runmysteriet.scene.More = function() {
    rune.scene.Scene.call(this);
};

runmysteriet.scene.More.prototype = Object.create(rune.scene.Scene.prototype);
runmysteriet.scene.More.prototype.constructor = runmysteriet.scene.More;

runmysteriet.scene.More.prototype.init = function() {
    rune.scene.Scene.prototype.init.call(this);

    var text = new rune.text.BitmapField("MER OM SPELET SKIVER VI HAR");
    text.autoSize = true;
    text.center = this.application.screen.center;
    this.stage.addChild(text);
};

runmysteriet.scene.More.prototype.update = function(step) {
    rune.scene.Scene.prototype.update.call(this, step);

    if (this.keyboard.justPressed("ESCAPE") || this.keyboard.justPressed("ENTER")) {
        this.application.scenes.load([new runmysteriet.scene.Menu()]);
    }
};