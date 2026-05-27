//------------------------------------------------------------------------------
// GAME INPUT
//------------------------------------------------------------------------------

/**
 * Gemensam input-klass för keyboard och gamepad
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

/**
 * Läser tangentbord och gamepad.
 *
 * @param {?Object} keyboard
 * @return {!Object}
 */
runmysteriet.input.GameInput.prototype.read = function(keyboard) {

    var input = {
        up: false,
        down: false,
        left: false,
        right: false,
        choose: false,
        back: false,
        hint: false,
        pause: false,
        volumeUp: false,
        volumeDown: false
    };

    if (this.m_scrollCooldown > 0) {
        this.m_scrollCooldown--;
    }

   //Läser tangentbordet
    this.readKeyboard(keyboard, input);

    /*
     * Båda gamepads används för meny/global input.
     * Det gör att både joystick 1 och joystick 2 kan pausa,
     * välja i menyer och ändra volym.
     */
    this.readGamepadByIndex(0, input);
    this.readGamepadByIndex(1, input);

    return input;
};
/**
 * Läser en specifik gamepad för global/meny-input.
 *
 * @param {number} index
 * @param {!Object} input
 * @return {void}
 */

runmysteriet.input.GameInput.prototype.readGamepadByIndex = function(index, input) {

    var gamepad = this.getGamepadByIndex(index);

    if (!gamepad) {
        return;
    }

    this.readGamepadButtons(gamepad, input);
    this.applyStickInput(gamepad, input);
};

/**
 * Läser tangentbord.
 *
 * @param {?Object} keyboard
 * @param {!Object} input
 * @return {void}
 */
runmysteriet.input.GameInput.prototype.readKeyboard = function(keyboard, input) {

    if (!keyboard || typeof keyboard.justPressed !== "function") {
        return;
    }

    input.up = input.up || keyboard.justPressed("UP");
    input.down = input.down || keyboard.justPressed("DOWN");
    input.left = input.left || keyboard.justPressed("LEFT");
    input.right = input.right || keyboard.justPressed("RIGHT");

    input.choose = input.choose ||
        keyboard.justPressed("ENTER") ||
        keyboard.justPressed("SPACE");

    input.back = input.back ||
        keyboard.justPressed("ESCAPE");
        keyboard.justPressed("BACKSPACE");

    input.hint = input.hint ||
        keyboard.justPressed("T");

    input.pause = input.pause ||
        keyboard.justPressed("P") ||
        keyboard.justPressed("ESCAPE");

    input.volumeUp = input.volumeUp ||
        keyboard.justPressed("E") ||
        keyboard.justPressed("e");

    input.volumeDown = input.volumeDown ||
        keyboard.justPressed("Q") ||
        keyboard.justPressed("q");
};

/**
 * Läser gamepad-knappar.
 *
 * @param {?Object} gamepad
 * @param {!Object} input
 * @return {void}
 */
runmysteriet.input.GameInput.prototype.readGamepadButtons = function(gamepad, input) {

    if (!gamepad || typeof gamepad.justPressed !== "function") {
        return;
    }

    input.choose = input.choose ||
        gamepad.justPressed("A") ||
        gamepad.justPressed("CROSS") ||
        gamepad.justPressed(0);

    input.back = input.back ||
        gamepad.justPressed("B") ||
        gamepad.justPressed("CIRCLE") ||
        gamepad.justPressed(1);

    input.pause = input.pause ||
        gamepad.justPressed("START") ||
        gamepad.justPressed(9);

    input.up = input.up ||
        gamepad.justPressed("UP") ||
        gamepad.justPressed("DPAD_UP") ||
        gamepad.justPressed(12);

    input.down = input.down ||
        gamepad.justPressed("DOWN") ||
        gamepad.justPressed("DPAD_DOWN") ||
        gamepad.justPressed(13);

    input.left = input.left ||
        gamepad.justPressed("LEFT") ||
        gamepad.justPressed("DPAD_LEFT") ||
        gamepad.justPressed(14);

    input.right = input.right ||
        gamepad.justPressed("RIGHT") ||
        gamepad.justPressed("DPAD_RIGHT") ||
        gamepad.justPressed(15);

    input.hint = input.hint ||
        gamepad.justPressed("Y") ||
        gamepad.justPressed("TRIANGLE") ||
        gamepad.justPressed(3);

    input.volumeUp = input.volumeUp ||
        gamepad.justPressed("RB") ||
        gamepad.justPressed(5);

    input.volumeDown = input.volumeDown ||
        gamepad.justPressed("LB") ||
        gamepad.justPressed(4);
};

