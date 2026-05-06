//------------------------------------------------------------------------------
// PLAYER HANDLER
//------------------------------------------------------------------------------

//Klassen där alla spelare i spelet hanteras.

/**
 * Handles all players in the game.
 *
 * @constructor
 * @param {!rune.display.Stage} stage
 * @param {!Object} platformHandler
 * @param {!Object} application
 */
runmysteriet.handler.PlayerHandler = function(stage, platformHandler, application) {

    /** @type {!rune.display.Stage} */
    this.stage = stage;

    /** @type {!Object} */
    this.platformHandler = platformHandler;

    /** @type {!Array<!Object>} */
    this.platforms = platformHandler.platforms;

    /** @type {!Object} */
    this.application = application;

    /** @type {!Array<!runmysteriet.entity.Player>} */
    this.players = [];

    /** @type {number} */
    this.m_avatarPlatformOffsetY = 14;

    /** @type {?Object} */
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

    player1.hp = 100;
    player1.maxHp = 100;

    player2.hp = 100;
    player2.maxHp = 100;

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

        if (!player || player.isDead === true) {
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

        if (!player || player.isDead === true) {
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
        if (!player || player.isDead === true) {
            continue;
        }

        var onPlatform = false;
        player.currentPlatform = null;  

        for (var j = 0; j < this.platforms.length; j++) {

            var platform = this.platforms[j];

            if (Math.abs(platform.x - player.x) > 350) continue;

            if (this.checkPlatform(player, platform)) {
                onPlatform = true;
            }
        }

        for (var k = 0; k < this.players.length; k++) {

            var other = this.players[k];
            if (player === other) continue;

            if (this.checkPlayerPlatform(player, other)) {
                onPlatform = true;
            }
        }

        this.checkWaterDeath(player, i);
        this.checkBoatDeath(player, i);
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

        player.currentPlatform = platform;

        return true;
    }

    return false;
};

//------------------------------------------------------------------------------
// PLAYER ON PLAYER
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

runmysteriet.handler.PlayerHandler.prototype.handleInput = function(player) {

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

    bar.animation.create("full", [0], 0, false);
    bar.animation.create("high", [1], 0, false);
    bar.animation.create("medium", [2], 0, false);
    bar.animation.create("low", [3], 0, false);

    bar.animation.gotoAndStop("full");

    bar.scaleX = 1;

    return bar;
};

//------------------------------------------------------------------------------
// PLACEMENT
//------------------------------------------------------------------------------

runmysteriet.handler.PlayerHandler.prototype.placePlayerOnPlatform = function(player, platform, offsetX) {

    if (!player || !platform) return;

    player.x = platform.x + (offsetX || 0);
    player.y = this.getStandingY(player, platform);
};

runmysteriet.handler.PlayerHandler.prototype.placePlayerOnStartPlatform = function(player, index) {

    var startPlatform = null;
    var offsetX = 0;

    if (!player) return;

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

    if (!player || !platform) return 0;

    return platform.y - player.height / 2 - this.m_avatarPlatformOffsetY;
};

//------------------------------------------------------------------------------
// DEATH CHECKS
//------------------------------------------------------------------------------

runmysteriet.handler.PlayerHandler.prototype.checkWaterDeath = function(player, index) {

    var water = null;
    

    if (!player || player.isDead === true) {
        return;
    }
    /*
     * Om spelaren är på flotten ska vatten inte kunna döda.
     */
    if (player.currentPlatform && player.currentPlatform.isRaft === true) {
        return;
}

    if (!this.platformHandler || !this.platformHandler.waterAreas) {
        return;
    }

    for (var i = 0; i < this.platformHandler.waterAreas.length; i++) {

        water = this.platformHandler.waterAreas[i];

        if (water && water.isTouchingPlayer(player)) {
            this.killPlayer(player, index);
            return;
        }
    }
};

runmysteriet.handler.PlayerHandler.prototype.checkBoatDeath = function(player, index) {

    var boat = null;

    if (!player || player.isDead === true) {
        return;
    }

    if (!this.platformHandler || !this.platformHandler.boats) {
        return;
    }

    for (var i = 0; i < this.platformHandler.boats.length; i++) {

        boat = this.platformHandler.boats[i];

        if (boat && boat.isTouchingPlayer(player)) {
            this.killPlayer(player, index);
            return;
        }
    }
};

//------------------------------------------------------------------------------
// KILL PLAYER
//------------------------------------------------------------------------------

runmysteriet.handler.PlayerHandler.prototype.killPlayer = function(player, index) {

    if (!player) {
        return;
    }

    player.isDead = true;
    player.visible = false;
    player.active = false;
    player.velocityY = 0;
    player.hp = 0;

    if (player.hpBar) {
        player.hpBar.visible = false;
    }

    console.log("Spelaren " + index + " dog");
};