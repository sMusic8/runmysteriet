
runmysteriet.ui.graphic.Ground = function(stage, x, y, width, height, texture) {
    rune.display.Sprite.call(
        this,
        x,
        y,
        width,
        height,
        texture
    );

    this.stage = stage;
};

runmysteriet.ui.graphic.Ground.prototype = Object.create(rune.display.Sprite.prototype);
runmysteriet.ui.graphic.Ground.prototype.constructor = runmysteriet.ui.graphic.Ground;

//----------init

runmysteriet.ui.graphic.Ground.prototype.init = function() {
    rune.display.Sprite.prototype.init.call(this);

    if (this.stage) {
        this.stage.addChild(this);
    }
};