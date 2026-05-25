/**
 * @constructor
 * @extends {rune.display.Graphic}
 * @param {number=} x
 * @param {number=} y
 * @param {number=} width
 * @param {number=} height
 * @param {string=} texture
 */
runmysteriet.ui.Platform = function(x, y, width, height, texture) {

     rune.display.Graphic.call(
        this,
        (x !== undefined ? x : 200), 
        (y !== undefined ? y : 200),
        width || 268,
        height || 32,
        texture || "bana-gras1"
    );

        this.collisionPaddingLeft = 4;
        this.collisionPaddingRight = 4;
        this.collisionPaddingTop = 0;
};

//Inheritance
runmysteriet.ui.Platform.prototype = Object.create(rune.display.Graphic.prototype);
runmysteriet.ui.Platform.prototype.constructor = runmysteriet.ui.Platform;

/**
 * Initierar platformen.
 *
 * @this {runmysteriet.ui.Platform}
 * @return {void}
 */
runmysteriet.ui.Platform.prototype.init = function() {
    rune.display.Graphic.prototype.init.call(this);
};

/**
 * Returnerar vänster kant för kollisionsyta.
 *
 * @this {runmysteriet.ui.Platform}
 * @return {number} X-position för vänster kollisionsgräns.
 */
runmysteriet.ui.Platform.prototype.getCollisionLeft = function() {
    return this.x + this.collisionPaddingLeft;
};

/**
 * Returnerar höger kant för kollisionsyta.
 *
 * @this {runmysteriet.ui.Platform}
 * @return {number} X-position för höger kollisionsgräns.
 */
runmysteriet.ui.Platform.prototype.getCollisionRight = function() {
    return this.x + this.width - this.collisionPaddingRight;
};

/**
 * Returnerar övre kant för kollisionsyta.
 *
 * @this {runmysteriet.ui.Platform}
 * @return {number} Y-position för övre kollisionsgräns.
 */
runmysteriet.ui.Platform.prototype.getCollisionTop = function() {
    return this.y + this.collisionPaddingTop;
};