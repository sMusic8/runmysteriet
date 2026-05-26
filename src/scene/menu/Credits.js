/**
 * Credits scene.
 *
 * @constructor
 * @extends {rune.scene.Scene}
 */
runmysteriet.scene.Credits = function() {

    rune.scene.Scene.call(this);

    this.m_background = null;
    this.m_box = null;
    this.m_titleText = null;
    this.m_text = null;
    this.m_backButton = null;

    this.backgroundMusic = null;
    this.menuSound = null;

    this.m_gameInput = null;
    this.m_volumeHud = null;
};

runmysteriet.scene.Credits.prototype = Object.create(rune.scene.Scene.prototype);
runmysteriet.scene.Credits.prototype.constructor = runmysteriet.scene.Credits;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.scene.Credits.prototype.init = function() {

    rune.scene.Scene.prototype.init.call(this);

    this.m_gameInput = new runmysteriet.input.GameInput(this.application);

    this.backgroundMusic = this.application.sounds.sound.get("sound_musicMenu");
    this.menuSound = this.application.sounds.sound.get("sound_menu");

    if (this.backgroundMusic) {
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.5;
        this.backgroundMusic.play();
    }

    this.createBackground();
    this.createBox();
    this.createTitle();
    this.createText();
    this.createBackButton();
    this.createVolumeHud();
};

//------------------------------------------------------------------------------
// CREATE
//------------------------------------------------------------------------------

runmysteriet.scene.Credits.prototype.createBackground = function() {

    this.m_background = new rune.display.Graphic(
        0,
        0,
        this.application.screen.width,
        this.application.screen.height,
        "background_menu"
    );

    this.stage.addChild(this.m_background);
};

runmysteriet.scene.Credits.prototype.createBox = function() {

    var boxWidth = 520;
    var boxHeight = 300;

    this.m_box = new rune.display.Graphic(
        0,
        0,
        boxWidth,
        boxHeight
    );

    this.m_box.fill = true;
    this.m_box.fillColor = "#ffffff";

    this.m_box.x = this.application.screen.center.x - boxWidth / 2;
    this.m_box.y = this.application.screen.center.y - boxHeight / 2;

    this.stage.addChild(this.m_box);
};

runmysteriet.scene.Credits.prototype.createTitle = function() {

    this.m_titleText = new rune.text.BitmapField("CREDITS");
    this.m_titleText.autoSize = true;

    this.stage.addChild(this.m_titleText);

    this.m_titleText.x =
        this.application.screen.center.x - this.m_titleText.width / 2;

    this.m_titleText.y =
        this.m_box.y + 25;
};

runmysteriet.scene.Credits.prototype.createText = function() {

    this.m_text = new rune.text.BitmapField(
         "\n\nThis game was created by\n" +
      "Frida Bergstrom and Sabina Music\n" +
      "as part of Project Course 2\n" +
      "in media technology.\n\n" +
        "MADE WITH RUNE SDK\n\n" +
        "ART, CODE AND DESIGN\n" +
        "RUNMYSTERIET\n\n\n\n" +
        "< BACK\n" +
        "Press A / ENTER / SPACE / ESC\n" +
        "R/Q = Volume"
    );

    this.m_text.autoSize = true;

    this.stage.addChild(this.m_text);

    this.m_text.x = this.m_box.x + (this.m_box.width - this.m_text.width) / 2;
    this.m_text.y = this.m_box.y + 80;
};

runmysteriet.scene.Credits.prototype.createBackButton = function() {

    this.m_backButton = new rune.text.BitmapField("BACK");
    this.m_backButton.autoSize = true;

    this.stage.addChild(this.m_backButton);

    this.m_backButton.x =
        this.application.screen.center.x - this.m_backButton.width / 2;

    this.m_backButton.y =
        this.m_box.y + this.m_box.height + 15;
};

