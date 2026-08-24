//------------------------------------------------------------------------------
// GUESS WORD SCENE
//------------------------------------------------------------------------------

/**
 * Scene där spelaren ska gissa den saknade bokstaven i ordet.
 *
 * Layout:
 * 1. Header/status: titel, score och hjärtan.
 * 2. Ordpanel: bokstavsrutor.
 * 3. Vald bokstav: LETTER.
 * 4. Hintpanel: hint och kostnad.
 * 5. Feedbackpanel: rätt/fel/meddelanden.
 * 6. Kontrollpanel: instruktioner.
 *
 * @constructor
 * @extends {rune.scene.Scene}
 * @param {number=} levelNumber
 * @param {number=} earnedScore
 * @param {number=} totalScore
 * @param {Object|string=} wordData
 * @param {?Object=} avatarData
 */
runmysteriet.scene.GuessWord = function(
    levelNumber,
    earnedScore,
    totalScore,
    wordData,
    avatarData
) {

    rune.scene.Scene.call(this);

    /** @type {?runmysteriet.input.GameInput} */
    this.m_gameInput = null;

    /** @type {number} */
    this.m_levelNumber = levelNumber || 1;

    /** @type {number} */
    this.m_earnedScore = earnedScore || 0;

    /** @type {number} */
    this.m_totalScore = totalScore || 0;

    /** @type {?Object} */
    this.m_avatarData = null;

    if (avatarData && typeof avatarData === "object") {
        this.m_avatarData = avatarData;
    }

    /** @type {?runmysteriet.logic.HighscoreManager} */
    this.m_highscoreManager = null;

    /** @type {?Object} */
    this.m_highscoreSound = null;

    /** @type {?rune.text.BitmapField} */
    this.m_highscoreText = null;

    /** @type {number} */
    this.m_highscoreTimer = 0;

    /** @type {boolean} */
    this.m_highscoreNotified = false;

    /** @type {number} */
    this.m_scoreBeforeLevel = this.m_totalScore - this.m_earnedScore;

    if (this.m_scoreBeforeLevel < 0) {
        this.m_scoreBeforeLevel = 0;
    }

    if (typeof wordData === "string") {
        wordData = {
            word: wordData,
            Subword: []
        };
    }

    /** @type {!Object} */
    this.m_wordData = wordData || {
        word: "Button",
        Subword: ["Start", "Needle"]
    };

    /** @type {string} */
    this.m_word = String(this.m_wordData.word || "Button").toLowerCase();

    /** @type {!Array} */
    this.m_hints = this.m_wordData.Subword || [];

    /** @type {?runmysteriet.logic.GuessWordPuzzle} */
    this.m_puzzle = null;

    /** @type {?runmysteriet.logic.GuessAlphabetSelector} */
    this.m_alphabetSelector = null;

    /** @type {!Array<!Object>} */
    this.m_letterBoxes = [];

    /** @type {?rune.display.Graphic} */
    this.m_background = null;

    /** @type {?rune.display.Graphic} */
    this.m_screenOverlay = null;

    /** @type {?rune.display.Graphic} */
    this.m_headerPanel = null;

    /** @type {?rune.display.Graphic} */
    this.m_wordPanel = null;

    /** @type {?rune.display.Graphic} */
    this.m_hintPanel = null;

    /** @type {?rune.display.Graphic} */
    this.m_feedbackBox = null;

    /** @type {?rune.display.Graphic} */
    this.m_controlsPanel = null;

    /** @type {?rune.text.BitmapField} */
    this.m_titleText = null;

    /** @type {?rune.text.BitmapField} */
    this.m_scoreText = null;

    /** @type {?rune.text.BitmapField} */
    this.m_heartsLabelText = null;

    /** @type {?rune.text.BitmapField} */
    this.m_letterText = null;

    /** @type {?rune.text.BitmapField} */
    this.m_hintText = null;

    /** @type {?rune.text.BitmapField} */
    this.m_feedbackText = null;

    /** @type {?rune.text.BitmapField} */
    this.m_messageText = null;

    /** @type {?rune.text.BitmapField} */
    this.m_correctWordText = null;

    /** @type {!Array<!rune.display.Graphic>} */
    this.m_triesHearts = [];

    /**
     *
     * @type {string}
     */
    this.m_heartTexture = "hart";

    /** @type {?Object} */
    this.m_wrongSound = null;

    /** @type {?Object} */
    this.m_rightSound = null;

    /** @type {!Array<!Object>} */
    this.m_effects = [];

    /** @type {number} */
    this.m_shakeTimer = 0;

    /** @type {number} */
    this.m_shakeDuration = 10;

    /** @type {number} */
    this.m_feedbackBoxStartX = 0;

    /** @type {number} */
    this.m_feedbackTextStartX = 0;

    /** @type {boolean} */
    this.m_failedGuess = false;

    /** @type {boolean} */
    this.m_answeredCorrect = false;

    /** @type {number} */
    this.m_currentHintIndex = 0;

    /** @type {number} */
    this.m_hintCost = 20;

    /** @type {number} */
    this.m_wrongGuessPenalty = 10;

    /** @type {number} */
    this.m_wrongGuesses = 0;

    /** @type {number} */
    this.m_maxWrongGuesses = 3;

    /** @type {?Object} */
    this.backgroundMusic = null;

    /** @type {?Object} */
    this.menuSound = null;
};

