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

    this.m_isPaused = false;
    this.m_pauseText = null;
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

    
  //Musik
  this.backgroundMusic = this.application.sounds.sound.get("sound_music");
  this.backgroundMusic.play(true);
      //console.log("kamera", this.camera.viewport);

  // Bakgrund
  this.m_backgroundHandler = new runmysteriet.handler.BackgroundHandler(
    this.stage,
    this.cameras.getCameraAt(0),
    this.application.screen.width,
    this.application.screen.height
  );
  this.m_backgroundHandler.init();
  // Moln
  this.m_cloudHandler = new runmysteriet.handler.CloudHandler(
    this.stage,
    this.application.screen.width
  );

  this.m_cloudHandler.init();

  // Plattformar
  this.m_platformHandler = new runmysteriet.handler.PlatformHandler(
    this.stage,
    this.application.screen.width
  );

  this.m_platformHandler.init();

  // Spelare
  this.m_playerHandler = new runmysteriet.handler.PlayerHandler(
    this.stage,
    this.m_platformHandler.platforms,
    this.application
  );

  this.m_playerHandler.init();

  //kamera
  this.m_cameraHandler = new runmysteriet.handler.CameraHandler(
    this.cameras.getCameraAt(0),
    this.m_playerHandler
  );

  // Sköldar
  this.m_shieldHandler = new runmysteriet.handler.ShieldHandler(
    this.stage,
    this.application
  );
  this.m_shieldHandler.init();

this.m_kristen = new runmysteriet.entity.Kristen(
    this.stage,
    this.application.spritesheets.get("spritesheet_kristen")
);

this.m_kristen.init();
//text för paus ---OBS----låt ligga sist så den inte hamnar bakom bakgrund och molnen
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
  if(this.m_isPaused === true){
    return;

  }

  this.m_cloudHandler.update();
  this.m_playerHandler.update();
  
  if (this.m_shieldHandler) {
    this.m_shieldHandler.update(this.m_playerHandler.players);
  }

  //kameran uppdateras 
  if (this.m_cameraHandler) {
    this.m_cameraHandler.update();

  }
  if (this.m_backgroundHandler) {
    this.m_backgroundHandler.update();
  }
};

//------------------------------------------------------------------------------
// DISPOSE
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.dispose = function () {
  rune.scene.Scene.prototype.dispose.call(this);
};

//paus funtion kollar tangent p o gamepad
runmysteriet.scene.Game.prototype.updatePauseInput = function(){
  var gamepad = null;
  if(this.application && this.application.inputs && this.application.inputs.gamepads){
    gamepad = this.application.inputs.gamepads.get(0);
  }

  var startIsPressed = false;

  if(gamepad !== null && gamepad !== undefined) {
    if(typeof gamepad.justPressed === "function"){
      startIsPressed = gamepad.justPressed("START") || gamepad.justPressed(9);
    }
    
  }
  if (startIsPressed || this.keyboard.justPressed("P")) {
      this.m_isPaused = !this.m_isPaused;

      if(this.m_pauseText){

          this.m_pauseText.visible = this.m_isPaused;
          this.m_pauseText.x = this.cameras.getCameraAt(0).viewport.x + 90;
          this.m_pauseText.y = this.cameras.getCameraAt(0).viewport.y + 100;
      } 
      if (this.backgroundMusic){
        if(this.m_isPaused === true){
            this.backgroundMusic.pause();

        }
        else {
            this.backgroundMusic.play(true);
        }


      }

   console.log("Paus", this.m_isPaused);



  }


}
