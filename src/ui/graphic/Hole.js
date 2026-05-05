runmysteriet.ui.graphic.Hole = function(x, y, width, height, fallLimitY) {
    rune.display.DisplayObject.call(this, x, y, width, height);

    this.backgroundColor = "#000000";
    this.fallLimitY = fallLimitY || 360;
};

runmysteriet.ui.graphic.Hole.prototype = Object.create(rune.display.DisplayObject.prototype);
runmysteriet.ui.graphic.Hole.prototype.constructor = runmysteriet.ui.graphic.Hole;

runmysteriet.ui.graphic.Hole.prototype.isPlayerInside = function(player) {
    if (!player) {
        return false;
    }

    var playerCenterX = player.x + player.width / 2;

    return (
        playerCenterX >= this.x &&
        playerCenterX <= this.x + this.width
    );
};

runmysteriet.ui.graphic.Hole.prototype.hasPlayerFallen = function(player) {
    if (!player || player.isDead === true) {
        return false;
    }

    return (
        this.isPlayerInside(player) &&
        player.y > this.fallLimitY
    );
};