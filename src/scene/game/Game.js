//------------------------------------------------------------------------------
// GAME SCENE
//------------------------------------------------------------------------------

runmysteriet.scene.Game = function (levelNumber, score, playerName) {
  rune.scene.Scene.call(this);

  this.m_playerHandler = null;
  this.m_platformHandler = null;
  this.m_cloudHandler = null;
  this.m_shieldHandler = null;
  this.m_cameraHandler = null;
  this.m_backgroundHandler = null;
  this.m_enemyHandler = null;
  this.m_diseaseHandler = null;
  this.m_armorHandler = null;

  this.m_levelConfig = null;
  this.m_levelNumber = levelNumber || 1;
  this.m_score = score || 0;
  this.m_playerName = playerName || "PLAYER";

  this.m_isPaused = false;
  this.m_pauseTitle = null;
  this.m_pauseMenu = null;
  this.m_pauseOverlay = null;

  this.m_timeLeft = 200;

  this.m_gameEnd = false;
  this.m_finishX = 0;

  this.backgroundMusic = null;
  this.menuSound = null;

  this.m_gameInput = null;
  this.camera = null;

  this.m_hudHandler = null;
  this.m_highscoreSaved = false;

this.m_startCountdownActive = false;
this.m_startCountdownTimer = 0;
this.m_startCountdownOverlay = null;
this.m_startCountdownText = null;

};

//------------------------------------------------------------------------------
// INHERITANCE
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype = Object.create(rune.scene.Scene.prototype);
runmysteriet.scene.Game.prototype.constructor = runmysteriet.scene.Game;

//------------------------------------------------------------------------------
// HUD
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.createHUD = function() {

    this.m_hudHandler = new runmysteriet.handler.HudHandler(
        this.stage,
        this.application,
        this.cameras
    );

    this.m_hudHandler.init();

    if (this.m_shieldHandler) {
        this.m_hudHandler.connectShieldHandler(this.m_shieldHandler);
    }

    this.updateHUD();
};

