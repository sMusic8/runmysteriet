runmysteriet.ui.graphic.Water = function(x, y, width, height) {

    rune.display.Graphic.call(
        this,
        x || 0,
        y || 0,
        134,
        96,
        "water"
    );
    this.width = 134;
    this.height = 96;
};

runmysteriet.ui.graphic.Water.prototype = Object.create(rune.display.Graphic.prototype);
runmysteriet.ui.graphic.Water.prototype.constructor = runmysteriet.ui.graphic.Water;


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