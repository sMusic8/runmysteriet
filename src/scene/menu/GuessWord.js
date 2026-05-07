var runmysteriet = runmysteriet || {};
runmysteriet.scene = runmysteriet.scene || {};

runmysteriet.scene.GuessWord = function(application) {

    this.application = application;

    // 👉 skapar input-systemet
    this.textInput = new runmysteriet.ui.TextInput(application);

    // 👉 sparar ordet som skrivs
    this.word = "";
};

runmysteriet.scene.GuessWord.prototype.init = function() {
    console.log("GuessWord startad");
};

runmysteriet.scene.GuessWord.prototype.update = function() {

    var keyboard = this.application.inputs.keyboard;

    var data = this.textInput.update(keyboard);

    if (!data) return;

    // ➕ välj bokstav
    if (data.choose) {
        this.word += data.letter;
        console.log("WORD:", this.word);
    }

    // ➖ backspace
    if (data.back) {
        this.word = this.word.slice(0, -1);
        console.log("WORD:", this.word);
    }

    // (valfritt) space = avsluta ord / logga
    if (data.space) {
        console.log("FINAL WORD:", this.word);
    }
};

runmysteriet.scene.GuessWord.prototype.shield = function (){
    this.box =  new rune.display.Graphic.call(this,
        0,
        0,
        40,
        40,
    );
    this.box.backgroundColor = "#ffffff";
   this.stage.addChild(this.box);

   this.colected = runmysteriet.handler.ShieldHandler.prototype.getCollected();
   this.text = new rune.text.BitmapField(colected);
   this.box.addChild(this.text)
}