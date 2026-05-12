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
runmysteriet.scene.GuessWord = function(levelNumber, earnedScore, totalScore, wordData,playerName) {

    rune.scene.Scene.call(this);

    /*
     * Information från spelet.
     */
    this.m_gameInput = null;
    this.m_levelNumber = levelNumber || 1;
    this.m_earnedScore = earnedScore || 0;
    this.m_totalScore = totalScore || 0;
    this.m_playerName = playerName || "PLAYER";
    this.m_wrongGuessPenalty = 10;

    /*
     * Sparar poängen som spelaren hade innan denna level.
     * Detta gör att tips kan dra från earnedScore utan att totalScore blir konstig.
     */
    this.m_scoreBeforeLevel = this.m_totalScore - this.m_earnedScore;

    if (this.m_scoreBeforeLevel < 0) {
        this.m_scoreBeforeLevel = 0;
    }

    /*
     * Om Game råkar skicka bara en string, t.ex. "Button",
     * gör vi om den till samma format som JSON.
     */
    if (typeof wordData === "string") {
        wordData = {
            word: wordData,
            Subword: []
        };
    }

    /*
     * Om inget wordData skickas in används ett reservord.
     */
    this.m_wordData = wordData || {
        word: "Button",
        Subword: ["Start", "Needle"]
    };

    /*
     * Ordet som ska gissas.
     * Exempel: "Button" blir "button".
     */
    this.m_word = String(this.m_wordData.word || "Button").toLowerCase();

    /*
     * Ledtrådar från JSON.
     * Exempel: ["Start", "Needle"]
     */
    this.m_hints = this.m_wordData.Subword || [];

/*
 * Objekt som används av GuessWord.
 */
    this.m_puzzle = null;
    this.m_alphabetSelector = null;
    this.m_letterBoxes = [];

/*
 * Textobjekt på skärmen.
 */
    this.m_titleText = null;
    this.m_letterText = null;
    this.m_hintText = null;
    this.m_scoreText = null;
    this.m_messageText = null;

    /*
     * Tips-system.
     */
    this.m_currentHintIndex = 0;
    this.m_hintCost = 20;
    this.m_wrongGuessPenalty = 10; 

    /*
     * Blir true när spelaren har gissat rätt.
     */
    this.m_answeredCorrect = false;
};

//------------------------------------------------------------------------------
// INHERITANCE
//------------------------------------------------------------------------------

runmysteriet.scene.GuessWord.prototype = Object.create(rune.scene.Scene.prototype);
runmysteriet.scene.GuessWord.prototype.constructor = runmysteriet.scene.GuessWord;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

/**
 * Startar GuessWord-scenen.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.init = function() {

    rune.scene.Scene.prototype.init.call(this);

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

/**
 * Skapar texten som visas på skärmen.
 *
 * @return {void}
 */
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

    this.m_hintText = new rune.text.BitmapField("HINT: PRESS T / TRIANGLE, COSTS 20 POINTS");    this.m_hintText.autoSize = true;
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


    //
    this.m_messageText = new rune.text.BitmapField("UP/DOWN = LETTER, ENTER/CROSS = GUESS, T/TRIANGLE = HINT");    this.m_messageText.autoSize = true;
    this.m_messageText.center = this.application.screen.center;
    this.m_messageText.y += 90;
    this.m_messageText.scale = 0.7;
    this.stage.addChild(this.m_messageText);
};



//------------------------------------------------------------------------------
// CREATE LETTER BOXES
//------------------------------------------------------------------------------

/**
 * Skapar en box per bokstav.
 *
 * @return {void}
 */
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

/**
 * Uppdaterar boxarna.
 *
 * @return {void}
 */
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

/**
 * Uppdaterar scenen.
 *
 * @param {number} step
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.update = function(step) {

    var input = null;

    rune.scene.Scene.prototype.update.call(this, step);

    if (this.m_answeredCorrect === true) {

        if (this.isConfirmPressed()) {
            this.goToLevelComplete();
        }

        return;
    }

    if (!this.m_gameInput || !this.m_alphabetSelector || !this.m_puzzle) {
        return;
    }

    input = this.m_gameInput.read(this.keyboard);

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
// BUY HINT
//------------------------------------------------------------------------------

/**
 * Köper och visar nästa ledtråd.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.buyHint = function() {

    var hint = "";

    /*
     * Finns det fler ledtrådar?
     */
    if (this.m_currentHintIndex >= this.m_hints.length) {

        if (this.m_messageText) {
            this.m_messageText.text = "NO MORE HINTS";
        }

        return;
    }

    /*
     * Har spelaren råd med tips?
     */
    if (this.m_earnedScore < this.m_hintCost) {

        if (this.m_messageText) {
            this.m_messageText.text = "NOT ENOUGH POINTS FOR HINT";
        }

        return;
    }

    /*
     * Dra 20 poäng från level-poängen.
     */
    this.m_earnedScore -= this.m_hintCost;

    if (this.m_earnedScore < 0) {
        this.m_earnedScore = 0;
    }

    /*
     * Räkna om totalpoängen.
     */
    this.m_totalScore = this.m_scoreBeforeLevel + this.m_earnedScore;

    /*
     * Hämta nästa tips.
     */
    hint = this.m_hints[this.m_currentHintIndex];
    this.m_currentHintIndex++;

    /*
     * Visa tipset.
     */
    if (this.m_hintText) {
        this.m_hintText.text = "HINT " + this.m_currentHintIndex + ": " + String(hint).toUpperCase();
    }

    /*
     * Uppdatera poängen på skärmen.
     */
    if (this.m_scoreText) {
        this.m_scoreText.text = "SCORE: " + this.m_totalScore;
    }

    if (this.m_messageText) {
        this.m_messageText.text = "HINT COST 20 POINTS";
    }
};


