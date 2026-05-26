//------------------------------------------------------------------------------
// GUESS WORD SCENE
//------------------------------------------------------------------------------

/**
 * Scene där spelaren ska gissa den saknade bokstaven i ordet.
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

    this.m_gameInput = null;

    this.m_levelNumber = levelNumber || 1;
    this.m_earnedScore = earnedScore || 0;
    this.m_totalScore = totalScore || 0;

    if (avatarData && typeof avatarData === "object") {
        this.m_avatarData = avatarData;
    } else {
        this.m_avatarData = null;
    }

    this.m_highscoreManager = null;
    this.m_highscoreSound = null;
    this.m_highscoreText = null;
    this.m_highscoreTimer = 0;
    this.m_highscoreNotified = false;

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

    this.m_wordData = wordData || {
        word: "Button",
        Subword: ["Start", "Needle"]
    };

    this.m_word = String(this.m_wordData.word || "Button").toLowerCase();
    this.m_hints = this.m_wordData.Subword || [];

    this.m_puzzle = null;
    this.m_alphabetSelector = null;
    this.m_letterBoxes = [];

    this.m_titleText = null;
    this.m_letterText = null;
    this.m_hintText = null;
    this.m_scoreText = null;
    this.m_messageText = null;
    this.m_correctWordText = null;

    this.m_failedGuess = false;
    this.m_answeredCorrect = false;

    this.m_currentHintIndex = 0;
    this.m_hintCost = 20;
    this.m_wrongGuessPenalty = 10;
    this.m_wrongGuesses = 0;
    this.m_maxWrongGuesses = 3;

    this.backgroundMusic = null;
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

runmysteriet.scene.GuessWord.prototype.init = function() {

    rune.scene.Scene.prototype.init.call(this);

    this.backgroundMusic = this.application.sounds.sound.get("sound_musicMenu");
    this.menuSound = this.application.sounds.sound.get("sound_menu");

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

    this.createText();
    this.createLetterBoxes();
    this.updateLetterBoxes();

    this.createHighscoreNotice();
    this.checkHighscoreNotice(this.m_totalScore);
};

//------------------------------------------------------------------------------
// CREATE TEXT
//------------------------------------------------------------------------------

runmysteriet.scene.GuessWord.prototype.createText = function() {

    this.m_titleText = new rune.text.BitmapField("GUESS MISSING LETTERS");
    this.m_titleText.autoSize = true;
    this.m_titleText.center = this.application.screen.center;
    this.m_titleText.y -= 85;
    this.stage.addChild(this.m_titleText);

    this.m_letterText = new rune.text.BitmapField("LETTER: A");
    this.m_letterText.autoSize = true;
    this.m_letterText.center = this.application.screen.center;
    this.m_letterText.y += 10;
    this.stage.addChild(this.m_letterText);

    this.m_hintText = new rune.text.BitmapField(
        "HINT: PRESS T / TRIANGLE, COSTS 20 POINTS"
    );

    this.m_hintText.autoSize = true;
    this.m_hintText.center = this.application.screen.center;
    this.m_hintText.y += 40;
    this.m_hintText.scale = 0.8;
    this.stage.addChild(this.m_hintText);

    this.m_scoreText = new rune.text.BitmapField(
        "SCORE: " + this.m_totalScore
    );

    this.m_scoreText.autoSize = true;
    this.m_scoreText.center = this.application.screen.center;
    this.m_scoreText.y += 65;
    this.m_scoreText.scale = 0.8;
    this.stage.addChild(this.m_scoreText);

    this.m_messageText = new rune.text.BitmapField(
        "TRIES LEFT 3   UP/DOWN = LETTER, ENTER/CROSS = GUESS"
    );

    this.m_messageText.autoSize = true;
    this.m_messageText.center = this.application.screen.center;
    this.m_messageText.y += 90;
    this.m_messageText.scale = 0.7;
    this.stage.addChild(this.m_messageText);
};

//------------------------------------------------------------------------------
// CREATE LETTER BOXES
//------------------------------------------------------------------------------

runmysteriet.scene.GuessWord.prototype.createLetterBoxes = function() {

    var word = this.m_puzzle.getWord();
    var boxWidth = 28;
    var spacing = 10;
    var totalWidth = word.length * boxWidth + (word.length - 1) * spacing;
    var startX = this.application.screen.center.x - Math.floor(totalWidth / 2);
    var y = this.application.screen.center.y - 35;
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

//------------------------------------------------------------------------------
// UPDATE LETTER BOXES
//------------------------------------------------------------------------------

runmysteriet.scene.GuessWord.prototype.updateLetterBoxes = function() {

    var word = this.m_puzzle.getWord();
    var revealedMap = this.m_puzzle.getRevealedMap();
    var currentIndex = this.m_puzzle.getCurrentMissingIndex();
    var selectedLetter = this.m_alphabetSelector.getLetter();
    var i = 0;

    for (i = 0; i < word.length; i++) {
        if (revealedMap[i] === true) {
            this.m_letterBoxes[i].setLetter(word.charAt(i));
            this.m_letterBoxes[i].setActive(false);

        } else if (i === currentIndex) {
            this.m_letterBoxes[i].setPreviewLetter(selectedLetter);
            this.m_letterBoxes[i].setActive(true);

        } else {
            this.m_letterBoxes[i].clear();
            this.m_letterBoxes[i].setActive(false);
        }
    }

    if (this.m_letterText) {
        this.m_letterText.text = "LETTER: " + selectedLetter.toUpperCase();
    }
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

runmysteriet.scene.GuessWord.prototype.update = function(step) {

    var input = null;

    rune.scene.Scene.prototype.update.call(this, step);

    if (!this.m_gameInput) {
        return;
    }

    input = this.m_gameInput.read(this.keyboard);

    this.updateVolumeInput(input);
    this.updateHighscoreNotice();

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

//------------------------------------------------------------------------------
// VOLUME
//------------------------------------------------------------------------------

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
// BUY HINT
//------------------------------------------------------------------------------

runmysteriet.scene.GuessWord.prototype.buyHint = function() {

    var hint = null;

    if (this.m_currentHintIndex >= this.m_hints.length) {
        this.updateMessageText("NO MORE HINTS");
        return;
    }

    if (this.m_earnedScore < this.m_hintCost) {
        this.updateMessageText("NOT ENOUGH POINTS FOR HINT");
        return;
    }

    this.m_earnedScore -= this.m_hintCost;

    if (this.m_earnedScore < 0) {
        this.m_earnedScore = 0;
    }

    this.m_totalScore = this.m_scoreBeforeLevel + this.m_earnedScore;

    hint = this.m_hints[this.m_currentHintIndex];
    this.m_currentHintIndex++;

    if (this.m_hintText) {
        this.m_hintText.text =
            "HINT " +
            this.m_currentHintIndex +
            ": " +
            String(hint).toUpperCase();
    }

    this.updateScoreText();
    this.updateMessageText("HINT COST 20 POINTS");
    this.checkHighscoreNotice(this.m_totalScore);
};

//------------------------------------------------------------------------------
// CHECK ANSWER
//------------------------------------------------------------------------------

runmysteriet.scene.GuessWord.prototype.checkAnswer = function(letter) {

    var correct = this.m_puzzle.checkLetter(String(letter).toLowerCase());

    if (correct) {
        this.m_alphabetSelector.reset();
        this.updateLetterBoxes();

        if (this.m_puzzle.isComplete()) {
            this.m_answeredCorrect = true;
            this.updateMessageText("RIGHT! CONTINUE: PRESS X / ENTER");            return;
        }

        this.updateMessageText("RIGHT! NEXT LETTER");
        return;
    }

    this.applyWrongGuessPenalty();
};

//------------------------------------------------------------------------------
// CONFIRM
//------------------------------------------------------------------------------

runmysteriet.scene.GuessWord.prototype.isConfirmPressed = function(input) {

    if (!input) {
        return false;
    }

    return input.choose === true;
};

//------------------------------------------------------------------------------
// LEVEL COMPLETE
//------------------------------------------------------------------------------

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

//------------------------------------------------------------------------------
// WRONG GUESS
//------------------------------------------------------------------------------

runmysteriet.scene.GuessWord.prototype.applyWrongGuessPenalty = function() {

    var triesLeft = 0;

    this.m_wrongGuesses++;

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
        return;
    }

    triesLeft = this.m_maxWrongGuesses - this.m_wrongGuesses;

    this.updateMessageText(
        "WRONG LETTER. -" +
        this.m_wrongGuessPenalty +
        " POINTS. TRIES LEFT " +
        triesLeft
    );
};

//------------------------------------------------------------------------------
// CORRECT WORD TEXT
//------------------------------------------------------------------------------

runmysteriet.scene.GuessWord.prototype.showCorrectWordText = function() {

    this.m_failedGuess = true;

    if (!this.m_correctWordText) {
        this.m_correctWordText = new rune.text.BitmapField("");
        this.m_correctWordText.autoSize = true;
        this.m_correctWordText.scale = 1;

        this.stage.addChild(this.m_correctWordText);
    }

    this.m_correctWordText.text =
        "GAME OVER \n\n THE WORD WAS:  " + this.m_word.toUpperCase();

    this.m_correctWordText.center = this.application.screen.center;
    this.m_correctWordText.y = this.application.screen.center.y - 65;

    this.updateMessageText("CONTINUE: PRESS X / ENTER");
}
//------------------------------------------------------------------------------
// GAME OVER
//------------------------------------------------------------------------------

runmysteriet.scene.GuessWord.prototype.goToGameOver = function() {

    this.stopBackgroundMusic();

    this.application.scenes.load([
        new runmysteriet.scene.GameOver(
            this.m_totalScore,
            "TOO MANY WRONG GUESSES"
        )
    ]);
};

//------------------------------------------------------------------------------
// MESSAGE TEXT
//------------------------------------------------------------------------------

/**
 * Uppdaterar meddelandetext.
 *
 * @param {string} text
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.updateMessageText = function(text) {

    if (!this.m_messageText) {
        return;
    }

    this.m_messageText.text = text;
};

//------------------------------------------------------------------------------
// SCORE TEXT
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
};

//------------------------------------------------------------------------------
// HIGHSCORE NOTICE
//------------------------------------------------------------------------------

runmysteriet.scene.GuessWord.prototype.createHighscoreNotice = function() {

    this.m_highscoreText = new rune.text.BitmapField("NEW HIGHSCORE!");
    this.m_highscoreText.autoSize = true;
    this.m_highscoreText.visible = false;

    this.stage.addChild(this.m_highscoreText);
};

runmysteriet.scene.GuessWord.prototype.showHighscoreNotice = function() {

    if (this.m_highscoreNotified === true) {
        return;
    }

    this.m_highscoreNotified = true;
    this.m_highscoreTimer = 180;

    if (this.m_highscoreText) {
        this.m_highscoreText.visible = true;
        this.m_highscoreText.alpha = 1;
        this.m_highscoreText.scaleX = 1;
        this.m_highscoreText.scaleY = 1;
    }

    if (this.m_highscoreSound) {
        this.m_highscoreSound.play();
    }
};

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
    this.m_highscoreText.y = 35;

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
// REMOVE DISPLAY OBJECT
//------------------------------------------------------------------------------

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

//------------------------------------------------------------------------------
// SOUND
//------------------------------------------------------------------------------

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

//------------------------------------------------------------------------------
// DISPOSE
//------------------------------------------------------------------------------

runmysteriet.scene.GuessWord.prototype.dispose = function() {

    var i = 0;
    var box = null;

    this.stopBackgroundMusic();

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

    this.removeDisplayObject(this.m_titleText);
    this.removeDisplayObject(this.m_letterText);
    this.removeDisplayObject(this.m_hintText);
    this.removeDisplayObject(this.m_scoreText);
    this.removeDisplayObject(this.m_messageText);
    this.removeDisplayObject(this.m_correctWordText);
    this.removeDisplayObject(this.m_highscoreText);

    this.m_gameInput = null;

    this.m_puzzle = null;
    this.m_alphabetSelector = null;
    this.m_letterBoxes = [];

    this.m_titleText = null;
    this.m_letterText = null;
    this.m_hintText = null;
    this.m_scoreText = null;
    this.m_messageText = null;
    this.m_correctWordText = null;

    this.m_wordData = null;
    this.m_word = "";
    this.m_hints = [];

    this.m_highscoreText = null;
    this.m_highscoreManager = null;
    this.m_highscoreSound = null;
    this.m_highscoreTimer = 0;
    this.m_highscoreNotified = false;

    this.m_avatarData = null;

    this.backgroundMusic = null;
    this.menuSound = null;

    this.m_failedGuess = false;
    this.m_answeredCorrect = false;

    rune.scene.Scene.prototype.dispose.call(this);
};