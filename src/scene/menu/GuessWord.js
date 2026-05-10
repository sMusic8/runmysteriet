//------------------------------------------------------------------------------
// GUESS WORD SCENE (FINAL - DATA VERSION)
//------------------------------------------------------------------------------

var runmysteriet = runmysteriet || {};
runmysteriet.scene = runmysteriet.scene || {};

runmysteriet.scene.GuessWord = function(levelNumber, earnedScore, totalScore, wordData) {

    rune.scene.Scene.call(this);

    this.application = null;

    this.m_levelNumber = levelNumber || 1;
    this.m_earnedScore = earnedScore || 0;
    this.m_totalScore = totalScore || 0;

    this.m_wordData = wordData || { word: "" };

    this.m_word = String(this.m_wordData.word || "").toLowerCase();
    this.m_inputWord = "";

    this.m_wordText = null;
    this.m_messageText = null;

    this.textInput = null;
};

runmysteriet.scene.GuessWord.prototype = Object.create(rune.scene.Scene.prototype);
runmysteriet.scene.GuessWord.prototype.constructor = runmysteriet.scene.GuessWord;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.scene.GuessWord.prototype.init = function() {

    rune.scene.Scene.prototype.init.call(this);

    this.application = this.application || this.stage.application;

    console.log("GuessWord startad");
    console.log("ORD ATT GISSA:", this.m_word);

    this.textInput = new runmysteriet.ui.TextInput(this.application);

    this.createText();
};

//------------------------------------------------------------------------------
// CREATE TEXT
//------------------------------------------------------------------------------

runmysteriet.scene.GuessWord.prototype.createText = function() {

    var center = this.application.screen.center;

    var title = new rune.text.BitmapField("GUESS THE WORD");
    title.autoSize = true;
    title.center = center;
    title.y -= 80;
    this.stage.addChild(title);

    this.m_wordText = new rune.text.BitmapField("_"); // ← viktigt (inte tom)
    this.m_wordText.autoSize = true;
    this.m_wordText.center = center;
    this.stage.addChild(this.m_wordText);

    this.m_messageText = new rune.text.BitmapField("TYPE LETTERS + ENTER");
    this.m_messageText.autoSize = true;
    this.m_messageText.center = center;
    this.m_messageText.y += 60;
    this.m_messageText.scale = 0.8;
    this.stage.addChild(this.m_messageText);
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

runmysteriet.scene.GuessWord.prototype.update = function(step) {

    rune.scene.Scene.prototype.update.call(this, step);

    var keyboard = this.application.inputs.keyboard;
    var data = this.textInput.update(keyboard);

    if (!data) return;

    // ➕ skriv
    if (data.choose) {
        this.m_inputWord += data.letter.toLowerCase();
    }

    // ⬅️ backspace
    if (data.back) {
        this.m_inputWord = this.m_inputWord.slice(0, -1);
    }

    // visa text
    if (this.m_wordText) {
        this.m_wordText.text = this.m_inputWord.length > 0
            ? this.m_inputWord.toUpperCase()
            : "_";
    }

    // ENTER
    if (data.space || data.enter) {

        console.log("GISSAT:", this.m_inputWord);
        console.log("RÄTT:", this.m_word);

        if (this.m_inputWord === this.m_word) {

            this.m_messageText.text = "RIGHT!";

            this.application.scenes.load([
                new runmysteriet.scene.LevelComplete(
                    this.m_levelNumber,
                    this.m_totalScore,
                    this.m_earnedScore
                )
            ]);

        } else {
            this.m_messageText.text = "WRONG! TRY AGAIN";
        }
    }
};