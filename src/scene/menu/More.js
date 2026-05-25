/**
 * More info scene.
 *
 * @constructor
 * @extends {rune.scene.Scene}
 */
runmysteriet.scene.More = function() {
    rune.scene.Scene.call(this);

    this.m_backButton = null;
    this.m_text = null;
    this.m_background = null;
    this.m_box = null;

    this.backgroundMusic = null;
    this.menuSound = null;
    this.m_gameInput = null;
    this.m_volumeHud = null;    
};

runmysteriet.scene.More.prototype = Object.create(rune.scene.Scene.prototype);
runmysteriet.scene.More.prototype.constructor = runmysteriet.scene.More;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.scene.More.prototype.init = function() {

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
    this.createText();
    this.createBackButton();

    /*
     * VolumeHud ska skapas sist så den hamnar över bakgrund/box/text.
     */
    this.createVolumeHud();
};
//------------------------------------------------------------------------------
// CREATE
//------------------------------------------------------------------------------

runmysteriet.scene.More.prototype.createBackground = function() {

    this.m_background = new rune.display.Graphic(
        0,
        0,
        this.application.screen.width,
        this.application.screen.height,
        "background_menu"
    );

    this.stage.addChild(this.m_background);
};

runmysteriet.scene.More.prototype.createBox = function() {

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

runmysteriet.scene.More.prototype.createText = function() {

    this.m_text = new rune.text.BitmapField(
        "This is the game where you help the Vikings\n" +
        "reach their home ship while avoiding obstacles.\n\n" +
        "Jump across platforms, fight priests,\n" +
        "and avoid being captured.\n\n" +
        "To board the ship you must guess\n" +
        "the secret password.\n\n" +
        "Collect shields with runes along the way.\n\n" +
        "< BACK\n" +
        "Press A / ENTER / SPACE / ESC\n" +
        "E/Q = Volume"
    );

    this.m_text.autoSize = true;
    this.stage.addChild(this.m_text);

    this.m_text.x = this.m_box.x + (this.m_box.width - this.m_text.width) / 2;
    this.m_text.y = this.m_box.y + (this.m_box.height - this.m_text.height) / 2;
};

runmysteriet.scene.More.prototype.createBackButton = function() {

    this.m_backButton = new rune.text.BitmapField("BACK");
    this.m_backButton.autoSize = true;

    this.stage.addChild(this.m_backButton);

    this.m_backButton.x =
        this.application.screen.center.x - this.m_backButton.width / 2;

    this.m_backButton.y =
        this.m_box.y + this.m_box.height + 15;
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

runmysteriet.scene.More.prototype.update = function(step) {

    rune.scene.Scene.prototype.update.call(this, step);

    this.handleInput();
};

//------------------------------------------------------------------------------
// INPUT
//------------------------------------------------------------------------------

runmysteriet.scene.More.prototype.handleInput = function() {

    var input = null;

    if (!this.m_gameInput) {
        return;
    }

    input = this.m_gameInput.read(this.keyboard);

    this.handleVolumeInput(input);
    this.handleBackInput(input);
};

runmysteriet.scene.More.prototype.handleBackInput = function(input) {

    if (!input) {
        return;
    }

    if (input.choose || input.back) {
        this.playMenuSound();
        this.goToMenu();
    }
};

runmysteriet.scene.More.prototype.handleVolumeInput = function(input) {

    var stepVol = 0.1;

    if (!this.backgroundMusic || !input) {
        return;
    }

    if (input.volumeUp) {
        this.backgroundMusic.volume += stepVol;

        if (this.backgroundMusic.volume > 1) {
            this.backgroundMusic.volume = 0;
        }

        if (this.m_volumeHud) {
            this.m_volumeHud.updateText();
        }
    }

    if (input.volumeDown) {
        this.backgroundMusic.volume -= stepVol;

        if (this.backgroundMusic.volume < 0) {
            this.backgroundMusic.volume = 1;
        }

        if (this.m_volumeHud) {
            this.m_volumeHud.updateText();
        }
    }
};
//------------------------------------------------------------------------------
// SOUND
//------------------------------------------------------------------------------

runmysteriet.scene.More.prototype.playMenuSound = function() {

    if (this.menuSound) {
        this.menuSound.play();
    }
};

//------------------------------------------------------------------------------
// NAVIGATION
//------------------------------------------------------------------------------

runmysteriet.scene.More.prototype.goToMenu = function() {

    this.application.scenes.load([
        new runmysteriet.scene.Menu()
    ]);
};
//------------------------------------------------------------------------------
// VOLUME HUD
//------------------------------------------------------------------------------

runmysteriet.scene.More.prototype.createVolumeHud = function() {

    this.m_volumeHud = new runmysteriet.ui.graphic.VolumeHud(
        this.application,
        this.backgroundMusic
    );

    this.stage.addChild(this.m_volumeHud);
};

//------------------------------------------------------------------------------
// REMOVE DISPLAY OBJECT
//------------------------------------------------------------------------------

runmysteriet.scene.More.prototype.removeDisplayObject = function(object) {

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

runmysteriet.scene.More.prototype.dispose = function() {

    if (
        this.backgroundMusic &&
        this.backgroundMusic.m_source &&
        this.backgroundMusic.m_source.mediaElement
    ) {
        this.backgroundMusic.m_source.mediaElement.pause();
    }

    this.removeDisplayObject(this.m_volumeHud);
    this.removeDisplayObject(this.m_backButton);
    this.removeDisplayObject(this.m_text);
    this.removeDisplayObject(this.m_box);
    this.removeDisplayObject(this.m_background);

    this.m_backButton = null;
    this.m_text = null;
    this.m_background = null;
    this.m_box = null;

    this.backgroundMusic = null;
    this.menuSound = null;
    this.m_gameInput = null;
    this.m_volumeHud = null;

    rune.scene.Scene.prototype.dispose.call(this);
};