//------------------------------------------------------------------------------
// INHERITANCE
//------------------------------------------------------------------------------

runmysteriet.scene.GuessWord.prototype =
    Object.create(rune.scene.Scene.prototype);

runmysteriet.scene.GuessWord.prototype.constructor =
    runmysteriet.scene.GuessWord;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

/**
 * Initierar GuessWord-scenen.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.init = function() {

    rune.scene.Scene.prototype.init.call(this);

    this.backgroundMusic = this.application.sounds.sound.get("sound_musicMenu");
    this.menuSound = this.application.sounds.sound.get("sound_menu");
    this.m_wrongSound = this.application.sounds.sound.get("fail");
    this.m_rightSound = this.application.sounds.sound.get("lvl_up");

    if (this.backgroundMusic) {
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.3;
        this.backgroundMusic.play();
    }

    this.m_highscoreManager =
        new runmysteriet.logic.HighscoreManager(this.application);

    this.m_highscoreSound =
        this.application.sounds.sound.get("sound_highscore");

    this.m_gameInput = new runmysteriet.input.GameInput(this.application);

    this.m_puzzle = new runmysteriet.logic.GuessWordPuzzle(this.m_wordData);
    this.m_alphabetSelector = new runmysteriet.logic.GuessAlphabetSelector();

    /*
     * Viktig ordning:
     * Paneler först, sedan text och innehåll ovanpå.
     */
    this.createBackground();
    this.createScreenOverlay();

    this.createHeaderPanel();
    this.createWordPanel();
    this.createFeedbackPanel();
    this.createControlsPanel();

    this.createHeaderText();
    this.createTriesHearts();

    this.createLetterBoxes();
    this.updateLetterBoxes();
    this.updateTriesHearts();

    this.createFeedbackText();
    this.createControlsText();

    this.createHighscoreNotice();
    this.checkHighscoreNotice(this.m_totalScore);
};

//------------------------------------------------------------------------------
// CREATE BACKGROUND / PANELS
//------------------------------------------------------------------------------

