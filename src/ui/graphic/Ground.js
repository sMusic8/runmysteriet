/**
 * @constructor
 * @extends {rune.display.Sprite}
 * @param {!Object} stage
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @param {string} texture
 */
runmysteriet.ui.graphic.Ground = function(stage, x, y, width, height, texture) {

    rune.display.Sprite.call(
        this,
        x,
        y,
        width,
        height,
        texture
    );

    /** @type {!Object} */
    this.stage = stage;

    /** @type {boolean} */
    this.solid = true;
};

runmysteriet.ui.graphic.Ground.prototype = Object.create(rune.display.Sprite.prototype);
runmysteriet.ui.graphic.Ground.prototype.constructor = runmysteriet.ui.graphic.Ground;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

/**
 * Initializes ground object.
 * @return {void}
 */
runmysteriet.ui.graphic.Ground.prototype.init = function() {

    rune.display.Sprite.prototype.init.call(this);

    if (this.stage) {
        this.stage.addChild(this);
    }

    /** @type {boolean} */
    this.autoSize = false;
};