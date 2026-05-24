//------------------------------------------------------------------------------
// ENGLISH BOAT ENTITY
//------------------------------------------------------------------------------

/**
 * Representerar en fiendebåt.
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

    this.width = 100;
    this.height = 100;

    this.damage = 999;

    this.startX = x || 0;
    this.startY = y || 0;

    this.waveCounter = 0;
    this.waveSpeed = 0.20;
    this.waveHeight = 3;

    this.isDangerous = false;

    this.hitboxOffsetX = 30;
    this.hitboxOffsetY = 45;
    this.hitboxWidth = 50;
    this.hitboxHeight = 35;

    this.m_lightnings = [];
    this.m_maxLightnings = 3;

    this.m_lightningTypes = [
        "blixt11",
        "blixt12",
        "blixt13",
        "blixt14",
        "blixt15"
    ];
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

runmysteriet.entity.EnglishBoat.prototype.spawnLightning = function() {

    var type = null;
    var lightning = null;

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

runmysteriet.entity.EnglishBoat.prototype.showLightning = function() {

    var i = 0;

    if (this.m_lightnings.length > 0) {
        return;
    }

    for (i = 0; i < this.m_maxLightnings; i++) {
        this.spawnLightning();
    }
};

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

//------------------------------------------------------------------------------
// RAFT CHECK
//------------------------------------------------------------------------------

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

    /*
     * Hitboxens mittpunkt måste vara ovanför raften.
     * Då kan inte båten bli farlig bara för att en liten del råkar
     * överlappa raften medan resten är över mark.
     */
    if (hitboxCenterX < raftLeft || hitboxCenterX > raftRight) {
        return false;
    }

    /*
     * Hitboxen måste ligga ovanför eller nära raftens ovansida.
     */
    if (hitboxBottom > raftTop + 20) {
        return false;
    }

    return true;
};
//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

runmysteriet.entity.EnglishBoat.prototype.update = function() {

    var i = 0;
    var lightning = null;
    var old = null;

    this.waveCounter += this.waveSpeed;
    this.y = this.startY + Math.sin(this.waveCounter) * this.waveHeight;

    if (this.isDangerous !== true) {
        return;
    }

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

    if (Math.random() < 0.18) {
        old = this.m_lightnings.shift();

        if (old && old.parent) {
            old.parent.removeChild(old);
        }

        this.spawnLightning();
    }
};

//------------------------------------------------------------------------------
// COLLISION
//------------------------------------------------------------------------------

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

//------------------------------------------------------------------------------
// TWEEN
//------------------------------------------------------------------------------

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

//------------------------------------------------------------------------------
// DISPOSE
//------------------------------------------------------------------------------

runmysteriet.entity.EnglishBoat.prototype.dispose = function() {

    this.hideLightning();

    this.m_lightningTypes = null;
};