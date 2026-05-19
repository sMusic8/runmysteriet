//------------------------------------------------------------------------------
// ATTACK PARTICLE
//------------------------------------------------------------------------------

// Namespace-säker initiering (ES5-kompatibel)
runmysteriet.particle = runmysteriet.particle || {};

/**
 * @constructor
 * @extends {rune.particle.Particle}
 *
 * @classdesc
 * Visuell attack-partikel som används för attack-effekter i spelet.
 * Partikeln bleknar gradvis samtidigt som den skalar upp.
 *
 * @param {void} none - Ingen extern parameter används.
 */
runmysteriet.particle.AttackParticle = function() {

    /**
     * Anropar basklassen Particle.
     * Parametrar:
     * x, y, width, height, spriteId
     */
    rune.particle.Particle.call(
        this,
        0,   // x-position
        0,   // y-position
        16,  // bredd
        16,  // höjd
        "effect_attack" // sprite/asset-id
    );

    /**
     * Genomskinlighet (1 = helt synlig, 0 = helt osynlig)
     * @type {number}
     */
    this.alpha = 1;
};

/**
 * Inheritance setup (ES5 pattern)
 */
runmysteriet.particle.AttackParticle.prototype =
    Object.create(rune.particle.Particle.prototype);

/**
 * @override
 */
runmysteriet.particle.AttackParticle.prototype.constructor =
    runmysteriet.particle.AttackParticle;

/**
 * Uppdaterar partikelns logik varje frame.
 *
 * Effekter:
 * - Minskar alpha (fade out)
 * - Ökar scaleX och scaleY (zoom-effekt)
 *
 * @param {number} step - Tidssteg / delta time från spel-loopen.
 */
runmysteriet.particle.AttackParticle.prototype.update = function(step) {

    // Anropa basklassens update-logik
    rune.particle.Particle.prototype.update.call(this, step);

    // Fade-out effekt
    this.alpha -= 0.08;

    // Skala upp partikeln över tid
    this.scaleX += 0.03;
    this.scaleY += 0.03;

    // Säkerställ att alpha inte blir negativ
    if (this.alpha < 0) {
        this.alpha = 0;
    }
};