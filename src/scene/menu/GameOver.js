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

    /** @type {number} */
    this.m_score = score || 0;

    /** @type {string} */
    this.m_reason = reason || "GAME OVER";

    /** @type {?runmysteriet.logic.HighscoreManager} */
    this.m_highscoreManager = null;

    /** @type {boolean} */
    this.m_isNewRecord = false;

    /** @type {boolean} */
    this.m_highscoreSaved = false;

    /** @type {?runmysteriet.logic.NameInput} */
    this.m_player1NameInput = null;

    /** @type {?runmysteriet.logic.NameInput} */
    this.m_player2NameInput = null;

    /** @type {number} */
    this.m_activePlayerIndex = 0;

    /** @type {?rune.text.BitmapField} */
    this.m_title = null;

    /** @type {?rune.text.BitmapField} */
    this.m_reasonText = null;

    /** @type {?rune.text.BitmapField} */
    this.m_scoreText = null;

    /** @type {?rune.text.BitmapField} */
    this.m_nameTitleText = null;

    /** @type {?rune.text.BitmapField} */
    this.m_player1Text = null;

    /** @type {?rune.text.BitmapField} */
    this.m_player2Text = null;

    /** @type {?rune.text.BitmapField} */
    this.m_selectedLetterText = null;

    /** @type {?rune.text.BitmapField} */
    this.m_helpText = null;

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

runmysteriet.scene.GameOver.prototype =
    Object.create(rune.scene.Scene.prototype);

runmysteriet.scene.GameOver.prototype.constructor =
    runmysteriet.scene.GameOver;

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

    this.m_highscoreManager =
        new runmysteriet.logic.HighscoreManager(this.application);

    this.m_isNewRecord =
        this.m_highscoreManager.isNewRecord(this.m_score);

    this.createTitle();
    this.createReasonText();
    this.createScoreText();

    if (this.m_isNewRecord === true) {
        this.createNameInput();
    } else {
        this.showHighscoreAndMenu();
    }
};

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

    this.stage.addChild(this.m_title);

    this.m_title.x =
        this.application.screen.center.x - this.m_title.width / 2;

    this.m_title.y = 28;
};

/**
 * Skapar orsakstext.
 *
 * @return {void}
 */
runmysteriet.scene.GameOver.prototype.createReasonText = function() {

    this.m_reasonText = new rune.text.BitmapField(this.m_reason);
    this.m_reasonText.autoSize = true;

    this.stage.addChild(this.m_reasonText);

    this.m_reasonText.x =
        this.application.screen.center.x - this.m_reasonText.width / 2;

    this.m_reasonText.y = 58;
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

    this.stage.addChild(this.m_scoreText);

    this.m_scoreText.x =
        this.application.screen.center.x - this.m_scoreText.width / 2;

    this.m_scoreText.y = 78;
};

/**
 * Skapar namninput för två spelare.
 *
 * @return {void}
 */
runmysteriet.scene.GameOver.prototype.createNameInput = function() {

    this.m_player1NameInput = new runmysteriet.logic.NameInput(4);
    this.m_player2NameInput = new runmysteriet.logic.NameInput(4);
    this.m_activePlayerIndex = 0;

    this.m_nameTitleText = new rune.text.BitmapField("NEW TOP 5 SCORE!");
    this.m_nameTitleText.autoSize = true;

    this.stage.addChild(this.m_nameTitleText);

    this.m_nameTitleText.x =
        this.application.screen.center.x - this.m_nameTitleText.width / 2;

    this.m_nameTitleText.y = 108;

    this.m_player1Text = new rune.text.BitmapField("");
    this.m_player1Text.autoSize = true;
    this.stage.addChild(this.m_player1Text);

    this.m_player2Text = new rune.text.BitmapField("");
    this.m_player2Text.autoSize = true;
    this.stage.addChild(this.m_player2Text);

    this.m_selectedLetterText = new rune.text.BitmapField("");
    this.m_selectedLetterText.autoSize = true;
    this.stage.addChild(this.m_selectedLetterText);

    this.m_helpText = new rune.text.BitmapField(
        "UP/DOWN = LETTER   ENTER/X = ADD   BACK/O = DELETE"
    );
    this.m_helpText.autoSize = true;
    this.stage.addChild(this.m_helpText);

    this.m_helpText.x =
        this.application.screen.center.x - this.m_helpText.width / 2;

    this.m_helpText.y = 205;

    this.updateNameInputText();
};

