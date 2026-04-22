//------------------------------------------------------------------------------
// Constructor
//------------------------------------------------------------------------------

runmysteriet.scene.Game = function() {

    rune.scene.Scene.call(this);

    this.m_player = null;

    this.r_bana1 = null;
    this.r_bana2 = null;

    this.m_isOnGround = false;
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype = Object.create(rune.scene.Scene.prototype);
runmysteriet.scene.Game.prototype.constructor = runmysteriet.scene.Game;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.init = function() {

    rune.scene.Scene.prototype.init.call(this);

    // PLAYER
    this.m_player = new runmysteriet.entity.Player();
    this.m_player.x = 0;
    this.m_player.y = 180;

    // PLATTFORM 1
    this.r_bana1 = new runmysteriet.ui.Platform();
    this.r_bana1.x = 200;
    this.r_bana1.y = 180;

    // PLATTFORM 2
    this.r_bana2 = new runmysteriet.ui.Platform();
    this.r_bana2.x = 350;
    this.r_bana2.y = 120;

    // 🔥 VIKTIGT: rätt render order
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

    // gravitation
    if (!this.m_isOnGround) {
        player.y += 2;
    }

    // reset varje frame
    this.m_isOnGround = false;

    // check plattformar
    this.checkPlatform(this.r_bana1);
    this.checkPlatform(this.r_bana2);
};

//------------------------------------------------------------------------------
// PLATFORM COLLISION (STABIL VERSION)
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.checkPlatform = function(platform) {

    var player = this.m_player;

    if (!player.hitTestObject(platform)) {
        return;
    }

    // enkel och stabil landing:
    // spelaren måste vara ovanför plattformen
    if (player.y < platform.y) {

        player.y = platform.y - player.height;
        this.m_isOnGround = true;
    }
};

//------------------------------------------------------------------------------
// DISPOSE
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.dispose = function() {

    rune.scene.Scene.prototype.dispose.call(this);
};