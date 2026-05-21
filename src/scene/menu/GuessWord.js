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
 */
runmysteriet.scene.GuessWord = function(levelNumber, earnedScore, totalScore, wordData, playerName) {

    rune.scene.Scene.call(this);

    this.m_gameInput = null;
    this.m_levelNumber = levelNumber || 1;
    this.m_earnedScore = earnedScore || 0;
    this.m_totalScore = totalScore || 0;
    this.m_playerName = playerName || "PLAYER";
    this.m_wrongGuessPenalty = 10;

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

    this.m_currentHintIndex = 0;
    this.m_hintCost = 20;
    this.m_wrongGuessPenalty = 10;

    this.m_answeredCorrect = false;

    this.backgroundMusic = null;
    this.menuSound = null;
};

//------------------------------------------------------------------------------
// INHERITANCE
//------------------------------------------------------------------------------

runmysteriet.scene.GuessWord.prototype = Object.create(rune.scene.Scene.prototype);
runmysteriet.scene.GuessWord.prototype.constructor = runmysteriet.scene.GuessWord;

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

    console.log("GuessWord startad");
    console.log("WORD DATA:", this.m_wordData);
    console.log("ORD ATT GISSA:", this.m_word);
    console.log("LEDTRADAR:", this.m_hints);

    this.m_gameInput = new runmysteriet.input.GameInput(this.application);
    this.m_puzzle = new runmysteriet.logic.GuessWordPuzzle(this.m_wordData);
    this.m_alphabetSelector = new runmysteriet.logic.GuessAlphabetSelector();

    this.createText();
    this.createLetterBoxes();
    this.updateLetterBoxes();
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

    this.m_hintText = new rune.text.BitmapField("HINT: PRESS T / TRIANGLE, COSTS 20 POINTS");    
    this.m_hintText.autoSize = true;
    this.m_hintText.center = this.application.screen.center;
    this.m_hintText.y += 40;
    this.m_hintText.scale = 0.8;
    this.stage.addChild(this.m_hintText);

    this.m_scoreText = new rune.text.BitmapField("SCORE: " + this.m_totalScore);
    this.m_scoreText.autoSize = true;
    this.m_scoreText.center = this.application.screen.center;
    this.m_scoreText.y += 65;
    this.m_scoreText.scale = 0.8;
    this.stage.addChild(this.m_scoreText);

    this.m_messageText = new rune.text.BitmapField("UP/DOWN = LETTER, ENTER/CROSS = GUESS, T/TRIANGLE = HINT");    
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

    this.m_letterBoxes = [];

    for (var i = 0; i < word.length; i++) {

        var box = new runmysteriet.logic.GuessLetterBox(
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

    for (var i = 0; i < word.length; i++) {

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

    /*
     * Läs input EN gång.
     * GameInput ska läsa keyboard + gamepad 0 + gamepad 1.
     */
    input = this.m_gameInput.read(this.keyboard);

    this.updateVolumeInput(input);

    if (this.m_answeredCorrect === true) {

        if (this.isConfirmPressed(input)) {
            this.goToLevelComplete();
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
        return;
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

        console.log("Volym:", this.backgroundMusic.volume.toFixed(2));
        return;
    }

    if (input.volumeDown === true) {

        this.backgroundMusic.volume -= stepVol;

        if (this.backgroundMusic.volume < 0) {
            this.backgroundMusic.volume = 1;
        }

        console.log("Volym:", this.backgroundMusic.volume.toFixed(2));
    }
};

//------------------------------------------------------------------------------
// BUY HINT
//------------------------------------------------------------------------------

runmysteriet.scene.GuessWord.prototype.buyHint = function() {

    if (this.m_currentHintIndex >= this.m_hints.length) {
        this.m_messageText.text = "NO MORE HINTS";
        return;
    }

    if (this.m_earnedScore < this.m_hintCost) {
        this.m_messageText.text = "NOT ENOUGH POINTS FOR HINT";
        return;
    }

    this.m_earnedScore -= this.m_hintCost;

    if (this.m_earnedScore < 0) {
        this.m_earnedScore = 0;
    }

    this.m_totalScore = this.m_scoreBeforeLevel + this.m_earnedScore;

    var hint = this.m_hints[this.m_currentHintIndex];
    this.m_currentHintIndex++;

    this.m_hintText.text = "HINT " + this.m_currentHintIndex + ": " + String(hint).toUpperCase();
    this.m_scoreText.text = "SCORE: " + this.m_totalScore;
    this.m_messageText.text = "HINT COST 20 POINTS";
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
            this.m_messageText.text = "RIGHT! PRESS ENTER TO CONTINUE";
            return;
        }

        this.m_messageText.text = "RIGHT! NEXT LETTER";
        return;
    }

    this.applyWrongGuessPenalty();
    this.m_messageText.text = "WRONG LETTER. -10 POINTS.";
};

//------------------------------------------------------------------------------
// CONFIRM
//------------------------------------------------------------------------------

runmysteriet.scene.GuessWord.prototype.isConfirmPressed = function(input) {

    if (!input) {
        return false;
    }

    return input.choose === true || input.pause === true;
};
//------------------------------------------------------------------------------
// LEVEL COMPLETE
//------------------------------------------------------------------------------

runmysteriet.scene.GuessWord.prototype.goToLevelComplete = function() {

    this.application.scenes.load([
        new runmysteriet.scene.LevelComplete(
            this.m_levelNumber,
            this.m_totalScore,
            this.m_earnedScore,
            this.m_playerName
        )
    ]);
};

//------------------------------------------------------------------------------
// WRONG PENALTY
//------------------------------------------------------------------------------

runmysteriet.scene.GuessWord.prototype.applyWrongGuessPenalty = function() {

    this.m_earnedScore -= this.m_wrongGuessPenalty;

    if (this.m_earnedScore < 0) {
        this.m_earnedScore = 0;
    }

    this.m_totalScore = this.m_scoreBeforeLevel + this.m_earnedScore;

    this.m_scoreText.text = "SCORE: " + this.m_totalScore;

    if (this.m_earnedScore <= 0) {
        this.saveHighscore();
        this.goToGameOver();
    }
};

//------------------------------------------------------------------------------
// GAME OVER
//------------------------------------------------------------------------------

runmysteriet.scene.GuessWord.prototype.goToGameOver = function() {

    this.application.scenes.load([
        new runmysteriet.scene.GameOver(
            this.m_playerName,
            this.m_totalScore
        )
    ]);
};

//------------------------------------------------------------------------------
// HIGHSCORE
//------------------------------------------------------------------------------

runmysteriet.scene.GuessWord.prototype.saveHighscore = function() {

    var entry = new runmysteriet.logic.HighscoreEntry(
        this.m_playerName,
        this.m_totalScore
    );

    var manager = new runmysteriet.logic.HighscoreManager(this.application);
    manager.save(entry);
};