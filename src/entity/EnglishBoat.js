//------------------------------------------------------------------------------
// ENGLISH BOAT
//------------------------------------------------------------------------------

/**
 * Representerar en fiendebåt som kan bli elektriskt farlig för spelaren.
 *
 * Båten rör sig horisontellt och kan aktivera ett "danger state" där blixtar visas och spelaren kan dö vid kontakt.
 *
 * @constructor
 * @extends {rune.display.Graphic}
 *
 * @param {number=} x - Startposition X (default 0)
 * @param {number=} y - Startposition Y (default 0)
 */
runmysteriet.entity.EnglishBoat = function(x, y) {

    /**
     * Bas-Graphic (visual representation av båten)
     */
    rune.display.Graphic.call(
        this,
        x || 0,
        y || 0,
        100,
        100,
        "english_boat"
    );

    /**
     * @type {number} Bredd på båten
     */
    this.width = 100;

    /**
     * @type {number} Höjd på båten
     */
    this.height = 100;

    /**
     * @type {number} Skada som appliceras vid träff (instant death)
     */
    this.damage = 999;

    /**
     * @type {number} Ursprunglig X-position för rörelse/tween
     */
    this.startX = x || 0;

    /**
     * @type {number} Ursprunglig Y-position för vågrörelse
     */
    this.startY = y || 0;

    /**
     * @type {number} Intern räknare för sinusvåg
     */
    this.waveCounter = 0;

    /**
     * @type {number} Hastighet på vågrörelse
     */
    this.waveSpeed = 0.20;

    /**
     * @type {number} Höjd på vågrörelse
     */
    this.waveHeight = 3;

    /**
     * @type {boolean} Om båten är farlig och kan döda spelaren
     */
    this.isDangerous = false;

    /**
     * HITBOX som är separerad från grafik
     */

    /** @type {number} X-offset för hitbox */
    this.hitboxOffsetX = 30;

    /** @type {number} Y-offset för hitbox */
    this.hitboxOffsetY = 45;

    /** @type {number} Bredd på hitbox */
    this.hitboxWidth = 50;

    /** @type {number} Höjd på hitbox */
    this.hitboxHeight = 35;

    /**
     * @type {!Array<!rune.display.Graphic>} Lista av aktiva blixtar
     */
    this.m_lightnings = [];

    /**
     * @type {number} Max antal blixtar som kan visas samtidigt
     */
    this.m_maxLightnings = 3;

    /**
     * @type {!Array<string>} Lista av blixt-texturer
     */
    this.m_lightningTypes = [
        "blixt11",
        "blixt12",
        "blixt13",
        "blixt14",
        "blixt15"
    ];
};

runmysteriet.entity.EnglishBoat.prototype =
    Object.create(rune.display.Graphic.prototype);

runmysteriet.entity.EnglishBoat.prototype.constructor =
    runmysteriet.entity.EnglishBoat;

/**
 * Skapar en ny blixt och placerar den slumpmässigt på båten.
 *
 * Blixten är ett barn till båten.
 *
 * @return {void}
 */
runmysteriet.entity.EnglishBoat.prototype.spawnLightning = function() {

    var type = null;
    var lightning = null;

    // Välj slumpmässig blixt-textur
    type = this.m_lightningTypes[
        Math.floor(Math.random() * this.m_lightningTypes.length)
    ];

    // Skapa blixt-grafik
    lightning = new rune.display.Graphic(
        0,
        0,
        7,
        12,
        type
    );

    lightning.scaleX = 1;
    lightning.scaleY = 1;

    // Slumpmässig position inom båten
    lightning.x = Math.random() * 43;
    lightning.y = Math.random() * 58;

    // Lägg till bakom båten
    this.addChildAt(lightning, 0);

    this.m_lightnings.push(lightning);
};

/**
 * Aktiverar blixtar om inga redan finns.
 *
 * @return {void}
 */
runmysteriet.entity.EnglishBoat.prototype.showLightning = function() {

    var i = 0;

    // Undvik duplicering ab blixtar
    if (this.m_lightnings.length > 0) {
        return;
    }

    for (i = 0; i < this.m_maxLightnings; i++) {
        this.spawnLightning();
    }
};

/**
 * Tar bort alla blixtar från båten.
 *
 * @return {void}
 */
runmysteriet.entity.EnglishBoat.prototype.hideLightning = function() {

    var i = 0;
    var lightning = null;

    for (i = 0; i < this.m_lightnings.length; i++) {

        lightning = this.m_lightnings[i];

        if (!lightning) {
            continue;
        }

        if (lightning.parent) {
            lightning.parent.removeChild(lightning);
        }
    }

    this.m_lightnings = [];
};

