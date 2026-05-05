//------------------------------------------------------------------------------
// KRISTEN
//------------------------------------------------------------------------------

runmysteriet.entity.Kristen = function(texture) {

    rune.display.Sprite.call(
        this,
        2025,
        0,
        32,
        40,
        texture
    );

    this.hp = 100;
    this.maxHp = 100;

    this.hitCooldown = 0;

    this.hpBar = null;

    this.isDead = false;
};

runmysteriet.entity.Kristen.prototype = Object.create(rune.display.Sprite.prototype);
runmysteriet.entity.Kristen.prototype.constructor = runmysteriet.entity.Kristen;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.entity.Kristen.prototype.init = function() {

    rune.display.Sprite.prototype.init.call(this);

    this.flippedX = true;

    this.animation.create("start", [0, 1,2], 3, true);
    this.animation.gotoAndPlay("start");

    this.hpBar = new rune.display.Sprite(
        0,
        0,
        32,
        4,
        "hpbar"
    );

    this.hpBar.scaleX = 1;
    this.hpBar.anchorX = 0;
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

runmysteriet.entity.Kristen.prototype.update = function(step, players) {

    if (this.isDead) return;

    rune.display.Sprite.prototype.update.call(this, step);

    // HP bar läggs bara till en gång
    if (this.hpBar && this.stage && !this.hpBar.stage) {
        this.stage.addChild(this.hpBar);
    }

    // cooldown
    if (this.hitCooldown > 0) {
        this.hitCooldown--;
    }

    // collision
    if (players) {
        this.checkCollision(players);
    }

    // HP bar position
    if (this.hpBar) {

        this.hpBar.x = this.x;
        this.hpBar.y = this.y - 10;

        var hpPercent = this.hp / this.maxHp;
        if (hpPercent < 0) hpPercent = 0;

        this.hpBar.scaleX = hpPercent;
    }
};

//------------------------------------------------------------------------------
// COLLISION
//------------------------------------------------------------------------------

runmysteriet.entity.Kristen.prototype.checkCollision = function(players) {

    for (var i = 0; i < players.length; i++) {

        var player = players[i];
        if (!player) continue;

        if (this.hitTestObject(player) && this.hitCooldown === 0) {

            this.hitCooldown = 10;

            // 🔥 KRISTEN TAR SKADA
            this.hp -= 1;

            // 🔥 SPELARE TAR SKADA (NU FIXEN)
            player.hp -= 1;

            // clamp
            if (this.hp < 0) this.hp = 0;
            if (player.hp < 0) player.hp = 0;

            // 🔥 DEBUG (DETTA KOMMER NU FUNKA)
            console.log("Kristen HP:", this.hp);
            console.log("Player HP:", player.hp);

            // 🔥 OM KRISTEN DÖR
            if (this.hp === 0) {
                this.die();
                return;
            }
        }
    }
};

//------------------------------------------------------------------------------
// DIE
//------------------------------------------------------------------------------

runmysteriet.entity.Kristen.prototype.die = function() {

    if (this.isDead) return;

    this.isDead = true;

    console.log("Kristen död");

    this.visible = false;
    this.active = false;

    if (this.hpBar && this.hpBar.stage) {
        this.hpBar.stage.removeChild(this.hpBar);
    }
};