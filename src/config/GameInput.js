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

        input.back = input.back ||
            gamepad.justPressed("B") ||
            gamepad.justPressed("CIRCLE") ||
            gamepad.justPressed(1) ||
            gamepad.justPressed(9);

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

        input.hint = input.hint ||
            gamepad.justPressed("Y") ||
            gamepad.justPressed("TRIANGLE") ||
            gamepad.justPressed(3);
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

//--------------------------------------------------------------------------------
// GAMEPAD BY INDEX
//------------------------------------------------------------------------------

/**
 * Hämtar gamepad utifrån spelarens index.
 *
 * @param {number} index
 * @return {?Object}
 */
runmysteriet.input.GameInput.prototype.getGamepadByIndex = function(index) {

    if (this.application &&
        this.application.inputs &&
        this.application.inputs.gamepads) {

        return this.application.inputs.gamepads.get(index);
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

//------------------------------------------------------------------------------
// PLAYER INPUT
//------------------------------------------------------------------------------

/**
 * Läser input för en spelare.
 *
 * Skillnad från read():
 * - read() används för menyer och använder justPressed.
 * - readPlayer() används för spelaren och använder pressed/hållen knapp.
 *
 * @param {?Object} keyboard
 * @param {number} playerIndex
 * @return {!Object}
 */
runmysteriet.input.GameInput.prototype.readPlayer = function(keyboard, playerIndex) {

    var gamepad = this.getGamepadByIndex(playerIndex);

    var input = {
        left: false,
        right: false,
        jump: false,
        attack: false
    };

    /*
     * Tangentbord spelare 1.
     */
    if (keyboard) {

        if (playerIndex === 0) {

            if (typeof keyboard.pressed === "function") {
                input.left = input.left || keyboard.pressed("LEFT");
                input.right = input.right || keyboard.pressed("RIGHT");
            }

            if (typeof keyboard.justPressed === "function") {
                input.jump = input.jump || keyboard.justPressed("UP");
                input.attack = input.attack || keyboard.justPressed("SPACE");
            }
        }

        /*
         * Tangentbord spelare 2.
         */
        if (playerIndex === 1) {

            if (typeof keyboard.pressed === "function") {
                input.left = input.left || keyboard.pressed("A");
                input.right = input.right || keyboard.pressed("D");
            }

            if (typeof keyboard.justPressed === "function") {
                input.jump = input.jump || keyboard.justPressed("W");
                input.attack = input.attack || keyboard.justPressed("E");
            }
        }
    }

    /*
     * Gamepad-knappar.
     */
    if (gamepad) {

        if (typeof gamepad.pressed === "function") {
            input.left = input.left ||
                gamepad.pressed("LEFT") ||
                gamepad.pressed(14);

            input.right = input.right ||
                gamepad.pressed("RIGHT") ||
                gamepad.pressed(15);
        }

        if (typeof gamepad.justPressed === "function") {
            input.jump = input.jump ||
                gamepad.justPressed("A") ||
                gamepad.justPressed("CROSS") ||
                gamepad.justPressed(0);

            input.attack = input.attack ||
                gamepad.justPressed("X") ||
                gamepad.justPressed("SQUARE") ||
                gamepad.justPressed(2);
        }

        this.applyPlayerStickInput(gamepad, input);
    }

    return input;
};


/**
 * Läser analog joystick för spelarrörelse.
 *
 * OBS: Ingen cooldown här, eftersom spelaren ska kunna röra sig mjukt.
 *
 * @param {?Object} gamepad
 * @param {!Object} input
 * @return {void}
 */
runmysteriet.input.GameInput.prototype.applyPlayerStickInput = function(gamepad, input) {

    var x = 0;

    if (!gamepad) {
        return;
    }

    if (gamepad.axes && gamepad.axes.length > 0) {
        x = gamepad.axes[0];
    } else if (typeof gamepad.axis === "function") {
        x = gamepad.axis(0);
    }

    if (x < -0.5) {
        input.left = true;
    } else if (x > 0.5) {
        input.right = true;
    }
};