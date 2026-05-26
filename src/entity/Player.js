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

    var texture = "";

    spriteConfig = spriteConfig || {};
    texture = spriteConfig.texture || "spritesheet_freya_all";

    rune.display.Sprite.call(
        this,
        0,
        0,
        32,
        32,
        texture
    );

    /** @type {!Object} */
    this.controls = controls || {};

    /** @type {!Object} */
    this.spriteConfig = spriteConfig;

    /** @type {string} */
    this.normalTexture = texture;

    /** @type {string} */
    this.crouchTexture = spriteConfig.crouchTexture || texture;

    /** @type {string} */
    this.m_currentTexture = this.normalTexture;

    /** @type {number} */
    this.speed = 2.7;

    /** @type {number} */
    this.velocityY = 0;

    /** @type {number} */
    this.gravity = 0.5;

    /** @type {number} */
    this.jumpPower = -10;

    /** @type {boolean} */
    this.isOnGround = false;

    /** @type {number} */
    this.groundY = 0;

    /** @type {boolean} */
    this.isMoving = false;

    /** @type {boolean} */
    this.isCrouching = false;

    /** @type {boolean} */
    this.wantsToCrouch = false;

    /** @type {boolean} */
    this.isAttacking = false;

    /** @type {number} */
    this.attackAnimationTimer = 0;

    /** @type {string} */
    this.currentAnimation = "";

    /** @type {number} */
    this.direction = 1;

    /** @type {boolean} */
    this.flippedX = false;

    /** @type {number} */
    this.attackCooldown = 0;

    /** @type {number} */
    this.attackCooldownMax = 20;

    /** @type {number} */
    this.hp = 100;

    /** @type {number} */
    this.maxHp = 100;

    /** @type {?Object} */
    this.hpBar = null;

    /** @type {boolean} */
    this.isDead = false;

    /** @type {boolean} */
    this.active = true;

    /** @type {?Object} */
    this.currentPlatform = null;

    /** @type {number} */
    this.previousX = 0;

    /** @type {number} */
    this.previousY = 0;
};

//------------------------------------------------------------------------------
// INHERITANCE
//------------------------------------------------------------------------------

runmysteriet.entity.Player.prototype =
    Object.create(rune.display.Sprite.prototype);

runmysteriet.entity.Player.prototype.constructor =
    runmysteriet.entity.Player;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

/**
 * Initierar spelare.
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

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

/**
 * Uppdateringsloopen.
 *
 * @param {number} step
 * @return {void}
 */
runmysteriet.entity.Player.prototype.update = function(step) {

    rune.display.Sprite.prototype.update.call(this, step);
};

//------------------------------------------------------------------------------
// ANIMATION
//------------------------------------------------------------------------------

/**
 * Uppdaterar animationsstatus.
 *
 * @return {void}
 */
runmysteriet.entity.Player.prototype.updateAnimation = function() {

    if (this.isDead === true || this.visible === false) {
        return;
    }

    /*
     * Attack ska gå före allt annat.
     */
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

    /*
     * Krypning kommer före jump/run/idle.
     */
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

    if (!name) {
        return;
    }

    if (this.currentAnimation !== name) {
        this.animation.gotoAndPlay(name);
        this.currentAnimation = name;
    }
};

//------------------------------------------------------------------------------
// ATTACK
//------------------------------------------------------------------------------

/**
 * Kollar om spelaren kan attackera.
 *
 * @return {boolean}
 */
runmysteriet.entity.Player.prototype.canAttack = function() {

    if (this.isDead === true || this.active === false) {
        return false;
    }

    return this.attackCooldown <= 0;
};

/**
 * Startar attack cooldown.
 *
 * @return {void}
 */
runmysteriet.entity.Player.prototype.resetAttackCooldown = function() {

    this.attackCooldown = this.attackCooldownMax;
};

/**
 * Uppdaterar attack cooldown.
 *
 * @return {void}
 */
runmysteriet.entity.Player.prototype.updateAttackCooldown = function() {

    if (this.attackCooldown > 0) {
        this.attackCooldown--;
    }
};

//------------------------------------------------------------------------------
// TEXTURE
//------------------------------------------------------------------------------

/**
 * Sätter spelarens textur om den är annorlunda än nuvarande.
 *
 * @param {string} texture
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
    this.texture = texture;
};

//------------------------------------------------------------------------------
// REMOVE DISPLAY OBJECT
//------------------------------------------------------------------------------

/**
 * Tar bort display object från stage.
 *
 * @param {?Object} object
 * @return {void}
 */
runmysteriet.entity.Player.prototype.removeDisplayObject = function(object) {

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
 * Tar bort spelaren från stage.
 *
 * @return {void}
 */
runmysteriet.entity.Player.prototype.remove = function() {

    this.removeDisplayObject(this.hpBar);
    this.removeDisplayObject(this);

    this.hpBar = null;
};

//------------------------------------------------------------------------------
// DISPOSE
//------------------------------------------------------------------------------

/**
 * Rensar Player.
 *
 * @return {void}
 */
runmysteriet.entity.Player.prototype.dispose = function() {

    this.remove();

    this.controls = null;
    this.spriteConfig = null;

    this.normalTexture = "";
    this.crouchTexture = "";
    this.m_currentTexture = "";

    this.speed = 0;
    this.velocityY = 0;
    this.gravity = 0;
    this.jumpPower = 0;

    this.isOnGround = false;
    this.groundY = 0;

    this.isMoving = false;
    this.isCrouching = false;
    this.wantsToCrouch = false;

    this.isAttacking = false;
    this.attackAnimationTimer = 0;
    this.currentAnimation = "";

    this.direction = 0;
    this.flippedX = false;

    this.attackCooldown = 0;
    this.attackCooldownMax = 0;

    this.hp = 0;
    this.maxHp = 0;

    this.isDead = true;
    this.active = false;

    this.currentPlatform = null;

    this.previousX = 0;
    this.previousY = 0;
};