/**
 * Sätter om båten ska vara farlig eller inte.
 *
 * @param {boolean} value
 * @return {void}
 */
runmysteriet.entity.EnglishBoat.prototype.setDangerous = function(value) {

    value = value === true;

    if (this.isDangerous === value) {
        return;
    }

    this.isDangerous = value;

    if (this.isDangerous === true) {
        this.showLightning();
    } else {
        this.hideLightning();
    }
};

/**
 * Kollar om båten är ovanför en flotte.
 *Används för att avgöra om båten ska bli farlig.
 *
 * @param {!Object} raft
 * @return {boolean}
 */
runmysteriet.entity.EnglishBoat.prototype.isAboveRaft = function(raft) {

    var hitboxLeft = 0;
    var hitboxRight = 0;
    var hitboxCenterX = 0;
    var hitboxBottom = 0;

    var raftLeft = 0;
    var raftRight = 0;
    var raftTop = 0;

    if (!raft || raft.isRaft !== true) {
        return false;
    }

    hitboxLeft = this.x + this.hitboxOffsetX;
    hitboxRight = hitboxLeft + this.hitboxWidth;
    hitboxCenterX = hitboxLeft + this.hitboxWidth / 2;
    hitboxBottom = this.y + this.hitboxOffsetY + this.hitboxHeight;

    raftLeft = raft.x;
    raftRight = raft.x + raft.width;
    raftTop = raft.y;

    // Kontrollera att mitten av båten är över flotten
    if (hitboxCenterX < raftLeft || hitboxCenterX > raftRight) {
        return false;
    }

    // Kontrollera höjd
    if (hitboxBottom > raftTop + 20) {
        return false;
    }

    return true;
};

/**
 * Uppdaterar båtens rörelse och blixt-effekter.
 *
 * @return {void}
 */
runmysteriet.entity.EnglishBoat.prototype.update = function() {

    var i = 0;
    var lightning = null;
    var old = null;

    // Vertikal vågrörelse
    this.waveCounter += this.waveSpeed;
    this.y = this.startY + Math.sin(this.waveCounter) * this.waveHeight;

    // Om inte farlig så avbryt
    if (this.isDangerous !== true) {
        return;
    }

    // Uppdatera blixtar
    for (i = 0; i < this.m_lightnings.length; i++) {

        lightning = this.m_lightnings[i];

        if (!lightning) {
            continue;
        }

        lightning.x += (Math.random() - 0.5) * 5;
        lightning.y += (Math.random() - 0.5) * 5;

        // Clamp inom båten
        if (lightning.x < 0) lightning.x = 0;
        if (lightning.x > 93) lightning.x = 93;

        if (lightning.y < 0) lightning.y = 0;
        if (lightning.y > 88) lightning.y = 88;
    }

    // Slumpmässigt byt ut blixt
    if (Math.random() < 0.18) {

        old = this.m_lightnings.shift();

        if (old && old.parent) {
            old.parent.removeChild(old);
        }

        this.spawnLightning();
    }
};

/**
 * Kollar om båten träffar spelaren.
 *Endast aktiv när båten är farlig.
 *
 * @param {!Object} player
 * @return {boolean}
 */
runmysteriet.entity.EnglishBoat.prototype.isTouchingPlayer = function(player) {

    var boatX = 0;
    var boatY = 0;

    if (!player || player.isDead === true) {
        return false;
    }

    if (this.isDangerous !== true) {
        return false;
    }

    boatX = this.x + this.hitboxOffsetX;
    boatY = this.y + this.hitboxOffsetY;

    return (
        player.x + player.width > boatX &&
        player.x < boatX + this.hitboxWidth &&
        player.y + player.height > boatY &&
        player.y < boatY + this.hitboxHeight
    );
};

/**
 * Startar horisontell rörelse mellan två punkter.
 *
 * @param {!Object} tweens
 * @param {number} minX
 * @param {number} maxX
 * @return {void}
 */
runmysteriet.entity.EnglishBoat.prototype.startTween = function(tweens, minX, maxX) {

    if (!tweens) {
        return;
    }

    this.x = minX;

    tweens.create({
        target: this,
        duration: 8000,
        behavior: rune.tween.Tween.REVERSE,
        cycles: 100,
        easing: rune.tween.Sine.easeInOut,
        args: {
            x: maxX
        }
    });
};

/**
 * Städar upp blixtar och referenser.
 *
 * @return {void}
 */
runmysteriet.entity.EnglishBoat.prototype.dispose = function() {

    this.hideLightning();

    this.m_lightningTypes = null;
};