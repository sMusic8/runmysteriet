/**
 * @constructor
 * @extends {rune.display.Graphic}
 * @param {number=} x
 * @param {number=} y
 * @param {number=} width
 * @param {number=} height
 */
runmysteriet.ui.graphic.Water = function(x, y, width, height) {

    rune.display.Graphic.call(
        this,
        x || 0,
        y || 0,
        402,
        32,
        "havet"
    );

    /** @type {number} */
    this.width = 402;

    /** @type {number} */
    this.height = 32;
};

runmysteriet.ui.graphic.Water.prototype = Object.create(rune.display.Graphic.prototype);
runmysteriet.ui.graphic.Water.prototype.constructor = runmysteriet.ui.graphic.Water;

/**
 * Checks if player is touching water.
 * @param {?Object} player
 * @return {boolean}
 */
runmysteriet.ui.graphic.Water.prototype.isTouchingPlayer = function(player) {

    if (!player || player.isDead === true) {
        return false;
    }

    return (
        player.x + player.width > this.x &&
        player.x < this.x + this.width &&
        player.y + player.height > this.y &&
        player.y < this.y + this.height
    );
};