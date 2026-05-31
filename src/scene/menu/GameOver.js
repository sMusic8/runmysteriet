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
 * @param {string=} playerName
 */
runmysteriet.scene.GameOver = function(score, reason, playerName) {

    rune.scene.Scene.call(this);

    /** @type {number} */
    this.m_score = score || 0;

    /** @type {string} */
    this.m_reason = reason || "GAME OVER";

    /** @type {string} */
    this.m_playerName = playerName || "PLAYER";

    /** @type {?rune.display.Graphic} */
    this.m_background = null;

    /** @type {?rune.text.BitmapField} */
    this.m_title = null;

    /** @type {?rune.text.BitmapField} */
    this.m_reasonText = null;

    /** @type {?rune.text.BitmapField} */
    this.m_scoreText = null;

    /** @type {?Object} */
    this.m_highscoreHud = null;

    /** @type {?rune.display.Graphic} */
    this.m_screenOverlay = null;

    /** @type {?rune.display.Graphic} */
    this.m_highscoreBox = null;

    /** @type {?Object} */
    this.m_volumeHud = null;

    /** @type {?Object} */
    this.m_menu = null;

    /** @type {?Object} */
    this.m_menuSound = null;

    /** @type {?Object} */
    this.backgroundMusic = null;

    /** @type {?runmysteriet.input.GameInput} */
    this.m_gameInput = null;

    /** @type {boolean} */
    this.m_highscoreSaved = false;
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

/**
 * Initierar GameOver.
 *
 * @return {void}
 */
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

    /*
     * Viktigt:
     * Spara score innan highscore-HUD skapas.
     * Annars kan listan laddas innan nya resultatet finns.
     */
    this.saveHighscore();

    this.createBackground();
    this.createScreenOverlay();
    this.createTitle();
    this.createReasonText();
    this.createScoreText();
    this.createHighscoreBox();
    this.createHighscoreHud();
    this.createMenu();
    this.createVolumeHud();
};

//------------------------------------------------------------------------------
// HIGHSCORE SAVE
//------------------------------------------------------------------------------

/**
 * Sparar score till highscore-listan.
 *
 * @return {void}
 */
runmysteriet.scene.GameOver.prototype.saveHighscore = function() {

    var entry = null;
    var manager = null;

    if (this.m_highscoreSaved === true) {
        return;
    }

    this.m_highscoreSaved = true;

    if (this.m_score <= 0) {
        return;
    }

    /*
     * Om inget riktigt namn har skrivits ska GameOver inte autospara.
     * Då ska spelaren först gå via TextInputView vid nytt highscore.
     */
    if (
        !this.m_playerName ||
        String(this.m_playerName).toUpperCase() === "PLAYER"
    ) {
        return;
    }

    if (!runmysteriet.logic) {
        return;
    }

    if (typeof runmysteriet.logic.HighscoreEntry !== "function") {
        return;
    }

    if (typeof runmysteriet.logic.HighscoreManager !== "function") {
        return;
    }

    entry = new runmysteriet.logic.HighscoreEntry(
        this.m_playerName,
        this.m_score
    );

    manager = new runmysteriet.logic.HighscoreManager(this.application);

    if (manager && typeof manager.save === "function") {
        manager.save(entry);
    }
};

//------------------------------------------------------------------------------
// CREATE
//------------------------------------------------------------------------------

/**
 * Skapar titeltext.
 *
 * @return {void}
 */
runmysteriet.scene.GameOver.prototype.createTitle = function() {

    this.m_title = new rune.text.BitmapField("GAME OVER");
    this.m_title.autoSize = true;
    this.m_title.scaleX = 4;
    this.m_title.scaleY = 4;
    this.m_title.center = this.application.screen.center;
    this.m_title.y = 18;

    this.stage.addChild(this.m_title);
};

/**
 * Skapar bakgrund för Game Over-skärmen.
 *
 * @return {void}
 */
runmysteriet.scene.GameOver.prototype.createBackground = function() {

    this.m_background = new rune.display.Graphic(
        0,
        0,
        this.application.screen.width,
        this.application.screen.height,
        "background_menu"
    );

    this.stage.addChild(this.m_background);
};

/**
 * Skapar en mörk transparent ruta över hela Game Over-skärmen.
 *
 * @return {void}
 */
runmysteriet.scene.GameOver.prototype.createScreenOverlay = function() {

    this.m_screenOverlay = new rune.display.Graphic(
        0,
        0,
        this.application.screen.width,
        this.application.screen.height
    );

    this.m_screenOverlay.backgroundColor = "#000000";
    this.m_screenOverlay.alpha = 0.4;

    this.stage.addChild(this.m_screenOverlay);
};

/**
 * Skapar text som visar varför det blev Game Over.
 *
 * @return {void}
 */
runmysteriet.scene.GameOver.prototype.createReasonText = function() {

    this.m_reasonText = new rune.text.BitmapField(this.m_reason);
    this.m_reasonText.autoSize = true;
    this.m_reasonText.scaleX = 1;
    this.m_reasonText.scaleY = 1;
    this.m_reasonText.center = this.application.screen.center;
    this.m_reasonText.y = 58;

    this.stage.addChild(this.m_reasonText);
};

/**
 * Skapar scoretext.
 *
 * @return {void}
 */
runmysteriet.scene.GameOver.prototype.createScoreText = function() {

    this.m_scoreText = new rune.text.BitmapField(
        "SCORE: " + this.m_score
    );

    this.m_scoreText.autoSize = true;
    this.m_scoreText.scaleX = 1;
    this.m_scoreText.scaleY = 1;
    this.m_scoreText.center = this.application.screen.center;
    this.m_scoreText.y = 80;

    this.stage.addChild(this.m_scoreText);
};
/**
 * Skapar en mörk transparent ruta bakom highscore-listan.
 *
 * @return {void}
 */
