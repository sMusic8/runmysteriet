//------------------------------------------------------------------------------
// PLAYER HANDLER (RENSAD)
//------------------------------------------------------------------------------

runmysteriet.handler.PlayerHandler = function(stage, platforms, application) {

    this.stage = stage;
    this.platforms = platforms;
    this.application = application;

    this.players = [];
    this.jumpSound = this.application.sounds.sound.get("sound_jump");
};

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.handler.PlayerHandler.prototype.init = function() {

    var player1 = new runmysteriet.entity.Player(
        { left: "LEFT", right: "RIGHT", jump: "UP" },
        { texture: "spritesheet_freya_move", start: "idle" }
    );

    var player2 = new runmysteriet.entity.Player(
        { left: "A", right: "D", jump: "W" },
        { texture: "spritesheet_thor_move", start: "idle" }
    );

    player1.x = 0;
    player1.y = 188;

    player2.x = 100;
    player2.y = 188;

    this.setupPlayer(player1);
    this.setupPlayer(player2);

    player1.hpBar = this.createHpBar();
    player2.hpBar = this.createHpBar();

    this.stage.addChild(player1.hpBar);
    this.stage.addChild(player2.hpBar);

    this.players.push(player1);
    this.players.push(player2);

    for (var i = 0; i < this.players.length; i++) {
        this.stage.addChild(this.players[i]);
    }
};

//------------------------------------------------------------------------------
// SETUP PLAYER
//------------------------------------------------------------------------------

runmysteriet.handler.PlayerHandler.prototype.setupPlayer = function(player) {

    player.hp = 100;
    player.maxHp = 100;

    player.hitCooldown = 0;
    player.velocityY = 0;
    player.gravity = 0.5;
    player.isOnGround = false;
};

//------------------------------------------------------------------------------
// HP BAR
//------------------------------------------------------------------------------

runmysteriet.handler.PlayerHandler.prototype.createHpBar = function() {

    var bar = new rune.display.Sprite(0, 0, 32, 4, "hpbar");
    bar.anchorX = 0;
    bar.scaleX = 1;

    return bar;
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

runmysteriet.handler.PlayerHandler.prototype.update = function() {

    this.applyPhysics();

    for (var i = 0; i < this.players.length; i++) {

        var p = this.players[i];

        // HP BAR UPDATE
        if (p.hpBar) {

            p.hpBar.x = p.x;
            p.hpBar.y = p.y - 12;

            var hpPercent = p.hp / p.maxHp;
            if (hpPercent < 0) hpPercent = 0;

            p.hpBar.scaleX = hpPercent;
        }

        // COOLDOWN
        if (p.hitCooldown > 0) {
            p.hitCooldown--;
        }

        // INPUT
        this.handleInput(p, i);

        // ANIMATION
        p.updateAnimation();
    }
};

//------------------------------------------------------------------------------
// PHYSICS
//------------------------------------------------------------------------------

runmysteriet.handler.PlayerHandler.prototype.applyPhysics = function() {

    for (var i = 0; i < this.players.length; i++) {

        var p = this.players[i];

        p.previousY = p.y;

        p.velocityY += p.gravity;
        p.y += p.velocityY;

        p.isOnGround = false;

        for (var j = 0; j < this.platforms.length; j++) {
            this.checkPlatform(p, this.platforms[j]);
        }
    }
};

//------------------------------------------------------------------------------
// PLATFORM COLLISION
//------------------------------------------------------------------------------

runmysteriet.handler.PlayerHandler.prototype.checkPlatform = function(player, platform) {

    if (!player.hitTestObject(platform)) return false;

    var wasAbove = player.previousY + player.height <= platform.y;

    if (player.velocityY >= 0 && wasAbove) {

        player.y = platform.y - player.height;
        player.velocityY = 0;
        player.isOnGround = true;

        return true;
    }

    return false;
};

//------------------------------------------------------------------------------
// INPUT
//------------------------------------------------------------------------------

runmysteriet.handler.PlayerHandler.prototype.handleInput = function(player, gamepadID) {

    var moving = false;

    if (player.keyboard.pressed(player.controls.right)) {
        player.x += player.speed;
        moving = true;
        player.flippedX = false;
    }

    if (player.keyboard.pressed(player.controls.left)) {
        player.x -= player.speed;
        moving = true;
        player.flippedX = true;
    }

    if (player.keyboard.justPressed(player.controls.jump) && player.isOnGround) {

        player.velocityY = player.jumpPower;
        player.isOnGround = false;

        if (this.jumpSound) {
            this.jumpSound.play();
        }
    }

    player.isMoving = moving;
};