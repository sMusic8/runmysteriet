//------------------------------------------------------------------------------
// HOLE (LOGIC ONLY - SAFE)
//------------------------------------------------------------------------------

/**
 * @constructor
 * @extends {rune.display.DisplayObject}
 */
runmysteriet.ui.graphic.Hole = function(x, y, width, height, fallLimitY) {

    rune.display.DisplayObject.call(this, x, y, width, height);

    this.backgroundColor = "#000000";
    this.fallLimitY = fallLimitY || 360;
};

runmysteriet.ui.graphic.Hole.prototype =
    Object.create(rune.display.DisplayObject.prototype);

runmysteriet.ui.graphic.Hole.prototype.constructor =
    runmysteriet.ui.graphic.Hole;

/**
 * Check if player is inside hole (X-axis)
 */
runmysteriet.ui.graphic.Hole.prototype.isPlayerInside = function(player) {

    if (!player) return false;

    var cx = player.x + player.width / 2;

    return cx >= this.x && cx <= this.x + this.width;
};

/**
 * Check if player fell into hole
 */
runmysteriet.ui.graphic.Hole.prototype.hasPlayerFallen = function(player) {

    if (!player || player.isDead) return false;

    var cx = player.x + player.width / 2;
    var bottom = player.y + player.height;

    return (
        cx >= this.x &&
        cx <= this.x + this.width &&
        bottom >= this.y + 20
    );
};