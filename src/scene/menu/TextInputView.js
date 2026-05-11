var runmysteriet = runmysteriet || {};
runmysteriet.scene = runmysteriet.scene || {};

runmysteriet.scene.TextInputView = function(getHelpText) {

    rune.scene.Scene.call(this);

    this.getHelpText = getHelpText || function() {
        return "No help text provided";
    };

    this.handler = null;

    this.letterText = null;
    this.wordText = null;
    this.helpText = null;

    // 🔥 NYTT
    this.startText = null;
    this.focus = 0; // 0 = bokstav, 1 = start knapp
};

runmysteriet.scene.TextInputView.prototype =
    Object.create(rune.scene.Scene.prototype);

runmysteriet.scene.TextInputView.prototype.constructor =
    runmysteriet.scene.TextInputView;


// INIT
runmysteriet.scene.TextInputView.prototype.init = function() {

    rune.scene.Scene.prototype.init.call(this);

    this.handler = new runmysteriet.ui.TextInputHandler(this.application);

    var textValue = this.getHelpText();

    this.helpText = new rune.text.BitmapField(String(textValue));
    this.helpText.autoSize = true;
    this.stage.addChild(this.helpText);

    // aktuell bokstav
    this.letterText = new rune.text.BitmapField("a");
    this.letterText.autoSize = true;
    this.letterText.x = 100;
    this.letterText.y = 120;
    this.stage.addChild(this.letterText);

    // ord
    this.wordText = new rune.text.BitmapField(" ");
    this.letterText.autoSize = true;
    this.wordText.x = 100;
    this.wordText.y = 180;
    this.stage.addChild(this.wordText);

    // 🔥 START KNAPP
    this.startText = new rune.text.BitmapField("STARTA SPEL");
    this.startText.autoSize = true;
    this.startText.x = 250; // till höger om bokstav
    this.startText.y = 120;
    this.stage.addChild(this.startText);
};


// UPDATE
runmysteriet.scene.TextInputView.prototype.update = function(step) {

    rune.scene.Scene.prototype.update.call(this, step);

    var data = this.handler.update(this.keyboard);
    if (!data) return;

    // --------------------------
    // NAVIGATION 
    // --------------------------
    if (this.keyboard.justPressed("UP")) {
        this.focus = 1;
        this.backgroundColor = "#ffffff";
    }

    if (this.keyboard.justPressed("DOWN")) {
        this.focus = 0;
        this.backgroundColor = "#ffffff";
    }

    // --------------------------
    // UI MARKERING
    // --------------------------
    if (this.focus === 0) {
        this.letterText.scale = 1.5;
        this.startText.scale = 1.0;
    } else {
        this.letterText.scale = 1.0;
        this.startText.scale = 1.5;
    }

    // --------------------------
    // UPDATE TEXT
    // --------------------------
    this.letterText.text = String(data.letter || "");
    this.wordText.text = String(this.handler.getWord() || "");

    // --------------------------
    // SELECT / ENTER
    // --------------------------
    if (this.keyboard.justPressed("SPACE") || this.keyboard.justPressed("ENTER")) {

        // om START är vald → byt scene
        if (this.focus === 1) {

            this.application.scenes.load([
                new runmysteriet.scene.Game(1, 0)
            ]);

            return;
        }

        // annars → låt handlern lägga till bokstav (det gör den redan)
    }
};