/**
 * Skapar bakgrund.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.createBackground = function() {

    this.m_background = new rune.display.Graphic(
        0,
        0,
        this.application.screen.width,
        this.application.screen.height,
        "backgroundExtra"
    );

    this.stage.addChild(this.m_background);
};

/**
 * Skapar mörk overlay.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.createScreenOverlay = function() {

    this.m_screenOverlay = new rune.display.Graphic(
        0,
        0,
        this.application.screen.width,
        this.application.screen.height
    );

    this.m_screenOverlay.backgroundColor = "#000000";
    this.m_screenOverlay.alpha = 0.28;

    this.stage.addChild(this.m_screenOverlay);
};

/**
 * Skapar toppanel för status.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.createHeaderPanel = function() {

    this.m_headerPanel = new rune.display.Graphic(
        14,
        6,
        this.application.screen.width - 28,
        30
    );

    this.m_headerPanel.backgroundColor = "#061313";
    this.m_headerPanel.alpha = 0.70;

    this.stage.addChild(this.m_headerPanel);
};
/**
 * Skapar ordpanelen.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.createWordPanel = function() {

    var centerX = this.application.screen.center.x;

    this.m_wordPanel = new rune.display.Graphic(
        centerX - 155,
        54,
        310,
        72
    );

    this.m_wordPanel.backgroundColor = "#050b0b";
    this.m_wordPanel.alpha = 0.82;

    this.stage.addChild(this.m_wordPanel);
};


/**
 * Skapar kontrollpanelen längst ner
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.createControlsPanel = function() {

    this.m_controlsPanel = new rune.display.Graphic(
        18,
        this.application.screen.height - 36,
        this.application.screen.width - 36,
        26
    );

    this.m_controlsPanel.backgroundColor = "#050b0b";
    this.m_controlsPanel.alpha = 0.82;

    this.stage.addChild(this.m_controlsPanel);
};

//------------------------------------------------------------------------------
// CREATE TEXT / CONTENT
//------------------------------------------------------------------------------

/**
 * Skapar titel och score.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.createHeaderText = function() {

    this.m_scoreText = new rune.text.BitmapField(
        "SCORE: " + this.m_totalScore
    );

    this.m_scoreText.autoSize = true;
    this.m_scoreText.x = 30;
    this.m_scoreText.y = 16;
    this.m_scoreText.scale = 0.55;
    this.stage.addChild(this.m_scoreText);

    this.m_titleText = new rune.text.BitmapField("GUESS THE SECRET WORD");
    this.m_titleText.autoSize = true;
    this.m_titleText.center = this.application.screen.center;
    this.m_titleText.y = 13;
    this.m_titleText.scale = 0.72;
    this.stage.addChild(this.m_titleText);
};

/**
 * Skapar hjärtan.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.createTriesHearts = function() {

    var i = 0;
    var heart = null;

    var heartW = 15;
    var heartH = 15;
    var spacing = 5;

    var totalWidth =
        this.m_maxWrongGuesses * heartW +
        (this.m_maxWrongGuesses - 1) * spacing;

    var startX = this.application.screen.width - totalWidth - 30;
    var y = 14;

    this.m_triesHearts = [];

    for (i = 0; i < this.m_maxWrongGuesses; i++) {
        heart = new rune.display.Graphic(
            startX + i * (heartW + spacing),
            y,
            heartW,
            heartH,
            this.m_heartTexture
        );

        heart.alpha = 1;

        this.stage.addChild(heart);
        this.m_triesHearts.push(heart);
    }
};
/**
 * Skapar bokstavsrutor för ordet.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.createLetterBoxes = function() {

    var word = this.m_puzzle.getWord();
    var boxWidth = 30;
    var spacing = 10;
    var totalWidth = word.length * boxWidth + (word.length - 1) * spacing;
    var startX = this.application.screen.center.x - Math.floor(totalWidth / 2);
    var y = 78;

    var i = 0;
    var box = null;

    this.m_letterBoxes = [];

    for (i = 0; i < word.length; i++) {
        box = new runmysteriet.logic.GuessLetterBox(
            startX + i * (boxWidth + spacing),
            y,
            i
        );

        box.create(this.stage);
        this.m_letterBoxes.push(box);
    }
};
/**
 * Skapar feedbacktext.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.createFeedbackText = function() {

    this.m_feedbackText = new rune.text.BitmapField("CHOOSE A LETTER");
    this.m_feedbackText.autoSize = true;
    this.m_feedbackText.center = this.application.screen.center;
    this.m_feedbackText.y = 147;
    this.m_feedbackText.scale = 0.62;
    this.stage.addChild(this.m_feedbackText);

    this.m_feedbackTextStartX = this.m_feedbackText.x;
};
/**
 * Skapar feedbackpanel.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.createFeedbackPanel = function() {

    var centerX = this.application.screen.center.x;

    this.m_feedbackBox = new rune.display.Graphic(
        centerX - 125,
        140,
        250,
        26
    );

    this.m_feedbackBox.backgroundColor = "#050b0b";
    this.m_feedbackBox.alpha = 0.90;

    this.stage.addChild(this.m_feedbackBox);

    this.m_feedbackBoxStartX = this.m_feedbackBox.x;
};

/**
 * Skapar instruktionstext längst ner
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.createControlsText = function() {

    this.m_messageText = new rune.text.BitmapField(
        "UP/DOWN = LETTER   ENTER/CROSS = GUESS   T/TRIANGLE = HINT"
    );

    this.m_messageText.autoSize = true;
    this.m_messageText.center = this.application.screen.center;
    this.m_messageText.y = this.application.screen.height - 29;
    this.m_messageText.scale = 0.48;

    this.stage.addChild(this.m_messageText);
};

//------------------------------------------------------------------------------
// UPDATE LETTER BOXES / HEARTS
//------------------------------------------------------------------------------

/**
 * Uppdaterar bokstavsrutor
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.updateLetterBoxes = function() {

    var word = this.m_puzzle.getWord();
    var revealedMap = this.m_puzzle.getRevealedMap();
    var currentIndex = this.m_puzzle.getCurrentMissingIndex();
    var selectedLetter = this.m_alphabetSelector.getLetter();

    var i = 0;
    var box = null;

    for (i = 0; i < word.length; i++) {
        box = this.m_letterBoxes[i];

        if (!box) {
            continue;
        }

        if (revealedMap[i] === true) {
            box.setFound(word.charAt(i));
            continue;
        }

        if (i === currentIndex) {
            box.setPreview(selectedLetter);
            continue;
        }

        box.setEmpty();
    }
};

/**
 * Uppdaterar hjärtan efter fel gissning.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.updateTriesHearts = function() {

    var i = 0;
    var triesLeft = this.m_maxWrongGuesses - this.m_wrongGuesses;

    if (triesLeft < 0) {
        triesLeft = 0;
    }

    if (!this.m_triesHearts) {
        return;
    }

    for (i = 0; i < this.m_triesHearts.length; i++) {
        if (!this.m_triesHearts[i]) {
            continue;
        }

        if (i < triesLeft) {
            this.m_triesHearts[i].alpha = 1;
        } else {
            this.m_triesHearts[i].alpha = 0.22;
        }
    }
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

/**
 * Uppdaterar GuessWord-scenen varje frame.
 *
 * @param {number} step
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.update = function(step) {

    var input = null;

    rune.scene.Scene.prototype.update.call(this, step);

    if (!this.m_gameInput) {
        return;
    }

    input = this.m_gameInput.read(this.keyboard);

    this.updateVolumeInput(input);
    this.updateHighscoreNotice();
    this.updateShake();
    this.updateEffects();

    if (this.m_answeredCorrect === true) {
        if (this.isConfirmPressed(input)) {
            this.goToLevelComplete();
        }

        return;
    }

    if (this.m_failedGuess === true) {
        if (this.isConfirmPressed(input)) {
            this.goToGameOver();
        }

        return;
    }

    if (!this.m_alphabetSelector || !this.m_puzzle) {
        return;
    }

    if (input.hint) {
        this.buyHint();
        return;
    }

    if (input.up) {
        this.m_alphabetSelector.previous();
        this.updateLetterBoxes();
        return;
    }

    if (input.down) {
        this.m_alphabetSelector.next();
        this.updateLetterBoxes();
        return;
    }

    if (input.choose) {
        this.checkAnswer(this.m_alphabetSelector.getLetter());
    }
};

/**
 * Hanterar volym.
 *
 * @param {?Object} input
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.updateVolumeInput = function(input) {

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
// GAME LOGIC
//------------------------------------------------------------------------------

/**
 * Köper och visar en hint.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.buyHint = function() {

    var hint = null;

    if (this.m_currentHintIndex >= this.m_hints.length) {
        this.updateMessageText("NO MORE HINTS", "hint");
        return;
    }

    if (this.m_earnedScore < this.m_hintCost) {
        this.updateMessageText("NOT ENOUGH POINTS", "wrong");
        this.startWrongShake();
        this.playWrongSound();
        return;
    }

    this.m_earnedScore -= this.m_hintCost;

    if (this.m_earnedScore < 0) {
        this.m_earnedScore = 0;
    }

    this.m_totalScore = this.m_scoreBeforeLevel + this.m_earnedScore;

    hint = this.m_hints[this.m_currentHintIndex];
    this.m_currentHintIndex++;

    this.updateScoreText();

    this.updateMessageText(
        "HINT: " + String(hint).toUpperCase(),
        "hint"
    );

    this.checkHighscoreNotice(this.m_totalScore);
    return;

    this.updateScoreText();
    this.updateMessageText("HINT USED", "hint");
    this.checkHighscoreNotice(this.m_totalScore);
};

/**
 * Kontrollerar vald bokstav.
 *
 * @param {string} letter
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.checkAnswer = function(letter) {

    var correct = this.m_puzzle.checkLetter(String(letter).toLowerCase());

    if (correct) {
        this.playRightSound();

        this.m_alphabetSelector.reset();
        this.updateLetterBoxes();
        if (this.m_puzzle.isComplete()) {
            this.m_answeredCorrect = true;
            this.updateMessageText("WORD COMPLETE", "right");
            this.spawnFlowerEffect();

            if (this.m_messageText) {
                this.m_messageText.text = "CONTINUE: PRESS X / ENTER";
                this.m_messageText.center = this.application.screen.center;
                this.m_messageText.y = this.application.screen.height - 34;
            }

            return;
        }

        this.updateMessageText("RIGHT LETTER", "right");
        this.spawnFlowerEffect();
        return;
    }

    this.applyWrongGuessPenalty();
};

/**
 * ger straff vid fel gissning
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.applyWrongGuessPenalty = function() {

    this.m_wrongGuesses++;
    this.updateTriesHearts();

    this.m_earnedScore -= this.m_wrongGuessPenalty;
    this.m_totalScore -= this.m_wrongGuessPenalty;

    if (this.m_earnedScore < 0) {
        this.m_earnedScore = 0;
    }

    if (this.m_totalScore < 0) {
        this.m_totalScore = 0;
    }

    this.updateScoreText();
    this.checkHighscoreNotice(this.m_totalScore);

   if (this.m_wrongGuesses >= this.m_maxWrongGuesses) {
    this.showCorrectWordText();
    this.startWrongShake();
    this.playWrongSound();
    return;
    }

    this.updateMessageText("WRONG LETTER", "wrong");
    this.startWrongShake();
    this.playWrongSound();
};

/**
 * Visar korrekt ord när spelaren har slut på hjärtan.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.showCorrectWordText = function() {

    this.m_failedGuess = true;

    if (!this.m_correctWordText) {
        this.m_correctWordText = new rune.text.BitmapField("");
        this.m_correctWordText.autoSize = true;
        this.m_correctWordText.scale = 0.75;
        this.stage.addChild(this.m_correctWordText);
    }

    this.m_correctWordText.text =
        "THE WORD WAS: " + this.m_word.toUpperCase();

    this.m_correctWordText.center = this.application.screen.center;
    this.m_correctWordText.y = 130;

    this.updateMessageText("NO HEARTS LEFT", "wrong");

    if (this.m_messageText) {
        this.m_messageText.text = "CONTINUE: PRESS X / ENTER";
        this.m_messageText.center = this.application.screen.center;
        this.m_messageText.y = this.application.screen.height - 34;
    }
};

/**
 * Kontrollerar confirm.
 *
 * @param {?Object} input
 * @return {boolean}
 */