/**
 * Hämtar första gamepaden.
 *
 * @return {?Object}
 */
runmysteriet.input.GameInput.prototype.getGamepad = function() {
    return this.getGamepadByIndex(0);
};

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

/**
 * Hämtar analog axel.
 *
 * @param {?Object} gamepad
 * @param {number} index
 * @return {number}
 */
runmysteriet.input.GameInput.prototype.getAxis = function(gamepad, index) {

    if (!gamepad) {
        return 0;
    }

    if (gamepad.axes && gamepad.axes.length > index) {
        return gamepad.axes[index] || 0;
    }

    if (typeof gamepad.axis === "function") {
        return gamepad.axis(index) || 0;
    }

    return 0;
};

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

    if (this.m_scrollCooldown > 0) {
        return;
    }

    x = this.getAxis(gamepad, 0);
    y = this.getAxis(gamepad, 1);

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

/**
 * Läser input för en spelare.
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
        up: false,
        down: false,
        jump: false,
        attack: false,
        choose: false,
        back: false,
        pause: false,
        hint: false,
        volumeUp: false,
        volumeDown: false
    };

    this.readPlayerKeyboard(keyboard, playerIndex, input);
    this.readPlayerGamepad(gamepad, input);
    this.applyPlayerStickInput(gamepad, input);

    return input;
};
/**
 * Läser tangentbord för spelare.
 *
 * @param {?Object} keyboard
 * @param {number} playerIndex
 * @param {!Object} input
 * @return {void}
 */
runmysteriet.input.GameInput.prototype.readPlayerKeyboard = function(keyboard, playerIndex, input) {

    if (!keyboard) {
        return;
    }

    if (playerIndex === 0) {
        if (typeof keyboard.pressed === "function") {
            input.left = input.left || keyboard.pressed("LEFT");
            input.right = input.right || keyboard.pressed("RIGHT");
            input.down = input.down || keyboard.pressed("DOWN");
        }

        if (typeof keyboard.justPressed === "function") {
            input.up = input.up || keyboard.justPressed("UP");
            input.jump = input.jump || keyboard.justPressed("UP");
            input.attack = input.attack || keyboard.justPressed("SPACE");
        }
    }

    if (playerIndex === 1) {
        if (typeof keyboard.pressed === "function") {
            input.left = input.left || keyboard.pressed("A");
            input.right = input.right || keyboard.pressed("D");
            input.down = input.down || keyboard.pressed("S");
        }

        if (typeof keyboard.justPressed === "function") {
            input.up = input.up || keyboard.justPressed("W");
            input.jump = input.jump || keyboard.justPressed("W");
            input.attack = input.attack || keyboard.justPressed("E");
        }
    }

    if (typeof keyboard.justPressed === "function") {
        input.choose = input.choose ||
            keyboard.justPressed("ENTER") ||
            keyboard.justPressed("SPACE");

        input.back = input.back ||
            keyboard.justPressed("ESCAPE") ||
            keyboard.justPressed("BACKSPACE");

        input.pause = input.pause ||
            keyboard.justPressed("P") ||
            keyboard.justPressed("ESCAPE");

        input.hint = input.hint ||
            keyboard.justPressed("T");

    
        input.volumeUp = input.volumeUp ||
            keyboard.justPressed("E") ||
            keyboard.justPressed("e");

        input.volumeDown = input.volumeDown ||
            keyboard.justPressed("Q") ||
            keyboard.justPressed("q");
    }
};

