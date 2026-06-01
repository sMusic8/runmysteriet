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
        0,   //X-position
        0,   //Y-position
        16,  //Bredd
        16,  //Höjd
        "attack_effect"
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
 * Minskar alpha
 * Ökar scaleX och scaleY 
 *
 * @param {number} step
 */
runmysteriet.particle.AttackParticle.prototype.update = function(step) {
    rune.particle.Particle.prototype.update.call(this, step);

    //Fade-out effekt
    this.alpha -= 0.08;

    //Skala upp partikeln över tid
    this.scaleX += 0.03;
    this.scaleY += 0.03;

    //Säkerställer att alpha inte blir negativ
    if (this.alpha < 0) {
        this.alpha = 0;
    }
};