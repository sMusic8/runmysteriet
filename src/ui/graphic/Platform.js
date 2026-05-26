//------------------------------------------------------------------------------
// PLATFORM
//------------------------------------------------------------------------------

/**
 * Platform.
 *
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
        x !== undefined ? x : 200,
        y !== undefined ? y : 200,
        width || 268,
        height || 32,
        texture || "bana-gras1"
    );

    /*
     * Kollisionsyta.
     * Gör hitboxen lite smalare än grafiken så spelaren inte fastnar i kanter.
     */
    this.collisionPaddingLeft = 4;
    this.collisionPaddingRight = 4;
    this.collisionPaddingTop = 0;
};

//------------------------------------------------------------------------------
// INHERITANCE
//------------------------------------------------------------------------------

runmysteriet.ui.Platform.prototype =
    Object.create(rune.display.Graphic.prototype);

runmysteriet.ui.Platform.prototype.constructor =
    runmysteriet.ui.Platform;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

/**
 * Initializes platform.
 *
 * @return {void}
 */
runmysteriet.ui.Platform.prototype.init = function() {

    rune.display.Graphic.prototype.init.call(this);
};

//------------------------------------------------------------------------------
// COLLISION
//------------------------------------------------------------------------------

/**
 * Hämtar vänster kollisionskant.
 *
 * @return {number}
 */
runmysteriet.ui.Platform.prototype.getCollisionLeft = function() {

    return this.x + this.collisionPaddingLeft;
};

/**
 * Hämtar höger kollisionskant.
 *
 * @return {number}
 */
runmysteriet.ui.Platform.prototype.getCollisionRight = function() {

    return this.x + this.width - this.collisionPaddingRight;
};

/**
 * Hämtar övre kollisionskant.
 *
 * @return {number}
 */
runmysteriet.ui.Platform.prototype.getCollisionTop = function() {

    return this.y + this.collisionPaddingTop;
};

//------------------------------------------------------------------------------
// REMOVE DISPLAY OBJECT
//------------------------------------------------------------------------------

/**
 * Tar bort display object från stage.
 *
 * @param {?Object} object
 * @return {void}
 */
runmysteriet.ui.Platform.prototype.removeDisplayObject = function(object) {

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

//------------------------------------------------------------------------------
// REMOVE
//------------------------------------------------------------------------------

/**
 * Tar bort plattformen från stage.
 *
 * @return {void}
 */
runmysteriet.ui.Platform.prototype.remove = function() {

    this.removeDisplayObject(this);
};

//------------------------------------------------------------------------------
// DISPOSE
//------------------------------------------------------------------------------

/**
 * Rensar Platform.
 *
 * @return {void}
 */
runmysteriet.ui.Platform.prototype.dispose = function() {

    this.remove();

    this.collisionPaddingLeft = 0;
    this.collisionPaddingRight = 0;
    this.collisionPaddingTop = 0;
};