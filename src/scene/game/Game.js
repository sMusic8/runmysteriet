//------------------------------------------------------------------------------
// GAME SCENE
//------------------------------------------------------------------------------

runmysteriet.scene.Game = function() {

    rune.scene.Scene.call(this);

    this.m_players = [];
    this.m_shields = [];
    this.m_platforms = []; 
};

// Inheritance
runmysteriet.scene.Game.prototype = Object.create(rune.scene.Scene.prototype);
runmysteriet.scene.Game.prototype.constructor = runmysteriet.scene.Game;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.init = function() {

    rune.scene.Scene.prototype.init.call(this);

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
        { left: "A", right: "D", jump: "W" },
        {
            texture: "spritesheet_thor_move",
            start: "idle"
        }
    );
    player2.x = 100;
    player2.y = 188;

    // ⭐ INIT previousY
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

    // SHIELDS
    var shield1 = new runmysteriet.ui.Shield();
    shield1.x = 150;
    shield1.y = 140;

    var shield2 = new runmysteriet.ui.Shield();
    shield2.x = 250;
    shield2.y = 140;

    this.m_shields.push(shield1);
    this.m_shields.push(shield2);

    this.stage.addChild(shield1);
    this.stage.addChild(shield2);

    // Lägg till spelare
    for (var i = 0; i < this.m_players.length; i++) {
        this.stage.addChild(this.m_players[i]);
    }
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.update = function(step) {

    rune.scene.Scene.prototype.update.call(this, step);

    // =========================
    // 1. INPUT + SPARA POSITION
    // =========================
    for (var i = 0; i < this.m_players.length; i++) {

        var player = this.m_players[i];

        player.handleInput();

        // spara gammal position
        player.previousY = player.y;
    }

    // =========================
    // 2. RÖRELSE (ALLA SAMTIDIGT)
    // =========================
    for (var i = 0; i < this.m_players.length; i++) {

        var player = this.m_players[i];

        player.velocityY += player.gravity;
        player.y += player.velocityY;

        player.isOnGround = false;
    }

    // =========================
    // 3. KOLLISION (ALLA SAMTIDIGT)
    // =========================
    for (var i = 0; i < this.m_players.length; i++) {

        var player = this.m_players[i];

        var onPlatform = false;

        // plattformar
        for (var j = 0; j < this.m_platforms.length; j++) {
            if (this.checkPlatform(player, this.m_platforms[j])) {
                onPlatform = true;
            }
        }

        // andra spelare
        for (var k = 0; k < this.m_players.length; k++) {

            var other = this.m_players[k];
            if (player === other) continue;

            if (this.checkPlatform(player, other)) {
                onPlatform = true;
            }
        }

        // mark
        if (player.y >= player.groundY && onPlatform === false) {
            player.y = player.groundY;
            player.velocityY = 0;
            player.isOnGround = true;
        }

        player.updateAnimation();
    }
};

//------------------------------------------------------------------------------
// PLATFORM COLLISION (FIXAD)
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.checkPlatform = function(player, platform) {

    if (!player.hitTestObject(platform)) return false;

    // ⭐ MÅSTE HA VARIT OVANFÖR
    var wasAbove = player.previousY + player.height <= platform.y;

    if (player.velocityY >= 0 && wasAbove) {
        player.y = platform.y - player.height;
        player.velocityY = 0;
        player.isOnGround = true;
        return true;
    }

    return false;
};