//------------------------------------------------------------------------------
// GAME OVER SCENE
//------------------------------------------------------------------------------

/**
 * Game over scene.
 *
 * @constructor
 * @extends {rune.scene.Scene}
 * @param {number=} score
 * @param {string=} reason
 */
runmysteriet.scene.GameOver = function(score, reason) {

    rune.scene.Scene.call(this);

    this.m_score = score || 0;
    this.m_reason = reason || "GAME OVER";

    this.m_title = null;
    this.m_reasonText = null;
    this.m_scoreText = null;

    this.m_highscoreHud = null;
    this.m_volumeHud = null;
    this.m_menu = null;

    this.m_menuSound = null;
    this.backgroundMusic = null;

    this.m_gameInput = null;
};

//------------------------------------------------------------------------------
// INHERITANCE
//------------------------------------------------------------------------------

runmysteriet.scene.GameOver.prototype =
    Object.create(rune.scene.Scene.prototype);

runmysteriet.scene.GameOver.prototype.constructor =
    runmysteriet.scene.GameOver;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.scene.GameOver.prototype.init = function() {

    rune.scene.Scene.prototype.init.call(this);

    this.m_gameInput = new runmysteriet.input.GameInput(this.application);

    this.m_menuSound = this.application.sounds.sound.get("sound_menu");
    this.backgroundMusic = this.application.sounds.sound.get("sound_musicMenu");

    if (this.backgroundMusic) {
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.3;
        this.backgroundMusic.play();
    }

    this.createTitle();
    this.createReasonText();
    this.createScoreText();
    this.createMenu();
    this.createHighscoreHud();
    this.createVolumeHud();

    this.positionMenu();
};

//------------------------------------------------------------------------------
// CREATE
//------------------------------------------------------------------------------

runmysteriet.scene.GameOver.prototype.createTitle = function() {

    this.m_title = new rune.text.BitmapField("GAME OVER");
    this.m_title.autoSize = true;
    this.m_title.scaleX = 4;
    this.m_title.scaleY = 4;
    this.m_title.center = this.application.screen.center;
    this.m_title.y = 30;

    this.stage.addChild(this.m_title);
};

runmysteriet.scene.GameOver.prototype.createReasonText = function() {

    this.m_reasonText = new rune.text.BitmapField(this.m_reason);
    this.m_reasonText.autoSize = true;
    this.m_reasonText.center = this.application.screen.center;
    this.m_reasonText.y = 85;
    this.m_reasonText.scaleX = 1;
    this.m_reasonText.scaleY = 1;

    this.stage.addChild(this.m_reasonText);
};

runmysteriet.scene.GameOver.prototype.createScoreText = function() {

    this.m_scoreText = new rune.text.BitmapField(
        "SCORE: " + this.m_score
    );

    this.m_scoreText.autoSize = true;
    this.m_scoreText.center = this.application.screen.center;
    this.m_scoreText.y = 75;

    this.stage.addChild(this.m_scoreText);
};

runmysteriet.scene.GameOver.prototype.createMenu = function() {

    this.m_menu = new runmysteriet.ui.graphic.MenuList(
        this.stage,
        this.application,
        ["START NEW GAME", "BACK TO MENU"],
        155,
        22,
        1
    );
};

runmysteriet.scene.GameOver.prototype.createHighscoreHud = function() {

    this.m_highscoreHud = new runmysteriet.ui.graphic.HighscoreHud(
        this.application,
        5
    );

    this.m_highscoreHud.x = 15;
    this.m_highscoreHud.y = 140;

    this.stage.addChild(this.m_highscoreHud);
};

runmysteriet.scene.GameOver.prototype.createVolumeHud = function() {

    this.m_volumeHud = new runmysteriet.ui.graphic.VolumeHud(
        this.application,
        this.backgroundMusic
    );

    this.stage.addChild(this.m_volumeHud);
};

runmysteriet.scene.GameOver.prototype.positionMenu = function() {

    var camera = this.cameras.getCameraAt(0);

    if (!this.m_menu) {
        return;
    }

    if (this.m_menu.setCameraPosition && camera) {
        this.m_menu.setCameraPosition(camera, 155, 100);
    }
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

runmysteriet.scene.GameOver.prototype.update = function(step) {

    var input = null;

    rune.scene.Scene.prototype.update.call(this, step);

    if (!this.m_gameInput) {
        return;
    }

    input = this.m_gameInput.read(this.keyboard);

    this.handleVolumeInput(input);
    this.handleMenuInput(input);
};

//------------------------------------------------------------------------------
// INPUT
//------------------------------------------------------------------------------

runmysteriet.scene.GameOver.prototype.handleMenuInput = function(input) {

    if (!this.m_menu || !input) {
        return;
    }

    if (input.down) {
        this.playMenuSound();
        this.m_menu.moveNext();
        return;
    }

    if (input.up) {
        this.playMenuSound();
        this.m_menu.movePrevious();
        return;
    }

    if (input.choose) {
        this.chooseMenuItem();
        return;
    }

    if (input.back) {
        this.goToMenu();
    }
};

runmysteriet.scene.GameOver.prototype.handleVolumeInput = function(input) {

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

runmysteriet.scene.GameOver.prototype.updateVolumeHud = function() {

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

runmysteriet.scene.GameOver.prototype.chooseMenuItem = function() {

    var selectedIndex = 0;

    if (!this.m_menu) {
        return;
    }

    selectedIndex = this.m_menu.getSelectedIndex();

    if (selectedIndex === 0) {
        this.startNewGame();
        return;
    }

    if (selectedIndex === 1) {
        this.goToMenu();
    }
};

//------------------------------------------------------------------------------
// NAVIGATION
//------------------------------------------------------------------------------

runmysteriet.scene.GameOver.prototype.startNewGame = function() {

    this.stopBackgroundMusic();

    this.application.scenes.load([
        new runmysteriet.scene.AvatarSelect()
    ]);
};

runmysteriet.scene.GameOver.prototype.goToMenu = function() {

    this.stopBackgroundMusic();

    this.application.scenes.load([
        new runmysteriet.scene.Menu()
    ]);
};

//------------------------------------------------------------------------------
// SOUND
//------------------------------------------------------------------------------

runmysteriet.scene.GameOver.prototype.playMenuSound = function() {

    if (this.m_menuSound && typeof this.m_menuSound.play === "function") {
        this.m_menuSound.play();
    }
};

runmysteriet.scene.GameOver.prototype.stopBackgroundMusic = function() {

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
runmysteriet.scene.GameOver.prototype.removeDisplayObject = function(object) {

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

runmysteriet.scene.GameOver.prototype.dispose = function() {

    this.stopBackgroundMusic();

    if (this.m_menu) {
        if (typeof this.m_menu.dispose === "function") {
            this.m_menu.dispose();
        } else if (typeof this.m_menu.clear === "function") {
            this.m_menu.clear();
        }
    }

    this.removeDisplayObject(this.m_volumeHud);
    this.removeDisplayObject(this.m_highscoreHud);
    this.removeDisplayObject(this.m_scoreText);
    this.removeDisplayObject(this.m_reasonText);
    this.removeDisplayObject(this.m_title);

    this.m_menu = null;
    this.m_volumeHud = null;
    this.m_highscoreHud = null;
    this.m_scoreText = null;
    this.m_reasonText = null;
    this.m_title = null;

    this.m_menuSound = null;
    this.backgroundMusic = null;
    this.m_gameInput = null;

    this.m_score = 0;
    this.m_reason = "";

    rune.scene.Scene.prototype.dispose.call(this);
};