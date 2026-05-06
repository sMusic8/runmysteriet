//------------------------------------------------------------------------------
// PLAYER HANDLER
//------------------------------------------------------------------------------

//Klassen där alla spelare i spelet hanteras.
runmysteriet.handler.PlayerHandler = function(stage, platforms, application) {

    this.stage = stage;
    this.platforms = platforms;
    this.application = application;

    this.players = [];
    this.m_avatarPlatformOffsetY = 10;
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

    this.placePlayerOnStartPlatform(player1, 0);
    this.placePlayerOnStartPlatform(player2, 1);

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
        if (!player || player.isDead === true){
            continue;
        }

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

        if (!player || player.isDead === true){
            continue;
        }

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

        if (!player || player.isDead === true){
            continue;
        }
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

        // GROUND - - - - låt vara bortkommenterad- - - - - - - - 
        // if (player.y >= player.groundY && !onPlatform) {
        //     player.y = player.groundY;
        //     player.velocityY = 0;
        //     player.isOnGround = true;
        //}
    }
};

//------------------------------------------------------------------------------
// PLATFORM COLLISION
//------------------------------------------------------------------------------

runmysteriet.handler.PlayerHandler.prototype.checkPlatform = function(player, platform) {

    if (!player || !platform) {
        return false;
    }

    if (!player.hitTestObject(platform)) {
        return false;
    }

    if (player.velocityY >= 0) {
        player.y = this.getStandingY(player, platform);
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

    var bar = new rune.display.Sprite(0, 0, 32, 4, "spritesheet_hpbar");

    bar.anchorX = 0;

    // Animationer (EN frame per nivå)
    bar.animation.create("full", [0], 0, false);
    bar.animation.create("high", [1], 0, false);
    bar.animation.create("medium", [2], 0, false);
    bar.animation.create("low", [3], 0, false);

    bar.animation.gotoAndStop("full");

    bar.scaleX = 1; // start full

    return bar;
};

runmysteriet.handler.PlayerHandler.prototype.placePlayerOnPlatform = function(player, platform, offsetX) {
    if (!player || !platform) {
        return;
    }

    player.x = platform.x + (offsetX || 0);
    player.y = this.getStandingY(player, platform);
};

runmysteriet.handler.PlayerHandler.prototype.placePlayerOnStartPlatform = function(player, index) {
    var startPlatform = null;
    var offsetX = 0;

    if (!player) {
        return;
    }

    if (!this.platforms || this.platforms.length === 0) {
        player.x = index * 100;
        player.y = 188 - this.m_avatarPlatformOffsetY;
        return;
    }

    startPlatform = this.platforms[0];
    offsetX = 40 + index * 60;

    this.placePlayerOnPlatform(player, startPlatform, offsetX);
};

runmysteriet.handler.PlayerHandler.prototype.getStandingY = function(player, platform) {
    if (!player || !platform) {
        return 0;
    }

    return platform.y - player.height / 2 - this.m_avatarPlatformOffsetY;
};