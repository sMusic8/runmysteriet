//------------------------------------------------------------------------------
// DISEASE
//------------------------------------------------------------------------------

/**
 * Representerar en skadlig "disease" som skadar spelaren.
 *
 * @constructor
 * @extends {rune.display.Sprite}
 * @param {number=} x
 * @param {number=} y
 * @param {string=} type
 */
runmysteriet.entity.Disease = function(x, y, type) {

    /**
     * Hämta data baserat på typ.
     *
     * @type {{texture: string, damage: number}}
     */
    var data = runmysteriet.entity.Disease.getData(type);

    rune.display.Sprite.call(
        this,
        x || 0,
        y || 0,
        15,
        15,
        data.texture
    );

    /** @type {string} */
    this.type = type || "default";

    /**
     * Skada som appliceras på spelaren vid kontakt.
     *
     * @type {number}
     */
    this.damage = data.damage;

    /**
     * Flagga för att identifiera disease-objekt.
     *
     * @type {boolean}
     */
    this.isDisease = true;

    /**
     * Om objektet är aktivt.
     *
     * @type {boolean}
     */
    this.isActive = true;

    /**
     * Ursprunglig Y-position för svävande effekt.
     *
     * @type {number}
     */
    this.baseY = this.y;

    /**
     * Intern timer för sinus-rörelse.
     *
     * @type {number}
     */
    this.m_floatTime = Math.random() * 100;

    /*
     * Varje disease-spritesheet har 4 frames.
     */
    this.animation.create("idle", [0, 1, 2, 3], 10, true);
    this.animation.gotoAndPlay("idle");
};

//------------------------------------------------------------------------------
// INHERITANCE
//------------------------------------------------------------------------------

runmysteriet.entity.Disease.prototype =
    Object.create(rune.display.Sprite.prototype);

runmysteriet.entity.Disease.prototype.constructor =
    runmysteriet.entity.Disease;

//------------------------------------------------------------------------------
// STATIC DATA
//------------------------------------------------------------------------------

/**
 * Returnerar data för en viss disease-typ.
 *
 * @param {string=} type
 * @return {{texture: string, damage: number}}
 */
runmysteriet.entity.Disease.getData = function(type) {

    if (type === "red") {
        return {
            texture: "sick2",
            damage: 50
        };
    }

    if (type === "brown") {
        return {
            texture: "sick1",
            damage: 30
        };
    }

    return {
        texture: "sick3",
        damage: 10
    };
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

/**
 * Uppdaterar disease varje frame.
 *
 * @param {number} step
 * @return {void}
 */
runmysteriet.entity.Disease.prototype.update = function(step) {

    if (this.isActive !== true) {
        return;
    }

    rune.display.Sprite.prototype.update.call(this, step);

    this.m_floatTime += 0.08;

    /*
     * Svävande rörelse:
     * rör sig upp/ner kring baseY.
     */
    this.y = this.baseY + Math.sin(this.m_floatTime) * 2;
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
runmysteriet.entity.Disease.prototype.removeDisplayObject = function(object) {

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
 * Tar bort disease från spelet.
 *
 * @return {void}
 */
runmysteriet.entity.Disease.prototype.remove = function() {

    this.isActive = false;

    this.removeDisplayObject(this);
};

//------------------------------------------------------------------------------
// DISPOSE
//------------------------------------------------------------------------------

/**
 * Rensar Disease.
 *
 * @return {void}
 */
runmysteriet.entity.Disease.prototype.dispose = function() {

    this.remove();

    this.type = null;

    this.damage = 0;

    this.isDisease = false;
    this.isActive = false;

    this.baseY = 0;
    this.m_floatTime = 0;
};