//------------------------------------------------------------------------------
// GAME SCENE
//------------------------------------------------------------------------------

runmysteriet.scene.Game = function () {
  rune.scene.Scene.call(this);

  this.m_playerHandler = null;
  this.m_cloudHandler = null;
  this.m_shieldHandler = null;
  this.m_cameraHandler = null;
  this.m_backgroundHandler = null;

  this.m_isPaused = false;
  this.m_pauseText = null;

  this.m_timeLeft = 60;
  this.m_timerText = null;
  this.m_gameEnd = false;

  this.m_finishX = 0;

  // SEGMENT
  this.segment = null;
};

runmysteriet.scene.Game.prototype = Object.create(rune.scene.Scene.prototype);
runmysteriet.scene.Game.prototype.constructor = runmysteriet.scene.Game;

//------------------------------------------------------------------------------
// INIT (FIXAD – endast en version)
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.init = function () {
  rune.scene.Scene.prototype.init.call(this);

  // skapa segment
  this.segment = new runmysteriet.segments.Segment_1(this.stage);

  // bygg hela segmentet
  this.segment.build();

  // debug
  console.log("PLATFORMS:", this.segment.platforms.length);

  // sätt var banan slutar
  this.m_finishX = this.segment.levelWidth - 50;

  // Bakgrund
  /*this.m_backgroundHandler = new runmysteriet.handler.BackgroundHandler(
    this.stage,
    this.cameras.getCameraAt(0),
    this.application.screen.width,
    this.application.screen.height
  );
  this.m_backgroundHandler.init();*/

  // Moln
  this.m_cloudHandler = new runmysteriet.handler.CloudHandler(
    this.stage,
    this.application.screen.width
  );
  this.m_cloudHandler.init();

  // SPELARE – använder segmentets plattformar
  this.m_playerHandler = new runmysteriet.handler.PlayerHandler(
    this.stage,
    this.segment.platforms,
    this.application
  );
  this.m_playerHandler.init();

  // Kamera
  this.m_cameraHandler = new runmysteriet.handler.CameraHandler(
    this.cameras.getCameraAt(0),
    this.m_playerHandler,
    this.segment.levelWidth
  );

  // Sköldar
  this.m_shieldHandler = new runmysteriet.handler.ShieldHandler(
    this.stage,
    this.application,
    this.segment.levelWidth
  );
  this.m_shieldHandler.init();

  // Timer UI
  this.m_timerText = new rune.text.BitmapField("TID KVAR 60");
  this.m_timerText.x = 15;
  this.m_timerText.y = 15;
  this.stage.addChild(this.m_timerText);

  // Pause text
  this.m_pauseText = new rune.text.BitmapField("SPELET AR PAUSAT");
  this.m_pauseText.autoSize = true;
  this.m_pauseText.x = 90;
  this.m_pauseText.y = 100;
  this.m_pauseText.visible = false;
  this.stage.addChild(this.m_pauseText);
};

//------------------------------------------------------------------------------
// UPDATE (oförändrad)
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.update = function (step) {
  rune.scene.Scene.prototype.update.call(this, step);

  this.updatePauseInput();

  if (this.m_isPaused || this.m_gameEnd) {
    return;
  }

  this.m_cloudHandler.update();
  this.m_playerHandler.update();

  if (this.m_shieldHandler) {
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
  if (this.keyboard.justPressed("P")) {
    this.m_isPaused = !this.m_isPaused;

    if (this.m_pauseText) {
      let cam = this.cameras.getCameraAt(0);
      this.m_pauseText.visible = this.m_isPaused;
      this.m_pauseText.x = cam.viewport.x + 90;
      this.m_pauseText.y = cam.viewport.y + 100;
    }
  }
};

//------------------------------------------------------------------------------
// TIMER
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.updateTimer = function () {
  let cam = this.cameras.getCameraAt(0);

  this.m_timeLeft -= 1 / 30;
  if (this.m_timeLeft < 0) this.m_timeLeft = 0;

  if (this.m_timerText) {
    this.m_timerText.text = "TID KVAR " + Math.ceil(this.m_timeLeft);
    this.m_timerText.x = cam.viewport.x + 15;
    this.m_timerText.y = cam.viewport.y + 15;
  }
};

//------------------------------------------------------------------------------
// WIN / LOSE
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.checkLevelCompletion = function () {
  let players = this.m_playerHandler.players;

  if (!players) return;

  for (let i = 0; i < players.length; i++) {
    let player = players[i];

    if (!player || player.isDead) continue;

    if (player.x >= this.m_finishX) {
      this.winGame();
      return;
    }
  }

  if (this.m_timeLeft <= 0) {
    this.loseGame();
  }
};

runmysteriet.scene.Game.prototype.winGame = function () {
  if (this.m_gameEnd) return;

  this.m_gameEnd = true;

  let cam = this.cameras.getCameraAt(0);

  let text = new rune.text.BitmapField("DU VANN");
  text.autoSize = true;
  text.x = cam.viewport.x + 90;
  text.y = cam.viewport.y + 100;

  this.stage.addChild(text);
};

runmysteriet.scene.Game.prototype.loseGame = function () {
  if (this.m_gameEnd) return;

  this.m_gameEnd = true;

  let cam = this.cameras.getCameraAt(0);

  let text = new rune.text.BitmapField("DU FORLORADE");
  text.autoSize = true;
  text.x = cam.viewport.x + 90;
  text.y = cam.viewport.y + 100;

  this.stage.addChild(text);
};