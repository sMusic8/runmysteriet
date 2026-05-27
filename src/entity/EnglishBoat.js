//------------------------------------------------------------------------------
// ENGLISH BOAT
//------------------------------------------------------------------------------

/**
 * Representerar en fiendebåt som kan bli farlig för spelaren.
 *
 * @constructor
 * @extends {rune.display.Graphic}
 * @param {number=} x
 * @param {number=} y
 */
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
    this.damage = 999;

    /** @type {number} */
    this.startX = x || 0;

    /** @type {number} */
    this.startY = y || 0;

    /** @type {number} */
    this.waveCounter = 0;

    /** @type {number} */
    this.waveSpeed = 0.20;

    /** @type {number} */
    this.waveHeight = 3;

    /** @type {boolean} */
    this.isDangerous = false;

    /*
     * Separat hitbox.
     */
    this.hitboxOffsetX = 30;
    this.hitboxOffsetY = 45;
    this.hitboxWidth = 50;
    this.hitboxHeight = 35;

    /** @type {!Array<!rune.display.Graphic>} */
    this.m_lightnings = [];

    /** @type {number} */
    this.m_maxLightnings = 3;

    /** @type {!Array<string>} */
    this.m_lightningTypes = [
        "blixt11",
        "blixt12",
        "blixt13",
        "blixt14",
        "blixt15"
    ];

    /** @type {boolean} */
    this.m_isDisposed = false;
};

//------------------------------------------------------------------------------
// INHERITANCE
//------------------------------------------------------------------------------

runmysteriet.entity.EnglishBoat.prototype =
    Object.create(rune.display.Graphic.prototype);

runmysteriet.entity.EnglishBoat.prototype.constructor =
    runmysteriet.entity.EnglishBoat;

//------------------------------------------------------------------------------
// LIGHTNING
//------------------------------------------------------------------------------

/**
 * Skapar en ny blixt och placerar den slumpmässigt på båten.
 *
 * @return {void}
 */
