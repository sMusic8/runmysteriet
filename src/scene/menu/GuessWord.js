

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
 * @param {string=} word
 */
runmysteriet.scene.GuessWord = function(levelNumber, earnedScore, totalScore, word) {

    rune.scene.Scene.call(this);

    this.m_levelNumber = levelNumber || 1;
    this.m_earnedScore = earnedScore || 0;
    this.m_totalScore = totalScore || 0;

    /*
     * Ordet som spelaren samlade ihop med runorna.
     * Exempel: "tiger"
     */
    this.m_word = String(word || "apa").toLowerCase();

    /*
     * Vilken position i ordet som ska döljas.
     * Exempel: tiger → ti_er
     */
    this.m_missingIndex = 0;

    /*
     * Själva bokstaven som saknas.
     * Exempel: "g"
     */
    this.m_missingLetter = "";

    /*
     * Ordet som visas för spelaren med en lucka.
     * Exempel: "ti_er"
     */
    this.m_maskedWord = "";

    /*
     * TextInput används för att välja bokstav med höger/vänster + enter.
     */
    this.m_textInput = null;

    /*
     * Textobjekt på skärmen.
     */
    this.m_titleText = null;
    this.m_wordText = null;
    this.m_letterText = null;
    this.m_messageText = null;

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
    console.log("ORD ATT GISSA:", this.m_word);

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
        this.m_word = "apa";
    }

    /*
     * Väljer slumpmässig position i ordet.
     * Om ordet är "tiger" kan den välja t.ex. index 2.
     */
    this.m_missingIndex = Math.floor(Math.random() * this.m_word.length);

    /*
     * Sparar rätt bokstav.
     */
    this.m_missingLetter = this.m_word.charAt(this.m_missingIndex);

    /*
     * Bygger ordet som ska visas.
     * På den saknade positionen läggs "_" istället för bokstaven.
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

    this.m_titleText = new rune.text.BitmapField("GISSA SAKNAD BOKSTAV");
    this.m_titleText.autoSize = true;
    this.m_titleText.center = this.application.screen.center;
    this.m_titleText.y -= 70;
    this.stage.addChild(this.m_titleText);

    this.m_wordText = new rune.text.BitmapField(this.m_maskedWord.toUpperCase());
    this.m_wordText.autoSize = true;
    this.m_wordText.center = this.application.screen.center;
    this.m_wordText.y -= 25;
    this.m_wordText.scale = 1.5;
    this.stage.addChild(this.m_wordText);

    this.m_letterText = new rune.text.BitmapField("VALD BOKSTAV: A");
    this.m_letterText.autoSize = true;
    this.m_letterText.center = this.application.screen.center;
    this.m_letterText.y += 25;
    this.stage.addChild(this.m_letterText);

    this.m_messageText = new rune.text.BitmapField("HOGER/VANSTER = BYT, ENTER = GISSA");
    this.m_messageText.autoSize = true;
    this.m_messageText.center = this.application.screen.center;
    this.m_messageText.y += 65;
    this.m_messageText.scale = 0.8;
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

    rune.scene.Scene.prototype.update.call(this, step);

    var keyboard = this.keyboard;
    var data = null;
    var typedLetter = "";

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
        this.m_letterText.text = "VALD BOKSTAV: " + String(data.letter).toUpperCase();
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
            this.m_messageText.text = "RATT! TRYCK ENTER FOR ATT FORTSATTA";
        }

        return;
    }

    if (this.m_messageText) {
        this.m_messageText.text = "FEL BOKSTAV. FORSOK IGEN.";
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