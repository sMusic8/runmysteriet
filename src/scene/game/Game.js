//------------------------------------------------------------------------------
// GAME SCENE
//------------------------------------------------------------------------------

runmysteriet.scene.Game = function(levelNumber, score, playerName) {
    rune.scene.Scene.call(this);

    this.m_playerHandler = null;
    this.m_platformHandler = null;
    this.m_cloudHandler = null;
    this.m_shieldHandler = null;
    this.m_cameraHandler = null;
    this.m_backgroundHandler = null;
    this.m_enemyHandler = null;

    this.m_levelConfig = null;
    this.m_levelNumber = levelNumber || 1;
    this.m_score = score || 0;
    this.m_playerName = playerName || "PLAYER";
    this.m_isPaused = false;
    this.m_pauseTitle = null;
    this.m_pauseMenu = null;
    this.m_pauseOverlay = null;

    this.m_timeLeft = 200;
    this.m_timerText = null;
    this.m_scoreText = null;

    this.m_gameEnd = false;
    this.m_finishX = 0;

    this.backgroundMusic = null;
    this.menuSound = null;

    this.m_gameOverActive = false;
    this.m_gameOverTitle = null;
    this.m_gameOverMenu = null;

    this.m_gameInput = null;

    this.camera = null;
    this.m_highscoreHud = null;
    this.m_highscoreSaved = false;
};
    
