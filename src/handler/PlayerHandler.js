//------------------------------------------------------------------------------
// PLAYER HANDLER
//------------------------------------------------------------------------------

//Klassen där alla spelare i spelet hanteras.
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

    // HP INIT
    player1.hp = 100;
    player1.maxHp = 100;

    player2.hp = 100;
    player2.maxHp = 100;

    // PHYSICS INIT
    player1.previousY = player1.y;
    player2.previousY = player2.y;

    player1.velocityY = 0;
    player2.velocityY = 0;

    player1.gravity = 0.5;
    player2.gravity = 0.5;

    player1.isOnGround = false;
    player2.isOnGround = false;

    this.players.push(player1);
    this.players.push(player2);

    // HP BARS
    player1.hpBar = this.createHpBar();
    player2.hpBar = this.createHpBar();

    this.stage.addChild(player1.hpBar);
    this.stage.addChild(player2.hpBar);

    for (var i = 0; i < this.players.length; i++) {
        this.stage.addChild(this.players[i]);
    }
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

runmysteriet.handler.PlayerHandler.prototype.update = function() {

    this.updateInput();
    this.updateMovement();
    this.updateCollisions();

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

        p.updateAnimation();
    }
};

//------------------------------------------------------------------------------
// INPUT
//------------------------------------------------------------------------------

runmysteriet.handler.PlayerHandler.prototype.updateInput = function() {

    for (var i = 0; i < this.players.length; i++) {

        var player = this.players[i];

        player.previousY = player.y;
        player.isMoving = false;

        this.handleInput(player, i);
    }
};

//------------------------------------------------------------------------------
// MOVEMENT
//------------------------------------------------------------------------------

runmysteriet.handler.PlayerHandler.prototype.updateMovement = function() {

    for (var i = 0; i < this.players.length; i++) {

        var player = this.players[i];

        player.velocityY += player.gravity;
        player.y += player.velocityY;

        player.isOnGround = false;
    }
};

//------------------------------------------------------------------------------
// COLLISIONS
//------------------------------------------------------------------------------

runmysteriet.handler.PlayerHandler.prototype.updateCollisions = function() {

    for (var i = 0; i < this.players.length; i++) {

        var player = this.players[i];

        var onPlatform = false;

        // PLATFORMER
        for (var j = 0; j < this.platforms.length; j++) {

            var platform = this.platforms[j];

            if (Math.abs(platform.x - player.x) > 350) continue;

            if (this.checkPlatform(player, platform)) {
                onPlatform = true;
            }
        }

        // PLAYER ON PLAYER (STÅ PÅ VARANDRA)
        for (var k = 0; k < this.players.length; k++) {

            var other = this.players[k];

            if (player === other) continue;

            if (this.checkPlayerPlatform(player, other)) {
                onPlatform = true;
            }
        }

        // GROUND
        if (player.y >= player.groundY && !onPlatform) {
            player.y = player.groundY;
            player.velocityY = 0;
            player.isOnGround = true;
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
// PLAYER ON PLAYER (VIKTIG DEL)
//------------------------------------------------------------------------------

runmysteriet.handler.PlayerHandler.prototype.checkPlayerPlatform = function(player, other) {

    var hitboxOffsetX = 10;
    var hitboxWidth = other.width - 20;

    var playerPreviousBottom = player.previousY + player.height;
    var otherTop = other.y;

    var otherLeft = other.x + hitboxOffsetX;
    var otherRight = other.x + hitboxOffsetX + hitboxWidth;

    var playerCenterX = player.x + player.width / 2;

    var isOverOther =
        playerCenterX >= otherLeft &&
        playerCenterX <= otherRight;

    var wasAbove = playerPreviousBottom <= otherTop;

    if (player.velocityY >= 0 && wasAbove && isOverOther) {

        player.y = otherTop - player.height;
        player.velocityY = 0;
        player.isOnGround = true;

        return true;
    }

    return false;
};

//------------------------------------------------------------------------------
// INPUT HANDLER
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

        if (this.jumpSound) this.jumpSound.play();
    }

    player.isMoving = moving;
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