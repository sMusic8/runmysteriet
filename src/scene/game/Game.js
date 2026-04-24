//------------------------------------------------------------------------------
// GAME SCENE
//------------------------------------------------------------------------------

runmysteriet.scene.Game = function() {

    rune.scene.Scene.call(this);

    this.m_players = [];
    this.m_shields = []; // 🔁 FLYTTAD hit (från global)

    this.r_bana1 = null;
    this.r_bana2 = null;
};

// Inheritance
runmysteriet.scene.Game.prototype = Object.create(rune.scene.Scene.prototype);
runmysteriet.scene.Game.prototype.constructor = runmysteriet.scene.Game;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.init = function() {

    rune.scene.Scene.prototype.init.call(this);

    //==============================================================================
    // PLAYERS (oförändrat)
    //==============================================================================

    var player1 = new runmysteriet.entity.Player(
        { left: "LEFT", right: "RIGHT", jump: "UP" },
        {
            texture: "spritesheet_freya_move",
            start: "idle",
            animations: [
                new rune.animation.Animation("idle", [0], 5, true),
                new rune.animation.Animation("run", [1,2,3,4], 10, true),
                new rune.animation.Animation("jump", [5], 1, false)
            ]
        }
    );
    player1.x = 0;
    player1.y = 180;

    var player2 = new runmysteriet.entity.Player(
        { left: "A", right: "D", jump: "W" },
        {
            texture: "spritesheet_thor_move",
            start: "idle",
            animations: [
                new rune.animation.Animation("idle", [0], 5, true),
                new rune.animation.Animation("run", [1,2,3,4], 10, true),
                new rune.animation.Animation("jump", [5], 1, false)
            ]
        }
    );
    player2.x = 100;
    player2.y = 180;

    this.m_players.push(player1);
    this.m_players.push(player2);

    //==============================================================================
    // PLATTFORMAR
    //==============================================================================

    this.r_bana1 = new runmysteriet.ui.Platform();
    this.r_bana1.x = 200;
    this.r_bana1.y = 180;

    this.r_bana2 = new runmysteriet.ui.Platform();
    this.r_bana2.x = 300;
    this.r_bana2.y = 180;

    //==============================================================================
    // 🛡️ SHIELDS (🔁 FLYTTAD IN HIT – VIKTIGT)
    //==============================================================================

    var shield1 = new runmysteriet.ui.Shield();
    shield1.x = 150;
    shield1.y = 140;

    var shield2 = new runmysteriet.ui.Shield();
    shield2.x = 250;
    shield2.y = 140;

    this.m_shields.push(shield1);
    this.m_shields.push(shield2);

    //==============================================================================
    // ADD TO STAGE
    //==============================================================================

    this.stage.addChild(this.r_bana1);
    this.stage.addChild(this.r_bana2);

    this.stage.addChild(shield1);
    this.stage.addChild(shield2);

    for (var i = 0; i < this.m_players.length; i++) {
        this.stage.addChild(this.m_players[i]);
    }
};

//------------------------------------------------------------------------------
// UPDATE (oförändrad)
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.update = function(step) {

    rune.scene.Scene.prototype.update.call(this, step);

    for (var i = 0; i < this.m_players.length; i++) {

        var player = this.m_players[i];

        player.handleInput();

        player.isOnGround = false;

        player.velocityY += player.gravity;
        player.y += player.velocityY;

        var onPlatform = false;

        if (this.checkPlatform(player, this.r_bana1)) onPlatform = true;
        if (this.checkPlatform(player, this.r_bana2)) onPlatform = true;

        if (player.y >= player.groundY && !onPlatform) {
            player.y = player.groundY;
            player.velocityY = 0;
            player.isOnGround = true;
        }
    }
};

//------------------------------------------------------------------------------
// PLATFORM COLLISION (oförändrad)
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.checkPlatform = function(player, platform) {

    if (!player.hitTestObject(platform)) return false;

    if (player.velocityY >= 0 && player.y < platform.y) {
        player.y = platform.y - player.height;
        player.velocityY = 0;
        player.isOnGround = true;
        return true;
    }

    return false;
};