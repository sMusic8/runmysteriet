/**
 * Kristen entity.
 *
 * @constructor
 * @extends {rune.display.Sprite}
 * @param {string} texture
 * @param {number=} x
 * @param {number=} y
 */
runmysteriet.entity.Kristen = function(texture, x, y) {

    rune.display.Sprite.call(
        this,
        x || 0,
        y || 0,
        32,
        40,
        texture
    );

    /** @type {number} */
    this.hp = 100;

    /** @type {number} */
    this.maxHp = 100;

    /** @type {number} */
    this.hitCooldown = 0;

    /** @type {?rune.display.Sprite} */
    this.hpBar = null;

    /** @type {boolean} */
    this.isDead = false;

    if (rune.physics && rune.physics.Space) {
    this.allowCollisions = rune.physics.Space.ANY;
}

    // physics flags (engine-specific → behöver externs)
   // this.allowCollisions = rune.physics.Space.ANY;
    this.immovable = true;
};

//------------------------------------------------------------------------------
// INHERITANCE
//------------------------------------------------------------------------------

runmysteriet.entity.Kristen.prototype = Object.create(rune.display.Sprite.prototype);
runmysteriet.entity.Kristen.prototype.constructor = runmysteriet.entity.Kristen;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

/**
 * @return {void}
 */
runmysteriet.entity.Kristen.prototype.init = function() {

    rune.display.Sprite.prototype.init.call(this);

    this.animation.create("start", [0, 1, 2], 3, true);
    this.animation.gotoAndPlay("start");

    /** @type {!rune.display.Sprite} */
    this.hpBar = new rune.display.Sprite(
        0,
        0,
        32,
        4,
        "hpbar"
    );

    this.hpBar.anchorX = 0;
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

/**
 * @param {number} step
 * @return {void}
 */
runmysteriet.entity.Kristen.prototype.update = function(step) {

    if (this.isDead) return;

    rune.display.Sprite.prototype.update.call(this, step);

    if (this.hitCooldown > 0) {
        this.hitCooldown--;
    }

    if (this.hpBar && this.stage && !this.hpBar.stage) {
        this.stage.addChild(this.hpBar);
    }

    if (this.hpBar) {

        this.hpBar.x = this.x;
        this.hpBar.y = this.y - 8;

        var p = this.hp / this.maxHp;
        if (p < 0) p = 0;

        this.hpBar.scaleX = p;
    }
};

//------------------------------------------------------------------------------
// COLLISION
//------------------------------------------------------------------------------

/**
 * @param {?Object} player
 * @return {void}
 */
runmysteriet.entity.Kristen.prototype.handleCollision = function(player) {

    if (!player || player.isDead === true) return;

    if (typeof player.hitTestAndSeparate !== "function") return;

    var hit = player.hitTestAndSeparate(this);

    if (!hit) return;

    if (this.hitCooldown > 0) return;

    this.hitCooldown = 5; //

    this.hp -= 35;// 35 är skada per träff, kan justeras

    if (player.hp !== undefined) {
        player.hp -= 1;
    }

    if (this.hp <= 0) {
        this.die();
    }
};

//------------------------------------------------------------------------------
// DIE
//------------------------------------------------------------------------------

/**
 * @return {void}
 */
runmysteriet.entity.Kristen.prototype.die = function() {

    if (this.isDead) return;

    this.isDead = true;

    console.log("Kristen död");

    this.visible = false;
    this.active = false;

    if (this.hpBar && this.hpBar.stage) {
        this.hpBar.stage.removeChild(this.hpBar);
        this.hpBar = null;
    }
};

//------------------------------------------------------------------------------
// PLAYER COLLISION LOOP
//------------------------------------------------------------------------------

/**
 * @param {!Array<!Object>} players
 * @return {void}
 */
runmysteriet.entity.Kristen.prototype.checkPlayerCollisions = function(players) {

    if (!players) return;

    for (var i = 0; i < players.length; i++) {
        this.handleCollision(players[i]);
    }
};