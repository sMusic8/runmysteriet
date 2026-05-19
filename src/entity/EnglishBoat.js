/**
 * English Boat entity.
 *
 * @constructor
 * @extends {rune.display.Graphic}
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

    // hitbox (bara för spelaren – påverkar INTE visuals)
    this.hitboxOffsetX = 10;
    this.hitboxOffsetY = 45;
    this.hitboxWidth = 80;
    this.hitboxHeight = 35;

    // ⚡ lightning
    this.m_lightnings = [];
    this.m_maxLightnings = 3;

    this.m_lightningTypes = [
        "blixt11",
        "blixt12",
        "blixt13",
        "blixt14",
        "blixt15"
    ];

    for (var i = 0; i < this.m_maxLightnings; i++) {
        this.spawnLightning();
    }
};

runmysteriet.entity.EnglishBoat.prototype =
Object.create(rune.display.Graphic.prototype);

runmysteriet.entity.EnglishBoat.prototype.constructor =
runmysteriet.entity.EnglishBoat;

// -------------------------------------------------
// SPAWN (LOKAL 0–100 KOORDINATYTA)
// -------------------------------------------------
runmysteriet.entity.EnglishBoat.prototype.spawnLightning = function() {

    var type = this.m_lightningTypes[
        Math.floor(Math.random() * this.m_lightningTypes.length)
    ];

    var l = new rune.display.Graphic(
        0,
        0,
        7,
        12,
        type
    );

    l.scaleX = 1;
    l.scaleY = 1;

    // 🔥 VIKTIG FIX: absolut låst till båtyta (0–100)
    l.x = Math.random() * (50 - 7);
    l.y = Math.random() * (70 - 12);

    this.addChildAt(l, 0);
    this.m_lightnings.push(l);
};

// -------------------------------------------------
// UPDATE (håll inne + snabb flicker)
// -------------------------------------------------
runmysteriet.entity.EnglishBoat.prototype.update = function() {

    for (var i = 0; i < this.m_lightnings.length; i++) {

        var l = this.m_lightnings[i];

        // snabb elektrisk jitter
        l.x += (Math.random() - 0.5) * 5;
        l.y += (Math.random() - 0.5) * 5;

        // clamp inom BÅTENS LOKALA 100x100
        if (l.x < 0) l.x = 0;
        if (l.x > 93) l.x = 93;

        if (l.y < 0) l.y = 0;
        if (l.y > 88) l.y = 88;
    }

    // byt ofta men inte för brutalt
    if (Math.random() < 0.18) {

        var old = this.m_lightnings.shift();

        if (old && old.parent) {
            old.parent.removeChild(old);
        }

        this.spawnLightning();
    }
};

// -------------------------------------------------
// COLLISION (oförändrad korrekt)
// -------------------------------------------------
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

// -------------------------------------------------
// TWEEN
// -------------------------------------------------
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