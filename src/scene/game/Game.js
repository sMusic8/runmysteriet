//------------------------------------------------------------------------------
// GAME SCENE
//------------------------------------------------------------------------------

runmysteriet.scene.Game = function() {

    rune.scene.Scene.call(this);

    this.m_players = [];

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
    // 🔥 HÄR SÄTTER DU DINA BILDER (SPRITESHEETS)
    //==============================================================================

    var player1 = new runmysteriet.entity.Player(

        // 🎮 Kontroller
        {
            left: "LEFT",
            right: "RIGHT",
            jump: "UP"
        },

        // 🖼️ SPRITE CONFIG
        {
            texture: "spritesheet_freya_move", // 🔥 ← NAMNET från din asset-loader

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


    //==============================================================================
    // PLAYER 2 (egen bild!)
    //==============================================================================

    var player2 = new runmysteriet.entity.Player(

        {
            left: "A",
            right: "D",
            jump: "W"
        },

        {
            texture: "spritesheet_thor_move", // 🔥 ← ANDRA bilden

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


    // Lägg i array
    this.m_players.push(player1);
    this.m_players.push(player2);


    //==============================================================================
    // PLATTFORMAR (oförändrat – rätt design)
    //==============================================================================

    this.r_bana1 = new runmysteriet.ui.Platform();
    this.r_bana1.x = 200;
    this.r_bana1.y = 180;

    this.r_bana2 = new runmysteriet.ui.Platform();
    this.r_bana2.x = 300;
    this.r_bana2.y = 180;


    // Lägg till i scen
    this.stage.addChild(this.r_bana1);
    this.stage.addChild(this.r_bana2);

    for (var i = 0; i < this.m_players.length; i++) {
        this.stage.addChild(this.m_players[i]);
    }
};

//------------------------------------------------------------------------------
// UPDATE
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

        if (this.checkPlatform(player, this.r_bana1)) {
            onPlatform = true;
        }

        if (this.checkPlatform(player, this.r_bana2)) {
            onPlatform = true;
        }

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

runmysteriet.scene.Game.prototype.checkPlatform = function(player, platform) {

    if (!player.hitTestObject(platform)) {
        return false;
    }

    if (player.velocityY >= 0 && player.y < platform.y) {

        player.y = platform.y - player.height;
        player.velocityY = 0;
        player.isOnGround = true;

        return true;
    }

    return false;
};

//------------------------------------------------------------------------------
// DISPOSE
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.dispose = function() {

    rune.scene.Scene.prototype.dispose.call(this);
};