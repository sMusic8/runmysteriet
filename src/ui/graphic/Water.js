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
        width || 402,
        height || 32,
        "havet"
    );

    /** @type {boolean} */
    this.isWater = true;
};

runmysteriet.ui.graphic.Water.prototype =
    Object.create(rune.display.Graphic.prototype);

runmysteriet.ui.graphic.Water.prototype.constructor =
    runmysteriet.ui.graphic.Water;

/**
 *Kollar om spelaren rör vattnet.
 *
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

/**
 * Tar bort display object från stage.
 *
 * @param {?Object} object
 * @return {void}
 */
runmysteriet.ui.graphic.Water.prototype.removeDisplayObject = function(object) {

    if (!object) {
        return;
    }

    if (object.parent) {
        object.parent.removeChild(object);
        return;
    }

    if (object.stage) {
        object.stage.removeChild(object);
    }
};

/**
 * Tar bort Water från stage.
 *
 * @return {void}
 */
runmysteriet.ui.graphic.Water.prototype.remove = function() {

    this.removeDisplayObject(this);
};

/**
 * Rensar Water.
 *
 * @return {void}
 */
runmysteriet.ui.graphic.Water.prototype.dispose = function() {

    this.remove();

    this.isWater = false;
};