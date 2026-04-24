//------------------------------------------------------------------------------
// GAME SCENE
//------------------------------------------------------------------------------

runmysteriet.scene.Game = function() {

    rune.scene.Scene.call(this);

    this.m_players = [];
    this.m_shields = []; //  FLYTTAD hit (från global)
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

        //  Kontroller
        {
            left: "LEFT",
            right: "RIGHT",
            jump: "UP"
        },

        // SPRITE CONFIG
        {
            texture: "spritesheet_freya_move", // ← NAMNET från din asset-loader

            start: "idle"
        }
    );
    player1.x = 0;
    player1.y = 188;

    var player2 = new runmysteriet.entity.Player(
        { left: "A", right: "D", jump: "W" },
        {
            texture: "spritesheet_thor_move", // 🔥 ← ANDRA bilden

            start: "idle"
        }
    );
    player2.x = 100;
    player2.y = 188;

    this.m_players.push(player1);
    this.m_players.push(player2);

//------------------------------------------------------------------------------
// PLATTFORMAR ÖVER HELA FÖNSTRET
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
    //==============================================================================
    //  SHIELDS (FLYTTAD IN HIT – VIKTIGT)
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

    this.stage.addChild(shield1);
    this.stage.addChild(shield2);

    
//Lägger till spelare till stage
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

        // 1. Hantera input först
        player.handleInput();

        // 2. Lägg på gravitation
        player.velocityY += player.gravity;
        player.y += player.velocityY;

        // 3. Anta att spelaren inte står på något
        player.isOnGround = false;

        // 4. Kolla plattformar
        var onPlatform = false;

        for (var j = 0; j < this.m_platforms.length; j++) {
            if (this.checkPlatform(player, this.m_platforms[j])) {
                onPlatform = true;
    }

}

        // 5. Kolla marken
        if (player.y >= player.groundY && onPlatform === false) {
            player.y = player.groundY;
            player.velocityY = 0;
            player.isOnGround = true;
        }

        // 6. Animation sist
        player.updateAnimation();
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