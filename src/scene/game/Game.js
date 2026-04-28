//------------------------------------------------------------------------------
// GAME SCENE
//------------------------------------------------------------------------------

runmysteriet.scene.Game = function() {

    rune.scene.Scene.call(this);

    this.m_playerHandler = null;
    this.m_platformHandler = null;
    this.m_cloudHandler = null;
    this.m_shieldHandler = null;
};

//------------------------------------------------------------------------------
// INHERITANCE
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype = Object.create(rune.scene.Scene.prototype);
runmysteriet.scene.Game.prototype.constructor = runmysteriet.scene.Game;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.init = function() {

    rune.scene.Scene.prototype.init.call(this);

    // Bakgrund
    var background = new rune.display.Graphic(
        0,
        0,
        this.application.screen.width,
        this.application.screen.height,
        "background"
    );

    this.stage.addChild(background);

    // Moln
    this.m_cloudHandler = new runmysteriet.handler.CloudHandler(
        this.stage,
        this.application.screen.width
    );

    this.m_cloudHandler.init();

    // Plattformar
    this.m_platformHandler = new runmysteriet.handler.PlatformHandler(
        this.stage,
        this.application.screen.width
    );

    this.m_platformHandler.init();

    // Spelare
    this.m_playerHandler = new runmysteriet.handler.PlayerHandler(
        this.stage,
        this.m_platformHandler.platforms,
        this.application
    );

    this.m_playerHandler.init();

    // Sköldar
    this.m_shieldHandler = new runmysteriet.handler.ShieldHandler(this.stage);
    this.m_shieldHandler.init();
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.update = function(step) {

    rune.scene.Scene.prototype.update.call(this, step);

    this.m_cloudHandler.update();
    this.m_playerHandler.update();

    if (this.m_shieldHandler) {
        this.m_shieldHandler.update(this.m_playerHandler.players);
    }

    // ----------------------------------------------------
    // PAUS (Keyboard + Gamepad)
    // ----------------------------------------------------

    var gamepad = this.application.gamepads ? this.application.gamepads.get(0) : null;

    var startPressed = gamepad && gamepad.justPressed("START");
    var pPressed = this.keyboard.justPressed("P");

    if (startPressed || pPressed) {

        this.application.scenes.load([
            new runmysteriet.scene.Paus()
        ]);
    }
};

//------------------------------------------------------------------------------
// DISPOSE
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype.dispose = function() {

    rune.scene.Scene.prototype.dispose.call(this);
};