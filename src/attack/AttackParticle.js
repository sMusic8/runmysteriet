//------------------------------------------------------------------------------
// ATTACK PARTICLE
//------------------------------------------------------------------------------

runmysteriet.particle = runmysteriet.particle || {};

runmysteriet.particle.AttackParticle = function() {

    rune.particle.Particle.call(
        this,
        0,
        0,
        16,
        16,
        "effect_attack"
    );

    this.alpha = 1;
};

runmysteriet.particle.AttackParticle.prototype = Object.create(rune.particle.Particle.prototype);
runmysteriet.particle.AttackParticle.prototype.constructor = runmysteriet.particle.AttackParticle;

runmysteriet.particle.AttackParticle.prototype.update = function(step) {

    rune.particle.Particle.prototype.update.call(this, step);

    this.alpha -= 0.08;
    this.scaleX += 0.03;
    this.scaleY += 0.03;

    if (this.alpha < 0) {
        this.alpha = 0;
    }
};