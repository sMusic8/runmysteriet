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
    var text = new rune.text.BitmapField("MER OM SPELET SKRIVER VI HAR");
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

    if (
        keyboard &&
        (keyboard.justPressed("ESCAPE") || keyboard.justPressed("ENTER"))
    ) {
        this.application.scenes.load([
            new runmysteriet.scene.Menu()
        ]);
    }
};