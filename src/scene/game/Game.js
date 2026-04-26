//------------------------------------------------------------------------------
// GAME SCENE
//------------------------------------------------------------------------------

runmysteriet.scene.Game = function() {

    rune.scene.Scene.call(this);

    this.m_players = [];
    this.m_platforms = [];

    this.m_shieldHandler = null;

    // ☁️ MOLN
    this.m_clouds = [];
};

// Inheritance
runmysteriet.scene.Game.prototype = Object.create(rune.scene.Scene.prototype);
runmysteriet.scene.Game.prototype.constructor = runmysteriet.scene.Game;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.init = function() {

    rune.scene.Scene.prototype.init.call(this);

    //------------------------------------------------------------------------------
    // ☁️ MOLN
    //------------------------------------------------------------------------------

    var cloudResources = ["moln1", "moln2", "moln3"];

    var startX = 0;
    var spacing = 160;

    for (var i = 0; i < 8; i++) {

        var randomIndex = Math.floor(Math.random() * cloudResources.length);

        var cloud = new rune.display.Graphic(
            startX + (i * spacing),
            20 + Math.random() * 70,
            100,
            60,
            cloudResources[randomIndex]
        );

        cloud.speed = 0.2 + Math.random() * 0.3;

        this.m_clouds.push(cloud);
        this.stage.addChild(cloud);
    }

    //------------------------------------------------------------------------------
    // PLAYERS
    //------------------------------------------------------------------------------

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

    this.m_players.push(player1);
    this.m_players.push(player2);

    //------------------------------------------------------------------------------
    // PLATTFORMAR
    //------------------------------------------------------------------------------

    var tileSize = 30;
    var screenWidth = this.application.screen.width;
    var groundY = 220;

    for (var x = 0; x < screenWidth; x += tileSize) {

        var platform = new runmysteriet.ui.Platform();
        platform.x = x;
        platform.y = groundY;

        this.m_platforms.push(platform);
        this.stage.addChild(platform);
    }

    //------------------------------------------------------------------------------
    // SHIELDS
    //------------------------------------------------------------------------------

    this.m_shieldHandler = new runmysteriet.handler.ShieldHandler(this.stage);
    this.m_shieldHandler.init();

    //------------------------------------------------------------------------------
    // ADD PLAYERS
    //------------------------------------------------------------------------------

    for (var i = 0; i < this.m_players.length; i++) {
        this.stage.addChild(this.m_players[i]);
    }
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.update = function(step) {

    rune.scene.Scene.prototype.update.call(this, step);

    // 1. INPUT
    for (var i = 0; i < this.m_players.length; i++) {

        var player = this.m_players[i];

        player.handleInput();
        player.previousY = player.y;
    }

    // 2. RÖRELSE
    for (var i = 0; i < this.m_players.length; i++) {

        var player = this.m_players[i];

        player.velocityY += player.gravity;
        player.y += player.velocityY;

        player.isOnGround = false;
    }

    // 3. KOLLISION
    for (var i = 0; i < this.m_players.length; i++) {

        var player = this.m_players[i];

        var onPlatform = false;

        for (var j = 0; j < this.m_platforms.length; j++) {
            if (this.checkPlatform(player, this.m_platforms[j])) {
                onPlatform = true;
            }
        }

        for (var k = 0; k < this.m_players.length; k++) {

            var other = this.m_players[k];
            if (player === other) continue;

            if (this.checkPlatform(player, other)) {
                onPlatform = true;
            }
        }

        if (player.y >= player.groundY && onPlatform === false) {
            player.y = player.groundY;
            player.velocityY = 0;
            player.isOnGround = true;
        }

        player.updateAnimation();
    }

    //------------------------------------------------------------------------------
    // SHIELDS
    //------------------------------------------------------------------------------

    if (this.m_shieldHandler) {
        this.m_shieldHandler.update(this.m_players);
    }

    //------------------------------------------------------------------------------
    // ☁️ MOLN UPDATE (FIXAD)
    //------------------------------------------------------------------------------

    for (var i = 0; i < this.m_clouds.length; i++) {

        var cloud = this.m_clouds[i];

        cloud.x += cloud.speed;

        if (cloud.x > this.application.screen.width + 150) {

            cloud.x = -150;
            cloud.y = 20 + Math.random() * 70;
        }
    }
};

//------------------------------------------------------------------------------
// PLATFORM COLLISION
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.checkPlatform = function(player, platform) {

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