runmysteriet.entity.EnglishBoat.prototype.spawnLightning = function() {

    var type = null;
    var lightning = null;

    if (this.m_isDisposed === true) {
        return;
    }

    if (!this.m_lightningTypes || this.m_lightningTypes.length <= 0) {
        return;
    }

    type = this.m_lightningTypes[
        Math.floor(Math.random() * this.m_lightningTypes.length)
    ];

    lightning = new rune.display.Graphic(
        0,
        0,
        7,
        12,
        type
    );

    lightning.scaleX = 1;
    lightning.scaleY = 1;

    lightning.x = Math.random() * 43;
    lightning.y = Math.random() * 58;

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

    if (this.m_isDisposed === true) {
        return;
    }

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

    if (!this.m_lightnings) {
        this.m_lightnings = [];
        return;
    }

    for (i = 0; i < this.m_lightnings.length; i++) {
        lightning = this.m_lightnings[i];

        this.removeDisplayObject(lightning);
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

    if (this.m_isDisposed === true) {
        return;
    }

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

//------------------------------------------------------------------------------
// COLLISION / STATE
//------------------------------------------------------------------------------

/**
 * Kollar om båten är ovanför en flotte.
 *
 * @param {!Object} raft
 * @return {boolean}
 */
runmysteriet.entity.EnglishBoat.prototype.isAboveRaft = function(raft) {

    var hitboxLeft = 0;
    var hitboxCenterX = 0;
    var hitboxBottom = 0;

    var raftLeft = 0;
    var raftRight = 0;
    var raftTop = 0;

    if (this.m_isDisposed === true) {
        return false;
    }

    if (!raft || raft.isRaft !== true) {
        return false;
    }

    hitboxLeft = this.x + this.hitboxOffsetX;
    hitboxCenterX = hitboxLeft + this.hitboxWidth / 2;
    hitboxBottom = this.y + this.hitboxOffsetY + this.hitboxHeight;

    raftLeft = raft.x;
    raftRight = raft.x + raft.width;
    raftTop = raft.y;

    /*
     * Kontrollera att mitten av båten är över flotten.
     */
    if (hitboxCenterX < raftLeft || hitboxCenterX > raftRight) {
        return false;
    }

    /*
     * Kontrollera höjd.
     */
    if (hitboxBottom > raftTop + 20) {
        return false;
    }

    return true;
};

//------------------------------------------------------------------------------
// COALITION CONTROL
//------------------------------------------------------------------------------
/**
 * Kollar om båten är till höger om flotten och ovanför flotten.
 * Detta används bara för varning på flotten, inte för skada.
 *
 * @param {!Object} raft
 * @return {boolean}
 */
runmysteriet.entity.EnglishBoat.prototype.isWarningAboveRaft = function(raft) {

    var hitboxLeft = 0;
    var hitboxCenterX = 0;
    var hitboxBottom = 0;

    var raftCenterX = 0;
    var raftRight = 0;
    var raftTop = 0;
    var warningRightLimit = 0;

    if (this.m_isDisposed === true) {
        return false;
    }

    if (!raft || raft.isRaft !== true) {
        return false;
    }

    hitboxLeft = this.x + this.hitboxOffsetX;
    hitboxCenterX = hitboxLeft + this.hitboxWidth / 2;
    hitboxBottom = this.y + this.hitboxOffsetY + this.hitboxHeight;

    raftCenterX = raft.x + raft.width / 2;
    raftRight = raft.x + raft.width;
    raftTop = raft.y;

    /*
     * Hur långt åt höger om flotten varningen får synas.
     */
    warningRightLimit = raftRight + 90;

    /*
     * Om båten har kommit till vänster sida av flotten
     * ska DANGER försvinna direkt.
     */
    if (hitboxCenterX < raftCenterX) {
        return false;
    }

    /*
     * Om båten är för långt till höger ska DANGER inte visas ännu.
     */
    if (hitboxCenterX > warningRightLimit) {
        return false;
    }

    /*
     * Båten måste vara ovanför flotten.
     */
    if (hitboxBottom > raftTop + 20) {
        return false;
    }

    return true;
};
//------------------------------------------------------------------------------
// COLLISION
//------------------------------------------------------------------------------
/**
 * Kollar om båten träffar spelaren.
 * Endast aktiv när båten är farlig.
 *
 * @param {!Object} player
 * @return {boolean}
 */
runmysteriet.entity.EnglishBoat.prototype.isTouchingPlayer = function(player) {

    var boatX = 0;
    var boatY = 0;

    if (this.m_isDisposed === true) {
        return false;
    }

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

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

/**
 * Uppdaterar båtens rörelse och blixt-effekter.
 *
 * @return {void}
 */
runmysteriet.entity.EnglishBoat.prototype.update = function() {

    var i = 0;
    var lightning = null;
    var old = null;

    if (this.m_isDisposed === true) {
        return;
    }

    /*
     * Vertikal vågrörelse.
     */
    this.waveCounter += this.waveSpeed;
    this.y = this.startY + Math.sin(this.waveCounter) * this.waveHeight;

    if (this.isDangerous !== true) {
        return;
    }

    /*
     * Uppdatera blixtar.
     */
    for (i = 0; i < this.m_lightnings.length; i++) {
        lightning = this.m_lightnings[i];

        if (!lightning) {
            continue;
        }

        lightning.x += (Math.random() - 0.5) * 5;
        lightning.y += (Math.random() - 0.5) * 5;

        if (lightning.x < 0) {
            lightning.x = 0;
        }

        if (lightning.x > 93) {
            lightning.x = 93;
        }

        if (lightning.y < 0) {
            lightning.y = 0;
        }

        if (lightning.y > 88) {
            lightning.y = 88;
        }
    }

    /*
     * Slumpmässigt byt ut blixt.
     */
    if (Math.random() < 0.18) {
        old = this.m_lightnings.shift();

        this.removeDisplayObject(old);

        this.spawnLightning();
    }
};

//------------------------------------------------------------------------------
// TWEEN
//------------------------------------------------------------------------------

/**
 * Startar horisontell rörelse mellan två punkter.
 *
 * @param {!Object} tweens
 * @param {number} minX
 * @param {number} maxX
 * @return {void}
 */
runmysteriet.entity.EnglishBoat.prototype.startTween = function(tweens, minX, maxX) {

    if (this.m_isDisposed === true) {
        return;
    }

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

//------------------------------------------------------------------------------
// REMOVE DISPLAY OBJECT
//------------------------------------------------------------------------------

/**
 * Tar bort display object från stage/parent.
 *
 * @param {?Object} object
 * @return {void}
 */
runmysteriet.entity.EnglishBoat.prototype.removeDisplayObject = function(object) {

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
 * Tar bort båten från stage.
 *
 * @return {void}
 */
runmysteriet.entity.EnglishBoat.prototype.remove = function() {

    this.hideLightning();
    this.removeDisplayObject(this);
};

//------------------------------------------------------------------------------
// DISPOSE
//------------------------------------------------------------------------------

/**
 * Städar upp båten, blixtar och referenser.
 *
 * @return {void}
 */
runmysteriet.entity.EnglishBoat.prototype.dispose = function() {

    this.m_isDisposed = true;

    this.remove();

    this.damage = 0;

    this.startX = 0;
    this.startY = 0;

    this.waveCounter = 0;
    this.waveSpeed = 0;
    this.waveHeight = 0;

    this.isDangerous = false;

    this.hitboxOffsetX = 0;
    this.hitboxOffsetY = 0;
    this.hitboxWidth = 0;
    this.hitboxHeight = 0;

    this.m_lightnings = [];
    this.m_maxLightnings = 0;
    this.m_lightningTypes = [];
};