//------------------------------------------------------------------------------
// GAME SCENE
//------------------------------------------------------------------------------
/**
 * Skapar en ny spel-scene (Game) med nivådata, poäng och avatarinformation.
 *
 * @constructor
 * @extends {rune.scene.Scene}
 * @param {number} levelNumber Aktuellt nivånummer som ska spelas.
 * @param {number} score Spelarens totala poäng innan denna nivå.
 * @param {Object=} avatarData Data kopplad till spelarens avatar (valfri).
 */
runmysteriet.scene.Game = function (levelNumber, score, avatarData) {
  rune.scene.Scene.call(this);

  /**
   * Hanterare för spelaren.
   * @type {?Object}
   */
  this.m_playerHandler = null;

  /**
   * Hanterare för plattformar.
   * @type {?Object}
   */
  this.m_platformHandler = null;

  /**
   * Hanterare för moln.
   * @type {?Object}
   */
  this.m_cloudHandler = null;

  /**
   * Hanterare för sköldar.
   * @type {?Object}
   */
  this.m_shieldHandler = null;

  /**
   * Kamerahanterare.
   * @type {?Object}
   */
  this.m_cameraHandler = null;

  /**
   * Hanterare för bakgrund.
   * @type {?Object}
   */
  this.m_backgroundHandler = null;

  /**
   * Hanterare för fiender.
   * @type {?Object}
   */
  this.m_enemyHandler = null;

  /**
   * Hanterare för sjukdomar/effects.
   * @type {?Object}
   */
  this.m_diseaseHandler = null;

  /**
   * Hanterare för rustning/armor.
   * @type {?Object}
   */
  this.m_armorHandler = null;

  /**
   * Konfiguration för aktuell nivå.
   * @type {?Object}
   */
  this.m_levelConfig = null;

  /**
   * Nuvarande nivånummer.
   * @type {number}
   */
  this.m_levelNumber = levelNumber || 1;

  /**
   * Total poäng innan nivån startar.
   * @type {number}
   */
  this.m_score = score || 0;

  /**
   * Poäng som samlas under aktuell nivå.
   * @type {number}
   */
  this.m_levelScore = 0;

  /**
   * Poängkrav för att klara nivån.
   * @type {number}
   */
  this.m_scoreLevelComplete = 100;

  /**
   * Multiplikator/andel för hälsa i poängberäkning.
   * @type {number}
   */
  this.m_scoreHealthPercent = 1;

  if (avatarData && typeof avatarData === "object") {
    this.m_avatarData = avatarData;
  } else {
    this.m_avatarData = null;
  }

  /**
   * Highscore-hanterare.
   * @type {?Object}
   */
  this.m_highscoreManager = null;

  /**
   * Ljud som spelas vid highscore.
   * @type {?Object}
   */
  this.m_highscoreSound = null;

  /**
   * Highscore-UI text.
   * @type {?Object}
   */
  this.m_highscoreText = null;

  /**
   * Timer för highscore-notis.
   * @type {number}
   */
  this.m_highscoreTimer = 0;

  /**
   * Flagga för om highscore redan visats.
   * @type {boolean}
   */
  this.m_highscoreNotified = false;

  /**
   * Pausläge för spelet.
   * @type {boolean}
   */
  this.m_isPaused = false;

  /**
   * Titeltext i pausmenyn.
   * @type {?Object}
   */
  this.m_pauseTitle = null;

  /**
   * Pausmeny.
   * @type {?Object}
   */
  this.m_pauseMenu = null;

  /**
   * Overlay för pausläge.
   * @type {?Object}
   */
  this.m_pauseOverlay = null;

  /**
   * Flagga för om spelet är avslutat.
   * @type {boolean}
   */
  this.m_gameEnd = false;

  /**
   * X-position för mållinje/finish.
   * @type {number}
   */
  this.m_finishX = 0;

  /**
   * Bakgrundsmusik.
   * @type {?Object}
   */
  this.backgroundMusic = null;

  /**
   * Meny-/UI-ljud.
   * @type {?Object}
   */
  this.menuSound = null;

  /**
   * Inputhantering för spelet.
   * @type {?Object}
   */
  this.m_gameInput = null;

  /**
   * Kameraobjekt.
   * @type {?Object}
   */
  this.camera = null;

  /**
   * HUD-hanterare.
   * @type {?Object}
   */
  this.m_hudHandler = null;

  /**
   * Flagga för aktiv nedräkning innan start.
   * @type {boolean}
   */
  this.m_startCountdownActive = false;

  /**
   * Timer för nedräkning innan start.
   * @type {number}
   */
  this.m_startCountdownTimer = 0;

  /**
   * Overlay för nedräkning.
   * @type {?Object}
   */
  this.m_startCountdownOverlay = null;

  /**
   * Text för nedräkning.
   * @type {?Object}
   */
  this.m_startCountdownText = null;

  /**
   * Sekvens för level complete-animation/logik.
   * @type {?Object}
   */
  this.m_levelCompleteSequence = null;

  /**
 * Flagga som hindrar att highscore-notisen visas flera gånger.
 * @type {boolean}
 */
  this.m_highscoreNotified = false;

  /**
 * highscore-notisen som redan visats
 * "" = ingen notis
 * "TOP5" = top 5-notis visad
 * "HIGHSCORE" = första plats-notis visad
 *
 * @type {string}
 */
this.m_highscoreNoticeType = "";
};

