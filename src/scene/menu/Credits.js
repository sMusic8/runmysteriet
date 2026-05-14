var runmysteriet = runmysteriet || {};
runmysteriet.scene = runmysteriet.scene || {};

//------------------------------------------------------------------------------
// Constructor scope
//------------------------------------------------------------------------------

/**
 * Credits scene.
 *
 * @constructor
 * @extends rune.scene.Scene
 */
runmysteriet.scene.Credits = function () {
  rune.scene.Scene.call(this);

  this.m_background = null;
  this.m_title = null;
  this.m_back = null;
  this.m_subText = null;
  this.m_backText = null;
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

runmysteriet.scene.Credits.prototype = Object.create(
  rune.scene.Scene.prototype,
);
runmysteriet.scene.Credits.prototype.constructor = runmysteriet.scene.Credits;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.scene.Credits.prototype.init = function () {
  this.backgroundMusic = this.application.sounds.sound.get("sound_musicMenu");
  this.menuSound = this.application.sounds.sound.get("sound_menu");
  if (this.backgroundMusic) {
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.5;
    this.backgroundMusic.play();
  }

  //If gamepad eller kaybord justpresst ändra nummret på volume med ett steg i en loop
  rune.scene.Scene.prototype.init.call(this);

  this.m_initBackground();
  this.m_initTitle();
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

runmysteriet.scene.Credits.prototype.update = function (step) {
  rune.scene.Scene.prototype.update.call(this, step);

  var gamepad = this.gamepads.get(0);

  if (
    this.keyboard.justPressed("ENTER") ||
    this.keyboard.justPressed("SPACE") ||
    this.keyboard.justPressed("ESCAPE") ||
    (gamepad && (gamepad.justPressed(9) || gamepad.justPressed(0)))
  ) {
    this.application.scenes.load([new runmysteriet.scene.Menu()]);
  }
};

//------------------------------------------------------------------------------
// DISPOSE
//------------------------------------------------------------------------------

runmysteriet.scene.Credits.prototype.dispose = function () {
  this.m_background = null;
  this.m_title = null;
  this.m_back = null;
  this.m_subText = null;
  this.m_backText = null;

  rune.scene.Scene.prototype.dispose.call(this);
};

//------------------------------------------------------------------------------
// BACKGROUND
//------------------------------------------------------------------------------

runmysteriet.scene.Credits.prototype.m_initBackground = function () {
  this.m_background = new rune.display.Graphic(
    0,
    0,
    this.application.screen.width,
    this.application.screen.height,
    "background_menu",
  );

  this.stage.addChild(this.m_background);
};

//------------------------------------------------------------------------------
// TITLE + TEXT
//------------------------------------------------------------------------------

runmysteriet.scene.Credits.prototype.m_initTitle = function () {
  var center = this.application.screen.center;

  //-------------------------------------------------------
  // MAIN TEXT (FIXAD, CENTRERAD, FITAR SKÄRM)
  //-------------------------------------------------------

  this.m_title = new rune.text.BitmapField(
    "This game was created by\n" +
      "Frida Bergstrom and Sabina Music\n" +
      "as part of Project Course 2\n" +
      "in media technology.",
  );

  this.m_title.autoSize = true;

  this.stage.addChild(this.m_title);

  this.m_title.x = center.x - this.m_title.width / 2;
  this.m_title.y = center.y - this.m_title.height / 2 - 40;

  //-------------------------------------------------------
  // BACK INSTRUCTIONS
  //-------------------------------------------------------

  this.m_back = new rune.text.BitmapField(
    "< BACK\nPress ENTER / SPACE / ESC\nGamepad: START or X",
  );

  this.m_back.autoSize = true;

  this.stage.addChild(this.m_back);

  this.m_back.x = center.x - this.m_back.width / 2;
  this.m_back.y = center.y + 60;
};
