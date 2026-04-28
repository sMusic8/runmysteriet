//------------------------------------------------------------------------------
// PLAYER HANDLER
//------------------------------------------------------------------------------

runmysteriet.handler.PlayerHandler = function(stage, platforms, application) {

    this.stage = stage;
    this.platforms = platforms;
    this.application = application;


    this.players = [];
}; 

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.handler.PlayerHandler.prototype.init = function() {

    var player1 = new runmysteriet.entity.Player(
        {
            left: "LEFT",
            right: "RIGHT",
            jump: "UP"
        },
        {
            texture: "spritesheet_freya_move",
            start: "idle"
        }
    );

    player1.x = 0;
    player1.y = 188;

    var player2 = new runmysteriet.entity.Player(
        {
            left: "A",
            right: "D",
            jump: "W"
        },
        {
            texture: "spritesheet_thor_move",
            start: "idle"
        }
    );

    player2.x = 100;
    player2.y = 188;

    player1.previousY = player1.y;
    player2.previousY = player2.y;

    this.players.push(player1);
    this.players.push(player2);

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
};

//------------------------------------------------------------------------------
// INPUT
//------------------------------------------------------------------------------
// Här hanterar vi både tangentbord och gamepad-input
runmysteriet.handler.PlayerHandler.prototype.updateInput = function() {

    for (var i = 0; i < this.players.length; i++) {

        var player = this.players[i];
        
        //Tangentbord
        player.handleInput();

        // Gamepad
        player.previousY = player.y;

        player.handleInput();

        //skickar in player och index för att veta vilken gamepad som hör till vilken spelare
        this.handleGamepadInput(player, i);
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

        // Plattformar
        for (var j = 0; j < this.platforms.length; j++) {

            if (this.checkPlatform(player, this.platforms[j])) {
                onPlatform = true;
            }
        }

        // Spelare på spelare
        for (var k = 0; k < this.players.length; k++) {

            var other = this.players[k];

            if (player === other) {
                continue;
            }

            if (this.checkPlayerPlatform(player, other)) {
                onPlatform = true;
            }
        }

        // Mark
        if (player.y >= player.groundY && onPlatform === false) {
            player.y = player.groundY;
            player.velocityY = 0;
            player.isOnGround = true;
        }

        player.updateAnimation();
    }
};

//------------------------------------------------------------------------------
// PLATFORM COLLISION
//------------------------------------------------------------------------------

runmysteriet.handler.PlayerHandler.prototype.checkPlatform = function(player, platform) {

    if (!player.hitTestObject(platform)) {
        return false;
    }

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
// PLAYER ON PLAYER COLLISION
//------------------------------------------------------------------------------

runmysteriet.handler.PlayerHandler.prototype.checkPlayerPlatform = function(player, other) {

    var hitboxOffsetX = 10;
    var hitboxWidth = other.width - 20;

    var playerPreviousBottom = player.previousY + player.height;
    var otherTop = other.y;

    var otherLeft = other.x + hitboxOffsetX;
    var otherRight = other.x + hitboxOffsetX + hitboxWidth;

    var playerCenterX = player.x + player.width / 2;

    var isOverOther = (
        playerCenterX >= otherLeft &&
        playerCenterX <= otherRight
    );

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
// GAMEPAD INPUT
//------------------------------------------------------------------------------

runmysteriet.handler.PlayerHandler.prototype.handleGamepadInput = function(player, gamepadID) {

    var gamepad = this.getGamepad(gamepadID);

    if (gamepad === null || gamepad === undefined) {
        return;
    }

    var moving = player.isMoving === true;

    // Höger med vänster joystick
    if (gamepad.stickLeftRight) {
        player.x += player.speed;
        player.flippedX = false;
        moving = true;
    }

    // Vänster med vänster joystick
    if (gamepad.stickLeftLeft) {
        player.x -= player.speed;
        player.flippedX = true;
        moving = true;
    }

    // Hoppa med knapp 0
    // På många kontroller är knapp 0 = A / X beroende på kontroll
    if (
    typeof gamepad.justPressed === "function" &&
    gamepad.justPressed(0) &&
    player.isOnGround === true
) {
    player.velocityY = player.jumpPower;
    player.isOnGround = false;
}

    player.isMoving = moving;
};

runmysteriet.handler.PlayerHandler.prototype.getGamepad = function(gamepadID) {

    if (this.application === null || this.application === undefined) {
        return null;
    }

    if (this.application.inputs === null || this.application.inputs === undefined) {
        return null;
    }

    if (
        this.application.inputs.gamepads === null ||
        this.application.inputs.gamepads === undefined
    ) {
        return null;
    }

    return this.application.inputs.gamepads.get(gamepadID);
};