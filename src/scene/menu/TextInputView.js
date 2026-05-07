var runmysteriet = runmysteriet || {};
runmysteriet.scene = runmysteriet.scene || {};

runmysteriet.scene.TextInputView = function(getHelpText) {

    rune.scene.Scene.call(this);

    /**
     * Callback som returnerar text
     * (kan vara funktion eller fallback string)
     */
    this.getHelpText = getHelpText || function() {
        return "No help text provided";
    };

    this.handler = null;

    this.letterText = null;
    this.wordText = null;
    this.helpText = null;
};

runmysteriet.scene.TextInputView.prototype =
    Object.create(rune.scene.Scene.prototype);

runmysteriet.scene.TextInputView.prototype.constructor =
    runmysteriet.scene.TextInputView;


// INIT
runmysteriet.scene.TextInputView.prototype.init = function() {

    rune.scene.Scene.prototype.init.call(this);

    this.handler = new runmysteriet.ui.TextInputHandler(this.application);

    // 🔥 HÄR används callbacken
    var textValue = this.getHelpText();

    this.helpText = new rune.text.BitmapField(String(textValue));
    this.helpText.autoSize = true;
    this.helpText.x = 40;
    this.helpText.y = 40;
    this.stage.addChild(this.helpText);

    this.letterText = new rune.text.BitmapField("a");
    this.letterText.x = 100;
    this.letterText.y = 120;
    this.stage.addChild(this.letterText);

    this.wordText = new rune.text.BitmapField("");
    this.wordText.x = 100;
    this.wordText.y = 180;
    this.stage.addChild(this.wordText);
};


// UPDATE
runmysteriet.scene.TextInputView.prototype.update = function(step) {

    rune.scene.Scene.prototype.update.call(this, step);

    var data = this.handler.update(this.keyboard);
    if (!data) return;

    this.letterText.text = String(data.letter || "");
    this.wordText.text = String(this.handler.getWord() || "");
};