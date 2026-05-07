var runmysteriet = runmysteriet || {};
runmysteriet.scene = runmysteriet.scene || {};

runmysteriet.scene.TextInputView = function() {

    rune.scene.Scene.call(this);

    this.handler = null;

    this.letterText = null;
    this.wordText = null;
};

runmysteriet.scene.TextInputView.prototype =
    Object.create(rune.scene.Scene.prototype);

runmysteriet.scene.TextInputView.prototype.constructor =
    runmysteriet.scene.TextInputView;

// INIT
runmysteriet.scene.TextInputView.prototype.init = function() {

    rune.scene.Scene.prototype.init.call(this);

    this.handler = new runmysteriet.ui.TextInputHandler(this.application);

    this.letterText = new rune.text.BitmapField("");
    this.letterText.x = 100;
    this.letterText.y = 100;
    this.stage.addChild(this.letterText);

    this.wordText = new rune.text.BitmapField("");
    this.wordText.x = 100;
    this.wordText.y = 140;
    this.stage.addChild(this.wordText);
};

// UPDATE
runmysteriet.scene.TextInputView.prototype.update = function(step) {

    rune.scene.Scene.prototype.update.call(this, step);

    var data = this.handler.update(this.keyboard);

    if (!data) return;

    // aktuell bokstav
    this.letterText.text = String(data.letter);

    // hela ordet
    this.wordText.text = String(this.handler.getWord());
};