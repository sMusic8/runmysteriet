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

    /** @type {string} */
    this.rune = "";

    /** @type {number} */
    this.wordIndex = -1;

    /** @type {boolean} */
    this.isCollected = false;

    /** @type {boolean} */
    this.active = true;

    /** @type {boolean} */
    this.isShield = true;

    /** @type {?rune.text.BitmapField} */
    this.m_runeText = null;
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

    if (this.m_runeText) {
        this.m_runeText.text = this.rune || "A";
        this.updateRuneTextPosition();
    }
};

/**
 * Hämtar runan/bokstaven.
 *
 * @return {string}
 */
runmysteriet.ui.Shield.prototype.getRune = function() {

    return this.rune;
};

/**
 * Skapar texten som visar runan ovanpå shielden.
 * Texten ligger separat på stage eftersom Graphic inte ska användas
 * som container här.
 *
 * @param {!Object} stage
 * @return {void}
 */
runmysteriet.ui.Shield.prototype.createRuneText = function(stage) {

    if (!stage) {
        return;
    }

    if (!this.m_runeText) {
        this.m_runeText = new rune.text.BitmapField(this.rune || "A");
        this.m_runeText.autoSize = true;
        this.m_runeText.scale = 0.75;
        stage.addChild(this.m_runeText);
    }

    this.updateRuneTextPosition();
};

/**
 * Håller runtexten centrerad på shielden.
 *
 * @return {void}
 */
runmysteriet.ui.Shield.prototype.updateRuneTextPosition = function() {

    if (!this.m_runeText) {
        return;
    }

    this.m_runeText.visible = this.visible !== false;
    this.m_runeText.x = this.x + 8;
    this.m_runeText.y = this.y + 7;
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
 * Tar bort shieldens visuella delar från stage.
 * Behåller rune-data så ShieldHandler fortfarande kan läsa getRune
 *
 * @return {void}
 */
runmysteriet.ui.Shield.prototype.remove = function() {

    this.removeDisplayObject(this.m_runeText);
    this.m_runeText = null;

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
