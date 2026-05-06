


runmysteriet.entity.EnglishBoat = function(x, y) {

    rune.display.Graphic.call(
        this,
        x || 0,
        y || 0,
        100,
        100,
        "english_boat"
    );

    this.width = 100;
    this.height = 100;

    this.damage = 999;
};

runmysteriet.entity.EnglishBoat.prototype = Object.create(rune.display.Graphic.prototype);
runmysteriet.entity.EnglishBoat.prototype.constructor = runmysteriet.entity.EnglishBoat;

runmysteriet.entity.EnglishBoat.prototype.isTouchingPlayer = function(player) {
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