runmysteriet.scene.Credits.prototype.createVolumeHud = function() {

    this.m_volumeHud = new runmysteriet.ui.graphic.VolumeHud(
        this.application,
        this.backgroundMusic
    );

    this.stage.addChild(this.m_volumeHud);
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

runmysteriet.scene.Credits.prototype.update = function(step) {

    rune.scene.Scene.prototype.update.call(this, step);

    this.handleInput();
};

//------------------------------------------------------------------------------
// INPUT
//------------------------------------------------------------------------------

runmysteriet.scene.Credits.prototype.handleInput = function() {

    var input = null;

    if (!this.m_gameInput) {
        return;
    }

    input = this.m_gameInput.read(this.keyboard);

    this.handleVolumeInput(input);
    this.handleBackInput(input);
};

runmysteriet.scene.Credits.prototype.handleBackInput = function(input) {

    if (!input) {
        return;
    }

    if (input.choose || input.back) {
        this.playMenuSound();
        this.goToMenu();
    }
};

runmysteriet.scene.Credits.prototype.handleVolumeInput = function(input) {

    var stepVol = 0.1;

    if (!this.backgroundMusic || !input) {
        return;
    }

    if (input.volumeUp) {
        this.backgroundMusic.volume += stepVol;

        if (this.backgroundMusic.volume > 1) {
            this.backgroundMusic.volume = 0;
        }

        this.updateVolumeHud();
        return;
    }

    if (input.volumeDown) {
        this.backgroundMusic.volume -= stepVol;

        if (this.backgroundMusic.volume < 0) {
            this.backgroundMusic.volume = 1;
        }

        this.updateVolumeHud();
    }
};

runmysteriet.scene.Credits.prototype.updateVolumeHud = function() {

    if (this.m_volumeHud &&
        typeof this.m_volumeHud.updateText === "function") {

        this.m_volumeHud.updateText();
    }
};

//------------------------------------------------------------------------------
// SOUND
//------------------------------------------------------------------------------

runmysteriet.scene.Credits.prototype.playMenuSound = function() {

    if (this.menuSound && typeof this.menuSound.play === "function") {
        this.menuSound.play();
    }
};

runmysteriet.scene.Credits.prototype.stopBackgroundMusic = function() {

    if (
        this.backgroundMusic &&
        this.backgroundMusic.m_source &&
        this.backgroundMusic.m_source.mediaElement
    ) {
        this.backgroundMusic.m_source.mediaElement.pause();
    }
};

//------------------------------------------------------------------------------
// NAVIGATION
//------------------------------------------------------------------------------

runmysteriet.scene.Credits.prototype.goToMenu = function() {

    this.stopBackgroundMusic();

    this.application.scenes.load([
        new runmysteriet.scene.Menu()
    ]);
};

//------------------------------------------------------------------------------
// REMOVE DISPLAY OBJECT
//------------------------------------------------------------------------------

/**
 * Tar bort ett objekt från stage.
 *
 * @param {?Object} object
 * @return {void}
 */
runmysteriet.scene.Credits.prototype.removeDisplayObject = function(object) {

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

//------------------------------------------------------------------------------
// DISPOSE
//------------------------------------------------------------------------------

runmysteriet.scene.Credits.prototype.dispose = function() {

    this.stopBackgroundMusic();

    this.removeDisplayObject(this.m_volumeHud);
    this.removeDisplayObject(this.m_backButton);
    this.removeDisplayObject(this.m_text);
    this.removeDisplayObject(this.m_titleText);
    this.removeDisplayObject(this.m_box);
    this.removeDisplayObject(this.m_background);

    this.m_volumeHud = null;
    this.m_backButton = null;
    this.m_text = null;
    this.m_titleText = null;
    this.m_box = null;
    this.m_background = null;

    this.backgroundMusic = null;
    this.menuSound = null;
    this.m_gameInput = null;

    rune.scene.Scene.prototype.dispose.call(this);
};