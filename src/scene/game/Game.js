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

    /**
     * sekunder spelaren har på sig att klara level
     * @type{number}
     * 
     */
    this.m_timeLeft = 60;

    /**
     * text 
     * @type{rune.text.BitmapField}
     * 
     */
    this.m_timerText = null;

    /**
     * om spelet är slut 
     * @type{boolean}
     * 
     */
    this.m_gameEnd = false;

    /**
     * 
     * x position för finish
     * @type{number}
     * 
     */
    this.m_finishX = 0;

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
// var gris = new runmysteriet.segments.Segment_1();
// gris.ground();
//Musik
  this.backgroundMusic = this.application.sounds.sound.get("sound_music");
  //this.backgroundMusic.play(true);
      //console.log("kamera", this.camera.viewport);

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
  this.m_levelNumber = 1;
  // Plattformar
  this.m_platformHandler = new runmysteriet.handler.PlatformHandler(
    this.stage,
    this.application.screen.width
  );

  this.m_platformHandler.init();

  this.m_levelConfig = new runmysteriet.config.LevelConfig(this.m_levelNumber);

  this.m_enemyHandler = new runmysteriet.handler.EnemyHandler(this.stage);

  this.m_enemyHandler.init(
    this.m_levelConfig,
    this.m_platformHandler.getEnemySpawns()
);

  this.m_finishX = this.m_platformHandler.levelWidth - 50; 
  this.m_timerText = new rune.text.BitmapField("TID KVAR 60");
  this.m_timerText.x = 15;
  this.m_timerText.y = 15;
  this.stage.addChild(this.m_timerText);


  // Spelare
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

    if (this.m_isPaused === true) {
        return;
    }

    if (this.m_gameEnd === true) {
        return;
    }

    this.m_cloudHandler.update();

    this.m_playerHandler.update();

    var self = this;

    this.m_platformHandler.updateHoles(
        this.m_playerHandler.players,
        function(player, index) {
            self.killPlayer(player, index);
        }
    );

    if (this.m_enemyHandler) {
        this.m_enemyHandler.update(this.m_playerHandler.players);
    }

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

  return this.m_shieldHandler.allRunesColected();
}

runmysteriet.scene.Game.prototype.reviveDeadPlayers =function(winningPlayer){

  var players = this.m_playerHandler.players;

  if (!players){
          return;

        }
    for (var i = 0; i < players.length; i++) {
        var player = players[i];

       

        if (!player) {
            continue;
        }
        if( player.isDead === true ){ 
            player.isDead = false; 
            player.visible = true;
            player.active = true;
            player.velocityY = 0;
            player.isOnGround = true; 

            if (winningPlayer){
              player.x = winningPlayer.x - 40 + i  * 40;
              player.y = winningPlayer.y;
            }
            else{
              player.x = this.m_finishX - 80 + i * 40
              player.y = player.groundY || 188;
            }
            console.log("PLAYER REVIVED", i)
       };
      }

}
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