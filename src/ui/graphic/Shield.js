//------------------------------------------------------------------------------
// SHIELD
//------------------------------------------------------------------------------

/**
 * Shield / rune collectible.
 *
 * @constructor
 * @extends {rune.display.Graphic}
 * @param {number=} x
 * @param {number=} y
 */
runmysteriet.ui.Shield = function(x, y) {

    rune.display.Graphic.call(
        this,
        x || 0,
        y || 0,
        24,
        24,
        "shield"
    );

    /*
     * Vilken bokstav/runa denna shield representerar.
     */
    this.rune = "";

    /*
     * Index i ordet.
     */
    this.wordIndex = -1;

    /*
     * Om den redan är insamlad.
     */
    this.isCollected = false;

    /*
     * Används av handlern för att veta om objektet är aktivt.
     */
    this.active = true;

    /*
     * Identifiering.
     */
    this.isShield = true;
};

//------------------------------------------------------------------------------
// INHERITANCE
//------------------------------------------------------------------------------

runmysteriet.ui.Shield.prototype =
    Object.create(rune.display.Graphic.prototype);

runmysteriet.ui.Shield.prototype.constructor =
    runmysteriet.ui.Shield;

//------------------------------------------------------------------------------
// RUNE
//------------------------------------------------------------------------------

/**
 * Sätter vilken rune/bokstav shielden representerar.
 *
 * @param {string} rune
 * @return {void}
 */
runmysteriet.ui.Shield.prototype.setRune = function(rune) {

    this.rune = String(rune || "").toUpperCase();
};

/**
 * Hämtar runan/bokstaven.
 *
 * @return {string}
 */
runmysteriet.ui.Shield.prototype.getRune = function() {

    return this.rune;
};

//------------------------------------------------------------------------------
// COLLECT
//------------------------------------------------------------------------------

/**
 * Markerar shielden som insamlad.
 *
 * @return {void}
 */
runmysteriet.ui.Shield.prototype.collect = function() {

    this.isCollected = true;
    this.active = false;
    this.visible = false;

    this.remove();
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
runmysteriet.ui.Shield.prototype.removeDisplayObject = function(object) {

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
 * Tar bort shield från stage.
 *
 * @return {void}
 */
runmysteriet.ui.Shield.prototype.remove = function() {

    this.removeDisplayObject(this);
};

//------------------------------------------------------------------------------
// DISPOSE
//------------------------------------------------------------------------------

/**
 * Rensar Shield.
 *
 * @return {void}
 */
runmysteriet.ui.Shield.prototype.dispose = function() {

    this.remove();

    this.rune = "";
    this.wordIndex = -1;

    this.isCollected = true;
    this.active = false;
    this.isShield = false;
};