runmysteriet.scene.Game.prototype = Object.create(rune.scene.Scene.prototype);
runmysteriet.scene.Game.prototype.constructor = runmysteriet.scene.Game;
/**
 * Skapar textobjektet som används för highscore-notis.
 * Texten är initialt dold och visas endast vid nytt rekord.
 *
 * @return {void}
 */
runmysteriet.scene.Game.prototype.createHighscoreNotice = function () {
  /**
   * Textfält som visar "NEW HIGHSCORE!".
   * @type {rune.text.BitmapField}
   */
  this.m_highscoreText = new rune.text.BitmapField("NEW HIGHSCORE!");
  this.m_highscoreText.autoSize = true;
  this.m_highscoreText.visible = false;
runmysteriet.scene.Game.prototype.createHighscoreNotice = function() {

    /**
     * Textfält som visar "NEW HIGHSCORE!".
     * @type {rune.text.BitmapField}
     */
    this.m_highscoreText = new rune.text.BitmapField("");
    this.m_highscoreText.autoSize = true;
    this.m_highscoreText.visible = false;

  this.stage.addChild(this.m_highscoreText);
};
/**
 * Visar highscore-/top 5-notis.
 *
 * @param {string=} text
 * @param {boolean=} playSound
 * @return {void}
 */
runmysteriet.scene.Game.prototype.showHighscoreNotice = function (text, playSound) {
  if (this.m_highscoreNotified === true) {
    return;
  }

    text = text || "TOP 5 SCORE";
    playSound = playSound === true;

    this.m_highscoreNotified = true;
    this.m_highscoreTimer = 300;

    if (this.m_highscoreText) {
        this.m_highscoreText.text = text;
        this.m_highscoreText.visible = true;
        this.m_highscoreText.alpha = 1;
        this.m_highscoreText.scaleX = 1;
        this.m_highscoreText.scaleY = 1;
    }

    /*
     * Ljud spelas bara vid riktig första plats.
     */
    if (playSound === true && this.m_highscoreSound) {
        this.m_highscoreSound.play();
    }2
}
};
/**
 * Uppdaterar highscore-notisen (animation, position och fade-out).
 * Tar hänsyn till kamerans position för korrekt placering i världen.
 *
 * @return {void}
 */
runmysteriet.scene.Game.prototype.updateHighscoreNotice = function () {
  /**
   * Kamerans X-position (viewport).
   * @type {number}
   */
  var cameraX = 0;

  /**
   * Kamerans Y-position (viewport).
   * @type {number}
   */
  var cameraY = 0;

  /**
   * Pulsfaktor för animation av texten.
   * @type {number}
   */
  var pulse = 0;

  if (!this.m_highscoreText || this.m_highscoreText.visible !== true) {
    return;
  }

  if (this.camera && this.camera.viewport) {
    cameraX = this.camera.viewport.x;
    cameraY = this.camera.viewport.y;
  }

  this.m_highscoreTimer--;

  pulse = 1 + Math.sin(this.m_highscoreTimer * 0.25) * 0.15;

  this.m_highscoreText.scaleX = pulse;
  this.m_highscoreText.scaleY = pulse;

  this.m_highscoreText.x =
    cameraX +
    this.application.screen.width / 2 -
    this.m_highscoreText.width / 2;

  this.m_highscoreText.y = cameraY + 35;

  if (this.m_highscoreTimer < 30) {
    this.m_highscoreText.alpha = this.m_highscoreTimer / 30;
  }

  if (this.m_highscoreTimer <= 0) {
    this.m_highscoreText.visible = false;
    this.m_highscoreText.alpha = 1;
    this.m_highscoreText.scaleX = 1;
    this.m_highscoreText.scaleY = 1;
  }
};
/**
 * Kontrollerar om spelaren har satt highscore eller top 5-score.
 *
 * @param {number} score Aktuell poäng att kontrollera.
 * @return {void}
 */
runmysteriet.scene.Game.prototype.checkHighscoreNotice = function (score) {
  if (this.m_highscoreNotified === true) {
    return;
  }

  if (!this.m_highscoreManager) {
    return;
  }

    /*
     * Plats 1 
     */
    if (
        typeof this.m_highscoreManager.isBestScore === "function" &&
        this.m_highscoreManager.isBestScore(score) === true
    ) {
        this.showHighscoreNotice("NEW HIGHSCORE!", true);
        return;
    }

    /*
     * Plats 2-5: top 5, men inte highscore.
     */
    if (this.m_highscoreManager.isNewRecord(score) === true) {
        this.showHighscoreNotice("TOP 5 SCORE", false);
    }
};

/**
 * Skapar och initialiserar HUD för spelet.
 * Kopplar samman relevanta spelhandlers och uppdaterar UI.
 *
 * @return {void}
 */
