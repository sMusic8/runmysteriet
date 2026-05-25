//------------------------------------------------------------------------------
// PLAYER
//------------------------------------------------------------------------------

/**
 * Klass för spelare.
 *
 * @constructor
 * @extends {rune.display.Sprite}
 * @param {!Object} controls
 * @param {!Object} spriteConfig
 */
runmysteriet.entity.Player = function(controls, spriteConfig) {
//Superpanrop
    rune.display.Sprite.call(
        this,
        0,
        0,
        32,
        32,
        spriteConfig.texture
    );

    /** @type {!Object} */
    this.controls = controls;

    /** @type {!Object} */
    this.spriteConfig = spriteConfig;

    /** @type {string} */
    this.normalTexture = spriteConfig.texture;

    /** @type {string} */
    this.crouchTexture = spriteConfig.crouchTexture || spriteConfig.texture;
    
    /** @type {boolean} */
    this.isCrouching = false;
   
    /** @type {string} */
    this.m_currentTexture = this.normalTexture;

    /** @type {number} */
    this.speed = 2.7;

    /** @type {number} */
    this.velocityY = 0;

    /** @type {number} */
    this.gravity = 0.5;

    /** @type {number} */
    this.jumpPower = - 10;

    /** @type {boolean} */
    this.isOnGround = false;

    /** @type {number} */
    this.groundY = 0;

    /** @type {boolean} */
    this.isMoving = false;

    /** @type {string} */
    this.currentAnimation = " ";

    this.isMoving = false;

    this.direction = 1;
    this.attackCooldown = 0;
    this.attackCooldownMax = 20;

};

runmysteriet.entity.Player.prototype = Object.create(rune.display.Sprite.prototype);
runmysteriet.entity.Player.prototype.constructor = runmysteriet.entity.Player;

/**
 * initsiera spelare.
 *
 * @return {void}
 */
runmysteriet.entity.Player.prototype.init = function() {

    rune.display.Sprite.prototype.init.call(this);

    this.groundY = this.y;
    this.isOnGround = true;

    this.animation.create("idle", [0], 1, true);
    this.animation.create("run", [0, 1], 6, true);
    this.animation.create("jump", [1], 1, false);
    this.animation.create("attack", [2, 3, 4], 8, false);
    this.animation.create("crouch", [5, 6], 6, true);

    this.playAnimation("idle");
};

/**
 * Uppdateringsloopen.
 *
 * @param {number} step
 * @return {void}
 */
runmysteriet.entity.Player.prototype.update = function(step) {

    rune.display.Sprite.prototype.update.call(this, step);

};

/**
 * Uppdatera animationsstatus.
 *
 * @return {void}
 */
runmysteriet.entity.Player.prototype.updateAnimation = function() {

    //Attack ska gå före allt annat.
    if (this.isAttacking === true) {
        this.playAnimation("attack");

        this.attackAnimationTimer--;

        if (this.attackAnimationTimer <= 0) {
            this.attackAnimationTimer = 0;
            this.isAttacking = false;
            this.currentAnimation = "";
        }

        return;
    }

    //Krypning kommer före jump/run/idle.
    if (this.isCrouching === true) {
        this.playAnimation("crouch");
        return;
    }

    if (this.isOnGround !== true) {
        this.playAnimation("jump");
        return;
    }

    if (this.isMoving === true) {
        this.playAnimation("run");
        return;
    }

    this.playAnimation("idle");
};

/**
 * Spelar animation om den inte redan är aktiv.
 *
 * @param {string} name
 * @return {void}
 */
runmysteriet.entity.Player.prototype.playAnimation = function(name) {

    if (this.currentAnimation !== name) {
        this.animation.gotoAndPlay(name);
        this.currentAnimation = name;
    }
};

/**
 * Kollar om spelaren kan attackera.
 *
 * @return {boolean}
 */
runmysteriet.entity.Player.prototype.canAttack = function() {

    return this.attackCooldown <= 0;
};

/**
 * Startar attack cooldown.
 *
 * @return {undefined}
 */
runmysteriet.entity.Player.prototype.resetAttackCooldown = function() {

    this.attackCooldown = this.attackCooldownMax;
};

/**
 * Uppdaterar attack cooldown.
 *
 * @return {undefined}
 */
runmysteriet.entity.Player.prototype.updateAttackCooldown = function() {

    if (this.attackCooldown > 0) {
        this.attackCooldown--;
    }
};

/**
 * Sätter spelarens textur (spritesheet/animationstextur) om den är annorlunda än nuvarande.
 *Funktionen undviker onödiga texture-uppdateringar genom att jämföra mot den senast använda texturen innan den appliceras.
 *
 * @param {string} texture - Namnet på texturen som ska sättas på spelaren.
 * @return {void}
 */
runmysteriet.entity.Player.prototype.setPlayerTexture = function(texture) {

    if (!texture) {
        return;
    }

    if (this.m_currentTexture === texture) {
        return;
    }

    this.m_currentTexture = texture;

    /*
     * texture-byte via texture-egenskapen
     */
    this.texture = texture;
};