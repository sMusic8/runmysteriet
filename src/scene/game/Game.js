//------------------------------------------------------------------------------
// GAME SCENE
//------------------------------------------------------------------------------

runmysteriet.scene.Game = function() {

    rune.scene.Scene.call(this);

    this.m_player = null;

    this.r_bana1 = null;
    this.r_bana2 = null;

    this.m_isOnGround = false;
};

// Inheritance
runmysteriet.scene.Game.prototype = Object.create(rune.scene.Scene.prototype);
runmysteriet.scene.Game.prototype.constructor = runmysteriet.scene.Game;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.init = function() {

    rune.scene.Scene.prototype.init.call(this);

    // Player
    this.m_player = new runmysteriet.entity.Player();
    this.m_player.x = 0;
    this.m_player.y = 180;

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
    this.stage.addChild(this.m_player);
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.update = function(step) {

    rune.scene.Scene.prototype.update.call(this, step);

    var player = this.m_player;

    // Input (måste komma före fysik)
    player.handleInput();

    // Reset ground state varje frame
    this.m_isOnGround = false;
    player.isOnGround = false;

    // Gravitation (enda platsen där gravitation sker)
    player.velocityY += player.gravity;

    // Rörelse
    player.y += player.velocityY;

    // Kollisioner
    this.checkPlatform(this.r_bana1);
    this.checkPlatform(this.r_bana2);

    // Fallback mark (om ingen plattform träffas)
    if (player.y >= player.groundY && !this.m_isOnGround) {

        player.y = player.groundY;
        player.velocityY = 0;

        this.m_isOnGround = true;
        player.isOnGround = true;
    }
};

//------------------------------------------------------------------------------
// PLATFORM COLLISION
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.checkPlatform = function(platform) {

    var player = this.m_player;

    if (!player.hitTestObject(platform)) {
        return;
    }

    // bara om spelaren faller nedåt
    if (player.velocityY >= 0 && player.y < platform.y) {

        // placera ovanpå plattform
        player.y = platform.y - player.height;

        // stoppa fall
        player.velocityY = 0;

        // sätt ground state
        this.m_isOnGround = true;
        player.isOnGround = true;
    }
};

//------------------------------------------------------------------------------
// DISPOSE
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.dispose = function() {

    rune.scene.Scene.prototype.dispose.call(this);
};