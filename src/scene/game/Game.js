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
    // HÄR SÄTTER DU DINA BILDER (SPRITESHEETS)
    //==============================================================================

    var player1 = new runmysteriet.entity.Player(

        // 🎮 Kontroller
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
    player1.y = 180;

    var player2 = new runmysteriet.entity.Player(
        { left: "A", right: "D", jump: "W" },
        {
            texture: "spritesheet_thor_move", // 🔥 ← ANDRA bilden

            start: "idle"
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

        // 1. Hantera input först
        player.handleInput();

        // 2. Lägg på gravitation
        player.velocityY += player.gravity;
        player.y += player.velocityY;

        // 3. Anta att spelaren inte står på något
        player.isOnGround = false;

        var onPlatform = false;

        // 4. Kolla plattformar
        if (this.checkPlatform(player, this.r_bana1)) {
            onPlatform = true;
        }

        if (this.checkPlatform(player, this.r_bana2)) {
            onPlatform = true;
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