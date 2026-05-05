
//------------------------------------------------------------------------------
// KRISTEN
//------------------------------------------------------------------------------

runmysteriet.entity.Kristen = function(texture) {

    rune.display.Sprite.call(
        this,
        x || 0,
        y ||0,
        32,
        40,
        texture
    );

    this.hp = 100;
    this.maxHp = 100;

    this.hitCooldown = 0;
    this.hpBar = null;
    this.isDead = false;

    // 🔥 VIKTIGT: gör Kristen STABIL (kan inte flyttas av physics)
    this.allowCollisions = rune.physics.Space.ANY;
    this.immovable = true;
};

// inheritance
runmysteriet.entity.Kristen.prototype = Object.create(rune.display.Sprite.prototype);
runmysteriet.entity.Kristen.prototype.constructor = runmysteriet.entity.Kristen;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.entity.Kristen.prototype.init = function() {

    rune.display.Sprite.prototype.init.call(this);

    this.animation.create("start", [0, 1, 2], 3, true);
    this.animation.gotoAndPlay("start");

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

runmysteriet.entity.Kristen.prototype.update = function(step) {

    if (this.isDead) return;

    rune.display.Sprite.prototype.update.call(this, step);

    if (this.hitCooldown > 0) {
        this.hitCooldown--;
    }

    // HP bar
    if (this.hpBar && this.stage && !this.hpBar.stage) {
        this.stage.addChild(this.hpBar);
    }

    // var objects = this.stage ? this.stage.getChildren() : [];

    // for (var i = 0; i < objects.length; i++) {

    //     var player = objects[i];

    //     if (!player || player === this || player.hp === undefined) continue;

    //     this.handleCollision(player);
    // }

    // HP bar follow
    if (this.hpBar) {

        this.hpBar.x = this.x;
        this.hpBar.y = this.y - 10;

        var p = this.hp / this.maxHp;
        if (p < 0) p = 0;

        this.hpBar.scaleX = p;
    }
};

//------------------------------------------------------------------------------
// COLLISION (NO PUSH BUG VERSION)
//------------------------------------------------------------------------------

runmysteriet.entity.Kristen.prototype.handleCollision = function(player) {

    if (!player) {
        return;
    }

    if (player.isDead === true) {
        return;
    }

    if (typeof player.hitTestAndSeparate !== "function") {
        return;
    }

    var hit = player.hitTestAndSeparate(this);

    if (!hit) {
        return;
    }

    if (this.hitColdown > 0) {
        return;
    }

    this.hitCooldown = 10;

    this.hp -= 1;

    if (player.hp !== undefined) {
        player.hp -= 1;
    }

    if (this.hp <= 0) {
        this.die();
    }
};

    
    // 🔥 Viktigt: bara spelaren separeras (inte Kristen)
  /*   var hit = player.hitTestAndSeparate(this);

    if (!hit) return;

    // -------------------------
    // DAMAGE
    // -------------------------
    if (this.hitCooldown === 0) {

        this.hitCooldown = 10;

        this.hp -= 1;
        player.hp -= 1;

        if (this.hp <= 0) {
            this.die();
            return;
        }
    } 
};*/

//------------------------------------------------------------------------------
// DIE
//------------------------------------------------------------------------------

runmysteriet.entity.Kristen.prototype.die = function() {

    if (this.isDead) return;

    this.isDead = true;

    console.log(" Kristen död");

    this.visible = false;
    this.active = false;

    if (this.hpBar && this.hpBar.stage) {
        this.hpBar.stage.removeChild(this.hpBar);
    }
};


runmysteriet.entity.Kristen.prototype.checkPlayerCollisions = function(players) {

    if (!players) {
        return;
    }

    for (var i = 0; i < players.length; i++) {
        this.handleCollision(players[i]);
    }
};