runmysteriet.scene.Game.prototype.createHUD = function () {
  /**
   * Handler för HUD (spelinterface).
   * @type {runmysteriet.handler.HudHandler}
   */
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

/**
 * Uppdaterar HUD om den finns tillgänglig.
 *
 * @return {void}
 */
runmysteriet.scene.Game.prototype.updateHUD = function () {
  if (this.m_hudHandler) {
    this.m_hudHandler.update();
  }
};

/**
 * Initierar Game-scenen och sätter upp hela spelvärlden.
 * Skapar input, ljud, handlers, spelobjekt, HUD och nivålogik.
 *
 * @return {void}
 */
runmysteriet.scene.Game.prototype.init = function () {
  rune.scene.Scene.prototype.init.call(this);

  /**
   * Inputhantering för spelaren.
   * @type {runmysteriet.input.GameInput}
   */
  this.m_gameInput = new runmysteriet.input.GameInput(this.application);

  /**
   * Huvudkamera som används i scenen.
   * @type {?Object}
   */
  this.camera = this.cameras.getCameraAt(0);

  // Musik

  /**
   * Bakgrundsmusik för spelet.
   * @type {?Object}
   */
  this.backgroundMusic = this.application.sounds.sound.get("sound_music");

  /**
   * Meny-/UI-ljud.
   * @type {?Object}
   */
  this.menuSound = this.application.sounds.sound.get("sound_menu");

  if (this.backgroundMusic) {
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.5;
    this.backgroundMusic.play();
  }

  /**
   * Highscore-hanterare.
   * @type {runmysteriet.logic.HighscoreManager}
   */
  this.m_highscoreManager = new runmysteriet.logic.HighscoreManager(
    this.application
  );

  /**
   * Ljud som spelas vid highscore.
   * @type {?Object}
   */
  this.m_highscoreSound = this.application.sounds.sound.get("sound_highscore");

  // Bakgrund

  /**
   * Handler för bakgrund.
   * @type {runmysteriet.handler.BackgroundHandler}
   */
  this.m_backgroundHandler = new runmysteriet.handler.BackgroundHandler(
    this.stage,
    this.camera,
    this.application.screen.width,
    this.application.screen.height
  );

  this.m_backgroundHandler.init();

  // Plattformar

  /**
   * Handler för plattformar.
   * @type {runmysteriet.handler.PlatformHandler}
   */
  this.m_platformHandler = new runmysteriet.handler.PlatformHandler(
    this.stage,
    this.application.screen.width
  );

  this.m_platformHandler.init(this.m_levelNumber);
  this.m_platformHandler.startBoatTweens(this.tweens);

  this.m_finishX = this.m_platformHandler.levelWidth - 50;

  // Moln

  /**
   * Handler för moln.
   * @type {runmysteriet.handler.CloudHandler}
   */
  this.m_cloudHandler = new runmysteriet.handler.CloudHandler(
    this.stage,
    this.application.screen.width,
    this.m_platformHandler.levelWidth
  );

  this.m_cloudHandler.init();

  // Spelare

  /**
   * Handler för spelaren.
   * @type {runmysteriet.handler.PlayerHandler}
   */
  this.m_playerHandler = new runmysteriet.handler.PlayerHandler(
    this.stage,
    this.m_platformHandler,
    this.application,
    this.m_gameInput,
    this.keyboard,
    this.m_avatarData
  );

  this.m_playerHandler.init();

  // Level config

  /**
   * Konfiguration för aktuell nivå.
   * @type {runmysteriet.config.LevelConfig}
   */
  this.m_levelConfig = new runmysteriet.config.LevelConfig(this.m_levelNumber);

  // Fiender

  /**
   * Handler för fiender.
   * @type {runmysteriet.handler.EnemyHandler}
   */
  this.m_enemyHandler = new runmysteriet.handler.EnemyHandler(this.stage);

  this.m_enemyHandler.init(
    this.m_levelConfig,
    this.m_platformHandler.getEnemySpawns()
  );

  this.m_playerHandler.setEnemyHandler(this.m_enemyHandler);

  // Kamera

  /**
   * Automatisk kamerahantering.
   * @type {runmysteriet.handler.AutoScrollCameraHandler}
   */
  this.m_cameraHandler = new runmysteriet.handler.AutoScrollCameraHandler(
    this.camera,
    this.m_playerHandler,
    this.m_platformHandler,
    this.m_platformHandler.levelWidth,
    this.m_levelNumber
  );

  this.m_playerHandler.setCamera(this.camera);
  this.m_playerHandler.setCameraHandler(this.m_cameraHandler);

  // Sjukdomar

  /**
   * Handler för sjukdomar/effects.
   * @type {runmysteriet.handler.DiseaseHandler}
   */
  this.m_diseaseHandler = new runmysteriet.handler.DiseaseHandler(
    this.stage,
    this.application
  );

  this.m_diseaseHandler.init(
    this.m_levelNumber,
    this.m_platformHandler.getDiseaseSpawns()
  );

  // Rustning

  /**
   * Handler för armor.
   * @type {runmysteriet.handler.ArmorHandler}
   */
  this.m_armorHandler = new runmysteriet.handler.ArmorHandler(
    this.stage,
    this.application,
    this.m_levelNumber,
    this.m_platformHandler.getArmorSpawns()
  );

  this.m_armorHandler.init();

  this.m_armorHandler.onArmorCollected = function (player, armor) {
    if (!player) {
      return;
    }

    if (player.maxHp !== undefined) {
      player.hp = player.maxHp;
    }
  };

  // Sköldar / runor

  /**
   * Handler för sköldar/runor.
   * @type {runmysteriet.handler.ShieldHandler}
   */
  this.m_shieldHandler = new runmysteriet.handler.ShieldHandler(
    this.stage,
    this.application,
    this.m_platformHandler.levelWidth,
    this.m_levelNumber,
    this.m_platformHandler.getRuneSpawns()
  );

  this.m_shieldHandler.init();

  // Level complete sequence

  /**
   * Sekvens som hanterar level complete-övergång.
   * @type {runmysteriet.handler.LevelCompleteSequence}
   */
  this.m_levelCompleteSequence = new runmysteriet.handler.LevelCompleteSequence(
    this.stage,
    this.application,
    this.camera,
    this.m_playerHandler
  );

  // HUD

  this.createHUD();
  this.updateGameInfo();

  // Highscore notifikation

  this.createHighscoreNotice();

  // Start countdown

  this.createStartCountdown();
};

/**
 * Uppdaterar Game-scenen varje frame.
 *
 * @param {number} step Tidssteg för uppdatering.
 * @return {void}
 */
runmysteriet.scene.Game.prototype.update = function (step) {
  /**
   * Inläst spelarinput från GameInput.
   * @type {?Object}
   */
  var input = this.m_gameInput.read(this.keyboard);

  //Debug-snabbval.

  if (this.keyboard.justPressed("F1")) {
    this.application.scenes.load([
      new runmysteriet.scene.Game(6, this.m_score, this.m_avatarData)
    ]);
    return;
  }

  if (this.keyboard.justPressed("F2")) {
    this.application.scenes.load([
      new runmysteriet.scene.Game(15, this.m_score, this.m_avatarData)
    ]);
    return;
  }

  if (this.keyboard.justPressed("F3")) {
    this.application.scenes.load([
      new runmysteriet.scene.Game(19, this.m_score, this.m_avatarData)
    ]);
    return;
  }

  this.updatePauseInput(input);
  this.updateVolumeInput(input);

  if (this.m_isPaused === true) {
    this.updatePauseMenuPosition();
    this.updateHUD();
    return;
  }

  if (this.m_levelCompleteSequence && this.m_levelCompleteSequence.isActive()) {
    this.m_levelCompleteSequence.update();

    if (this.m_backgroundHandler) {
      this.m_backgroundHandler.update();
    }

    this.updateHUD();
    return;
  }

  if (this.m_gameEnd === true) {
    this.updateHUD();
    return;
  }

  if (this.m_startCountdownActive === true) {
    rune.scene.Scene.prototype.update.call(this, step);
    this.updateStartCountdown();

    if (this.m_backgroundHandler) {
      this.m_backgroundHandler.update();
    }

    this.updateGameInfo();
    this.updateHighscoreNotice();
    this.updateHUD();
    return;
  }

  rune.scene.Scene.prototype.update.call(this, step);

  if (this.m_cloudHandler) {
    this.m_cloudHandler.update();
  }

  //Plattformar / holes
  if (
    this.m_platformHandler &&
    typeof this.m_platformHandler.update === "function"
  ) {
    this.m_platformHandler.update(step);
  }

  //Spelaren uppdateras före kameran.

  if (this.m_playerHandler) {
    this.m_playerHandler.update();
  }

  //Kollisioner
  this.updateHoles();
  this.updateEnemies();
  this.updateDiseases(step);
  this.updateArmor();
  this.updateExtra();
  this.updateShields();

  //Autoscroll-kameran flyttas efter spelaren.

  if (this.m_cameraHandler) {
    this.m_cameraHandler.update(step);
  }

  //Håll spelare inom kamerans vänster/högerkant.

  if (
    this.m_playerHandler &&
    typeof this.m_playerHandler.handleAutoScrollCameraBounds === "function"
  ) {
    this.m_playerHandler.handleAutoScrollCameraBounds();
  }

  //Uppdatera Rune-kameran.

  if (this.camera && typeof this.camera.update === "function") {
    this.camera.update(0);
  }

  //Bakgrund efter kamera så den följer rätt.

  if (this.m_backgroundHandler) {
    this.m_backgroundHandler.update();
  }

  //Kolla level completion efter att kamera/bounds är rättade.

  this.checkLevelCompletion();
  this.updateGameInfo();
  this.updateHighscoreNotice();
  this.updateHUD();
};

/**
 * Uppdaterar hål i plattformarna och hanterar död vid kontakt.
 * Använder callback för att eliminera spelare som faller i hål.
 *
 * @return {void}
 */
runmysteriet.scene.Game.prototype.updateHoles = function () {
  /**
   * Referens till aktuell scene (för callback-scope).
   * @type {runmysteriet.scene.Game}
   */
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

/**
 * Uppdaterar fiender och skickar in spelarobjekt för kollision/logik.
 *
 * @return {void}
 */
runmysteriet.scene.Game.prototype.updateEnemies = function () {
  if (this.m_enemyHandler && this.m_playerHandler) {
    this.m_enemyHandler.update(this.m_playerHandler.players);
  }
};

/**
 * Uppdaterar sköld-/runehanteraren och skickar in spelare för kollisioner.
 *
 * @return {void}
 */
runmysteriet.scene.Game.prototype.updateShields = function () {
  if (this.m_shieldHandler && this.m_playerHandler) {
    this.m_shieldHandler.update(this.m_playerHandler.players);
  }
};

/**
 * Uppdaterar sjukdoms-/effekthanteraren och skickar in spelare samt tidssteg.
 *
 * @param {number} step Tidssteg (delta time) för uppdatering.
 * @return {void}
 */
runmysteriet.scene.Game.prototype.updateDiseases = function (step) {
  if (this.m_diseaseHandler && this.m_playerHandler) {
    this.m_diseaseHandler.update(this.m_playerHandler.players, step);
  }
};

/**
 * Uppdaterar armor-hanteraren och skickar in spelare för kollision/logik.
 *
 * @return {void}
 */
runmysteriet.scene.Game.prototype.updateArmor = function () {
  if (this.m_armorHandler && this.m_playerHandler) {
    this.m_armorHandler.update(this.m_playerHandler.players);
  }
};

runmysteriet.scene.Game.prototype.updateExtra = function () {
  if (this.m_platformHandler && this.m_playerHandler) {
    //kollisionskod
    var i = 0;
    var m_extra = this.m_platformHandler.getExtra();
    var players = this.m_playerHandler.players;
    if (!players || !m_extra) {
      return;
    }
    for (i = 0; i < players.length; i++) {
      player = players[i];

      if (m_extra.hitTestObject(player)) {
        this.addScore(25);
       this.m_platformHandler.clearExtra();
        break;
      }
    }
  }
};

/**
 * Skapar start-countdown innan spelet börjar.
 *
 * @return {void}
 */
runmysteriet.scene.Game.prototype.createStartCountdown = function () {
  var cameraX = 0;
  var cameraY = 0;

  this.m_startCountdownActive = true;
  this.m_startCountdownTimer = 120;

  if (this.camera && this.camera.viewport) {
    cameraX = this.camera.viewport.x;
    cameraY = this.camera.viewport.y;
  }

  //Mörk overlay som ger blur-/pauskänsla.

  this.m_startCountdownOverlay = new rune.display.Graphic(
    cameraX,
    cameraY,
    this.application.screen.width,
    this.application.screen.height
  );

  this.m_startCountdownOverlay.backgroundColor = "#000000";
  this.m_startCountdownOverlay.alpha = 0.55;

  this.stage.addChild(this.m_startCountdownOverlay);

  //Countdown-text.

  this.m_startCountdownText = new rune.text.BitmapField("3");
  this.m_startCountdownText.autoSize = true;

  this.stage.addChild(this.m_startCountdownText);

  this.updateStartCountdownPosition();

  //Pausa tweens under countdown så båt/flotte inte börjar röra sig direkt.

  if (this.tweens) {
    this.tweens.paused = true;
  }
};

/**
 * Uppdaterar start-countdown.
 *
 * @return {void}
 */
runmysteriet.scene.Game.prototype.updateStartCountdown = function () {
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
    this.m_startCountdownText.text = " GO";
  } else {
    this.closeStartCountdown();
  }
};

/**
 * Håller countdown-overlay och text låsta mot kameran.
 *
 * @return {void}
 */
runmysteriet.scene.Game.prototype.updateStartCountdownPosition = function () {
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
    this.m_startCountdownText.x =
      cameraX + this.application.screen.width / 2 - 12;
    this.m_startCountdownText.y =
      cameraY + this.application.screen.height / 2 - 12;

    if (this.m_startCountdownText.text === "  GO") {
      this.m_startCountdownText.x =
        cameraX + this.application.screen.width / 2 - 22;
    }
  }
};

