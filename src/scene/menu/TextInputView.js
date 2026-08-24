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
 * @param {?Object=} highscoreData
 */
runmysteriet.scene.TextInputView = function(
    getHelpText,
    avatarData,
    highscoreData
) {

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

    /** @type {?Object} */
    if (highscoreData && typeof highscoreData === "object") {
        this.m_highscoreData = highscoreData;
    } else {
        this.m_highscoreData = null;
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

    /** @type {?rune.display.Graphic} */
    this.m_background = null;

    /** @type {?rune.display.Graphic} */
    this.m_screenOverlay = null;

    /** @type {?rune.display.Graphic} */
    this.m_headerPanel = null;

    /** @type {?rune.display.Graphic} */
    this.m_namePanel = null;

    /** @type {?rune.display.Graphic} */
    this.m_player1Panel = null;

    /** @type {?rune.display.Graphic} */
    this.m_player2Panel = null;

    /** @type {?rune.display.Graphic} */
    this.m_letterPanel = null;

    /** @type {?rune.display.Graphic} */
    this.m_controlsPanel = null;

    /** @type {?Object} */
    this.backgroundMusic = null;

    /** @type {?Object} */
    this.menuSound = null;

    /** @type {?Object} */
    this.m_highscoreSound = null;
};

runmysteriet.scene.TextInputView.prototype =
    Object.create(rune.scene.Scene.prototype);

runmysteriet.scene.TextInputView.prototype.constructor =
    runmysteriet.scene.TextInputView;


/**
 * Initierar TextInputView.
 *
 * @return {void}
 */
runmysteriet.scene.TextInputView.prototype.init = function() {

    rune.scene.Scene.prototype.init.call(this);

    this.backgroundMusic = this.application.sounds.sound.get("sound_musicMenu");
    this.menuSound = this.application.sounds.sound.get("sound_menu");
    this.m_highscoreSound = this.application.sounds.sound.get("sound_highscore");
    
    if (this.m_highscoreData && this.m_highscoreSound) {
    this.m_highscoreSound.play();
}
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

/**
 * Skapar all text på scene
 *
 * @return {void}
 */
/**
 * Retunerar rubrik för vilken typ av score det är
 *
 * @return {string}
 */
runmysteriet.scene.TextInputView.prototype.getTitleText = function() {

    if (
        this.m_highscoreData &&
        this.m_highscoreData.title
    ) {
        return String(this.m_highscoreData.title);
    }

    if (this.m_highscoreData) {
        return "TOP 5 SCORE";
    }

    return "WRITE YOUR NAMES";
};

runmysteriet.scene.TextInputView.prototype.createText = function() {

    var centerX = this.application.screen.center.x;
    var screenW = this.application.screen.width;
    var screenH = this.application.screen.height;

    /*
     * Bakgrund.
     */
    this.m_background = new rune.display.Graphic(
        0,
        0,
        screenW,
        screenH,
        "backgroundExtra"
    );

    this.stage.addChild(this.m_background);

    /*
     * Mörk overlay, samma känsla som GuessWord.
     */
    this.m_screenOverlay = new rune.display.Graphic(
        0,
        0,
        screenW,
        screenH
    );

    this.m_screenOverlay.backgroundColor = "#000000";
    this.m_screenOverlay.alpha = 0.30;
    this.stage.addChild(this.m_screenOverlay);

    /*
     * Toppanel.
     */
    this.m_headerPanel = new rune.display.Graphic(
        14,
        8,
        screenW - 28,
        46
    );

    this.m_headerPanel.backgroundColor = "#050b0b";
    this.m_headerPanel.alpha = 0.82;
    this.stage.addChild(this.m_headerPanel);

    /*
     * Namnpanel.
     */
    this.m_namePanel = new rune.display.Graphic(
        centerX - 175,
        70,
        350,
        86
    );

    this.m_namePanel.backgroundColor = "#050b0b";
    this.m_namePanel.alpha = 0.82;
    this.stage.addChild(this.m_namePanel);

    /*
     * Separata rader för spelarna.
     */
    this.m_player1Panel = new rune.display.Graphic(
        centerX - 155,
        82,
        310,
        28
    );

    this.m_player1Panel.backgroundColor = "#000000";
    this.m_player1Panel.alpha = 0.45;
    this.stage.addChild(this.m_player1Panel);

    this.m_player2Panel = new rune.display.Graphic(
        centerX - 155,
        118,
        310,
        28
    );

    this.m_player2Panel.backgroundColor = "#000000";
    this.m_player2Panel.alpha = 0.45;
    this.stage.addChild(this.m_player2Panel);

    /*
     * Selected letter / status-panel.
     */
    this.m_letterPanel = new rune.display.Graphic(
        centerX - 135,
        171,
        270,
        28
    );

    this.m_letterPanel.backgroundColor = "#050b0b";
    this.m_letterPanel.alpha = 0.90;
    this.stage.addChild(this.m_letterPanel);

    /*
     * Kontrollpanel längst ner.
     */
    this.m_controlsPanel = new rune.display.Graphic(
        18,
        screenH - 36,
        screenW - 36,
        26
    );

    this.m_controlsPanel.backgroundColor = "#050b0b";
    this.m_controlsPanel.alpha = 0.82;
    this.stage.addChild(this.m_controlsPanel);

    /*
     * Titel.
     */
    this.m_titleText = new rune.text.BitmapField(
    this.getTitleText()
);

    this.m_titleText.autoSize = true;
    this.m_titleText.centerX = centerX;
    this.m_titleText.y = 13;
    this.m_titleText.scale = 1.2;
    this.stage.addChild(this.m_titleText);

    /*
     * Player 1.
     */
    this.m_player1Text = new rune.text.BitmapField(" ");
    this.m_player1Text.autoSize = true;
    this.m_player1Text.scale = 0.62;
    this.m_player1Text.centerX = centerX;
    this.m_player1Text.y = 91;
    this.stage.addChild(this.m_player1Text);

    /*
     * Player 2.
     */
    this.m_player2Text = new rune.text.BitmapField(" ");
    this.m_player2Text.autoSize = true;
    this.m_player2Text.scale = 0.62;
    this.m_player2Text.centerX = centerX;
    this.m_player2Text.y = 127;
    this.stage.addChild(this.m_player2Text);

    /*
     * Vald bokstav.
     */
    this.m_letterText = new rune.text.BitmapField(" ");
    this.m_letterText.autoSize = true;
    this.m_letterText.scale = 0.62;
    this.m_letterText.centerX = centerX;
    this.m_letterText.y = 180;
    this.stage.addChild(this.m_letterText);

    /*
     * Kontrolltext längst ner
     */
    this.m_helpText = new rune.text.BitmapField(String(this.getHelpText()));
    this.m_helpText.autoSize = true;
    this.m_helpText.scale = 0.45;
    this.m_helpText.centerX = centerX;
    this.m_helpText.y = screenH - 29;
    this.stage.addChild(this.m_helpText);

    /*
     * Start/status-text
     */
    this.m_startText = new rune.text.BitmapField(" ");
    this.m_startText.autoSize = true;
    this.m_startText.scale = 0.58;
    this.m_startText.centerX = centerX;
    this.m_startText.y = 210;
    this.stage.addChild(this.m_startText);
};

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

/**
 * Uppdaterar all text.
 *
 * @return {void}
 */
runmysteriet.scene.TextInputView.prototype.updateText = function() {

    var centerX = this.application.screen.center.x;
    var screenH = this.application.screen.height;

    if (!this.m_nameInputs || this.m_nameInputs.length < 2) {
        return;
    }

    if (this.m_player1Text) {
        this.m_player1Text.text = this.formatPlayerRow(0);
        this.m_player1Text.centerX = centerX;
        this.m_player1Text.y = 91;
    }

    if (this.m_player2Text) {
        this.m_player2Text.text = this.formatPlayerRow(1);
        this.m_player2Text.centerX = centerX;
        this.m_player2Text.y = 127;
    }

    if (this.m_letterText) {
        this.m_letterText.text =
            "LETTER: " +
            this.m_nameInputs[this.m_currentPlayer]
                .getSelectedLetter()
                .toUpperCase();

        this.m_letterText.centerX = centerX;
        this.m_letterText.y = 180;
    }

    if (this.m_startText) {
        if (this.areBothNamesComplete()) {
            this.m_startText.text = "PRESS ENTER/X TO START";
        } else if (this.m_currentPlayer === 0) {
            this.m_startText.text = "FILL IN PLAYER 1";
        } else {
            this.m_startText.text = "FILL IN PLAYER 2";
        }

        this.m_startText.centerX = centerX;
        this.m_startText.y = 210;
    }

    if (this.m_helpText) {
        this.m_helpText.centerX = centerX;
        this.m_helpText.y = screenH - 29;
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
    text += "P" + (index + 1) + ": ";

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

        text += "[" + letter + "]";

        if (i < maxLength - 1) {
            text += " ";
        }
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

/**
 * Skapar playerData som skickas vidare genom spelet.
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

    if (this.m_highscoreData) {
        this.application.scenes.load([
            new runmysteriet.scene.GameOver(
                this.m_highscoreData.score || 0,
                this.m_highscoreData.reason || "GAME OVER",
                playerData.highscoreName
            )
        ]);
        return;
    }

    this.application.scenes.load([
        new runmysteriet.scene.Game(
            1,
            0,
            playerData
        )
    ]);
};

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
    this.removeDisplayObject(this.m_controlsPanel);
    this.removeDisplayObject(this.m_letterPanel);
    this.removeDisplayObject(this.m_player2Panel);
    this.removeDisplayObject(this.m_player1Panel);
    this.removeDisplayObject(this.m_namePanel);
    this.removeDisplayObject(this.m_headerPanel);
    this.removeDisplayObject(this.m_screenOverlay);
    this.removeDisplayObject(this.m_background);

    this.m_gameInput = null;
    this.m_nameInputs = [];
    this.m_currentPlayer = 0;

    this.m_startText = null;
    this.m_letterText = null;
    this.m_player2Text = null;
    this.m_player1Text = null;
    this.m_helpText = null;
    this.m_titleText = null;
    this.m_controlsPanel = null;
    this.m_letterPanel = null;
    this.m_player2Panel = null;
    this.m_player1Panel = null;
    this.m_namePanel = null;
    this.m_headerPanel = null;
    this.m_screenOverlay = null;
    this.m_background = null;

    this.m_avatarData = null;
    this.m_highscoreData = null;

    this.backgroundMusic = null;
    this.menuSound = null;
    this.m_highscoreSound = null;

    rune.scene.Scene.prototype.dispose.call(this);
};