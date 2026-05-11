/**
 * More info scene.
 *
 * @constructor
 * @extends {rune.scene.Scene}
 */
runmysteriet.scene.More = function() {
    rune.scene.Scene.call(this);
};

//------------------------------------------------------------------------------
// INHERITANCE
//------------------------------------------------------------------------------

runmysteriet.scene.More.prototype = Object.create(rune.scene.Scene.prototype);
runmysteriet.scene.More.prototype.constructor = runmysteriet.scene.More;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

/**
 * Initializes the scene.
 *
 * @return {void}
 */
runmysteriet.scene.More.prototype.init = function() {

    rune.scene.Scene.prototype.init.call(this);

    /** @type {!rune.text.BitmapField} */
    var text = new rune.text.BitmapField("This is the game where you help the Vikings reach their home ship while avoiding numerous obstacles. Jump across platforms, fight Christian priests, and avoid being captured by the English. To board the ship and sail on to the next level, you must guess the secret password. Collect the shields marked with runes along the way.");
    text.autoSize = true;
    text.center = this.application.screen.center;

    this.stage.addChild(text);
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

/**
 * Updates scene logic.
 *
 * @param {number} step Fixed time step.
 * @return {void}
 */
runmysteriet.scene.More.prototype.update = function(step) {

    rune.scene.Scene.prototype.update.call(this, step);

    /** @type {?Object} */
    var keyboard = this.keyboard;

    /** @type {?Object} */
    var gamepad = this.gamepads.get(0);

    if (
        keyboard &&
        (
            keyboard.justPressed("ESCAPE") ||
            keyboard.justPressed("ENTER") ||
            keyboard.justPressed("SPACE")
        )
    ) {
        this.application.scenes.load([
            new runmysteriet.scene.Menu()
        ]);
    }

    if (
        gamepad &&
        (
            gamepad.justPressed(9) ||  // Options / Start
            gamepad.justPressed(0)     // X-knappen
        )
    ) {
        this.application.scenes.load([
            new runmysteriet.scene.Menu()
        ]);
    }
};