runmysteriet.scene.GuessWord.prototype.isConfirmPressed = function(input) {

    if (!input) {
        return false;
    }

    return input.choose === true;
};

/**
 * Går vidare till LevelComplete.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.goToLevelComplete = function() {

    this.stopBackgroundMusic();

    this.application.scenes.load([
        new runmysteriet.scene.LevelComplete(
            this.m_levelNumber,
            this.m_totalScore,
            this.m_earnedScore,
            this.m_avatarData
        )
    ]);
};

/**
 * Går till GameOver eller TextInputView vid highscore.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.goToGameOver = function() {

    this.stopBackgroundMusic();

    if (
        this.m_highscoreManager &&
        this.m_highscoreManager.isNewRecord(this.m_totalScore) === true
    ) {
        this.application.scenes.load([
            new runmysteriet.scene.TextInputView(
                function() {
                    return "UP/DOWN = LETTER   ENTER/X = ADD/SAVE   BACK/ESC = DELETE";
                },
                this.m_avatarData,
                {
                    score: this.m_totalScore,
                    reason: "TOO MANY WRONG GUESSES"
                }
            )
        ]);
        return;
    }

    this.application.scenes.load([
        new runmysteriet.scene.GameOver(
            this.m_totalScore,
            "TOO MANY WRONG GUESSES"
        )
    ]);
};

//------------------------------------------------------------------------------
// FEEDBACK EFFECTS
//------------------------------------------------------------------------------

/**
 * Uppdaterar feedbacktext.
 *
 * @param {string} text
 * @param {string=} type
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.updateMessageText = function(text, type) {

    type = type || "normal";

    if (this.m_feedbackBox) {
        this.m_feedbackBox.backgroundColor = "#050b0b";
        this.m_feedbackBox.alpha = 0.90;
    }

    if (!this.m_feedbackText) {
        return;
    }

    this.m_feedbackText.text = text;
    this.m_feedbackText.center = this.application.screen.center;
    this.m_feedbackText.y = 147;

    if (type === "right") {
        this.m_feedbackText.color = "#7CFF8A";
    } else if (type === "hint") {
        this.m_feedbackText.color = "#FFD36A";
    } else {
        this.m_feedbackText.color = "#FFFFFF";
    }

    this.m_feedbackTextStartX = this.m_feedbackText.x;
};
/**
 * Startar skak vid fel.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.startWrongShake = function() {

    if (this.m_feedbackBox) {
        this.m_feedbackBoxStartX = this.m_feedbackBox.x;
    }

    if (this.m_feedbackText) {
        this.m_feedbackTextStartX = this.m_feedbackText.x;
    }

    this.m_shakeTimer = this.m_shakeDuration;
};

/**
 * Uppdaterar skak.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.updateShake = function() {

    var offset = 0;

    if (this.m_shakeTimer <= 0) {
        if (this.m_feedbackBox) {
            this.m_feedbackBox.x = this.m_feedbackBoxStartX;
        }

        if (this.m_feedbackText) {
            this.m_feedbackText.x = this.m_feedbackTextStartX;
        }

        return;
    }

    offset = this.m_shakeTimer % 2 === 0 ? -7 : 7;

    if (this.m_feedbackBox) {
        this.m_feedbackBox.x = this.m_feedbackBoxStartX + offset;
    }

    if (this.m_feedbackText) {
        this.m_feedbackText.x = this.m_feedbackTextStartX + offset;
    }

    this.m_shakeTimer--;
};

/**
 * spelar felljudet
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.playWrongSound = function() {

    if (this.m_wrongSound && typeof this.m_wrongSound.play === "function") {
        this.m_wrongSound.play();
    }
};
/**
 * Spelar ljud vid rätt gissning av bokstav
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.playRightSound = function() {

    if (this.m_rightSound && typeof this.m_rightSound.play === "function") {
        this.m_rightSound.play();
    }
};
/**
 * Skapar små blommor vid rätt svar.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.spawnFlowerEffect = function() {

    var i = 0;
    var flower = null;
    var x = 0;
    var y = 0;

    for (i = 0; i < 8; i++) {
        x = 50 + Math.random() * (this.application.screen.width - 100);
        y = 80 + Math.random() * 52;

        flower = this.createSmallFlower(x, y);
        this.m_effects.push(flower);
    }
};

/**
 * Skapar en liten blomma.
 *
 * @param {number} x
 * @param {number} y
 * @return {!Object}
 */