//------------------------------------------------------------------------------
// INHERITANCE
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype = Object.create(rune.scene.Scene.prototype);
runmysteriet.scene.Game.prototype.constructor = runmysteriet.scene.Game;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.init = function() {
    rune.scene.Scene.prototype.init.call(this);

    this.m_gameInput = new runmysteriet.input.GameInput(this.application);

    this.camera = this.cameras.getCameraAt(0);


    /*
     * Musik
     */
    this.backgroundMusic = this.application.sounds.sound.get("sound_music");
    this.menuSound = this.application.sounds.sound.get("sound_menu");
    if (this.backgroundMusic) {
    this.backgroundMusic.loop = true;
    this.backgroundMusic.play();
}

    /*
     * Bakgrund
     */
    this.m_backgroundHandler = new runmysteriet.handler.BackgroundHandler(
        this.stage,
        this.camera,
        this.application.screen.width,
        this.application.screen.height
    );

    this.m_backgroundHandler.init();

    /*
     * Moln
     */
    this.m_cloudHandler = new runmysteriet.handler.CloudHandler(
        this.stage,
        this.application.screen.width
    );

    this.m_cloudHandler.init();

    /*
     * Plattformar / segment / holes / enemy spawnpoints
     */
    this.m_platformHandler = new runmysteriet.handler.PlatformHandler(
        this.stage,
        this.application.screen.width
    );

    this.m_platformHandler.init(this.m_levelNumber);
    this.m_platformHandler.startBoatTweens(this.tweens);

    this.m_finishX = this.m_platformHandler.levelWidth - 50;

    /*
     * Spelare
     */
    // PlayerHandler initieras efter PlatformHandler så att den kan få referenser till plattformar, hål och fiendespawns.
this.m_playerHandler = new runmysteriet.handler.PlayerHandler(
    this.stage,
    this.m_platformHandler,
    this.application,
    this.m_gameInput,
    this.keyboard
);

    this.m_playerHandler.init();

    /*
     * Level config
     */
    this.m_levelConfig = new runmysteriet.config.LevelConfig(this.m_levelNumber);

    /*
     * Fiender
     */
    this.m_enemyHandler = new runmysteriet.handler.EnemyHandler(this.stage);

    this.m_enemyHandler.init(
        this.m_levelConfig,
        this.m_platformHandler.getEnemySpawns()
    );
    
    //kopplas ihop enemy-handlern med playerhandlern så att fienderna kan skada spelaren och spelaren kan attackera fienderna.
    this.m_playerHandler.setEnemyHandler(this.m_enemyHandler);

    /*
     * Kamera
     */
    this.m_cameraHandler = new runmysteriet.handler.CameraHandler(
        this.camera,
        this.m_playerHandler,
        this.m_platformHandler.levelWidth
    );
    // Ge playerHandler referens till kameran så att den kan hålla spelare inom leveln.
    this.m_playerHandler.setCamera(this.camera);

    /*
     * Sköldar / runor
     */
    this.m_shieldHandler = new runmysteriet.handler.ShieldHandler( //
        this.stage,
        this.application,
        this.m_platformHandler.levelWidth,
        this.m_levelNumber
    );

    this.m_shieldHandler.init();
   // this.m_shieldHandler.display();

    /*
     * HUD
     */
    this.createHUD();

    /*
     * Paus-text/pausmeny skapas först när paus öppnas.
     */
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.update = function(step) {

    /*
     * Game over-menyn ska kunna läsa input,
     * men spelet bakom ska inte uppdateras.
     */
    if (this.m_gameOverActive === true) {
        this.updateGameOverInput();
        this.updateHUD();
        return;
    }

    /*
     * Pausinput måste kollas innan Rune uppdaterar stage/tweens.
     */
    this.updatePauseInput();

    /*
     * Om spelet är pausat ska vi INTE köra:
     * rune.scene.Scene.prototype.update.call(this, step);
     *
     * Annars fortsätter båtar, sköldar, flotte och tweens.
     */
    if (this.m_isPaused === true) {
        this.updateHUD();
        return;
    }

    if (this.m_gameEnd === true) {
        this.updateHUD();
        return;
    }

    /*
     * Rune uppdaterar stage, children, tweens och timers här.
     * Den ska bara köras när spelet inte är pausat.
     */
    rune.scene.Scene.prototype.update.call(this, step);

    if (this.m_cloudHandler) {
        this.m_cloudHandler.update();
    }

    if (this.m_platformHandler && typeof this.m_platformHandler.update === "function") {
        this.m_platformHandler.update(step);
    }

    if (this.m_playerHandler) {
        this.m_playerHandler.update();
    }

    this.updateHoles();
    this.updateEnemies();
    this.updateShields();

    this.checkLevelCompletion();

    if (this.m_cameraHandler) {
        this.m_cameraHandler.update();
    }
    
    if (this.m_playerHandler) {
    this.m_playerHandler.keepPlayersInsideCamera();
}


    if (this.m_backgroundHandler) {
        this.m_backgroundHandler.update();
    }

    this.updateTimer();
    this.updateHUD();
};
//------------------------------------------------------------------------------
// HUD
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.createHUD = function() {
    var self = this;

    /*
     * Timer
     */
    this.m_timerText = new rune.text.BitmapField("TID KVAR 200");
    this.m_timerText.x = 15;
    this.m_timerText.y = 15;
    this.stage.addChild(this.m_timerText);

    /*
     * Score / level
     */
    this.m_scoreText = new rune.text.BitmapField(" ");
    this.m_scoreText.x = 15;
    this.m_scoreText.y = 30;
    this.stage.addChild(this.m_scoreText);


    /**
    * Highscore högst upp på scenen.
    */
    this.m_highscoreHud = new runmysteriet.ui.graphic.HighscoreHud(this.application);
    this.m_highscoreHud.x = 15;
    this.m_highscoreHud.y = 45;
    this.stage.addChild(this.m_highscoreHud);

    /*
 * Bakgrund bakom runtexten.
 */
this.m_runeTextBg = new rune.display.Graphic(
    10,
    61,
    150,
    18
);

this.m_runeTextBg.backgroundColor = "#000000";
this.m_runeTextBg.alpha = 0.6;

this.stage.addChild(this.m_runeTextBg);

/*
 * Text som visar insamlade runor.
 */
this.m_runeText = new rune.text.BitmapField("RUNOR: ");
this.m_runeText.autoSize = true;
this.m_runeText.x = 15;
this.m_runeText.y = 65;
//så att texten hamnar ovanpå bakgrunden
this.stage.addChild(this.m_runeText);



// Kopplar shieldHandler till HUD så att den kan uppdatera runtexten när runor samlas in.
if (this.m_shieldHandler) {
    this.m_shieldHandler.onCollectedChanged = function(text) {

        if (self.m_runeText) {
            self.m_runeText.text = "RUNOR: " + text;
        }

        
    };
}

    this.updateHUD();
};

runmysteriet.scene.Game.prototype.updateHUD = function() {
    var camera = this.cameras.getCameraAt(0);

    if (!camera || !camera.viewport) {
        return;
    }

    /*
     * Timer och score sitter fast på skärmen.
     */
    if (this.m_timerText) {
        this.m_timerText.x = camera.viewport.x + 15;
        this.m_timerText.y = camera.viewport.y + 15;
    }

    if (this.m_scoreText) {
        this.m_scoreText.x = camera.viewport.x + 15;
        this.m_scoreText.y = camera.viewport.y + 30;
    }

    /*
     * Highscore följer kameran så att den alltid är synlig.
     */
    if (this.m_highscoreHud) {
        this.m_highscoreHud.x = camera.viewport.x + 12;
        this.m_highscoreHud.y = camera.viewport.y + 40;
    }

    /*
     * Runtext + bakgrund placeras vid höger kant.
     */
    if (this.m_runeTextBg && this.m_runeText) {

        this.m_runeTextBg.x = camera.viewport.x + 5;
        this.m_runeTextBg.y = camera.viewport.y + 205;

        this.m_runeText.x = this.m_runeTextBg.x + 6;
        this.m_runeText.y = this.m_runeTextBg.y + 4;
    }
};
//------------------------------------------------------------------------------
// UPDATE HELPERS
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.updateHoles = function() {
    var self = this;

    if (this.m_platformHandler && this.m_playerHandler) {
        this.m_platformHandler.updateHoles(
            this.m_playerHandler.players,
            function(player, index) {
                self.m_playerHandler.killPlayer(player, index);
            }
        );
    }
};


runmysteriet.scene.Game.prototype.updateEnemies = function() {
    if (this.m_enemyHandler && this.m_playerHandler) {
        this.m_enemyHandler.update(this.m_playerHandler.players);
    }
};

runmysteriet.scene.Game.prototype.updateShields = function() {
    if (this.m_shieldHandler && this.m_playerHandler) {
        this.m_shieldHandler.update(this.m_playerHandler.players);
    }
};

//------------------------------------------------------------------------------
// PAUSE
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.updatePauseInput = function() {
    if (this.m_gameEnd === true) {
        return;
    }

    if (this.isPauseButtonPressed()) {
        if (this.m_isPaused === true) {
            this.closePauseMenu();
        } else {
            this.openPauseMenu();
        }

        return;
    }

    if (this.m_isPaused !== true) {
        return;
    }

    this.updatePauseMenuPosition();

    this.handleMenuListInput(this.m_pauseMenu, function(selectedIndex) {
        if (selectedIndex === 0) {
            this.closePauseMenu();
        } else if (selectedIndex === 1) {
            this.quitToMenu();
        }
    });
};

runmysteriet.scene.Game.prototype.isPauseButtonPressed = function() {
    var gamepad = null;
    var startIsPressed = false;

    if (this.application && this.application.inputs && this.application.inputs.gamepads) {
        gamepad = this.application.inputs.gamepads.get(0);
    }

    if (gamepad !== null && gamepad !== undefined) {
        if (typeof gamepad.justPressed === "function") {
            startIsPressed =
                gamepad.justPressed("START") ||
                gamepad.justPressed(9);
        }
    }

    return (
        this.keyboard.justPressed("P") ||
        this.keyboard.justPressed("ESCAPE") ||
        startIsPressed
    );
};

runmysteriet.scene.Game.prototype.createPauseMenu = function() {
    if (this.m_pauseMenu) {
        return;
    }

    /*
     * Mörk overlay över spelet bakom pausmenyn.
     * Alpha 0.5 = 50% opacity.
     */
    this.m_pauseOverlay = new rune.display.Graphic(
        0,
        0,
        this.application.screen.width,
        this.application.screen.height
    );

    this.m_pauseOverlay.backgroundColor = "#000000";
    this.m_pauseOverlay.alpha = 0.7;
    this.m_pauseOverlay.visible = false;

    this.stage.addChild(this.m_pauseOverlay);

    this.m_pauseTitle = new rune.text.BitmapField("SPELET AR PAUSAT");
    this.m_pauseTitle.autoSize = true;
    this.m_pauseTitle.visible = false;
    this.stage.addChild(this.m_pauseTitle);

    this.m_pauseMenu = new runmysteriet.ui.graphic.MenuList(
        this.stage,
        this.application,
        ["FORTSATT SPELET", "AVSLUTA SPELET"],
        0,
        20,
        0.8
    );

    this.m_pauseMenu.setVisible(false);
};

runmysteriet.scene.Game.prototype.openPauseMenu = function() {
    this.m_isPaused = true;

    this.createPauseMenu();
    this.updatePauseMenuPosition();

    if (this.m_pauseOverlay) {
        this.m_pauseOverlay.visible = true;
    }

    if (this.m_pauseTitle) {
        this.m_pauseTitle.visible = true;
    }

    if (this.m_pauseMenu) {
        this.m_pauseMenu.setVisible(true);
    }

    if (this.tweens) {
        this.tweens.paused = true;
    }

    if (this.backgroundMusic && typeof this.backgroundMusic.pause === "function") {
        this.backgroundMusic.pause();
    }
};
runmysteriet.scene.Game.prototype.closePauseMenu = function() {
    this.m_isPaused = false;

    if (this.m_pauseOverlay) {
        this.m_pauseOverlay.visible = false;
    }

    if (this.m_pauseTitle) {
        this.m_pauseTitle.visible = false;
    }

    if (this.m_pauseMenu) {
        this.m_pauseMenu.setVisible(false);
    }

    if (this.tweens) {
        this.tweens.paused = false;
    }

    if (this.backgroundMusic && typeof this.backgroundMusic.play === "function") {
        this.backgroundMusic.play();
    }
};

runmysteriet.scene.Game.prototype.updatePauseMenuPosition = function() {
    var camera = this.cameras.getCameraAt(0);

    if (!camera) {
        return;
    }

    if (this.m_pauseOverlay) {
    this.m_pauseOverlay.x = camera.viewport.x;
    this.m_pauseOverlay.y = camera.viewport.y;
}

    if (this.m_pauseTitle) {
        this.m_pauseTitle.x = camera.viewport.x + 80;
        this.m_pauseTitle.y = camera.viewport.y + 85;
    }

    if (this.m_pauseMenu) {
        this.m_pauseMenu.setCameraPosition(camera, 80, 115);
    }
};

runmysteriet.scene.Game.prototype.quitToMenu = function() {
    this.m_gameEnd = true;

    if (this.backgroundMusic) {
        if (typeof this.backgroundMusic.stop === "function") {
            this.backgroundMusic.stop();
        } else if (typeof this.backgroundMusic.pause === "function") {
            this.backgroundMusic.pause();
        }
    }

    this.application.scenes.load([
        new runmysteriet.scene.Menu()
    ]);
};

runmysteriet.scene.Game.prototype.playMenuSound = function() {
    var menuSound = this.application.sounds.sound.get("sound_menu");

    if (menuSound) {
        menuSound.play();
    }
};

runmysteriet.scene.Game.prototype.handleMenuListInput = function(menuList, onChoose) {
    var input = null;

    if (!menuList) {
        return;
    }

    input = this.m_gameInput.read(this.keyboard);

    if (input.down) {
        this.playMenuSound();
        menuList.moveNext();
    }

    if (input.up) {
        this.playMenuSound();
        menuList.movePrevious();
    }

    if (input.choose) {
        onChoose.call(this, menuList.getSelectedIndex());
    }
};
//------------------------------------------------------------------------------
// TIMER
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.updateTimer = function() {
    if (this.allRunesColected()) {
        if (this.m_timerText) {
        this.m_timerText.text = "LEVEL IS COMPLETED GO GUESS THE WORD!";
        }

        if (this.m_scoreText) {
            this.m_scoreText.text = "LEVEL " + this.m_levelNumber + "  POANG " + this.m_score;
        }

        return;
    }

    this.m_timeLeft -= 1 / 30;

    if (this.m_timeLeft < 0) {
        this.m_timeLeft = 0;
    }

    if (this.m_timerText) {
        this.m_timerText.text = "TID KVAR " + Math.ceil(this.m_timeLeft);
    }

    if (this.m_scoreText) {
        this.m_scoreText.text = "LEVEL " + this.m_levelNumber + "  POANG " + this.m_score;
    }
};

//------------------------------------------------------------------------------
// LEVEL COMPLETION
//------------------------------------------------------------------------------
runmysteriet.scene.Game.prototype.checkLevelCompletion = function() {
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

    /*
     * om någon levande spelare når slutet av leveln
     * ska spelet gå vidare till GuessWord.
     *  det spelar ingen roll om alla runor är insamlade man ska försöka gissa ordet
     */
    for (i = 0; i < players.length; i++) {
        player = players[i];

        if (!player || player.isDead === true) {
            continue;
        }

        if (player.x >= this.m_finishX) {
            this.winGame(player);
            return;
        }
    }

    /*
     * Om alla spelare är döda förlorar man.
     */
    if (this.areAllPlayersDead()) {
        this.loseGame("ALLA SPELARE DOG"); 
        return;
    }

    /*
     * Om tiden tar slut förlorar man.
     */
    if (this.m_timeLeft <= 0) {
        this.loseGame("TIDEN TOG SLUT");
    }
};
//------------------------------------------------------------------------------
// PLAYER DEATH
//------------------------------------------------------------------------------

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
// HIGHSCORE
//------------------------------------------------------------------------------

/**
 * Sparar nuvarande score i highscore-listan.
 *
 * @return {number}
 */
runmysteriet.scene.Game.prototype.saveHighscore = function() {

    var entry = null;
    var manager = null;

    if (this.m_highscoreSaved === true) {
        return -1;
    }

    this.m_highscoreSaved = true;

    entry = new runmysteriet.logic.HighscoreEntry(
        this.m_playerName,
        this.m_score
    );

    manager = new runmysteriet.logic.HighscoreManager(this.application);

    return manager.save(entry);
};

//------------------------------------------------------------------------------
// WIN / LOSE
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.winGame = function(winningPlayer) {
    
    var earnedScore = 0;
    var totalScore = 0;
    var guessData = null;

    if (this.m_gameEnd === true) {
        return;
    }

    this.m_gameEnd = true;

    earnedScore = Math.ceil(this.m_timeLeft);

    if (earnedScore < 0) {
        earnedScore = 0;
    }

    totalScore = this.m_score + earnedScore;

    if (this.backgroundMusic) {
        if (typeof this.backgroundMusic.stop === "function") {
            this.backgroundMusic.stop();
        } else if (typeof this.backgroundMusic.pause === "function") {
            this.backgroundMusic.pause();
        }
    }

    if (this.m_shieldHandler &&
        typeof this.m_shieldHandler.getGuessData === "function") {

        guessData = this.m_shieldHandler.getGuessData();
    }

    this.application.scenes.load([
        new runmysteriet.scene.GuessWord(
            this.m_levelNumber,
            earnedScore,
            totalScore,
            guessData,
            this.m_playerName
        )
    ]);
};

runmysteriet.scene.Game.prototype.loseGame = function(reason) {
    if (this.m_gameOverActive === true) {
        return;
    }

    this.m_gameEnd = true;
    this.m_gameOverActive = true;

    if (this.backgroundMusic) {
        if (typeof this.backgroundMusic.stop === "function") {
            this.backgroundMusic.stop();
        } else if (typeof this.backgroundMusic.pause === "function") {
            this.backgroundMusic.pause();
        }
    }

    this.saveHighscore();

    if (this.m_highscoreHud && typeof this.m_highscoreHud.reload === "function") {
        this.m_highscoreHud.reload();
    }

    this.createGameOverMenu(reason || "DU FORLORADE");
    this.updateGameOverMenuPosition();

    if (this.m_gameOverTitle) {
        this.m_gameOverTitle.visible = true;
    }

    if (this.m_gameOverMenu) {
        this.m_gameOverMenu.setVisible(true);
    }
};

//------------------------------------------------------------------------------
// GAME OVER
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.createGameOverMenu = function(reason) {
    if (this.m_gameOverMenu) {
        return;
    }

    this.m_gameOverTitle = new rune.text.BitmapField(reason || "DU FORLORADE");
    this.m_gameOverTitle.autoSize = true;
    this.m_gameOverTitle.visible = false;
    this.stage.addChild(this.m_gameOverTitle);

    this.m_gameOverMenu = new runmysteriet.ui.graphic.MenuList(
        this.stage,
        this.application,
        ["STARTA NYTT SPEL", "TILL HUVUDMENY"],
        0,
        20,
        0.8
    );

    this.m_gameOverMenu.setVisible(false);
};

runmysteriet.scene.Game.prototype.updateGameOverInput = function() {
    if (this.m_gameOverActive !== true) {
        return;
    }

    this.updateGameOverMenuPosition();

    this.handleMenuListInput(this.m_gameOverMenu, function(selectedIndex) {
        if (selectedIndex === 0) {
            this.application.scenes.load([
                new runmysteriet.scene.Game(1, 0, this.m_playerName)
            ]);
        } else if (selectedIndex === 1) {
            this.application.scenes.load([
                new runmysteriet.scene.Menu()
            ]);
        }
    });
};

runmysteriet.scene.Game.prototype.updateGameOverMenuPosition = function() {
    var camera = this.cameras.getCameraAt(0);

    if (!camera) {
        return;
    }

    if (this.m_gameOverTitle) {
        this.m_gameOverTitle.x = camera.viewport.x + 70;
        this.m_gameOverTitle.y = camera.viewport.y + 80;
    }

    if (this.m_gameOverMenu) {
        this.m_gameOverMenu.setCameraPosition(camera, 75, 120);
    }
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

            if (player.hpBar) {
                player.hpBar.visible = true;
            }

            if (winningPlayer) {
                player.x = winningPlayer.x - 40 + i * 40;
                player.y = winningPlayer.y;
            } else {
                player.x = this.m_finishX - 80 + i * 40;
                player.y = player.groundY || 188;
            }
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

    if (this.m_playerHandler) {
        this.m_playerHandler.setEnemyHandler(this.m_enemyHandler);
    }
};

//------------------------------------------------------------------------------
// DISPOSE
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.dispose = function() {
    if (this.m_enemyHandler) {
        this.m_enemyHandler.clear();
    }

    rune.scene.Scene.prototype.dispose.call(this);
};
