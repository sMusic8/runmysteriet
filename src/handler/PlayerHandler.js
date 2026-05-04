//------------------------------------------------------------------------------
// PLAYER HANDLER
//------------------------------------------------------------------------------

//Klassen där alla spelare i spelet hanteras.
//Den skapar spelare, ritar dem och kollar kollisioner mellan spelaren och plattformarna.
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

//init funktion skapar players och lägger till de på spelplanen. //Här skapar vi två spelare, player1 och player2, med olika kontroller och spritesheets.
//Player1 använder piltangenterna för att röra sig, medan player2 använder WASD-tangenterna.
//Efter att spelarna har skapats och konfigurerats, läggs de till i this.players-arrayen och på scenen med this.stage.addChild.

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

//Update-funktionen hanterar input, rörelse och kollisioner för alla spelare i spelet.
//För varje spelare i this.players-arrayen, anropas updateInput(), updateMovement() och updateCollisions() för att uppdatera deras tillstånd baserat på användarens input, rörelse och kollisioner med plattformar och andra spelare.
//Genom att separera dessa funktioner i olika metoder (updateInput, updateMovement, updateCollisions) håller sig koden organiserad och lätt att underhålla.
runmysteriet.handler.PlayerHandler.prototype.update = function() {

    this.updateInput();
    this.updateMovement();
    this.updateCollisions();
};

//------------------------------------------------------------------------------
// INPUT
//------------------------------------------------------------------------------
runmysteriet.handler.PlayerHandler.prototype.updateInput = function() {

    for (var i = 0; i < this.players.length; i++) {

        var player = this.players[i]; // Hämtar den aktuella spelare
        

        player.previousY = player.y; // spelarens y position innan rörelse

        player.isMoving = false; 

        //skickar in player och index för att veta vilken gamepad som hör till vilken spelare
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

        // Plattformar
        for (var j = 0; j < this.platforms.length; j++) {

            var platform = this.platforms[j];

            if (Math.abs(platform.x - player.x) > 350) {
                continue;
            }

            if (this.checkPlatform(player, platform)) {
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
        // if (player.y >= player.groundY && onPlatform === false) {
        //     player.y = player.groundY;
        //     player.velocityY = 0;
        //     player.isOnGround = true;
        // }

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

//------------------------------------------------------------------------------
// INPUT
//------------------------------------------------------------------------------

runmysteriet.handler.PlayerHandler.prototype.handleInput = function(player, gamepadID) {

    var moving = false;
    var gamepad = this.getGamepad(gamepadID);

    //--------------------------------------------------------------------------
    // TANGENTBORD
    //--------------------------------------------------------------------------

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

    if (
        player.keyboard.justPressed(player.controls.jump) &&
        player.isOnGround === true
    ) {
        player.velocityY = player.jumpPower;
        player.isOnGround = false;

            if(this.jumpSound) {
                this.jumpSound.play();

            }
    }

    //--------------------------------------------------------------------------
    // GAMEPAD
    //--------------------------------------------------------------------------

    if (gamepad !== null && gamepad !== undefined) {

        if (gamepad.stickLeftRight) {
            player.x += player.speed;
            moving = true;
            player.flippedX = false;
        }

        if (gamepad.stickLeftLeft) {
            player.x -= player.speed;
            moving = true;
            player.flippedX = true;
        }

        if (
            typeof gamepad.justPressed === "function" &&
            gamepad.justPressed(0) &&
            player.isOnGround === true
        ) {
            player.velocityY = player.jumpPower;
            player.isOnGround = false;

            if(this.jumpSound) {
                this.jumpSound.play();}
        }
    }

    player.isMoving = moving;
};