/**
 * Uppdaterar text för namninput.
 *
 * @return {void}
 */
runmysteriet.scene.GameOver.prototype.updateNameInputText = function() {

    var player1Name = "";
    var player2Name = "";
    var selectedLetter = "";

    if (!this.m_player1NameInput || !this.m_player2NameInput) {
        return;
    }

    player1Name = this.formatNameInput(this.m_player1NameInput);
    player2Name = this.formatNameInput(this.m_player2NameInput);

    if (this.m_activePlayerIndex === 0) {
        selectedLetter =
            this.m_player1NameInput.getSelectedLetter().toUpperCase();
    } else {
        selectedLetter =
            this.m_player2NameInput.getSelectedLetter().toUpperCase();
    }

    if (this.m_player1Text) {
        if (this.m_activePlayerIndex === 0) {
            this.m_player1Text.text = "> PLAYER 1: " + player1Name;
        } else {
            this.m_player1Text.text = "  PLAYER 1: " + player1Name;
        }

        this.m_player1Text.x =
            this.application.screen.center.x - this.m_player1Text.width / 2;

        this.m_player1Text.y = 135;
    }

    if (this.m_player2Text) {
        if (this.m_activePlayerIndex === 1) {
            this.m_player2Text.text = "> PLAYER 2: " + player2Name;
        } else {
            this.m_player2Text.text = "  PLAYER 2: " + player2Name;
        }

        this.m_player2Text.x =
            this.application.screen.center.x - this.m_player2Text.width / 2;

        this.m_player2Text.y = 158;
    }

    if (this.m_selectedLetterText) {
        this.m_selectedLetterText.text = "LETTER: " + selectedLetter;

        this.m_selectedLetterText.x =
            this.application.screen.center.x -
            this.m_selectedLetterText.width / 2;

        this.m_selectedLetterText.y = 183;
    }
};

/**
 * Formaterar namn med tomma rutor.
 *
 * @param {!runmysteriet.logic.NameInput} nameInput
 * @return {string}
 */
runmysteriet.scene.GameOver.prototype.formatNameInput = function(nameInput) {

    var name = "";
    var text = "";
    var i = 0;

    name = nameInput.getRawName();

    for (i = 0; i < 4; i++) {
        if (i < name.length) {
            text += name.charAt(i);
        } else {
            text += "_";
        }

        if (i < 3) {
            text += " ";
        }
    }

    return text;
};

/**
 * Hämtar aktivt namninput.
 *
 * @return {?runmysteriet.logic.NameInput}
 */
runmysteriet.scene.GameOver.prototype.getActiveNameInput = function() {

    if (this.m_activePlayerIndex === 0) {
        return this.m_player1NameInput;
    }

    return this.m_player2NameInput;
};

/**
 * Hanterar input när spelarna skriver namn.
 *
 * @param {!Object} input
 * @return {void}
 */
runmysteriet.scene.GameOver.prototype.handleNameInput = function(input) {

    var nameInput = null;

    if (!input) {
        return;
    }

    nameInput = this.getActiveNameInput();

    if (!nameInput) {
        return;
    }

    if (input.up) {
        nameInput.previousLetter();
        this.playMenuSound();
        this.updateNameInputText();
        return;
    }

    if (input.down) {
        nameInput.nextLetter();
        this.playMenuSound();
        this.updateNameInputText();
        return;
    }

    if (input.choose) {
        nameInput.addSelectedLetter();
        this.playMenuSound();

        if (
            this.m_activePlayerIndex === 0 &&
            this.m_player1NameInput.isComplete()
        ) {
            this.m_activePlayerIndex = 1;
        } else if (
            this.m_activePlayerIndex === 1 &&
            this.m_player2NameInput.isComplete()
        ) {
            this.saveHighscoreFromNames();
            this.clearNameInputView();
            this.showHighscoreAndMenu();
            return;
        }

        this.updateNameInputText();
        return;
    }

    if (input.back) {
        if (nameInput.getLength() > 0) {
            nameInput.removeLastLetter();
            this.playMenuSound();
            this.updateNameInputText();
            return;
        }

        if (this.m_activePlayerIndex === 1) {
            this.m_activePlayerIndex = 0;
            this.playMenuSound();
            this.updateNameInputText();
        }
    }
};

