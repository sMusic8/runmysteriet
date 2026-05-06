/**
 * English Boat entity.
 *
 * @constructor
 * @extends {rune.display.Graphic}
 * @param {number=} x
 * @param {number=} y
 */
runmysteriet.entity.EnglishBoat = function(x, y) {

    rune.display.Graphic.call(
        this,
        x || 0,
        y || 0,
        100,
        100,
        "english_boat"
    );

    /** @type {number} */
    this.width = 100;

    /** @type {number} */
    this.height = 100;

    /** @type {number} */
    this.damage = 999;
};

//------------------------------------------------------------------------------
// INHERITANCE
//------------------------------------------------------------------------------

runmysteriet.entity.EnglishBoat.prototype = Object.create(rune.display.Graphic.prototype);
runmysteriet.entity.EnglishBoat.prototype.constructor = runmysteriet.entity.EnglishBoat;

//------------------------------------------------------------------------------
// COLLISION
//------------------------------------------------------------------------------

/**
 * Checks collision with player.
 *
 * @param {?Object} player
 * @return {boolean}
 */
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

runmysteriet.entity.EnglishBoat.prototype.startTween = function(tweens, minX, maxX) {
    if (!tweens) {
        console.log("No tweens object for EnglishBoat");
        return;
    }

    this.minX = minX;
    this.maxX = maxX;

    this.x = this.minX;

    console.log("Starting boat tween:", this.minX, this.maxX);

    this.m_tween = tweens.create({
        target: this,
        duration: 2500,
        behavior: rune.tween.Tween.REVERSE,
        cycles: 999999,
        easing: rune.tween.Sine.easeInOut,
        args: {
            x: this.maxX
        }
    });
};