//------------------------------------------------------------------------------
// WRONG GUESS PENALTY
//------------------------------------------------------------------------------

/**
 * Drar poäng när spelaren gissar fel bokstav.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.applyWrongGuessPenalty = function() {

    this.m_earnedScore -= this.m_wrongGuessPenalty;

    if (this.m_earnedScore < 0) {
        this.m_earnedScore = 0;
    }

    this.m_totalScore = this.m_scoreBeforeLevel + this.m_earnedScore;

    if (this.m_scoreText) {
        this.m_scoreText.text = "SCORE: " + this.m_totalScore;
    }
};

//------------------------------------------------------------------------------
// CHECK ANSWER
//------------------------------------------------------------------------------

/**
 * Kontrollerar vald bokstav mot aktuell tom box.
 *
 * @param {string} letter
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.checkAnswer = function(letter) {

    var correct = false;

    if (!this.m_puzzle) {
        return;
    }

    letter = String(letter || "").toLowerCase();

    correct = this.m_puzzle.checkLetter(letter);

    if (correct === true) {

        this.m_alphabetSelector.reset();
        this.updateLetterBoxes();

        if (this.m_puzzle.isComplete()) {
            this.m_answeredCorrect = true;

            if (this.m_messageText) {
                this.m_messageText.text = "RIGHT! PRESS ENTER TO CONTINUE";
            }

            return;
        }

        if (this.m_messageText) {
            this.m_messageText.text = "RIGHT! NEXT LETTER";
        }

        return;
    }

    this.applyWrongGuessPenalty();

    if (this.m_messageText) {
        this.m_messageText.text = "WRONG LETTER. -10 POINTS.";
    }
};
//------------------------------------------------------------------------------
// CONFIRM
//------------------------------------------------------------------------------

/**
 * Kollar om spelaren vill gå vidare.
 *
 * @return {boolean}
 */
runmysteriet.scene.GuessWord.prototype.isConfirmPressed = function() {

    var keyboard = this.keyboard;
    var gamepad = null;

    if (this.application &&
        this.application.inputs &&
        this.application.inputs.gamepads) {

        gamepad = this.application.inputs.gamepads.get(0);
    }

    if (keyboard &&
        typeof keyboard.justPressed === "function" &&
        (
            keyboard.justPressed("ENTER") ||
            keyboard.justPressed("SPACE")
        )) {
        return true;
    }

    if (gamepad &&
        typeof gamepad.justPressed === "function" &&
        (
            gamepad.justPressed("A") ||
            gamepad.justPressed("START") ||
            gamepad.justPressed(0) ||
            gamepad.justPressed(9)
        )) {
        return true;
    }

    return false;
};

//------------------------------------------------------------------------------
// GO TO LEVEL COMPLETE
//------------------------------------------------------------------------------

/**
 * Går vidare till LevelComplete efter rätt svar.
 *
 * @return {void}
 */
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
runmysteriet.scene.GuessWord.prototype.applyWrongGuessPenalty = function() {

    this.m_earnedScore -= this.m_wrongGuessPenalty;

    if (this.m_earnedScore < 0) {
        this.m_earnedScore = 0;
    }

    this.m_totalScore = this.m_scoreBeforeLevel + this.m_earnedScore;

    if (this.m_scoreText) {
        this.m_scoreText.text = "SCORE: " + this.m_totalScore;
    }

    if (this.m_earnedScore <= 0) {
        this.saveHighscore();
        this.goToGameOver();
    }
};

//------------------------------------------------------------------------------
// GO TO GAME OVER
//------------------------------------------------------------------------------

/**
 * Går till GameOver när poängen är slut.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.goToGameOver = function() {

    this.application.scenes.load([
        new runmysteriet.scene.GameOver(
            this.m_playerName,
            this.m_totalScore
        )
    ]);
};
runmysteriet.scene.GuessWord.prototype.saveHighscore = function() {

    var entry = new runmysteriet.logic.HighscoreEntry(
        this.m_playerName,
        this.m_totalScore
    );

    var manager = new runmysteriet.logic.HighscoreManager(this.application);

    manager.save(entry);
};