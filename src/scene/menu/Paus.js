/**
 * Pause scene.
 *
 * @constructor
 * @extends {rune.scene.Scene}
 */
runmysteriet.scene.Paus = function() {

    rune.scene.Scene.call(this);
};

//------------------------------------------------------------------------------
// INHERITANCE
//------------------------------------------------------------------------------

runmysteriet.scene.Paus.prototype = Object.create(rune.scene.Scene.prototype);
runmysteriet.scene.Paus.prototype.constructor = runmysteriet.scene.Paus;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

/**
 * Initializes the pause scene.
 *
 * @return {void}
 */
runmysteriet.scene.Paus.prototype.init = function() {

    rune.scene.Scene.prototype.init.call(this);

    console.log("PAUSAT");

    /** @type {!rune.text.BitmapField} */
    var title = new rune.text.BitmapField("SPELET AR PAUSAT");
    title.autoSize = true;
    title.center = this.application.screen.center;
    title.y -= 20;
    this.stage.addChild(title);

    /** @type {!rune.text.BitmapField} */
    var info = new rune.text.BitmapField(
        "Tryck P eller START igen for att fortsatta"
    );
    info.autoSize = true;
    info.center = this.application.screen.center;
    info.y += 20;
    info.scale = 0.8;
    this.stage.addChild(info);
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

/**
 * Updates pause scene logic.
 *
 * @param {number} step Fixed time step.
 * @return {void}
 */
runmysteriet.scene.Paus.prototype.update = function(step) {

    rune.scene.Scene.prototype.update.call(this, step);

    /** @type {?Object} */
    var gamepad = this.application.gamepads
        ? this.application.gamepads.get(0)
        : null;
};

//------------------------------------------------------------------------------
// DISPOSE
//------------------------------------------------------------------------------

/**
 * Cleans up the pause scene before destruction.
 *
 * @return {void}
 */
runmysteriet.scene.Paus.prototype.dispose = function() {

    rune.scene.Scene.prototype.dispose.call(this);
};