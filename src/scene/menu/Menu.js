//------------------------------------------------------------------------------
// MENU SCENE
//------------------------------------------------------------------------------

/**
 * Main menu scene.
 *
 * @constructor
 * @extends {rune.scene.Scene}
 */
runmysteriet.scene.Menu = function() {

    rune.scene.Scene.call(this);

    this.menuList = null;

    this.menuSound = null;
    this.backgroundMusic = null;

    this.m_background = null;
    this.m_controller = null;
    this.m_titleText = null;
    this.m_subtitleText = null;
    this.m_highscoreHud = null;
    this.m_volumeHud = null;

    this.m_gameInput = null;
};

//------------------------------------------------------------------------------
// INHERITANCE
//------------------------------------------------------------------------------

runmysteriet.scene.Menu.prototype = Object.create(rune.scene.Scene.prototype);
runmysteriet.scene.Menu.prototype.constructor = runmysteriet.scene.Menu;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.scene.Menu.prototype.init = function() {

    rune.scene.Scene.prototype.init.call(this);

    this.m_gameInput = new runmysteriet.input.GameInput(this.application);

    this.menuSound = this.application.sounds.sound.get("sound_menu");
    this.backgroundMusic = this.application.sounds.sound.get("sound_musicMenu");

    if (this.backgroundMusic) {
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.5;
        this.backgroundMusic.play();
    }

    this.createBackground();
    this.createControllerImage();
    this.createTitle();
    this.createHighscoreHud();
    this.createMenuList();
    this.createVolumeHud();
};

//------------------------------------------------------------------------------
// CREATE
//------------------------------------------------------------------------------

runmysteriet.scene.Menu.prototype.createBackground = function() {

    this.m_background = new rune.display.Graphic(
        0,
        0,
        this.application.screen.width,
        this.application.screen.height,
        "background_menu"
    );

    this.stage.addChild(this.m_background);
};

runmysteriet.scene.Menu.prototype.createControllerImage = function() {

    this.m_controller = new rune.display.Graphic(
        250,
        110,
        140,
        100,
        "testing"
    );

    this.stage.addChild(this.m_controller);
};

runmysteriet.scene.Menu.prototype.createTitle = function() {

    this.m_titleText = new rune.text.BitmapField(
        "Welcome to the Rune Mystery"
    );

    this.m_titleText.autoSize = true;
    this.m_titleText.center = this.application.screen.center;
    this.m_titleText.y -= 70;
    this.m_titleText.x -= 80;
    this.m_titleText.scaleX = 2;
    this.m_titleText.scaleY = 2;
    this.m_titleText.flicker.start(750, 0.5);

    this.stage.addChild(this.m_titleText);

    this.m_subtitleText = new rune.text.BitmapField(
        "From battle to brain, earn the final word!"
    );

    this.m_subtitleText.autoSize = true;
    this.m_subtitleText.center = this.application.screen.center;
    this.m_subtitleText.y -= 45;
    this.m_subtitleText.x -= 10;
    this.m_subtitleText.flicker.start(750, 0.5);

    this.stage.addChild(this.m_subtitleText);
};

runmysteriet.scene.Menu.prototype.createHighscoreHud = function() {

    this.m_highscoreHud = new runmysteriet.ui.graphic.HighscoreHud(
        this.application,
        5
    );

    this.m_highscoreHud.x = 15;
    this.m_highscoreHud.y = 150;

    this.stage.addChild(this.m_highscoreHud);
};

runmysteriet.scene.Menu.prototype.createMenuList = function() {

    this.menuList = new runmysteriet.ui.graphic.MenuList(
        this.stage,
        this.application,
        ["Play game", "Read more", "Credits"],
        45,
        25,
        1
    );
};

