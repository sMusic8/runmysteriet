//------------------------------------------------------------------------------
// GROUND
//------------------------------------------------------------------------------

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

    // Viktigt för collision-systemet
    this.solid = true;
};

runmysteriet.ui.graphic.Ground.prototype = Object.create(rune.display.Sprite.prototype);
runmysteriet.ui.graphic.Ground.prototype.constructor = runmysteriet.ui.graphic.Ground;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.ui.graphic.Ground.prototype.init = function() {

    rune.display.Sprite.prototype.init.call(this);

    if (this.stage) {
        this.stage.addChild(this);
    }

    // 🔧 säkerställ korrekt hitbox (ibland behövs i Rune)
    this.autoSize = false;
};