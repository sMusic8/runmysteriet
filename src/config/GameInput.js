//------------------------------------------------------------------------------
// GAME INPUT
//------------------------------------------------------------------------------

runmysteriet.input = runmysteriet.input || {};

/**
 * Gemensam input-klass för keyboard och gamepad.
 *
 * @constructor
 * @param {!Object} application
 */
runmysteriet.input.GameInput = function(application) {

    this.application = application;

    /*
     * Cooldown gör att joystick/D-pad inte scrollar för snabbt.
     */
    this.m_scrollCooldown = 0;
    this.m_scrollDelay = 8;
};

//------------------------------------------------------------------------------
// READ
//------------------------------------------------------------------------------

/**
 * Läser tangentbord och gamepad.
 *
 * @param {?Object} keyboard
 * @return {!Object}
 */
runmysteriet.input.GameInput.prototype.read = function(keyboard) {

    var gamepad = this.getGamepad();

    var input = {
        up: false,
        down: false,
        left: false,
        right: false,
        choose: false,
        back: false,
        hint: false,
        pause: false
    };

    if (this.m_scrollCooldown > 0) {
        this.m_scrollCooldown--;
    }

    /*
     * Tangentbord.
     */
    if (keyboard && typeof keyboard.justPressed === "function") {

        input.up = keyboard.justPressed("UP");
        input.down = keyboard.justPressed("DOWN");
        input.left = keyboard.justPressed("LEFT");
        input.right = keyboard.justPressed("RIGHT");

        input.choose =
            keyboard.justPressed("ENTER") ||
            keyboard.justPressed("SPACE");

        input.back =
            keyboard.justPressed("ESCAPE");

        input.hint =
            keyboard.justPressed("T");

        input.pause =
            keyboard.justPressed("P") ||
            keyboard.justPressed("ESCAPE");
    }

    /*
     * Gamepad-knappar.
     */
    if (gamepad && typeof gamepad.justPressed === "function") {

        input.choose = input.choose ||
            gamepad.justPressed("A") ||
            gamepad.justPressed("CROSS") ||
            gamepad.justPressed(0);

        input.pause = input.pause ||
            gamepad.justPressed("START") ||
            gamepad.justPressed(9);

        input.up = input.up ||
            gamepad.justPressed("UP") ||
            gamepad.justPressed(12);

        input.down = input.down ||
            gamepad.justPressed("DOWN") ||
            gamepad.justPressed(13);

        input.left = input.left ||
            gamepad.justPressed("LEFT") ||
            gamepad.justPressed(14);

        input.right = input.right ||
            gamepad.justPressed("RIGHT") ||
            gamepad.justPressed(15);
    }

    /*
     * Analog joystick.
     */
    this.applyStickInput(gamepad, input);

    return input;
};

//------------------------------------------------------------------------------
// GAMEPAD
//------------------------------------------------------------------------------

/**
 * Hämtar första gamepaden.
 *
 * @return {?Object}
 */
runmysteriet.input.GameInput.prototype.getGamepad = function() {

    if (this.application &&
        this.application.inputs &&
        this.application.inputs.gamepads) {

        return this.application.inputs.gamepads.get(0);
    }

    return null;
};

//------------------------------------------------------------------------------
// STICK INPUT
//------------------------------------------------------------------------------

/**
 * Läser analog joystick och lägger till riktning i input-objektet.
 *
 * @param {?Object} gamepad
 * @param {!Object} input
 * @return {void}
 */
runmysteriet.input.GameInput.prototype.applyStickInput = function(gamepad, input) {

    var x = 0;
    var y = 0;

    if (!gamepad) {
        return;
    }

    /*
     * Standard: axes[0] = vänster spak X
     *           axes[1] = vänster spak Y
     */
    if (gamepad.axes && gamepad.axes.length > 1) {
        x = gamepad.axes[0];
        y = gamepad.axes[1];
    } else if (typeof gamepad.axis === "function") {
        x = gamepad.axis(0);
        y = gamepad.axis(1);
    }

    /*
     * cooldown är för att inte scrolla för snabbt
     */
    if (this.m_scrollCooldown > 0) {
        return;
    }

    if (y < -0.5) {
        input.up = true;
        this.m_scrollCooldown = this.m_scrollDelay;
    } else if (y > 0.5) {
        input.down = true;
        this.m_scrollCooldown = this.m_scrollDelay;
    }

    if (x < -0.5) {
        input.left = true;
        this.m_scrollCooldown = this.m_scrollDelay;
    } else if (x > 0.5) {
        input.right = true;
        this.m_scrollCooldown = this.m_scrollDelay;
    }
};