runmysteriet.scene.Game.prototype.updateHUD = function() {

    if (this.m_hudHandler) {
        this.m_hudHandler.update();
    }
};

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.init = function () {
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
    this.backgroundMusic.volume = 0.5;
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
   * Plattformar
   */
  this.m_platformHandler = new runmysteriet.handler.PlatformHandler(
    this.stage,
    this.application.screen.width
  );

  this.m_platformHandler.init(this.m_levelNumber);
  this.m_platformHandler.startBoatTweens(this.tweens);

  this.m_finishX = this.m_platformHandler.levelWidth - 50;

  /*
   * Moln
   */
  this.m_cloudHandler = new runmysteriet.handler.CloudHandler(
    this.stage,
    this.application.screen.width,
    this.m_platformHandler.levelWidth
  );

  this.m_cloudHandler.init();

  /*
   * Spelare
   */
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

  this.m_playerHandler.setEnemyHandler(this.m_enemyHandler);

  /*
   * Kamera
   */
  this.m_cameraHandler = new runmysteriet.handler.AutoScrollCameraHandler(
    this.camera,
    this.m_playerHandler,
    this.m_platformHandler,
    this.m_platformHandler.levelWidth
);
  

  this.m_playerHandler.setCamera(this.camera);
  this.m_playerHandler.setCameraHandler(this.m_cameraHandler);

  /*
   * Sjukdomar / hazards
   */
  this.m_diseaseHandler = new runmysteriet.handler.DiseaseHandler(this.stage, this.application);

  this.m_diseaseHandler.init(
    this.m_levelNumber,
    this.m_platformHandler.getDiseaseSpawns()
  );

/*
 * Rustning
 */

this.m_armorHandler = new runmysteriet.handler.ArmorHandler(
    this.stage,
    this.application,
    this.m_levelNumber,
    this.m_platformHandler.getArmorSpawns()
);

this.m_armorHandler.init();

this.m_armorHandler.onArmorCollected = function(player, armor) {
    if (!player) {
        return;
    }

    if (player.maxHp !== undefined) {
        player.hp = player.maxHp;
    }
};

  /*
   * Sköldar / runor
   */
  this.m_shieldHandler = new runmysteriet.handler.ShieldHandler(
    this.stage,
    this.application,
    this.m_platformHandler.levelWidth,
    this.m_levelNumber,
    this.m_platformHandler.getRuneSpawns()
  );

  this.m_shieldHandler.init();

  /*
  * HUD
  */
  this.createHUD();

  /*
  * Start countdown.
  */
  this.createStartCountdown();
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.update = function(step) {

    /*
     * Debug-snabbval.
     */
    if (this.keyboard.justPressed("F1")) {
        this.application.scenes.load([
            new runmysteriet.scene.Game(6, this.m_score, this.m_playerName)
        ]);
        return;
    }

    if (this.keyboard.justPressed("F2")) {
        this.application.scenes.load([
            new runmysteriet.scene.Game(15, this.m_score, this.m_playerName)
        ]);
        return;
    }

    if (this.keyboard.justPressed("F3")) {
        this.application.scenes.load([
            new runmysteriet.scene.Game(19, this.m_score, this.m_playerName)
        ]);
        return;
    }

    this.updatePauseInput();

    /*
     * Volume control.
     */
    if (this.backgroundMusic) {

        var keyboard = this.keyboard;
        var gamepad = this.application.inputs.gamepads.get(0);
        var stepVol = 0.1;

        if (keyboard.justPressed("R") || (gamepad && gamepad.justPressed(5))) {

            this.backgroundMusic.volume += stepVol;

            if (this.backgroundMusic.volume > 1) {
                this.backgroundMusic.volume = 0;
            }

            console.log("Volym:", this.backgroundMusic.volume.toFixed(2));
        }

        if (keyboard.justPressed("Q") || (gamepad && gamepad.justPressed(4))) {

            this.backgroundMusic.volume -= stepVol;

            if (this.backgroundMusic.volume < 0) {
                this.backgroundMusic.volume = 1;
            }

            console.log("Volym:", this.backgroundMusic.volume.toFixed(2));
        }
    }

    if (this.m_startCountdownActive === true) {
    rune.scene.Scene.prototype.update.call(this, step);

    this.updateStartCountdown();

    if (this.m_backgroundHandler) {
        this.m_backgroundHandler.update();
    }

    this.updateHUD();
    return;
}

    if (this.m_isPaused === true) {
        this.updateHUD();
        return;
    }

    if (this.m_gameEnd === true) {
        this.updateHUD();
        return;
    }

    rune.scene.Scene.prototype.update.call(this, step);

    /*
     * Visuella system som inte styr spelaren.
     */
    if (this.m_cloudHandler) {
        this.m_cloudHandler.update();
    }

    /*
     * Plattformar / holes.
     * Detta uppdaterar bland annat lavaeffekten i Hole.
     */
    if (
        this.m_platformHandler &&
        typeof this.m_platformHandler.update === "function"
    ) {
        this.m_platformHandler.update(step);
    }

    /*
     * Spelaren uppdateras före kameran.
     * Då rör sig avatarerna först.
     */
    if (this.m_playerHandler) {
        this.m_playerHandler.update();
    }

    /*
     * Kollisioner / game logic.
     */
    this.updateHoles();
    this.updateEnemies();
    this.updateDiseases(step);
    this.updateArmor();
    this.updateShields();

    /*
     * Autoscroll-kameran flyttas efter spelaren.
     */
    if (this.m_cameraHandler) {
        this.m_cameraHandler.update(step);
    }

    /*
     * Efter att kameran flyttats:
     * håll spelare inom kamerans vänster/högerkant.
     */
    if (
        this.m_playerHandler &&
        typeof this.m_playerHandler.handleAutoScrollCameraBounds === "function"
    ) {
        this.m_playerHandler.handleAutoScrollCameraBounds();
    }

    /*
     * Uppdatera Rune-kameran.
     */
    if (this.camera && typeof this.camera.update === "function") {
        this.camera.update(0);
    }

    /*
     * Bakgrund efter kamera så den följer rätt.
     */
    if (this.m_backgroundHandler) {
        this.m_backgroundHandler.update();
    }

    /*
     * Kolla level completion efter att kamera/bounds är rättade.
     */
    this.checkLevelCompletion();

    this.updateTimer();
    this.updateHUD();
};

runmysteriet.scene.Game.prototype.updateHUD = function () {
  if (this.m_hudHandler) {
    this.m_hudHandler.update();
  }
};

//------------------------------------------------------------------------------
// UPDATE HELPERS
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.updateHoles = function () {
  var self = this;

  if (this.m_platformHandler && this.m_playerHandler) {
    this.m_platformHandler.updateHoles(
      this.m_playerHandler.players,
      function (player, index) {
        self.m_playerHandler.killPlayer(player, index);
      }
    );
  }
};

runmysteriet.scene.Game.prototype.updateEnemies = function () {
  if (this.m_enemyHandler && this.m_playerHandler) {
    this.m_enemyHandler.update(this.m_playerHandler.players);
  }
};

runmysteriet.scene.Game.prototype.updateShields = function () {
  if (this.m_shieldHandler && this.m_playerHandler) {
    this.m_shieldHandler.update(this.m_playerHandler.players);
  }
};

runmysteriet.scene.Game.prototype.updateDiseases = function (step) {
  if (this.m_diseaseHandler && this.m_playerHandler) {
    this.m_diseaseHandler.update(this.m_playerHandler.players, step);
  }
};

runmysteriet.scene.Game.prototype.updateArmor = function () {
  if (this.m_armorHandler && this.m_playerHandler) {
    this.m_armorHandler.update(this.m_playerHandler.players);
  }
};

//------------------------------------------------------------------------------
// START COUNTDOWN
//------------------------------------------------------------------------------

/**
 * Skapar start-countdown innan spelet börjar.
 *
 * @return {void}
 */
runmysteriet.scene.Game.prototype.createStartCountdown = function() {

    var cameraX = 0;
    var cameraY = 0;

    this.m_startCountdownActive = true;
    this.m_startCountdownTimer = 120;

    if (this.camera && this.camera.viewport) {
        cameraX = this.camera.viewport.x;
        cameraY = this.camera.viewport.y;
    }

    /*
     * Mörk overlay som ger blur-/pauskänsla.
     */
    this.m_startCountdownOverlay = new rune.display.Graphic(
        cameraX,
        cameraY,
        this.application.screen.width,
        this.application.screen.height
    );

    this.m_startCountdownOverlay.backgroundColor = "#000000";
    this.m_startCountdownOverlay.alpha = 0.55;

    this.stage.addChild(this.m_startCountdownOverlay);

    /*
     * Countdown-text.
     */
    this.m_startCountdownText = new rune.text.BitmapField("3");
    this.m_startCountdownText.autoSize = true;

    this.stage.addChild(this.m_startCountdownText);

    this.updateStartCountdownPosition();

    /*
     * Pausa tweens under countdown så båt/flotte inte börjar röra sig direkt.
     */
    if (this.tweens) {
        this.tweens.paused = true;
    }
};

/**
 * Uppdaterar start-countdown.
 *
 * @return {void}
 */
runmysteriet.scene.Game.prototype.updateStartCountdown = function() {

    if (this.m_startCountdownActive !== true) {
        return;
    }

    this.m_startCountdownTimer--;

    this.updateStartCountdownPosition();

    if (this.m_startCountdownTimer > 90) {
        this.m_startCountdownText.text = "3";
    } else if (this.m_startCountdownTimer > 60) {
        this.m_startCountdownText.text = "2";
    } else if (this.m_startCountdownTimer > 30) {
        this.m_startCountdownText.text = "1";
    } else if (this.m_startCountdownTimer > 0) {
        this.m_startCountdownText.text = "GO";
    } else {
        this.closeStartCountdown();
    }
};

/**
 * Håller countdown-overlay och text låsta mot kameran.
 *
 * @return {void}
 */
runmysteriet.scene.Game.prototype.updateStartCountdownPosition = function() {

    var cameraX = 0;
    var cameraY = 0;

    if (this.camera && this.camera.viewport) {
        cameraX = this.camera.viewport.x;
        cameraY = this.camera.viewport.y;
    }

    if (this.m_startCountdownOverlay) {
        this.m_startCountdownOverlay.x = cameraX;
        this.m_startCountdownOverlay.y = cameraY;
    }

    if (this.m_startCountdownText) {
        this.m_startCountdownText.x = cameraX + this.application.screen.width / 2 - 12;
        this.m_startCountdownText.y = cameraY + this.application.screen.height / 2 - 12;

        if (this.m_startCountdownText.text === "GO") {
            this.m_startCountdownText.x = cameraX + this.application.screen.width / 2 - 22;
        }
    }
};

/**
 * Tar bort countdown och startar spelet.
 *
 * @return {void}
 */
runmysteriet.scene.Game.prototype.closeStartCountdown = function() {

    this.m_startCountdownActive = false;
    this.m_startCountdownTimer = 0;

    if (this.m_startCountdownOverlay && this.m_startCountdownOverlay.stage) {
        this.m_startCountdownOverlay.stage.removeChild(this.m_startCountdownOverlay);
    }

    if (this.m_startCountdownText && this.m_startCountdownText.stage) {
        this.m_startCountdownText.stage.removeChild(this.m_startCountdownText);
    }

    this.m_startCountdownOverlay = null;
    this.m_startCountdownText = null;

    /*
     * Starta tweens igen.
     */
    if (this.tweens) {
        this.tweens.paused = false;
    }
};

//------------------------------------------------------------------------------
// PAUSE
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.updatePauseInput = function () {
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

  this.handleMenuListInput(this.m_pauseMenu, function (selectedIndex) {
    if (selectedIndex === 0) {
      this.closePauseMenu();
    } else if (selectedIndex === 1) {
      this.quitToMenu();
    }
  });
};

runmysteriet.scene.Game.prototype.isPauseButtonPressed = function () {
  var gamepad = null;
  var startIsPressed = false;

  if (
    this.application &&
    this.application.inputs &&
    this.application.inputs.gamepads
  ) {
    gamepad = this.application.inputs.gamepads.get(0);
  }

  if (gamepad !== null && gamepad !== undefined) {
    if (typeof gamepad.justPressed === "function") {
      startIsPressed = gamepad.justPressed("START") || gamepad.justPressed(9);
    }
  }

  return (
    this.keyboard.justPressed("P") ||
    this.keyboard.justPressed("ESCAPE") ||
    startIsPressed
  );
};

runmysteriet.scene.Game.prototype.createPauseMenu = function () {
  if (this.m_pauseMenu) {
    return;
  }

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

  this.m_pauseTitle = new rune.text.BitmapField("GAME PAUSED");
  this.m_pauseTitle.autoSize = true;
  this.m_pauseTitle.visible = false;

  this.stage.addChild(this.m_pauseTitle);

  this.m_pauseMenu = new runmysteriet.ui.graphic.MenuList(
    this.stage,
    this.application,
    ["CONTINUE", "QUIT GAME"],
    0,
    22,
    1
  );

  this.m_pauseMenu.setVisible(false);
};

runmysteriet.scene.Game.prototype.openPauseMenu = function () {
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

  if (
    this.backgroundMusic &&
    typeof this.backgroundMusic.pause === "function"
  ) {
    this.backgroundMusic.pause();
  }
};

runmysteriet.scene.Game.prototype.closePauseMenu = function () {
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

runmysteriet.scene.Game.prototype.updatePauseMenuPosition = function () {
  var camera = this.cameras.getCameraAt(0);

  if (!camera) {
    return;
  }

  if (this.m_pauseOverlay) {
    this.m_pauseOverlay.x = camera.viewport.x;
    this.m_pauseOverlay.y = camera.viewport.y;
  }

  if (this.m_pauseTitle) {
    this.m_pauseTitle.x = camera.viewport.x + 170;
    this.m_pauseTitle.y = camera.viewport.y + 85;
  }

  if (this.m_pauseMenu) {
    this.m_pauseMenu.setCameraPosition(camera, 170, 115);
  }
};

runmysteriet.scene.Game.prototype.quitToMenu = function () {
  this.m_gameEnd = true;

  if (this.backgroundMusic) {
    if (typeof this.backgroundMusic.stop === "function") {
      this.backgroundMusic.stop();
    } else if (typeof this.backgroundMusic.pause === "function") {
      this.backgroundMusic.pause();
    }
  }

  this.application.scenes.load([new runmysteriet.scene.Menu()]);
};

runmysteriet.scene.Game.prototype.playMenuSound = function () {
  var menuSound = this.application.sounds.sound.get("sound_menu");

  if (menuSound) {
    menuSound.play();
  }
};

runmysteriet.scene.Game.prototype.handleMenuListInput = function (
  menuList,
  onChoose
) {
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

runmysteriet.scene.Game.prototype.updateTimer = function () {
  this.m_timeLeft -= 1 / 30;

  if (this.m_timeLeft < 0) {
    this.m_timeLeft = 0;
  }

  if (this.m_hudHandler) {
    if (this.allRunesColected()) {
      this.m_hudHandler.setTimerText("ALL RUNES FOUND - REACH THE END");
    } else {
      this.m_hudHandler.setTimerText("TIME LEFT " + Math.ceil(this.m_timeLeft));
    }

    this.m_hudHandler.setScoreText(
      "LEVEL " + this.m_levelNumber + " SCORE " + this.m_score
    );
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

    if (this.hasPlayerReachedEndZone(player)) {
      this.winGame(player);
      return;
    }
  }

  if (this.areAllPlayersDead()) {
    this.loseGame("ALL PLAYERS ARE DEAD");
    return;
  }

  if (this.m_timeLeft <= 0) {
    this.loseGame("TIME IS UP");
  }
};

runmysteriet.scene.Game.prototype.hasPlayerReachedEndZone = function (player) {
  var endZones = null;
  var endZone = null;
  var i = 0;

  if (!player || !this.m_platformHandler) {
    return false;
  }

  if (typeof this.m_platformHandler.getEndZones !== "function") {
    return false;
  }

  endZones = this.m_platformHandler.getEndZones();

  if (!endZones) {
    return false;
  }

  for (i = 0; i < endZones.length; i++) {
    endZone = endZones[i];

    if (endZone && player.hitTestObject(endZone)) {
      return true;
    }
  }

  return false;
};

//------------------------------------------------------------------------------
// PLAYER DEATH
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.areAllPlayersDead = function () {
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
runmysteriet.scene.Game.prototype.saveHighscore = function () {
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

runmysteriet.scene.Game.prototype.winGame = function (winningPlayer) {
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

  if (
    this.m_shieldHandler &&
    typeof this.m_shieldHandler.getGuessData === "function"
  ) {
    guessData = this.m_shieldHandler.getGuessData();
  }

  this.application.scenes.load([
    new runmysteriet.scene.GuessWord(
      this.m_levelNumber,
      earnedScore,
      totalScore,
      guessData,
      this.m_playerName
    ),
  ]);
};

runmysteriet.scene.Game.prototype.loseGame = function (reason) {
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

  this.saveHighscore();

  this.application.scenes.load([
    new runmysteriet.scene.GameOver(
      this.m_playerName,
      this.m_score,
      reason || "GAME OVER"
    )
  ]);
};

//------------------------------------------------------------------------------
// RUNES
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.allRunesColected = function () {
  if (!this.m_shieldHandler) {
    return false;
  }

  return this.m_shieldHandler.allRunesColected();
};

//------------------------------------------------------------------------------
// REVIVE
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.reviveDeadPlayers = function (winningPlayer) {
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

runmysteriet.scene.Game.prototype.restartLevel = function () {
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

runmysteriet.scene.Game.prototype.dispose = function () {
  if (this.m_enemyHandler) {
    this.m_enemyHandler.clear();
  }

  if (this.m_armorHandler) {
    this.m_armorHandler.clear();
  }

  if (this.m_startCountdownOverlay && this.m_startCountdownOverlay.stage) {
    this.m_startCountdownOverlay.stage.removeChild(this.m_startCountdownOverlay);
}

if (this.m_startCountdownText && this.m_startCountdownText.stage) {
    this.m_startCountdownText.stage.removeChild(this.m_startCountdownText);
}

this.m_startCountdownOverlay = null;
this.m_startCountdownText = null;

  rune.scene.Scene.prototype.dispose.call(this);
};
