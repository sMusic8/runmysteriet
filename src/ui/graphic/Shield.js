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

    /**
     * Bokstaven som shielden representerar.
     *
     * @type {string}
     */
    this.rune = "";

    /**
     * Index i ordet.
     *
     * @type {number}
     */
    this.wordIndex = -1;

    /**
     * Om shielden redan är insamlad.
     *
     * @type {boolean}
     */
    this.isCollected = false;

    /**
     * Om shielden är aktiv.
     *
     * @type {boolean}
     */
    this.active = true;

    /**
     * Identifiering.
     *
     * @type {boolean}
     */
    this.isShield = true;

    /**
     * Stage som shielden ligger på.
     *
     * @type {?Object}
     */
    this.m_stage = null;

    /**
     * Visuell rune-sprite ovanpå shielden.
     *
     * @type {?rune.display.Graphic}
     */
    this.m_runeGraphic = null;

    /**
     * Skapar rune-sprites från Rune.js.
     *
     * @type {?runmysteriet.ui.Rune}
     */
    this.m_runeFactory = null;

    /**
     * Grundskala för pulseffekt.
     *
     * @type {number}
     */
    this.m_baseScale = 1;

    /**
     * Hastighet för pulseffekt.
     *
     * @type {number}
     */
    this.m_pulseSpeed = 0.08;

    /**
     * Räknare för pulseffekt.
     *
     * @type {number}
     */
    this.m_pulseValue = Math.random() * 10;
};

runmysteriet.ui.Shield.prototype =
    Object.create(rune.display.Graphic.prototype);

runmysteriet.ui.Shield.prototype.constructor =
    runmysteriet.ui.Shield;

/**
 * Sätter vilken bokstav shielden innehåller.
 *
 * @param {string} rune
 * @return {void}
 */
runmysteriet.ui.Shield.prototype.setRune = function(rune) {

    this.rune = String(rune || "").toUpperCase();
};

/**
 * Hämtar bokstaven shielden innehåller.
 *
 * @return {string}
 */
runmysteriet.ui.Shield.prototype.getRune = function() {

    return this.rune || "";
};

/**
 * Skapar visuell rune-grafik ovanpå shielden.
 *
 * @param {!Object} stage
 * @return {void}
 */
runmysteriet.ui.Shield.prototype.createRuneGraphic = function(stage) {

    if (!stage) {
        return;
    }

    this.m_stage = stage;

    if (this.m_runeGraphic) {
        this.updateRuneGraphicPosition();
        return;
    }

    if (
        !runmysteriet.ui ||
        typeof runmysteriet.ui.Rune !== "function"
    ) {
        return;
    }

    this.m_runeFactory = new runmysteriet.ui.Rune();
    this.m_runeFactory.makeAllRunes();

    this.m_runeGraphic = this.m_runeFactory.getOneRune();

    if (!this.m_runeGraphic) {
        return;
    }

    this.updateRuneGraphicPosition();

    // Runan läggs på stage efter shielden.
    stage.addChild(this.m_runeGraphic);
};

/**
 * Uppdaterar rune-grafikens position så den ligger centrerad på shielden.
 *
 * @return {void}
 */
runmysteriet.ui.Shield.prototype.updateRuneGraphicPosition = function() {

    var centerX = 0;
    var centerY = 0;
    var runeWidth = 0;
    var runeHeight = 0;

    var offsetX = -2;
    var offsetY = -3;

    if (!this.m_runeGraphic) {
        return;
    }

    centerX = this.x + this.width / 2;
    centerY = this.y + this.height / 2;

    runeWidth = this.m_runeGraphic.width * this.m_runeGraphic.scaleX;
    runeHeight = this.m_runeGraphic.height * this.m_runeGraphic.scaleY;

    this.m_runeGraphic.x =
        Math.round(centerX - runeWidth / 2 + offsetX);

    this.m_runeGraphic.y =
        Math.round(centerY - runeHeight / 2 + offsetY);
};

/**
 * Hämtar rune-grafiken.
 *
 * @return {?rune.display.Graphic}
 */
runmysteriet.ui.Shield.prototype.getRuneGraphic = function() {

    return this.m_runeGraphic;
};

/**
 * Uppdaterar shield-effekt och rune-position.
 *
 * @param {number=} step
 * @return {void}
 */
runmysteriet.ui.Shield.prototype.update = function(step) {

    var scale = 1;

    if (rune.display.Graphic.prototype.update) {
        rune.display.Graphic.prototype.update.call(this, step);
    }

    if (this.isCollected === true) {
        return;
    }

    if (this.visible === false) {
        return;
    }

    this.m_pulseValue += this.m_pulseSpeed;

    scale = this.m_baseScale + Math.sin(this.m_pulseValue) * 0.08;

    this.scaleX = scale;
    this.scaleY = scale;

    if (this.m_runeGraphic) {
        this.m_runeGraphic.scaleX = scale;
        this.m_runeGraphic.scaleY = scale;
    }

    this.updateRuneGraphicPosition();
};

/**
 * Markerar shielden som insamlad.
 *
 *
 * @return {void}
 */
runmysteriet.ui.Shield.prototype.collect = function() {

    this.isCollected = true;
    this.active = false;
    this.visible = false;

    this.remove();
};

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

/**
 * Tar bort shield och dess visuella rune från stage.
 *
 * @return {void}
 */
runmysteriet.ui.Shield.prototype.remove = function() {

    this.removeDisplayObject(this.m_runeGraphic);
    this.removeDisplayObject(this);
};

/**
 * Rensar Shield helt.
 *
 * @return {void}
 */
runmysteriet.ui.Shield.prototype.dispose = function() {

    this.remove();

    if (this.m_runeFactory) {
        this.m_runeFactory.dispose();
    }

    this.m_stage = null;
    this.m_runeGraphic = null;
    this.m_runeFactory = null;

    this.rune = "";
    this.wordIndex = -1;

    this.isCollected = true;
    this.active = false;
    this.isShield = false;

    this.m_baseScale = 1;
    this.m_pulseSpeed = 0;
    this.m_pulseValue = 0;
};