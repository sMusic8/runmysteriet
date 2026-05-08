/**
 * English Boat entity.
 *
 * @constructor
 * @extends {rune.display.Graphic}
 * @param {number=} x
 * @param {number=} y
 */

//avstånd mellan båten och vattnet: 32 (vattnets höjd) + 100 (båtens höjd) = 132
//ändras i water.js och segmnt_water.js
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
    /*
     * egen hitbox för båten
     * detta gör att bara själva vilden av båten dödar spelaren 
     * inte hela 100x100-rutan.
     */
    this.hitboxOffsetX = 10;
    this.hitboxOffsetY = 45;
    this.hitboxWidth = 80;
    this.hitboxHeight = 35;
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

    /*
     * båtens riktiga farliga område
     * this.x och this.y är hela bildens position.
     * offset flyttar in hitboxen till där själva båten syns.
     */
    var boatX = this.x + this.hitboxOffsetX;
    var boatY = this.y + this.hitboxOffsetY;
    var boatW = this.hitboxWidth;
    var boatH = this.hitboxHeight;

    return (
        player.x + player.width > boatX &&
        player.x < boatX + boatW &&
        player.y + player.height > boatY &&
        player.y < boatY + boatH
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
        duration: 15000,
        behavior: rune.tween.Tween.REVERSE,
        cycles: 999999,
        easing: rune.tween.Sine.easeInOut,
        args: {
            x: this.maxX
        }
    });
};