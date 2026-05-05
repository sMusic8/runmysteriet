//------------------------------------------------------------------------------
// GAME SCENE
//------------------------------------------------------------------------------

runmysteriet.scene.Game = function () {
    rune.scene.Scene.call(this);

    this.m_playerHandler = null;
    this.m_platformHandler = null;
    this.m_cloudHandler = null;
    this.m_shieldHandler = null;
    this.m_cameraHandler = null;
    this.m_backgroundHandler = null;

    this.m_levelConfig = null;
    this.m_levelNumber = 1;
    this.m_enemyHandler = null;

    this.m_isPaused = false;
    this.m_pauseText = null;

    this.m_timeLeft = 60;
    this.m_timerText = null;

    this.m_gameEnd = false;
    this.m_finishX = 0;

    this.backgroundMusic = null;
};

//------------------------------------------------------------------------------
// INHERITANCE
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype = Object.create(rune.scene.Scene.prototype);
runmysteriet.scene.Game.prototype.constructor = runmysteriet.scene.Game;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.init = function () {
    rune.scene.Scene.prototype.init.call(this);

    // Musik
    this.backgroundMusic = this.application.sounds.sound.get("sound_music");

    // Moln
    this.m_cloudHandler = new runmysteriet.handler.CloudHandler(
        this.stage,
        this.application.screen.width
    );

    this.m_cloudHandler.init();

    // Level
    this.m_levelNumber = 1;

    // Plattformar / segment / holes / enemy spawnpoints
    this.m_platformHandler = new runmysteriet.handler.PlatformHandler(
        this.stage,
        this.application.screen.width
    );

    this.m_platformHandler.init();

    this.m_finishX = this.m_platformHandler.levelWidth - 50;

    // Spelare
    this.m_playerHandler = new runmysteriet.handler.PlayerHandler(
        this.stage,
        this.m_platformHandler.platforms,
        this.application
    );

    this.m_playerHandler.init();

    // Fiender
    this.m_levelConfig = new runmysteriet.config.LevelConfig(this.m_levelNumber);

    this.m_enemyHandler = new runmysteriet.handler.EnemyHandler(this.stage);

    this.m_enemyHandler.init(
        this.m_levelConfig,
        this.m_platformHandler.getEnemySpawns()
    );

    // Kamera
    this.m_cameraHandler = new runmysteriet.handler.CameraHandler(
        this.cameras.getCameraAt(0),
        this.m_playerHandler,
        this.m_platformHandler.levelWidth
    );

    // Sköldar / runor
    this.m_shieldHandler = new runmysteriet.handler.ShieldHandler(
        this.stage,
        this.application,
        this.m_platformHandler.levelWidth
    );

    this.m_shieldHandler.init();

    // Timer
    this.m_timerText = new rune.text.BitmapField("TID KVAR 60");
    this.m_timerText.x = 15;
    this.m_timerText.y = 15;
    this.stage.addChild(this.m_timerText);

    // Paus-text
    this.m_pauseText = new rune.text.BitmapField("SPELET AR PAUSAT");
    this.m_pauseText.autoSize = true;
    this.m_pauseText.x = 90;
    this.m_pauseText.y = 100;
    this.m_pauseText.visible = false;
    this.stage.addChild(this.m_pauseText);
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.update = function (step) {
    rune.scene.Scene.prototype.update.call(this, step);

    this.updatePauseInput();

    if (this.m_isPaused === true) {
        return;
    }

    if (this.m_gameEnd === true) {
        return;
    }

    if (this.m_cloudHandler) {
        this.m_cloudHandler.update();
    }

    if (this.m_playerHandler) {
        this.m_playerHandler.update();
    }

    var self = this;

    if (this.m_platformHandler && this.m_playerHandler) {
        this.m_platformHandler.updateHoles(
            this.m_playerHandler.players,
            function(player, index) {
                self.killPlayer(player, index);
            }
        );
    }

    if (this.m_enemyHandler && this.m_playerHandler) {
        this.m_enemyHandler.update(this.m_playerHandler.players);
    }

    if (this.m_shieldHandler && this.m_playerHandler) {
        this.m_shieldHandler.update(this.m_playerHandler.players);
    }

    this.updateTimer();
    this.checkLevelCompletion();

    if (this.m_cameraHandler) {
        this.m_cameraHandler.update();
    }

    if (this.m_backgroundHandler) {
        this.m_backgroundHandler.update();
    }
};

//------------------------------------------------------------------------------
// PAUSE
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.updatePauseInput = function () {
    var camera = null;

    if (this.keyboard.justPressed("P")) {
        this.m_isPaused = !this.m_isPaused;

        if (this.m_pauseText) {
            camera = this.cameras.getCameraAt(0);

            this.m_pauseText.visible = this.m_isPaused;
            this.m_pauseText.x = camera.viewport.x + 90;
            this.m_pauseText.y = camera.viewport.y + 100;
        }

        if (this.backgroundMusic) {
            if (this.m_isPaused === true) {
                if (typeof this.backgroundMusic.pause === "function") {
                    this.backgroundMusic.pause();
                }
            } else {
                if (typeof this.backgroundMusic.play === "function") {
                    this.backgroundMusic.play(true);
                }
            }
        }
    }
};

//------------------------------------------------------------------------------
// TIMER
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.updateTimer = function () {
    var camera = this.cameras.getCameraAt(0);

    if (this.allRunesColected()) {
        if (this.m_timerText) {
            this.m_timerText.text = "ALLA RUNOR INSAMLADE TA DIG TILL BATEN";
            this.m_timerText.x = camera.viewport.x + 15;
            this.m_timerText.y = camera.viewport.y + 15;
        }

        return;
    }

    this.m_timeLeft -= 1 / 30;

    if (this.m_timeLeft < 0) {
        this.m_timeLeft = 0;
    }

    if (this.m_timerText) {
        this.m_timerText.text = "TID KVAR " + Math.ceil(this.m_timeLeft);
        this.m_timerText.x = camera.viewport.x + 15;
        this.m_timerText.y = camera.viewport.y + 15;
    }
};

//------------------------------------------------------------------------------
// LEVEL COMPLETION
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.checkLevelCompletion = function () {
    var players = null;
    var player = null;
    var i = 0;

    if (!this.m_playerHandler) {
        return;
    }

    players = this.m_playerHandler.players;

    if (!players) {
        return;
    }

    for (i = 0; i < players.length; i++) {
        player = players[i];

        if (!player || player.isDead === true) {
            continue;
        }

        if (player.x >= this.m_finishX) {
            if (this.allRunesColected()) {
                this.winGame(player);
                return;
            }
        }
    }

    if (this.areAllPlayersDead()) {
        this.loseGame();
        return;
    }

    if (this.m_timeLeft <= 0 && this.allRunesColected() === false) {
        this.loseGame();
    }
};

//------------------------------------------------------------------------------
// PLAYER DEATH
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.killPlayer = function(player, index) {
    if (!player || player.isDead === true) {
        return;
    }

    player.isDead = true;
    player.visible = false;
    player.active = false;
    player.velocityY = 0;
    player.isOnGround = false;

    console.log("PLAYER DEAD", index);
};

runmysteriet.scene.Game.prototype.areAllPlayersDead = function() {
    var players = null;
    var i = 0;

    if (!this.m_playerHandler) {
        return false;
    }

    players = this.m_playerHandler.players;

    if (!players || players.length === 0) {
        return false;
    }

    for (i = 0; i < players.length; i++) {
        if (players[i] && players[i].isDead !== true) {
            return false;
        }
    }

    return true;
};

//------------------------------------------------------------------------------
// WIN / LOSE
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.winGame = function (winningPlayer) {
    var camera = null;
    var winText = null;

    if (this.m_gameEnd === true) {
        return;
    }

    this.reviveDeadPlayers(winningPlayer);

    this.m_gameEnd = true;

    if (this.backgroundMusic) {
        if (typeof this.backgroundMusic.stop === "function") {
            this.backgroundMusic.stop();
        } else if (typeof this.backgroundMusic.pause === "function") {
            this.backgroundMusic.pause();
        }
    }

    camera = this.cameras.getCameraAt(0);

    winText = new rune.text.BitmapField("DU VANN");
    winText.autoSize = true;
    winText.x = camera.viewport.x + 90;
    winText.y = camera.viewport.y + 100;

    this.stage.addChild(winText);
};

runmysteriet.scene.Game.prototype.loseGame = function () {
    var camera = null;
    var loseText = null;

    if (this.m_gameEnd === true) {
        return;
    }

    this.m_gameEnd = true;

    if (this.backgroundMusic) {
        if (typeof this.backgroundMusic.stop === "function") {
            this.backgroundMusic.stop();
        } else if (typeof this.backgroundMusic.pause === "function") {
            this.backgroundMusic.pause();
        }
    }

    camera = this.cameras.getCameraAt(0);

    loseText = new rune.text.BitmapField("DU FORLORADE");
    loseText.autoSize = true;
    loseText.x = camera.viewport.x + 90;
    loseText.y = camera.viewport.y + 100;

    this.stage.addChild(loseText);
};

//------------------------------------------------------------------------------
// RUNES
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.allRunesColected = function() {
    if (!this.m_shieldHandler) {
        return false;
    }

    return this.m_shieldHandler.allRunesColected();
};

//------------------------------------------------------------------------------
// REVIVE
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.reviveDeadPlayers = function(winningPlayer) {
    var players = null;
    var player = null;
    var i = 0;

    if (!this.m_playerHandler) {
        return;
    }

    players = this.m_playerHandler.players;

    if (!players) {
        return;
    }

    for (i = 0; i < players.length; i++) {
        player = players[i];

        if (!player) {
            continue;
        }

        if (player.isDead === true) {
            player.isDead = false;
            player.visible = true;
            player.active = true;
            player.velocityY = 0;
            player.isOnGround = true;

            if (winningPlayer) {
                player.x = winningPlayer.x - 40 + i * 40;
                player.y = winningPlayer.y;
            } else {
                player.x = this.m_finishX - 80 + i * 40;
                player.y = player.groundY || 188;
            }

            console.log("PLAYER REVIVED", i);
        }
    }
};

//------------------------------------------------------------------------------
// RESTART LEVEL
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.restartLevel = function() {
    if (this.m_enemyHandler) {
        this.m_enemyHandler.clear();
    }

    this.m_levelConfig = new runmysteriet.config.LevelConfig(this.m_levelNumber);

    this.m_enemyHandler = new runmysteriet.handler.EnemyHandler(this.stage);

    this.m_enemyHandler.init(
        this.m_levelConfig,
        this.m_platformHandler.getEnemySpawns()
    );
};

//------------------------------------------------------------------------------
// DISPOSE
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.dispose = function () {
    if (this.m_enemyHandler) {
        this.m_enemyHandler.clear();
    }

    rune.scene.Scene.prototype.dispose.call(this);
};