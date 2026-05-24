//------------------------------------------------------------------------------
// ATTACK PARTICLE
//------------------------------------------------------------------------------
/**
 * @constructor
 * @extends {rune.particle.Particle}
 *
 * @classdesc
 * 
 */
runmysteriet.particle.AttackParticle = function() {


    rune.particle.Particle.call(
        this,
        0,   // x-position
        0,   // y-position
        16,  // bredd
        16,  // höjd
        "effect_attack"
    );

    /**
     * Genomskinlighet (1 = helt synlig, 0 = helt osynlig)
     * @type {number}
     */
    this.alpha = 1;
};

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
 * @param {number} step
 */
runmysteriet.particle.AttackParticle.prototype.update = function(step) {
    rune.particle.Particle.prototype.update.call(this, step);

    // fade-out effekt
    this.alpha -= 0.08;

    // skala upp partikeln över tid
    this.scaleX += 0.03;
    this.scaleY += 0.03;

    // säkerställ att alpha inte blir negativ
    if (this.alpha < 0) {
        this.alpha = 0;
    }
};