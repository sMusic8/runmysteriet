//------------------------------------------------------------------------------
// ENGLISH BOAT ENTITY
//------------------------------------------------------------------------------

/**
 * Representerar en fiendebåt med elektriska effekter (blixtar).
 *
 * Båten:
 * - Har en egen hitbox (separerad från grafik)
 * - Skadar spelaren vid kontakt
 * - Har visuella lightning-effekter som rör sig slumpmässigt
 * - Kan tweenas fram och tillbaka över vattnet
 *
 * @constructor
 * @extends {rune.display.Graphic}
 * @param {number=} x - Startposition X
 * @param {number=} y - Startposition Y
 */
runmysteriet.entity.EnglishBoat = function(x, y) {

    // Anropa basklass (Graphic)
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

    /**
     * Skada som appliceras vid träff.
     * @type {number}
     */
    this.damage = 999;

    //--------------------------------------------------------------------------
    // HITBOX (separerad från visuell grafik)
    //--------------------------------------------------------------------------

    /**
     * Offset för hitbox (relativt båtens position).
     * @type {number}
     */
    this.hitboxOffsetX = 10;

    /** @type {number} */
    this.hitboxOffsetY = 45;

    /** @type {number} */
    this.hitboxWidth = 80;

    /** @type {number} */
    this.hitboxHeight = 35;

    //--------------------------------------------------------------------------
    // LIGHTNING SYSTEM (visuell effekt)
    //--------------------------------------------------------------------------

    /**
     * Aktiva lightning-partiklar.
     * @type {!Array<!rune.display.Graphic>}
     */
    this.m_lightnings = [];

    /**
     * Max antal lightning-effekter samtidigt.
     * @type {number}
     */
    this.m_maxLightnings = 3;

    /**
     * Möjliga lightning-texturer.
     * @type {!Array<string>}
     */
    this.m_lightningTypes = [
        "blixt11",
        "blixt12",
        "blixt13",
        "blixt14",
        "blixt15"
    ];

    // Skapa initiala lightning-effekter
    for (var i = 0; i < this.m_maxLightnings; i++) {
        this.spawnLightning();
    }
};

//------------------------------------------------------------------------------
// INHERITANCE
//------------------------------------------------------------------------------

runmysteriet.entity.EnglishBoat.prototype =
    Object.create(rune.display.Graphic.prototype);

/** @override */
runmysteriet.entity.EnglishBoat.prototype.constructor =
    runmysteriet.entity.EnglishBoat;

//------------------------------------------------------------------------------
// SPAWN LIGHTNING
//------------------------------------------------------------------------------

/**
 * Skapar en lightning-effekt inom båtens lokala koordinatsystem.
 *
 * Koordinater är låsta till båtens 100x100 yta.
 *
 * @return {void}
 */
runmysteriet.entity.EnglishBoat.prototype.spawnLightning = function() {

    // Slumpa lightning-typ
    var type = this.m_lightningTypes[
        Math.floor(Math.random() * this.m_lightningTypes.length)
    ];

    // Skapa grafik
    var l = new rune.display.Graphic(
        0,
        0,
        7,
        12,
        type
    );

    l.scaleX = 1;
    l.scaleY = 1;

    /**
     * Placera lightning inom båtens lokala area.
     * (0–100 koordinatsystem)
     */
    l.x = Math.random() * (50 - 7);
    l.y = Math.random() * (70 - 12);

    // Lägg bakom (index 0)
    this.addChildAt(l, 0);

    this.m_lightnings.push(l);
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

/**
 * Uppdaterar lightning-effekter varje frame.
 *
 * - Ger jitter (elektrisk rörelse)
 * - Clamp: håller dem inom båtens bounds
 * - Byter ut lightning ibland för variation
 *
 * @return {void}
 */
runmysteriet.entity.EnglishBoat.prototype.update = function() {

    for (var i = 0; i < this.m_lightnings.length; i++) {

        var l = this.m_lightnings[i];

        // Slumpmässig jitter (elektrisk effekt)
        l.x += (Math.random() - 0.5) * 5;
        l.y += (Math.random() - 0.5) * 5;

        // Clamp X inom 0–100
        if (l.x < 0) l.x = 0;
        if (l.x > 93) l.x = 93;

        // Clamp Y inom 0–100
        if (l.y < 0) l.y = 0;
        if (l.y > 88) l.y = 88;
    }

    /**
     * Byt ut lightning ibland för variation.
     */
    if (Math.random() < 0.18) {

        var old = this.m_lightnings.shift();

        if (old && old.parent) {
            old.parent.removeChild(old);
        }

        this.spawnLightning();
    }
};

//------------------------------------------------------------------------------
// COLLISION
//------------------------------------------------------------------------------

/**
 * Kontrollerar om båten träffar en spelare.
 *
 * Använder separat hitbox (inte sprite-bounds).
 *
 * @param {!Object} player
 * @return {boolean}
 */
runmysteriet.entity.EnglishBoat.prototype.isTouchingPlayer = function(player) {

    if (!player || player.isDead === true) return false;

    var boatX = this.x + this.hitboxOffsetX;
    var boatY = this.y + this.hitboxOffsetY;

    return (
        player.x + player.width > boatX &&
        player.x < boatX + this.hitboxWidth &&
        player.y + player.height > boatY &&
        player.y < boatY + this.hitboxHeight
    );
};

//------------------------------------------------------------------------------
// TWEEN
//------------------------------------------------------------------------------

/**
 * Startar rörelse (fram och tillbaka) för båten.
 *
 * @param {!Object} tweens - Tween-system
 * @param {number} minX - Startposition
 * @param {number} maxX - Slutposition
 * @return {void}
 */
runmysteriet.entity.EnglishBoat.prototype.startTween = function(tweens, minX, maxX) {

    if (!tweens) return;

    this.x = minX;

    tweens.create({
        target: this,
        duration: 15000,
        behavior: rune.tween.Tween.REVERSE,
        cycles: 999999,
        easing: rune.tween.Sine.easeInOut,
        args: {
            x: maxX
        }
    });
};