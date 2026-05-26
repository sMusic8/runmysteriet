//------------------------------------------------------------------------------
// TEXT INPUT VIEW
//------------------------------------------------------------------------------

/**
 * Scene där spelarna skriver sina namn.
 *
 * @constructor
 * @extends {rune.scene.Scene}
 * @param {Function=} getHelpText
 * @param {?Object=} avatarData
 */
runmysteriet.scene.TextInputView = function(getHelpText, avatarData) {

    rune.scene.Scene.call(this);

    /**
     * Funktion som returnerar hjälptexten.
     *
     * @type {Function}
     */
    this.getHelpText = getHelpText || function() {
        return "UP/DOWN = CHOOSE LETTER   ENTER/X = VALIDATE   BACK/ESC = DELETE";
    };

    /**
     * Avatar-/spelardata som kan skickas vidare till Game.
     *
     * @type {?Object}
     */
    if (avatarData && typeof avatarData === "object") {
        this.m_avatarData = avatarData;
    } else {
        this.m_avatarData = null;
    }

    /** @type {?runmysteriet.input.GameInput} */
    this.m_gameInput = null;

    /** @type {!Array<!runmysteriet.logic.NameInput>} */
    this.m_nameInputs = [];

    /** @type {number} */
    this.m_currentPlayer = 0;

    /** @type {?rune.text.BitmapField} */
    this.m_helpText = null;

    /** @type {?rune.text.BitmapField} */
    this.m_titleText = null;

    /** @type {?rune.text.BitmapField} */
    this.m_player1Text = null;

    /** @type {?rune.text.BitmapField} */
    this.m_player2Text = null;

    /** @type {?rune.text.BitmapField} */
    this.m_letterText = null;

    /** @type {?rune.text.BitmapField} */
    this.m_startText = null;

    /** @type {?Object} */
    this.backgroundMusic = null;

    /** @type {?Object} */
    this.menuSound = null;
};

//------------------------------------------------------------------------------
// INHERITANCE
//------------------------------------------------------------------------------

runmysteriet.scene.TextInputView.prototype =
    Object.create(rune.scene.Scene.prototype);

runmysteriet.scene.TextInputView.prototype.constructor =
    runmysteriet.scene.TextInputView;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

/**
 * Initierar TextInputView.
 *
 * @return {void}
 */
runmysteriet.scene.TextInputView.prototype.init = function() {

    rune.scene.Scene.prototype.init.call(this);

    this.backgroundMusic = this.application.sounds.sound.get("sound_musicMenu");
    this.menuSound = this.application.sounds.sound.get("sound_menu");

    if (this.backgroundMusic) {
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.5;
        this.backgroundMusic.play();
    }

    this.m_gameInput = new runmysteriet.input.GameInput(this.application);

    this.m_nameInputs = [
        new runmysteriet.logic.NameInput(4),
        new runmysteriet.logic.NameInput(4)
    ];

    this.m_currentPlayer = 0;

    this.createText();
    this.updateText();
};

//------------------------------------------------------------------------------
// CREATE TEXT
//------------------------------------------------------------------------------

/**
 * Skapar all text på scenen.
 *
 * @return {void}
 */
