//------------------------------------------------------------------------------
// Constructor scope
//------------------------------------------------------------------------------

runmysteriet.scene.Game = function() {

    rune.scene.Scene.call(this);

    this.m_player = null;

    this.r_bana1 = null;
    this.r_bana2 = null;

    // state
    this.m_isOnGround = false;

    // spawn position
    this.m_startY = 0;
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

    this.m_startY = this.m_player.y;

    this.stage.addChild(this.m_player);

    // PLATFORM 1
    this.r_bana1 = new runmysteriet.ui.Platform();
    this.r_bana1.x = 200;
    this.r_bana1.y = 180;
    this.stage.addChild(this.r_bana1);

    // PLATFORM 2
    this.r_bana2 = new runmysteriet.ui.Platform();
    this.r_bana2.x = 300;
    this.r_bana2.y = 180;
    this.stage.addChild(this.r_bana2);

    // TEXT
    var text = new rune.text.BitmapField("Hello World!");
    text.autoSize = true;
    text.center = this.application.screen.center;
    this.stage.addChild(text);
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.update = function(step) {

    rune.scene.Scene.prototype.update.call(this, step);

    var player = this.m_player;

    // GRAVITATION (bara om vi inte står på något)
    if (!this.m_isOnGround) {
        player.y += 2;
    }

    // reset ground state varje frame
    this.m_isOnGround = false;

    // check platform 1
    if (player.hitTestObject(this.r_bana1)) {
        this.landOnPlatform(this.r_bana1);
    }

    // check platform 2
    if (player.hitTestObject(this.r_bana2)) {
        this.landOnPlatform(this.r_bana2);
    }
};

//------------------------------------------------------------------------------
// LANDING LOGIC
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.landOnPlatform = function(platform) {

    var player = this.m_player;

    // placera exakt ovanpå plattformen
    player.y = platform.y - player.height;

    // markera som grounded
    this.m_isOnGround = true;
};

//------------------------------------------------------------------------------
// DISPOSE
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.dispose = function() {

    rune.scene.Scene.prototype.dispose.call(this);
};