/**
 * Tar bort countdown och startar spelet.
 *
 * @return {void}
 */
runmysteriet.scene.Game.prototype.closeStartCountdown = function () {
  this.m_startCountdownActive = false;
  this.m_startCountdownTimer = 0;

  if (this.m_startCountdownOverlay && this.m_startCountdownOverlay.stage) {
    this.m_startCountdownOverlay.stage.removeChild(
      this.m_startCountdownOverlay
    );
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
/**
 * Hanterar volyminmatning under spelets gång.
 * Justerar bakgrundsmusikens volym upp eller ner i steg.
 *
 * @param {?Object} input Inläst spelarinput.
 * @return {void}
 */
runmysteriet.scene.Game.prototype.updateVolumeInput = function (input) {
  /**
   * Stegstorlek för volymändring.
   * @type {number}
   */
  var stepVol = 0.1;

  if (!input || !this.backgroundMusic) {
    return;
  }

  if (input.volumeUp === true) {
    this.backgroundMusic.volume += stepVol;

    if (this.backgroundMusic.volume > 1) {
      this.backgroundMusic.volume = 0;
    }

    return;
  }

  if (input.volumeDown === true) {
    this.backgroundMusic.volume -= stepVol;

    if (this.backgroundMusic.volume < 0) {
      this.backgroundMusic.volume = 1;
    }

    console.log("Volym:", this.backgroundMusic.volume.toFixed(2));
  }
};
/**
 * Hanterar input för pausmenyn.
 * Öppnar/stänger paus, samt hanterar menyval när spelet är pausat.
 *
 * @param {?Object} input Inläst spelarinput.
 * @return {void}
 */
runmysteriet.scene.Game.prototype.updatePauseInput = function (input) {
  /**
   * Säkerställer att spelet inte är pauslogik om spelet redan är avslutat.
   * @type {boolean}
   */
  if (this.m_gameEnd === true) {
    return;
  }

  if (!input) {
    input = this.m_gameInput.read(this.keyboard);
  }

  if (input.pause === true) {
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

  this.handleMenuListInput(this.m_pauseMenu, input, function (selectedIndex) {
    if (selectedIndex === 0) {
      this.closePauseMenu();
    } else if (selectedIndex === 1) {
      this.quitToMenu();
    }
  });
};
/**
 * Skapar pausmeny med overlay, titel och menyval.
 * Används för att stoppa spelet och visa paus-UI.
 *
 * @return {void}
 */
runmysteriet.scene.Game.prototype.createPauseMenu = function () {
  if (this.m_pauseMenu) {
    return;
  }

  /**
   * Mörk bakgrunds-overlay som visas vid paus.
   * @type {rune.display.Graphic}
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

  /**
   * Titeltext för pausmenyn.
   * @type {rune.text.BitmapField}
   */
  this.m_pauseTitle = new rune.text.BitmapField("GAME PAUSED");
  this.m_pauseTitle.autoSize = true;
  this.m_pauseTitle.visible = false;

  this.stage.addChild(this.m_pauseTitle);

  /**
   * Menylista för pausalternativ.
   * @type {runmysteriet.ui.graphic.MenuList}
   */
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

/**
 * Öppnar pausmenyn och stoppar spelets aktivitet.
 * Visar overlay, titel och meny samt pausar animationer och musik.
 *
 * @return {void}
 */
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
/**
 * Stänger pausmenyn och återupptar spelet.
 * Döljer UI-element och återstartar animationer och musik.
 *
 * @return {void}
 */
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
/**
 * Uppdaterar positionen för pausmenyn så den följer kamerans viewport.
 * Säkerställer att overlay, titel och meny ligger korrekt vid scroll.
 *
 * @return {void}
 */
runmysteriet.scene.Game.prototype.updatePauseMenuPosition = function () {
  /**
   * Aktiv kamera som används för positionering.
   * @type {?Object}
   */
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
/**
 * Avslutar spelet och återgår till huvudmenyn.
 * Stoppar musik och markerar spelet som avslutat innan scenbyte.
 *
 * @return {void}
 */
runmysteriet.scene.Game.prototype.quitToMenu = function () {
  this.m_gameEnd = true;

  if (this.backgroundMusic) {
    if (typeof this.backgroundMusic.stop === "function") {
      this.stopSound(this.backgroundMusic);
    } else if (typeof this.backgroundMusic.pause === "function") {
      this.backgroundMusic.pause();
    }
  }

  this.application.scenes.load([new runmysteriet.scene.Menu()]);
};
/**
 * Spelar upp meny-ljudet vid UI-interaktion.
 * Hämtar ljudet från sound-systemet och spelar det om det finns.
 *
 * @return {void}
 */
runmysteriet.scene.Game.prototype.playMenuSound = function () {
  var menuSound = this.application.sounds.sound.get("sound_menu");

  if (menuSound) {
    menuSound.play();
  }
};
/**
 * Hanterar input för en menylista (upp/ner/val).
 * Flyttar markering och anropar callback vid val.
 *
 * @param {Object} menuList Menyobjekt som hanterar valbara alternativ.
 * @param {?Object} input Inläst spelarinput.
 * @param {Function} onChoose Callback som körs vid val av menyitem.
 * @return {void}
 */
runmysteriet.scene.Game.prototype.handleMenuListInput = function (
  menuList,
  input,
  onChoose
) {
  if (!menuList || !input) {
    return;
  }

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

/**
 * Uppdaterar spelinformation i HUD (score och målstatus).
 * Visar nivå, totalpoäng samt status för runor.
 *
 * @return {void}
 */
runmysteriet.scene.Game.prototype.updateGameInfo = function () {
  if (!this.m_hudHandler) {
    return;
  }

  if (this.allRunesColected()) {
    this.m_hudHandler.setTimerText("ALL RUNES FOUND");
  } else {
    this.m_hudHandler.setTimerText("COLLECT ALL RUNES");
  }

  this.m_hudHandler.setScoreText(
    "LEVEL " + this.m_levelNumber + " SCORE " + this.getTotalScore()
  );
};
/**
 * Kontrollerar om spelet ska avslutas genom vinst eller förlust.
 * Kollar om någon spelare nått slutzon eller om alla spelare är döda.
 *
 * @return {void}
 */
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
};

/**
 * Kontrollerar om en specifik spelare har nått slutzonen.
 *
 * @param {Object} player Spelare som ska kontrolleras.
 * @return {boolean} True om spelaren är i slutzonen, annars false.
 */
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
/**
 * Kontrollerar om alla spelare är döda.
 * Används för att avgöra om spelet ska avslutas som förlust.
 *
 * @return {boolean} True om alla spelare är döda, annars false.
 */
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

/**
 * Lägger till poäng till aktuell nivå.
 * Uppdaterar även highscore-kontroll efter poängtillägg.
 *
 * @param {number} amount Antal poäng som ska läggas till.
 * @return {void}
 */
runmysteriet.scene.Game.prototype.addScore = function (amount) {
  amount = parseInt(amount, 10) || 0;

  if (amount <= 0) {
    return;
  }

  this.m_levelScore += amount;
  this.checkHighscoreNotice(this.getTotalScore());
};
/**
 * Hämtar spelarens totala poäng.
 * Summerar tidigare poäng och poäng från aktuell nivå.
 *
 * @return {number} Totalpoäng.
 */
runmysteriet.scene.Game.prototype.getTotalScore = function () {
  return this.m_score + this.m_levelScore;
};
/**
 * Beräknar poäng baserat på spelarnas hälsa.
 * Omvandlar HP till procent och viktar det till en score-del.
 *
 * @return {number} Hälsobaserad poängsumma.
 */
runmysteriet.scene.Game.prototype.getHealthScore = function () {
  var players = null;
  var player = null;
  var i = 0;

  var hp = 0;
  var maxHp = 0;
  var percent = 0;
  var score = 0;

  if (!this.m_playerHandler || !this.m_playerHandler.players) {
    return 0;
  }

  players = this.m_playerHandler.players;

  for (i = 0; i < players.length; i++) {
    player = players[i];

    if (!player) {
      continue;
    }

    if (player.isDead === true) {
      continue;
    }

    hp = parseInt(player.hp, 10) || 0;
    maxHp = parseInt(player.maxHp, 10) || 100;

    if (hp <= 0) {
      continue;
    }

    if (maxHp <= 0) {
      maxHp = 100;
    }

    percent = Math.round((hp / maxHp) * 100);

    if (percent < 0) {
      percent = 0;
    }

    if (percent > 100) {
      percent = 100;
    }

    score += percent * this.m_scoreHealthPercent;
  }

  return score;
};

/**
 * Hanterar vinst i spelet och startar level complete-sekvensen.
 *
 * @param {Object} winningPlayer Spelaren som nådde målet.
 * @return {void}
 */
runmysteriet.scene.Game.prototype.winGame = function (winningPlayer) {
  /**
   * Referens till scenen för callbacks.
   * @type {runmysteriet.scene.Game}
   */
  var self = this;

  /**
   * Poäng som tjänats under denna nivå.
   * @type {number}
   */
  var earnedScore = 0;

  /**
   * Totalpoäng efter nivåslut.
   * @type {number}
   */
  var totalScore = 0;

  /**
   * Data från gissningssystemet (runor/sköldar).
   * @type {?Object}
   */
  var guessData = null;

  if (this.m_gameEnd === true) {
    return;
  }

  this.m_gameEnd = true;

  // Lägg till level complete-score och health bonus.
  this.addScore(this.m_scoreLevelComplete + this.getHealthScore());

  earnedScore = this.m_levelScore;
  totalScore = this.getTotalScore();

  if (
    this.m_shieldHandler &&
    typeof this.m_shieldHandler.getGuessData === "function"
  ) {
    guessData = this.m_shieldHandler.getGuessData();
  }

  // Pausa rörelser som båtar/flottar under segersekvensen.
  if (this.tweens) {
    this.tweens.paused = true;
  }

  this.stopSound(this.backgroundMusic);

  // Starta segersekvensen
  if (
    this.m_levelCompleteSequence &&
    typeof this.m_levelCompleteSequence.start === "function"
  ) {
    this.m_levelCompleteSequence.start(
      {
        levelNumber: this.m_levelNumber,
        earnedScore: earnedScore,
        totalScore: totalScore,
        guessData: guessData,
        avatarData: this.m_avatarData,
      },
      function (data) {
        self.application.scenes.load([
          new runmysteriet.scene.GuessWord(
            data.levelNumber,
            data.earnedScore,
            data.totalScore,
            data.guessData,
            data.avatarData
          ),
        ]);
      }
    );

    return;
  }

  // Fallback om sekvensen saknas.
  this.application.scenes.load([
    new runmysteriet.scene.GuessWord(
      this.m_levelNumber,
      earnedScore,
      totalScore,
      guessData,
      this.m_avatarData
    )
  ]);
};
/**
 * Hanterar förlust i spelet och byter till Game Over-scenen.
 * Stoppar musik och skickar med slutpoäng samt orsak.
 *
 * @param {string=} reason Orsak till game over (valfri).
 * @return {void}
 */
runmysteriet.scene.Game.prototype.loseGame = function (reason) {
  var totalScore = 0;

  if (this.m_gameEnd === true) {
    return;
  }

  this.m_gameEnd = true;

  totalScore = this.getTotalScore();

  this.stopSound(this.backgroundMusic);

  if (
    this.m_highscoreManager &&
    this.m_highscoreManager.isNewRecord(totalScore) === true
  ) {
    this.application.scenes.load([
      new runmysteriet.scene.TextInputView(
        function () {
          return "UP/DOWN = LETTER   ENTER/X = ADD/SAVE   BACK/ESC = DELETE";
        },
        this.m_avatarData,
        {
          score: totalScore,
          reason: reason || "GAME OVER"
        }
      )
    ]);
    return;
  }

  this.application.scenes.load([
    new runmysteriet.scene.GameOver(totalScore, reason || "GAME OVER")
  ]);
};
/**
 * Kontrollerar om alla runor/sköldar har samlats in.
 * Använder ShieldHandler för att avgöra om spelet är klart.
 *
 * @return {boolean} True om alla runor är insamlade, annars false.
 */
runmysteriet.scene.Game.prototype.allRunesColected = function () {
  if (!this.m_shieldHandler) {
    return false;
  }

  return this.m_shieldHandler.allRunesColected();
};
/**
 * Återupplivar döda spelare efter vinst
 *
 * @param {Object=} winningPlayer Spelaren som vann (används för positionering).
 * @return {void}
 */
runmysteriet.scene.Game.prototype.reviveDeadPlayers = function (winningPlayer) {
  /**
   * Lista med spelare från PlayerHandler.
   * @type {?Array}
   */
  var players = null;

  /**
   * Aktuell spelare i loopen.
   * @type {?Object}
   */
  var player = null;

  /**
   * Loopindex.
   * @type {number}
   */
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

/**
 * Startar om nuvarande nivå genom att rensa och återskapa fiender.
 * Återinitialiserar LevelConfig och kopplar om EnemyHandler till spelaren.
 *
 * @return {void}
 */
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

/**
 * Tar bort ett objekt från scenen om det finns där.
 *
 * @param {?Object} object
 * @return {void}
 */
runmysteriet.scene.Game.prototype.removeDisplayObject = function (object) {
  if (!object) {
    return;
  }

  if (object.parent) {
    object.parent.removeChild(object);
    return;
  }

  if (object.stage) {
    object.stage.removeChild(object);
  }
};

/**
 * Stoppar ett Rune-ljud säkert.
 *
 * Använder inte sound.stop(), eftersom Rune kan krascha
 * om ljudets interna mediaElement redan är null.
 *
 * @param {?Object} sound
 * @return {void}
 */
runmysteriet.scene.Game.prototype.stopSound = function (sound) {
  var mediaElement = null;

  if (!sound) {
    return;
  }

  if (!sound.m_source || !sound.m_source.mediaElement) {
    return;
  }

  mediaElement = sound.m_source.mediaElement;

  if (typeof mediaElement.pause === "function") {
    mediaElement.pause();
  }

  try {
    mediaElement.currentTime = 0;
  } catch (error) {}
};

/**
 * Rensar Game-scenen.
 *
 * Ordningen är motsatt mot init:
 * det som skapas sist i init rensas först här.
 *
 * @return {void}
 */
runmysteriet.scene.Game.prototype.dispose = function () {
  //Start countdown skapades sist i init.
  this.m_startCountdownActive = false;
  this.m_startCountdownTimer = 0;

  this.removeDisplayObject(this.m_startCountdownText);
  this.removeDisplayObject(this.m_startCountdownOverlay);

  this.m_startCountdownText = null;
  this.m_startCountdownOverlay = null;

  //Highscore notification.

  this.removeDisplayObject(this.m_highscoreText);

    this.m_highscoreText = null;
    this.m_highscoreManager = null;
    this.m_highscoreSound = null;
    this.m_highscoreTimer = 0;
    this.m_highscoreNotified = false;
    this.m_highscoreNoticeType = "";
    

  //Pause UI kan ha skapats senare under spelet.

  if (this.m_pauseMenu) {
    if (typeof this.m_pauseMenu.dispose === "function") {
      this.m_pauseMenu.dispose();
    } else if (typeof this.m_pauseMenu.clear === "function") {
      this.m_pauseMenu.clear();
    }
  }

  this.removeDisplayObject(this.m_pauseTitle);
  this.removeDisplayObject(this.m_pauseOverlay);

  this.m_pauseMenu = null;
  this.m_pauseTitle = null;
  this.m_pauseOverlay = null;
  this.m_isPaused = false;

  //Level complete sequence.

  if (this.m_levelCompleteSequence) {
    if (typeof this.m_levelCompleteSequence.dispose === "function") {
      this.m_levelCompleteSequence.dispose();
    } else if (typeof this.m_levelCompleteSequence.clear === "function") {
      this.m_levelCompleteSequence.clear();
    }
  }

  this.m_levelCompleteSequence = null;

  //HUD skapades efter shields.

  if (this.m_hudHandler) {
    if (typeof this.m_hudHandler.dispose === "function") {
      this.m_hudHandler.dispose();
    } else if (typeof this.m_hudHandler.clear === "function") {
      this.m_hudHandler.clear();
    }
  }

  this.m_hudHandler = null;

  //Shields / runor.

  if (this.m_shieldHandler) {
    if (typeof this.m_shieldHandler.dispose === "function") {
      this.m_shieldHandler.dispose();
    } else if (typeof this.m_shieldHandler.clear === "function") {
      this.m_shieldHandler.clear();
    }
  }

  this.m_shieldHandler = null;

  //Armor.

  if (this.m_armorHandler) {
    if (typeof this.m_armorHandler.dispose === "function") {
      this.m_armorHandler.dispose();
    } else if (typeof this.m_armorHandler.clear === "function") {
      this.m_armorHandler.clear();
    }
  }

  this.m_armorHandler = null;

  //Sjukdomar.

  if (this.m_diseaseHandler) {
    if (typeof this.m_diseaseHandler.dispose === "function") {
      this.m_diseaseHandler.dispose();
    } else if (typeof this.m_diseaseHandler.clear === "function") {
      this.m_diseaseHandler.clear();
    }
  }

  this.m_diseaseHandler = null;

  this.m_cameraHandler = null;

  //Fiender

  if (this.m_enemyHandler) {
    if (typeof this.m_enemyHandler.dispose === "function") {
      this.m_enemyHandler.dispose();
    } else if (typeof this.m_enemyHandler.clear === "function") {
      this.m_enemyHandler.clear();
    }
  }

  this.m_enemyHandler = null;

  //Level config

  this.m_levelConfig = null;

  // Spelare

  if (this.m_playerHandler) {
    if (typeof this.m_playerHandler.dispose === "function") {
      this.m_playerHandler.dispose();
    } else if (typeof this.m_playerHandler.clear === "function") {
      this.m_playerHandler.clear();
    }
  }

  this.m_playerHandler = null;

  //Moln

  if (this.m_cloudHandler) {
    if (typeof this.m_cloudHandler.dispose === "function") {
      this.m_cloudHandler.dispose();
    } else if (typeof this.m_cloudHandler.clear === "function") {
      this.m_cloudHandler.clear();
    }
  }

  this.m_cloudHandler = null;

  //Plattformar, lava, vatten, båtar.

  if (this.m_platformHandler) {
    if (typeof this.m_platformHandler.dispose === "function") {
      this.m_platformHandler.dispose();
    } else if (typeof this.m_platformHandler.clear === "function") {
      this.m_platformHandler.clear();
    }
  }

  this.m_platformHandler = null;

  //Bakgrund skapas tidigt i init, därför rensas den sent.

  if (this.m_backgroundHandler) {
    if (typeof this.m_backgroundHandler.dispose === "function") {
      this.m_backgroundHandler.dispose();
    } else if (typeof this.m_backgroundHandler.clear === "function") {
      this.m_backgroundHandler.clear();
    }
  }

  this.m_backgroundHandler = null;

  //Ljud.

  this.stopSound(this.backgroundMusic);

  this.backgroundMusic = null;
  this.menuSound = null;

  this.m_gameInput = null;
  this.camera = null;
  this.m_avatarData = null;

  rune.scene.Scene.prototype.dispose.call(this);
};
