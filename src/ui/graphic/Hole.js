/**
 * @constructor
 * @extends {rune.display.DisplayObject}
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @param {number=} fallLimitY
 */
runmysteriet.ui.graphic.Hole = function(x, y, width, height, fallLimitY) {
    rune.display.DisplayObject.call(this, x, y, width, height);

    /** @type {string} */
    this.backgroundColor = "#000000";

    /** @type {number} */
    this.fallLimitY = fallLimitY || 360;
};

runmysteriet.ui.graphic.Hole.prototype = Object.create(rune.display.DisplayObject.prototype);
runmysteriet.ui.graphic.Hole.prototype.constructor = runmysteriet.ui.graphic.Hole;

/**
 * Checks if player is horizontally inside the hole.
 * @param {?Object} player
 * @return {boolean}
 */
runmysteriet.ui.graphic.Hole.prototype.isPlayerInside = function(player) {

    if (!player) return false;

    /** @type {number} */
    var playerCenterX = player.x + player.width / 2;

    return (
        playerCenterX >= this.x &&
        playerCenterX <= this.x + this.width
    );
};

/**
 * Checks if player has fallen into the hole.
 * @param {?Object} player
 * @return {boolean}
 */
runmysteriet.ui.graphic.Hole.prototype.hasPlayerFallen = function(player) {

    /** @type {number} */
    var playerCenterX = 0;

    /** @type {number} */
    var playerBottom = 0;

    /** @type {boolean} */
    var insideHoleX = false;

    /** @type {boolean} */
    var hasDroppedIntoHole = false;

    if (!player || player.isDead === true) {
        return false;
    }

    playerCenterX = player.x + player.width / 2;
    playerBottom = player.y + player.height;

    insideHoleX =
        playerCenterX >= this.x &&
        playerCenterX <= this.x + this.width;

    hasDroppedIntoHole = playerBottom >= this.y + 20;

    return insideHoleX && hasDroppedIntoHole;
};