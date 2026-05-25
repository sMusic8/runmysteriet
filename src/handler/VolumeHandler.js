//------------------------------------------------------------------------------
// VOLUME HANDLER
//------------------------------------------------------------------------------

/**
 * Hanterar volymkontroll för spelets audio-system.
 *
 * @constructor
 * @param {Object} audio Audio-systemet som ska styras
 * @this {runmysteriet.handler.VolumeHandler}
 */
runmysteriet.handler.VolumeHandler = function(audio) {

    /**
     * Referens till audio-systemet som kontrolleras.
     * @type {Object}
     */
    this.audio = audio;

    /**
     * Hur mycket volymen ändras per steg.
     * @type {number}
     */
    this.step = 0.1;

    /**
     * Minsta tillåtna volymnivå.
     * @type {number}
     */
    this.min = 0;

    /**
     * Högsta tillåtna volymnivå.
     * @type {number}
     */
    this.max = 1;
};
/**
 * Uppdaterar volymnivån baserat på input från tangentbord eller gamepad.
 *
 * @this {runmysteriet.handler.VolumeHandler}
 * @param {*} input (unused, reserverad för framtida input-system)
 * @param {Object=} gamepad Gamepad-input (valfri)
 * @param {Object=} keyboard Keyboard-input (valfri)
 * @return {void}
 */
runmysteriet.handler.VolumeHandler.prototype.update = function(input, gamepad, keyboard) {

    if (!this.audio) {
        return;
    }

    /** @type {boolean} */
    var increasePressed =
        (keyboard && keyboard.justPressed("U")) ||
        (gamepad && (gamepad.justPressed("RB") || gamepad.justPressed(5)));

    /** @type {boolean} */
    var decreasePressed =
        (keyboard && keyboard.justPressed("Y")) ||
        (gamepad && (gamepad.justPressed("LB") || gamepad.justPressed(4)));

    if (increasePressed) {

        this.audio.volume += this.step;

        if (this.audio.volume > this.max) {
            this.audio.volume = this.min; // wrap
        }
    }

    if (decreasePressed) {

        this.audio.volume -= this.step;

        if (this.audio.volume < this.min) {
            this.audio.volume = this.max; // wrap
        }
    }
};