/**
 * Läser gamepad för spelare.
 *
 * @param {?Object} gamepad
 * @param {!Object} input
 * @return {void}
 */
runmysteriet.input.GameInput.prototype.readPlayerGamepad = function(gamepad, input) {

    if (!gamepad) {
        return;
    }

    if (typeof gamepad.pressed === "function") {
        input.left = input.left ||
            gamepad.pressed("LEFT") ||
            gamepad.pressed("DPAD_LEFT") ||
            gamepad.pressed(14);

        input.right = input.right ||
            gamepad.pressed("RIGHT") ||
            gamepad.pressed("DPAD_RIGHT") ||
            gamepad.pressed(15);

        input.up = input.up ||
            gamepad.pressed("UP") ||
            gamepad.pressed("DPAD_UP") ||
            gamepad.pressed(12);

        input.down = input.down ||
            gamepad.pressed("DOWN") ||
            gamepad.pressed("DPAD_DOWN") ||
            gamepad.pressed(13);
    }

    if (typeof gamepad.justPressed === "function") {
        input.jump = input.jump ||
            gamepad.justPressed("A") ||
            gamepad.justPressed("CROSS") ||
            gamepad.justPressed(0);

        input.choose = input.choose ||
            gamepad.justPressed("A") ||
            gamepad.justPressed("CROSS") ||
            gamepad.justPressed(0);

        input.attack = input.attack ||
            gamepad.justPressed("X") ||
            gamepad.justPressed("SQUARE") ||
            gamepad.justPressed(2);

        input.back = input.back ||
            gamepad.justPressed("B") ||
            gamepad.justPressed("CIRCLE") ||
            gamepad.justPressed(1);

        input.hint = input.hint ||
            gamepad.justPressed("Y") ||
            gamepad.justPressed("TRIANGLE") ||
            gamepad.justPressed(3);

        input.pause = input.pause ||
            gamepad.justPressed("START") ||
            gamepad.justPressed("OPTIONS") ||
            gamepad.justPressed(9);

        input.volumeDown = input.volumeDown ||
            gamepad.justPressed("LB") ||
            gamepad.justPressed("L1") ||
            gamepad.justPressed(4);

        input.volumeUp = input.volumeUp ||
            gamepad.justPressed("RB") ||
            gamepad.justPressed("R1") ||
            gamepad.justPressed(5);
    }
};

/**
 * Läser analog joystick för spelarrörelse.
 *
 * @param {?Object} gamepad
 * @param {!Object} input
 * @return {void}
 */
runmysteriet.input.GameInput.prototype.applyPlayerStickInput = function(gamepad, input) {

    var x = 0;
    var y = 0;

    if (!gamepad) {
        return;
    }

    x = this.getAxis(gamepad, 0);
    y = this.getAxis(gamepad, 1);

    if (x < -0.5) {
        input.left = true;
    } else if (x > 0.5) {
        input.right = true;
    }

    if (y > 0.5) {
        input.down = true;
    }
};

/**
 * Läser analoga spak från gamepad
 *
 * @param {!Object} gamepad
 * @param {number} index
 * @return {number}
 */
runmysteriet.input.GameInput.prototype.getGamepadAxis = function(gamepad, index) {

    if (!gamepad) {
        return 0;
    }

    if (typeof gamepad.axis === "function") {
        return gamepad.axis(index) || 0;
    }

    if (typeof gamepad.getAxis === "function") {
        return gamepad.getAxis(index) || 0;
    }

    if (gamepad.axes && gamepad.axes.length > index) {
        return gamepad.axes[index] || 0;
    }

    return 0;
};