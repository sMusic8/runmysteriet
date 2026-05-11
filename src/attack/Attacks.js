//------------------------------------------------------------------------------
// Constructor scope
//------------------------------------------------------------------------------

/**
 * Attack hitbox.
 *
 * @constructor
 * @extends rune.display.Graphic
 *
 * @param {!runmysteriet.entity.Player} player
 */
runmysteriet.attack.Attack = function(player) {

    var width = 32; 
    var height = 32;
    var x = 0;
    var y = 0;

    if (player.direction === -1) {
        x = player.x - width;
    } else {
        x = player.x + player.width;
    }

    y = player.y + 8;

    rune.display.Graphic.call(
        this,
        x,
        y,
        width,
        height,
        "attack_effect"
    );

    /**
     * Spelaren som skapade attacken.
     *
     * @type {!runmysteriet.entity.Player}
     */
    this.owner = player;

    /**
     * Skada attacken gör.
     *
     * @type {number}
     */
    this.damage = 25;

    /**
     * Hur länge attacken syns.
     *
     * @type {number}
     */
    this.life = 8;

    /**
     * Hindrar attacken från att träffa flera gånger.
     *
     * @type {boolean}
     */
    this.hasHit = false;
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

runmysteriet.attack.Attack.prototype = Object.create(rune.display.Graphic.prototype);
runmysteriet.attack.Attack.prototype.constructor = runmysteriet.attack.Attack;

//------------------------------------------------------------------------------
// Public prototype methods
//------------------------------------------------------------------------------

/**
 * Uppdaterar attacken.
 *
 * @param {number} step
 * @return {undefined}
 */
runmysteriet.attack.Attack.prototype.update = function(step) {

    rune.display.Graphic.prototype.update.call(this, step);

    this.life--;

    if (this.life <= 0) {
        this.remove();
    }
};

/**
 * Tar bort attacken från scenen.
 *
 * @return {undefined}
 */
runmysteriet.attack.Attack.prototype.remove = function() {

    if (this.parent) {
        this.parent.removeChild(this);
    }
};