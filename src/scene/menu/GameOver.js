//------------------------------------------------------------------------------
// GAME OVER SCENE
//------------------------------------------------------------------------------

/**
 * Game over scene.
 *
 * @constructor
 * @extends {rune.scene.Scene}
 * @param {string=} playerName
 * @param {number=} score
 * @param {string=} reason
 */
runmysteriet.scene.GameOver = function(playerName, score, reason) {

    rune.scene.Scene.call(this);

    /** @type {string} */
    this.m_playerName = playerName || "PLAYER";

    /** @type {number} */
    this.m_score = score || 0;

    /** @type {string} */
    this.m_reason = reason || "GAME OVER";

    /** @type {?rune.text.BitmapField} */
    this.m_title = null;

    /** @type {?rune.text.BitmapField} */
    this.m_scoreText = null;

    /** @type {?runmysteriet.ui.graphic.HighscoreHud} */
    this.m_highscoreHud = null;

    /** @type {?runmysteriet.ui.graphic.MenuList} */
    this.m_menu = null;

    /** @type {?Object} */
    this.m_menuSound = null;

    /** @type {?runmysteriet.input.GameInput} */
    this.m_gameInput = null;

    /** @type {?Object} */
    this.backgroundMusic = null;
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
 * @inheritDoc
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

    this.createTitle();
    this.createScoreText();
    this.createMenu();
    this.createHighscoreHud();
    this.positionMenu();
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
    this.m_title.scaleX = 1.5;
    this.m_title.scaleY = 1.5;
    this.m_title.center = this.application.screen.center;
    this.m_title.y = 35;

    this.stage.addChild(this.m_title);
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
    this.m_scoreText.center = this.application.screen.center;
    this.m_scoreText.y = 55;

    this.stage.addChild(this.m_scoreText);
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
 * Skapar highscore-listan.
 *
 * @return {void}
 */
runmysteriet.scene.GameOver.prototype.createHighscoreHud = function() {

    this.m_highscoreHud = new runmysteriet.ui.graphic.HighscoreHud(
        this.application,
        5
    );

    this.m_highscoreHud.x = 15;
    this.m_highscoreHud.y = 140;

    this.stage.addChild(this.m_highscoreHud);
};

/**
 * Positionerar menyn.
 *
 * @return {void}
 */
runmysteriet.scene.GameOver.prototype.positionMenu = function() {

    var camera = this.cameras.getCameraAt(0);

    if (!this.m_menu) {
        return;
    }

    if (this.m_menu.setCameraPosition && camera) {
        this.m_menu.setCameraPosition(camera, 155, 95);
    }
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

/**
 * @inheritDoc
 */
runmysteriet.scene.GameOver.prototype.update = function(step) {

    var input = null;

    rune.scene.Scene.prototype.update.call(this, step);

    if (!this.m_gameInput) {
        return;
    }

    /*
     * Läs input en gång.
     * GameInput ska läsa keyboard + gamepad 0 + gamepad 1.
     */
    input = this.m_gameInput.read(this.keyboard);

    this.handleMenuInput(input);
    this.handleVolumeInput(input);
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
    }

    if (input.up) {
        this.playMenuSound();
        this.m_menu.movePrevious();
    }

    if (input.choose) {
        this.chooseMenuItem();
    }
};

/**
 * Hanterar volym.
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

        console.log("Volym:", this.backgroundMusic.volume.toFixed(2));
        return;
    }

    if (input.volumeDown) {

        this.backgroundMusic.volume -= stepVol;

        if (this.backgroundMusic.volume < 0) {
            this.backgroundMusic.volume = 1;
        }

        console.log("Volym:", this.backgroundMusic.volume.toFixed(2));
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

        this.stopBackgroundMusic();

        this.application.scenes.load([
            new runmysteriet.scene.AvatarSelect()        
        ]);

        return;
    }

    if (selectedIndex === 1) {

        this.stopBackgroundMusic();

        this.application.scenes.load([
            new runmysteriet.scene.Menu()
        ]);
    }
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

    if (this.m_menuSound) {
        this.m_menuSound.play();
    }
};

/**
 * Stoppar bakgrundsmusik.
 *
 * @return {void}
 */
runmysteriet.scene.GameOver.prototype.stopBackgroundMusic = function() {

    if (!this.backgroundMusic) {
        return;
    }

    try {
        if (typeof this.backgroundMusic.stop === "function") {
            this.backgroundMusic.stop();
        } else if (typeof this.backgroundMusic.pause === "function") {
            this.backgroundMusic.pause();
        }
    } catch (error) {
        if (typeof this.backgroundMusic.pause === "function") {
            try {
                this.backgroundMusic.pause();
            } catch (ignore) {
            }
        }
    }
};

//------------------------------------------------------------------------------
// DISPOSE
//------------------------------------------------------------------------------

/**
 * @inheritDoc
 */
runmysteriet.scene.GameOver.prototype.dispose = function() {

    this.stopBackgroundMusic();

    if (this.m_menu) {
        if (typeof this.m_menu.dispose === "function") {
            this.m_menu.dispose();
        } else {
            this.m_menu.clear();
        }

        this.m_menu = null;
    }

    if (this.m_title && this.m_title.stage) {
        this.m_title.stage.removeChild(this.m_title);
    }

    if (this.m_scoreText && this.m_scoreText.stage) {
        this.m_scoreText.stage.removeChild(this.m_scoreText);
    }

    if (this.m_highscoreHud && this.m_highscoreHud.stage) {
        this.m_highscoreHud.stage.removeChild(this.m_highscoreHud);
    }

    this.m_title = null;
    this.m_scoreText = null;
    this.m_highscoreHud = null;
    this.m_menuSound = null;
    this.m_gameInput = null;
    this.backgroundMusic = null;

    rune.scene.Scene.prototype.dispose.call(this);
};