/**
 * Sparar highscore med båda spelarnas namn.
 *
 * @return {void}
 */
runmysteriet.scene.GameOver.prototype.saveHighscoreFromNames = function() {

    var name = "";
    var entry = null;

    if (this.m_highscoreSaved === true) {
        return;
    }

    if (!this.m_highscoreManager) {
        return;
    }

    name =
        this.m_player1NameInput.getName() + "/" +
        this.m_player2NameInput.getName();

    entry = new runmysteriet.logic.HighscoreEntry(
        name,
        this.m_score
    );

    this.m_highscoreManager.save(entry);

    this.m_highscoreSaved = true;
};

/**
 * Tar bort namninput från scenen.
 *
 * @return {void}
 */
runmysteriet.scene.GameOver.prototype.clearNameInputView = function() {

    this.removeDisplayObject(this.m_nameTitleText);
    this.removeDisplayObject(this.m_player1Text);
    this.removeDisplayObject(this.m_player2Text);
    this.removeDisplayObject(this.m_selectedLetterText);
    this.removeDisplayObject(this.m_helpText);

    this.m_nameTitleText = null;
    this.m_player1Text = null;
    this.m_player2Text = null;
    this.m_selectedLetterText = null;
    this.m_helpText = null;

    this.m_player1NameInput = null;
    this.m_player2NameInput = null;
};

/**
 * Visar highscore-listan och menyn.
 *
 * @return {void}
 */
runmysteriet.scene.GameOver.prototype.showHighscoreAndMenu = function() {

    this.createHighscoreHud();
    this.createMenu();
    this.positionMenu();
};

/**
 * Skapar highscore-listan.
 *
 * @return {void}
 */
runmysteriet.scene.GameOver.prototype.createHighscoreHud = function() {

    if (this.m_highscoreHud) {
        this.m_highscoreHud.reload();
        return;
    }

    this.m_highscoreHud = new runmysteriet.ui.graphic.HighscoreHud(
        this.application,
        5
    );

    this.m_highscoreHud.x = 15;
    this.m_highscoreHud.y = 125;

    this.stage.addChild(this.m_highscoreHud);
};

/**
 * Skapar meny.
 *
 * @return {void}
 */
runmysteriet.scene.GameOver.prototype.createMenu = function() {

    if (this.m_menu) {
        return;
    }

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

    if (
        this.m_isNewRecord === true &&
        this.m_highscoreSaved !== true
    ) {
        this.handleNameInput(input);
        return;
    }

    this.handleMenuInput(input);
};

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

        return;
    }

    if (input.volumeDown) {
        this.backgroundMusic.volume -= stepVol;

        if (this.backgroundMusic.volume < 0) {
            this.backgroundMusic.volume = 1;
        }
    }
};

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

/**
 * Tar bort ett objekt från scenen.
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

    this.removeDisplayObject(this.m_title);
    this.removeDisplayObject(this.m_reasonText);
    this.removeDisplayObject(this.m_scoreText);

    this.removeDisplayObject(this.m_nameTitleText);
    this.removeDisplayObject(this.m_player1Text);
    this.removeDisplayObject(this.m_player2Text);
    this.removeDisplayObject(this.m_selectedLetterText);
    this.removeDisplayObject(this.m_helpText);

    this.removeDisplayObject(this.m_highscoreHud);

    this.m_title = null;
    this.m_reasonText = null;
    this.m_scoreText = null;

    this.m_nameTitleText = null;
    this.m_player1Text = null;
    this.m_player2Text = null;
    this.m_selectedLetterText = null;
    this.m_helpText = null;

    this.m_player1NameInput = null;
    this.m_player2NameInput = null;

    this.m_highscoreHud = null;
    this.m_menu = null;
    this.m_menuSound = null;
    this.m_gameInput = null;
    this.m_highscoreManager = null;
    this.backgroundMusic = null;

    rune.scene.Scene.prototype.dispose.call(this);
};