runmysteriet.scene.GameOver.prototype.createHighscoreBox = function() {

    this.m_highscoreBox = new rune.display.Graphic(
        10,
        140,
        140,
        70
    );

    this.m_highscoreBox.backgroundColor = "#000000";
    this.m_highscoreBox.alpha = 0.5;

    this.stage.addChild(this.m_highscoreBox);
};
/**
 * Skapar highscore-listan.
 *
 * @return {void}
 */
runmysteriet.scene.GameOver.prototype.createHighscoreHud = function() {

    if (
        !runmysteriet.ui ||
        !runmysteriet.ui.graphic ||
        typeof runmysteriet.ui.graphic.HighscoreHud !== "function"
    ) {
        return;
    }

    this.m_highscoreHud = new runmysteriet.ui.graphic.HighscoreHud(
        this.application,
        5
    );

    /*
     * Synlig placering.
     * Läggs till vänster så den inte krockar med menyn.
     */
    this.m_highscoreHud.x = 15;
    this.m_highscoreHud.y = 145;

    this.stage.addChild(this.m_highscoreHud);

    /*
     * Om HighscoreHud har reload-metod, använd den.
     */
    if (typeof this.m_highscoreHud.reload === "function") {
        this.m_highscoreHud.reload();
    }
};

/**
 * Skapar meny.
 *
 * @return {void}
 */
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

/**
 * Skapar volym-HUD.
 *
 * @return {void}
 */
runmysteriet.scene.GameOver.prototype.createVolumeHud = function() {

    if (
        !runmysteriet.ui ||
        !runmysteriet.ui.graphic ||
        typeof runmysteriet.ui.graphic.VolumeHud !== "function"
    ) {
        return;
    }

    this.m_volumeHud = new runmysteriet.ui.graphic.VolumeHud(
        this.application,
        this.backgroundMusic
    );

    this.stage.addChild(this.m_volumeHud);
};

/**
 * Positionerar meny.
 *
 * @return {void}
 */
runmysteriet.scene.GameOver.prototype.positionMenu = function() {

    var camera = this.cameras.getCameraAt(0);

    if (!this.m_menu) {
        return;
    }

    if (this.m_menu.setCameraPosition && camera) {
        this.m_menu.setCameraPosition(camera, 155, 135);
        return;
    }

    this.m_menu.x = 155;
    this.m_menu.y = 135;
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

/**
 * Uppdaterar GameOver.
 *
 * @param {number} step
 * @return {void}
 */
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

/**
 * Hanterar menyinput.
 *
 * @param {!Object} input
 * @return {void}
 */
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

/**
 * Hanterar volyminput.
 *
 * @param {!Object} input
 * @return {void}
 */
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

/**
 * Uppdaterar volym-HUD.
 *
 * @return {void}
 */
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

/**
 * Utför valt menyval.
 *
 * @return {void}
 */
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

/**
 * Startar nytt spel.
 *
 * @return {void}
 */
runmysteriet.scene.GameOver.prototype.startNewGame = function() {

    this.stopBackgroundMusic();

    this.application.scenes.load([
        new runmysteriet.scene.AvatarSelect()
    ]);
};

/**
 * Går tillbaka till huvudmenyn.
 *
 * @return {void}
 */
runmysteriet.scene.GameOver.prototype.goToMenu = function() {

    this.stopBackgroundMusic();

    this.application.scenes.load([
        new runmysteriet.scene.Menu()
    ]);
};

//------------------------------------------------------------------------------
// SOUND
//------------------------------------------------------------------------------

/**
 * Spelar menyljud.
 *
 * @return {void}
 */
runmysteriet.scene.GameOver.prototype.playMenuSound = function() {

    if (this.m_menuSound && typeof this.m_menuSound.play === "function") {
        this.m_menuSound.play();
    }
};

/**
 * Stoppar bakgrundsmusik.
 *
 * @return {void}
 */
runmysteriet.scene.GameOver.prototype.stopBackgroundMusic = function() {

    var mediaElement = null;

    if (!this.backgroundMusic) {
        return;
    }

    if (
        this.backgroundMusic.m_source &&
        this.backgroundMusic.m_source.mediaElement
    ) {
        mediaElement = this.backgroundMusic.m_source.mediaElement;

        if (typeof mediaElement.pause === "function") {
            mediaElement.pause();
        }

        try {
            mediaElement.currentTime = 0;
        } catch (error) {
        }
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

/**
 * Rensar GameOver.
 *
 * @return {void}
 */
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
    this.removeDisplayObject(this.m_highscoreBox);
    this.removeDisplayObject(this.m_scoreText);
    this.removeDisplayObject(this.m_reasonText);
    this.removeDisplayObject(this.m_title);
    this.removeDisplayObject(this.m_screenOverlay);

    this.m_menu = null;
    this.m_volumeHud = null;
    this.m_highscoreHud = null;
    this.m_highscoreBox = null;
    this.m_scoreText = null;
    this.m_reasonText = null;
    this.m_title = null;
    this.m_screenOverlay = null;
    this.m_menuSound = null;
    this.backgroundMusic = null;
    this.m_gameInput = null;
    this.m_score = 0;
    this.m_reason = "";
    this.m_playerName = "PLAYER";
    this.m_highscoreSaved = false;

    rune.scene.Scene.prototype.dispose.call(this);
};