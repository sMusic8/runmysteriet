//------------------------------------------------------------------------------
// GAME SCENE
//------------------------------------------------------------------------------

runmysteriet.scene.Game = function() {

    rune.scene.Scene.call(this);

    // 🔁 ÄNDRING: flera spelare istället för en
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

    // 🔁 ÄNDRING: skapa två spelare med olika kontroller
    var player1 = new runmysteriet.entity.Player({
        left: "LEFT",
        right: "RIGHT",
        jump: "UP"
    });
    player1.x = 0;
    player1.y = 180;

    var player2 = new runmysteriet.entity.Player({
        left: "A",
        right: "D",
        jump: "W"
    });
    player2.x = 100;
    player2.y = 180;

    // 🔁 Lägg in i array
    this.m_players.push(player1);
    this.m_players.push(player2);

    // Platform 1
    this.r_bana1 = new runmysteriet.ui.Platform();
    this.r_bana1.x = 200;
    this.r_bana1.y = 180;

    // Platform 2
    this.r_bana2 = new runmysteriet.ui.Platform();
    this.r_bana2.x = 300;
    this.r_bana2.y = 180;

    // Add to stage
    this.stage.addChild(this.r_bana1);
    this.stage.addChild(this.r_bana2);

    // 🔁 Lägg till alla spelare
    for (var i = 0; i < this.m_players.length; i++) {
        this.stage.addChild(this.m_players[i]);
    }
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.update = function(step) {

    rune.scene.Scene.prototype.update.call(this, step);

    // 🔁 Loopa igenom alla spelare (INGEN duplicerad kod)
    for (var i = 0; i < this.m_players.length; i++) {

        var player = this.m_players[i];

        // Input
        player.handleInput();

        // Reset ground state
        player.isOnGround = false;

        // Gravitation
        player.velocityY += player.gravity;

        // Rörelse
        player.y += player.velocityY;

        var isOnAnyPlatform = false;

        // Kollisioner
        if (this.checkPlatform(player, this.r_bana1)) {
            isOnAnyPlatform = true;
        }

        if (this.checkPlatform(player, this.r_bana2)) {
            isOnAnyPlatform = true;
        }

        // Fallback mark
        if (player.y >= player.groundY && !isOnAnyPlatform) {

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

    // bara om spelaren faller nedåt
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