runmysteriet.scene.TextInputView.prototype.createText = function() {

    this.m_titleText = new rune.text.BitmapField("WRITE YOUR NAMES");
    this.m_titleText.autoSize = true;
    this.m_titleText.center = this.application.screen.center;
    this.m_titleText.y -= 80;
    this.stage.addChild(this.m_titleText);

    this.m_helpText = new rune.text.BitmapField(String(this.getHelpText()));
    this.m_helpText.autoSize = true;
    this.m_helpText.center = this.application.screen.center;
    this.m_helpText.y -= 55;
    this.m_helpText.scale = 0.65;
    this.stage.addChild(this.m_helpText);

    this.m_player1Text = new rune.text.BitmapField(" ");
    this.m_player1Text.autoSize = true;
    this.m_player1Text.center = this.application.screen.center;
    this.m_player1Text.y -= 15;
    this.stage.addChild(this.m_player1Text);

    this.m_player2Text = new rune.text.BitmapField(" ");
    this.m_player2Text.autoSize = true;
    this.m_player2Text.center = this.application.screen.center;
    this.m_player2Text.y += 20;
    this.stage.addChild(this.m_player2Text);

    this.m_letterText = new rune.text.BitmapField(" ");
    this.m_letterText.autoSize = true;
    this.m_letterText.center = this.application.screen.center;
    this.m_letterText.y += 60;
    this.m_letterText.scale = 0.8;
    this.stage.addChild(this.m_letterText);

    this.m_startText = new rune.text.BitmapField(" ");
    this.m_startText.autoSize = true;
    this.m_startText.center = this.application.screen.center;
    this.m_startText.y += 90;
    this.m_startText.scale = 0.8;
    this.stage.addChild(this.m_startText);
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

/**
 * Uppdaterar namninput.
 *
 * @param {number} step
 * @return {void}
 */
runmysteriet.scene.TextInputView.prototype.update = function(step) {

    var input = null;
    var currentInput = null;

    rune.scene.Scene.prototype.update.call(this, step);

    if (!this.m_gameInput) {
        return;
    }

    input = this.m_gameInput.read(this.keyboard);

    this.updateVolumeInput(input);

    if (!this.m_nameInputs || this.m_nameInputs.length < 2) {
        return;
    }

    currentInput = this.m_nameInputs[this.m_currentPlayer];

    if (!currentInput) {
        return;
    }

    if (input.up) {
        currentInput.previousLetter();
        this.updateText();
        return;
    }

    if (input.down) {
        currentInput.nextLetter();
        this.updateText();
        return;
    }

    if (input.left && this.m_currentPlayer > 0) {
        this.m_currentPlayer = 0;
        this.updateText();
        return;
    }

    if (input.right && this.m_currentPlayer < 1 && currentInput.isComplete()) {
        this.m_currentPlayer = 1;
        this.updateText();
        return;
    }

    if (input.back) {
        this.removeLetterOrGoBack();
        this.updateText();
        return;
    }

    if (input.choose) {
        this.chooseLetterOrStart();
        this.updateText();
    }
};

//------------------------------------------------------------------------------
// INPUT HELPERS
//------------------------------------------------------------------------------

/**
 * Tar bort bokstav eller går tillbaka till spelare 1.
 *
 * @return {void}
 */
runmysteriet.scene.TextInputView.prototype.removeLetterOrGoBack = function() {

    var currentInput = this.m_nameInputs[this.m_currentPlayer];

    if (!currentInput) {
        return;
    }

    if (currentInput.getLength() > 0) {
        currentInput.removeLastLetter();
        return;
    }

    if (this.m_currentPlayer > 0) {
        this.m_currentPlayer = 0;
    }
};

/**
 * Lägger till bokstav eller startar spelet.
 *
 * @return {void}
 */
runmysteriet.scene.TextInputView.prototype.chooseLetterOrStart = function() {

    var currentInput = this.m_nameInputs[this.m_currentPlayer];

    if (!currentInput) {
        return;
    }

    if (this.areBothNamesComplete()) {
        this.startGame();
        return;
    }

    currentInput.addSelectedLetter();

    if (currentInput.isComplete() && this.m_currentPlayer < 1) {
        this.m_currentPlayer = 1;
    }
};

//------------------------------------------------------------------------------
// VOLUME
//------------------------------------------------------------------------------

/**
 * Hanterar volym med gemensam GameInput.
 *
 * @param {?Object} input
 * @return {void}
 */
runmysteriet.scene.TextInputView.prototype.updateVolumeInput = function(input) {

    var stepVol = 0.1;

    if (!input || !this.backgroundMusic) {
        return;
    }

    if (input.volumeUp === true) {
        this.backgroundMusic.volume += stepVol;

        if (this.backgroundMusic.volume > 1) {
            this.backgroundMusic.volume = 0;
        }

        return;
    }

    if (input.volumeDown === true) {
        this.backgroundMusic.volume -= stepVol;

        if (this.backgroundMusic.volume < 0) {
            this.backgroundMusic.volume = 1;
        }
    }
};

//------------------------------------------------------------------------------
// TEXT UPDATE
//------------------------------------------------------------------------------

/**
 * Uppdaterar all text.
 *
 * @return {void}
 */
runmysteriet.scene.TextInputView.prototype.updateText = function() {

    if (!this.m_nameInputs || this.m_nameInputs.length < 2) {
        return;
    }

    if (this.m_player1Text) {
        this.m_player1Text.text = this.formatPlayerRow(0);
        this.m_player1Text.center = this.application.screen.center;
        this.m_player1Text.y -= 15;
    }

    if (this.m_player2Text) {
        this.m_player2Text.text = this.formatPlayerRow(1);
        this.m_player2Text.center = this.application.screen.center;
        this.m_player2Text.y += 20;
    }

    if (this.m_letterText) {
        this.m_letterText.text =
            "SELECTED LETTER: " +
            this.m_nameInputs[this.m_currentPlayer]
                .getSelectedLetter()
                .toUpperCase();

        this.m_letterText.center = this.application.screen.center;
        this.m_letterText.y += 60;
    }

    if (this.m_startText) {
        if (this.areBothNamesComplete()) {
            this.m_startText.text = "PRESS ENTER/X TO START";
        } else if (this.m_currentPlayer === 0) {
            this.m_startText.text = "FILL IN PLAYER 1";
        } else {
            this.m_startText.text = "FILL IN PLAYER 2";
        }

        this.m_startText.center = this.application.screen.center;
        this.m_startText.y += 90;
    }
};

/**
 * Formaterar namnrad för spelare.
 *
 * @param {number} index
 * @return {string}
 */
runmysteriet.scene.TextInputView.prototype.formatPlayerRow = function(index) {

    var nameInput = this.m_nameInputs[index];
    var rawName = "";
    var selectedLetter = "";
    var isActive = false;
    var text = "";
    var i = 0;
    var letter = " ";
    var maxLength = 4;

    if (!nameInput) {
        return "";
    }

    rawName = nameInput.getRawName();
    selectedLetter = nameInput.getSelectedLetter().toUpperCase();
    isActive = index === this.m_currentPlayer;
    maxLength = nameInput.getMaxLength();

    text = isActive ? "> " : "  ";
    text += "PLAYER " + (index + 1) + ": ";

    for (i = 0; i < maxLength; i++) {
        letter = rawName.charAt(i);

        if (
            !letter &&
            isActive &&
            i === rawName.length &&
            !nameInput.isComplete()
        ) {
            letter = selectedLetter;
        }

        if (!letter) {
            letter = " ";
        }

        text += "[" + letter + "] ";
    }

    return text;
};

/**
 * Kontrollerar om båda namnen är färdiga.
 *
 * @return {boolean}
 */
runmysteriet.scene.TextInputView.prototype.areBothNamesComplete = function() {

    if (!this.m_nameInputs || this.m_nameInputs.length < 2) {
        return false;
    }

    return (
        this.m_nameInputs[0].isComplete() &&
        this.m_nameInputs[1].isComplete()
    );
};

//------------------------------------------------------------------------------
// PLAYER DATA
//------------------------------------------------------------------------------

/**
 * Skapar playerData som skickas vidare genom spelet.
 *
 * Viktigt:
 * highscoreName skickas i ett objekt.
 * Om den skickas som string tappas den bort i Game.
 *
 * @param {string} player1Name
 * @param {string} player2Name
 * @return {!Object}
 */
runmysteriet.scene.TextInputView.prototype.createPlayerData = function(
    player1Name,
    player2Name
) {

    var playerData = {};
    var key = "";

    if (this.m_avatarData && typeof this.m_avatarData === "object") {
        for (key in this.m_avatarData) {
            if (this.m_avatarData.hasOwnProperty(key)) {
                playerData[key] = this.m_avatarData[key];
            }
        }
    }

    playerData.player1Name = player1Name;
    playerData.player2Name = player2Name;
    playerData.highscoreName = player1Name + "/" + player2Name;

    return playerData;
};

//------------------------------------------------------------------------------
// START GAME
//------------------------------------------------------------------------------

/**
 * Startar spelet och skickar med namn till highscore-flödet.
 *
 * @return {void}
 */
runmysteriet.scene.TextInputView.prototype.startGame = function() {

    var player1Name = this.m_nameInputs[0].getName();
    var player2Name = this.m_nameInputs[1].getName();
    var playerData = this.createPlayerData(player1Name, player2Name);

    this.stopBackgroundMusic();

    this.application.scenes.load([
        new runmysteriet.scene.Game(
            1,
            0,
            playerData
        )
    ]);
};

//------------------------------------------------------------------------------
// SOUND
//------------------------------------------------------------------------------

/**
 * Stoppar bakgrundsmusik säkert.
 *
 * @return {void}
 */
runmysteriet.scene.TextInputView.prototype.stopBackgroundMusic = function() {

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
runmysteriet.scene.TextInputView.prototype.removeDisplayObject = function(
    object
) {

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
 * Rensar TextInputView.
 *
 * @return {void}
 */
runmysteriet.scene.TextInputView.prototype.dispose = function() {

    var i = 0;

    this.stopBackgroundMusic();

    if (this.m_nameInputs) {
        for (i = 0; i < this.m_nameInputs.length; i++) {
            if (
                this.m_nameInputs[i] &&
                typeof this.m_nameInputs[i].dispose === "function"
            ) {
                this.m_nameInputs[i].dispose();
            }
        }
    }

    this.removeDisplayObject(this.m_startText);
    this.removeDisplayObject(this.m_letterText);
    this.removeDisplayObject(this.m_player2Text);
    this.removeDisplayObject(this.m_player1Text);
    this.removeDisplayObject(this.m_helpText);
    this.removeDisplayObject(this.m_titleText);

    this.m_gameInput = null;
    this.m_nameInputs = [];
    this.m_currentPlayer = 0;

    this.m_startText = null;
    this.m_letterText = null;
    this.m_player2Text = null;
    this.m_player1Text = null;
    this.m_helpText = null;
    this.m_titleText = null;

    this.m_avatarData = null;

    this.backgroundMusic = null;
    this.menuSound = null;

    rune.scene.Scene.prototype.dispose.call(this);
};