runmysteriet.scene.Menu.prototype.createVolumeHud = function() {

    this.m_volumeHud = new runmysteriet.ui.graphic.VolumeHud(
        this.application,
        this.backgroundMusic
    );

    this.stage.addChild(this.m_volumeHud);
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

runmysteriet.scene.Menu.prototype.update = function(step) {

    var input = null;

    rune.scene.Scene.prototype.update.call(this, step);

    if (!this.m_gameInput || !this.menuList) {
        return;
    }

    input = this.m_gameInput.read(this.keyboard);

    this.handleVolumeInput(input);
    this.handleMenuInput(input);
};

//------------------------------------------------------------------------------
// INPUT
//------------------------------------------------------------------------------

runmysteriet.scene.Menu.prototype.handleMenuInput = function(input) {

    if (!input) {
        return;
    }

    if (input.down) {
        this.playMenuSound();
        this.menuList.moveNext();
        return;
    }

    if (input.up) {
        this.playMenuSound();
        this.menuList.movePrevious();
        return;
    }

    if (input.choose) {
        this.chooseSelected();
    }
};

runmysteriet.scene.Menu.prototype.handleVolumeInput = function(input) {

    var stepVol = 0.1;

    if (!input || !this.backgroundMusic) {
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

runmysteriet.scene.Menu.prototype.updateVolumeHud = function() {

    if (
        this.m_volumeHud &&
        typeof this.m_volumeHud.updateText === "function"
    ) {
        this.m_volumeHud.updateText();
    }
};

//------------------------------------------------------------------------------
// CHOOSE
//------------------------------------------------------------------------------

runmysteriet.scene.Menu.prototype.chooseSelected = function() {

    var selectedIndex = 0;

    if (!this.menuList) {
        return;
    }

    selectedIndex = this.menuList.getSelectedIndex();

    this.stopBackgroundMusic();

    if (selectedIndex === 0) {
        this.application.scenes.load([
            new runmysteriet.scene.AvatarSelect()
        ]);
        return;
    }

    if (selectedIndex === 1) {
        this.application.scenes.load([
            new runmysteriet.scene.More()
        ]);
        return;
    }

    if (selectedIndex === 2) {
        this.application.scenes.load([
            new runmysteriet.scene.Credits()
        ]);
    }
};

//------------------------------------------------------------------------------
// SOUND
//------------------------------------------------------------------------------

runmysteriet.scene.Menu.prototype.playMenuSound = function() {

    if (this.menuSound && typeof this.menuSound.play === "function") {
        this.menuSound.play();
    }
};

runmysteriet.scene.Menu.prototype.stopBackgroundMusic = function() {

    if (
        this.backgroundMusic &&
        this.backgroundMusic.m_source &&
        this.backgroundMusic.m_source.mediaElement
    ) {
        this.backgroundMusic.m_source.mediaElement.pause();
    }
};

//------------------------------------------------------------------------------
// REMOVE DISPLAY OBJECT
//------------------------------------------------------------------------------

/**
 * Tar bort display object från stage.
 *
 * @param {?Object} object
 * @return {void}
 */
runmysteriet.scene.Menu.prototype.removeDisplayObject = function(object) {

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

runmysteriet.scene.Menu.prototype.dispose = function() {

    this.stopBackgroundMusic();

    if (this.menuList) {
        if (typeof this.menuList.dispose === "function") {
            this.menuList.dispose();
        } else if (typeof this.menuList.clear === "function") {
            this.menuList.clear();
        }
    }

    this.removeDisplayObject(this.m_volumeHud);
    this.removeDisplayObject(this.m_highscoreHud);
    this.removeDisplayObject(this.m_subtitleText);
    this.removeDisplayObject(this.m_titleText);
    this.removeDisplayObject(this.m_controller);
    this.removeDisplayObject(this.m_background);

    this.menuList = null;

    this.m_volumeHud = null;
    this.m_highscoreHud = null;
    this.m_subtitleText = null;
    this.m_titleText = null;
    this.m_controller = null;
    this.m_background = null;

    this.menuSound = null;
    this.backgroundMusic = null;
    this.m_gameInput = null;

    rune.scene.Scene.prototype.dispose.call(this);
};