runmysteriet.scene.GuessWord.prototype.createSmallFlower = function(x, y) {

    var parts = [];
    var petalSize = 3;
    var centerSize = 3;

    var top = new rune.display.Graphic(x, y - 4, petalSize, petalSize);
    var bottom = new rune.display.Graphic(x, y + 4, petalSize, petalSize);
    var left = new rune.display.Graphic(x - 4, y, petalSize, petalSize);
    var right = new rune.display.Graphic(x + 4, y, petalSize, petalSize);
    var center = new rune.display.Graphic(x, y, centerSize, centerSize);

    top.backgroundColor = "#7CFF8A";
    bottom.backgroundColor = "#7CFF8A";
    left.backgroundColor = "#7CFF8A";
    right.backgroundColor = "#7CFF8A";
    center.backgroundColor = "#FFD36A";

    parts.push(top);
    parts.push(bottom);
    parts.push(left);
    parts.push(right);
    parts.push(center);

    this.stage.addChild(top);
    this.stage.addChild(bottom);
    this.stage.addChild(left);
    this.stage.addChild(right);
    this.stage.addChild(center);

    return {
        parts: parts,
        life: 30,
        speedY: -0.4
    };
};

/**
 * Uppdaterar effekter.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.updateEffects = function() {

    var i = 0;
    var j = 0;
    var effect = null;
    var part = null;

    for (i = this.m_effects.length - 1; i >= 0; i--) {
        effect = this.m_effects[i];
        effect.life--;

        for (j = 0; j < effect.parts.length; j++) {
            part = effect.parts[j];
            part.y += effect.speedY;
            part.alpha = effect.life / 30;
        }

        if (effect.life <= 0) {
            for (j = 0; j < effect.parts.length; j++) {
                this.removeDisplayObject(effect.parts[j]);
            }

            this.m_effects.splice(i, 1);
        }
    }
};

//------------------------------------------------------------------------------
// SCORE / HIGHSCORE
//------------------------------------------------------------------------------

/**
 * Uppdaterar scoretext.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.updateScoreText = function() {

    if (!this.m_scoreText) {
        return;
    }

    this.m_scoreText.text = "SCORE: " + this.m_totalScore;
    this.m_scoreText.x = 30;
    this.m_scoreText.y = 16;
};
/**
 * Skapar highscore-notis.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.createHighscoreNotice = function() {

    this.m_highscoreText = new rune.text.BitmapField("");
    this.m_highscoreText.autoSize = true;
    this.m_highscoreText.visible = false;

    this.stage.addChild(this.m_highscoreText);
};

/**
 * Visar highscore-notis.
 *
 * @param {string=} text
 * @param {boolean=} playSound
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.showHighscoreNotice = function(
    text,
    playSound
) {

    if (this.m_highscoreNotified === true) {
        return;
    }

    text = text || "TOP 5 SCORE";
    playSound = playSound === true;

    this.m_highscoreNotified = true;
    this.m_highscoreTimer = 300;

    if (this.m_highscoreText) {
        this.m_highscoreText.text = text;
        this.m_highscoreText.visible = true;
        this.m_highscoreText.alpha = 1;
        this.m_highscoreText.scaleX = 1;
        this.m_highscoreText.scaleY = 1;
    }

    if (playSound === true && this.m_highscoreSound) {
        this.m_highscoreSound.play();
    }
};

/**
 * Uppdaterar highscore-notis.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.updateHighscoreNotice = function() {

    var pulse = 0;

    if (!this.m_highscoreText || this.m_highscoreText.visible !== true) {
        return;
    }

    this.m_highscoreTimer--;

    pulse = 1 + Math.sin(this.m_highscoreTimer * 0.25) * 0.15;

    this.m_highscoreText.scaleX = pulse;
    this.m_highscoreText.scaleY = pulse;

    this.m_highscoreText.center = this.application.screen.center;
    this.m_highscoreText.y = 40;

    if (this.m_highscoreTimer < 30) {
        this.m_highscoreText.alpha = this.m_highscoreTimer / 30;
    }

    if (this.m_highscoreTimer <= 0) {
        this.m_highscoreText.visible = false;
        this.m_highscoreText.alpha = 1;
        this.m_highscoreText.scaleX = 1;
        this.m_highscoreText.scaleY = 1;
    }
};

/**
 * Kontrollerar highscore.
 *
 * @param {number} score
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.checkHighscoreNotice = function(score) {

    if (this.m_highscoreNotified === true) {
        return;
    }

    if (!this.m_highscoreManager) {
        return;
    }

    if (this.m_highscoreManager.isNewRecord(score) === true) {
        this.showHighscoreNotice();
    }
};

//------------------------------------------------------------------------------
// CLEANUP
//------------------------------------------------------------------------------

/**
 * Tar bort displayobjekt.
 *
 * @param {?Object} object
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.removeDisplayObject = function(object) {

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
 * Stoppar bakgrundsmusik.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.stopBackgroundMusic = function() {

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
 * Rensar scenen.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.dispose = function() {

    var i = 0;
    var j = 0;
    var box = null;

    this.stopBackgroundMusic();

    if (this.m_effects) {
        for (i = 0; i < this.m_effects.length; i++) {
            if (!this.m_effects[i] || !this.m_effects[i].parts) {
                continue;
            }

            for (j = 0; j < this.m_effects[i].parts.length; j++) {
                this.removeDisplayObject(this.m_effects[i].parts[j]);
            }
        }
    }

    if (this.m_triesHearts) {
        for (i = 0; i < this.m_triesHearts.length; i++) {
            this.removeDisplayObject(this.m_triesHearts[i]);
        }
    }

    if (this.m_letterBoxes) {
        for (i = 0; i < this.m_letterBoxes.length; i++) {
            box = this.m_letterBoxes[i];

            if (!box) {
                continue;
            }

            if (typeof box.dispose === "function") {
                box.dispose();
                continue;
            }

            if (typeof box.clear === "function") {
                box.clear();
                continue;
            }

            this.removeDisplayObject(box.m_box);
            this.removeDisplayObject(box.m_text);
            this.removeDisplayObject(box.m_background);
            this.removeDisplayObject(box.m_letterText);
        }
    }

    this.removeDisplayObject(this.m_background);
    this.removeDisplayObject(this.m_screenOverlay);

    this.removeDisplayObject(this.m_headerPanel);
    this.removeDisplayObject(this.m_wordPanel);
    this.removeDisplayObject(this.m_hintPanel);
    this.removeDisplayObject(this.m_feedbackBox);
    this.removeDisplayObject(this.m_controlsPanel);

    this.removeDisplayObject(this.m_titleText);
    this.removeDisplayObject(this.m_scoreText);
    this.removeDisplayObject(this.m_letterText);
    this.removeDisplayObject(this.m_hintText);
    this.removeDisplayObject(this.m_feedbackText);
    this.removeDisplayObject(this.m_messageText);
    this.removeDisplayObject(this.m_correctWordText);
    this.removeDisplayObject(this.m_highscoreText);

    this.m_gameInput = null;
    this.m_puzzle = null;
    this.m_alphabetSelector = null;
    this.m_letterBoxes = [];

    this.m_background = null;
    this.m_screenOverlay = null;
    this.m_headerPanel = null;
    this.m_wordPanel = null;
    this.m_hintPanel = null;
    this.m_feedbackBox = null;
    this.m_controlsPanel = null;

    this.m_titleText = null;
    this.m_scoreText = null;
    this.m_letterText = null;
    this.m_hintText = null;
    this.m_feedbackText = null;
    this.m_messageText = null;
    this.m_correctWordText = null;

    this.m_highscoreText = null;
    this.m_highscoreManager = null;
    this.m_highscoreSound = null;
    this.m_highscoreTimer = 0;
    this.m_highscoreNotified = false;

    this.m_wordData = null;
    this.m_word = "";
    this.m_hints = [];
    this.m_avatarData = null;

    this.backgroundMusic = null;
    this.menuSound = null;
    this.m_wrongSound = null;
    this.m_rightSound = null;

    this.m_failedGuess = false;
    this.m_answeredCorrect = false;
    this.m_triesHearts = [];
    this.m_effects = [];

    this.m_shakeTimer = 0;
    this.m_feedbackBoxStartX = 0;
    this.m_feedbackTextStartX = 0;

    rune.scene.Scene.prototype.dispose.call(this);
};
