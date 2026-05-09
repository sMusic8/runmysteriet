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
runmysteriet.scene.GuessWord = function(levelNumber, earnedScore, totalScore, wordData) {

    rune.scene.Scene.call(this);

    /*
     * Information från spelet.
     */
    this.m_gameInput = null;
    this.m_levelNumber = levelNumber || 1;
    this.m_earnedScore = earnedScore || 0;
    this.m_totalScore = totalScore || 0;

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
     * Vilken bokstav som saknas.
     */
    this.m_missingIndex = 0;
    this.m_missingLetter = "";
    this.m_maskedWord = "";

    /*
     * TextInput används för att välja bokstav med vänster/höger + enter.
     */
    this.m_textInput = null;

    /*
     * Textobjekt på skärmen.
     */
    this.m_titleText = null;
    this.m_wordText = null;
    this.m_letterText = null;
    this.m_hintText = null;
    this.m_scoreText = null;
    this.m_messageText = null;

    /*
     * Tips-system.
     */
    this.m_currentHintIndex = 0;
    this.m_hintCost = 20;

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
    this.m_textInput = new runmysteriet.ui.TextInput(this.application);

    this.createMissingLetter();
    this.createText();
};

//------------------------------------------------------------------------------
// CREATE MISSING LETTER
//------------------------------------------------------------------------------

/**
 * Väljer en bokstav i ordet som ska döljas.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.createMissingLetter = function() {

    var i = 0;

    if (!this.m_word || this.m_word.length <= 0) {
        this.m_word = "button";
    }

    /*
     * Slumpar vilken position i ordet som ska döljas.
     * Exempel: button → bu_ton
     */
    this.m_missingIndex = Math.floor(Math.random() * this.m_word.length);

    /*
     * Sparar rätt bokstav.
     */
    this.m_missingLetter = this.m_word.charAt(this.m_missingIndex);

    /*
     * Bygger ordet som visas på skärmen.
     * Den saknade bokstaven ersätts med "_".
     */
    this.m_maskedWord = "";

    for (i = 0; i < this.m_word.length; i++) {

        if (i === this.m_missingIndex) {
            this.m_maskedWord += "_";
        } else {
            this.m_maskedWord += this.m_word.charAt(i);
        }
    }

    console.log("MASKAT ORD:", this.m_maskedWord);
    console.log("SAKNAD BOKSTAV:", this.m_missingLetter);
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

    this.m_titleText = new rune.text.BitmapField("GUESS MISSING LETTER");
    this.m_titleText.autoSize = true;
    this.m_titleText.center = this.application.screen.center;
    this.m_titleText.y -= 85;
    this.stage.addChild(this.m_titleText);

    this.m_wordText = new rune.text.BitmapField(this.m_maskedWord.toUpperCase());
    this.m_wordText.autoSize = true;
    this.m_wordText.center = this.application.screen.center;
    this.m_wordText.y -= 40;
    this.m_wordText.scale = 1.5;
    this.stage.addChild(this.m_wordText);

    this.m_letterText = new rune.text.BitmapField("LETTER: A");
    this.m_letterText.autoSize = true;
    this.m_letterText.center = this.application.screen.center;
    this.m_letterText.y += 10;
    this.stage.addChild(this.m_letterText);

    this.m_hintText = new rune.text.BitmapField("HINT: PRESS T, COSTS 20 POINTS");
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

    this.m_messageText = new rune.text.BitmapField("LEFT/RIGHT = CHANGE, ENTER = GUESS");
    this.m_messageText.autoSize = true;
    this.m_messageText.center = this.application.screen.center;
    this.m_messageText.y += 90;
    this.m_messageText.scale = 0.7;
    this.stage.addChild(this.m_messageText);
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

    var input = this.m_gameInput.read(this.keyboard);

if (input.hint) {
    this.buyHint();
    return;
}

if (input.up) {
    this.m_alphabetSelector.previous();
    this.updateLetterBoxes();
}

if (input.down) {
    this.m_alphabetSelector.next();
    this.updateLetterBoxes();
}

if (input.choose) {
    this.checkAnswer(this.m_alphabetSelector.getLetter());
}
    var keyboard = this.keyboard;
    var data = null;
    var typedLetter = "";

    rune.scene.Scene.prototype.update.call(this, step);

    /*
     * Om spelaren redan har svarat rätt väntar vi på ENTER/SPACE
     * för att gå vidare till LevelComplete.
     */
    if (this.m_answeredCorrect === true) {

        if (this.isConfirmPressed()) {
            this.goToLevelComplete();
        }

        return;
    }

    /*
     * T köper en ledtråd.
     */
    if (keyboard &&
        typeof keyboard.justPressed === "function" &&
        keyboard.justPressed("T")) {

        this.buyHint();
        return;
    }

    if (!this.m_textInput) {
        return;
    }

    data = this.m_textInput.update(keyboard);

    if (!data) {
        return;
    }

    /*
     * Uppdaterar vald bokstav på skärmen.
     */
    if (this.m_letterText) {
        this.m_letterText.text = "LETTER: " + String(data.letter).toUpperCase();
    }

    /*
     * Alternativ 1:
     * Spelaren skriver en bokstav direkt på tangentbordet.
     */
    typedLetter = this.getTypedKeyboardLetter(keyboard);

    if (typedLetter !== "") {
        this.checkAnswer(typedLetter);
        return;
    }

    /*
     * Alternativ 2:
     * Spelaren väljer bokstav med ENTER/gamepad.
     */
    if (data.choose) {
        this.checkAnswer(data.letter);
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
// GET TYPED KEYBOARD LETTER
//------------------------------------------------------------------------------

/**
 * Kollar om spelaren tryckte på en bokstav på tangentbordet.
 *
 * @param {?Object} keyboard
 * @return {string}
 */
runmysteriet.scene.GuessWord.prototype.getTypedKeyboardLetter = function(keyboard) {

    var letters = "abcdefghijklmnopqrstuvwxyz";
    var i = 0;
    var letter = "";
    var upper = "";

    if (!keyboard || typeof keyboard.justPressed !== "function") {
        return "";
    }

    for (i = 0; i < letters.length; i++) {

        letter = letters.charAt(i);
        upper = letter.toUpperCase();

        if (keyboard.justPressed(upper)) {
            return letter;
        }
    }

    return "";
};

//------------------------------------------------------------------------------
// CHECK ANSWER
//------------------------------------------------------------------------------

/**
 * Jämför spelarens bokstav med rätt saknad bokstav.
 *
 * @param {string} letter
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.checkAnswer = function(letter) {

    letter = String(letter || "").toLowerCase();

    console.log("GISSAD BOKSTAV:", letter);
    console.log("RATT BOKSTAV:", this.m_missingLetter);

    if (letter === this.m_missingLetter.toLowerCase()) {

        this.m_answeredCorrect = true;

        if (this.m_wordText) {
            this.m_wordText.text = this.m_word.toUpperCase();
        }

        if (this.m_messageText) {
            this.m_messageText.text = "RIGHT! PRESS ENTER TO CONTINUE";
        }

        return;
    }

    if (this.m_messageText) {
        this.m_messageText.text = "WRONG LETTER. TRY AGAIN.";
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
            this.m_earnedScore
        )
    ]);
};