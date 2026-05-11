//------------------------------------------------------------------------------
// Constructor scope
//------------------------------------------------------------------------------

/**
 * Credits scene.
 *
 * @constructor
 * @extends rune.scene.Scene
 */
runmysteriet.scene.Credits = function() {

    rune.scene.Scene.call(this);

    this.m_background = null;
    this.m_title = null;
    this.m_subText = null;
    this.m_backText = null;

};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

runmysteriet.scene.Credits.prototype = Object.create(rune.scene.Scene.prototype);
runmysteriet.scene.Credits.prototype.constructor = runmysteriet.scene.Credits;

//------------------------------------------------------------------------------
// Public prototype methods
//------------------------------------------------------------------------------

/**
 * Initierar credits-scenen.
 *
 * @return {undefined}
 */
runmysteriet.scene.Credits.prototype.init = function() {

    rune.scene.Scene.prototype.init.call(this);

    this.m_initBackground();
    this.m_initTitle();
    this.m_initSubText();
    this.m_initBackText();
        console.log("Kör från Credits");

};

/**
 * Uppdaterar credits-scenen.
 *
 * @param {number} step
 * @return {undefined}
 */
runmysteriet.scene.Credits.prototype.update = function(step) {

    rune.scene.Scene.prototype.update.call(this, step);

    var gamepad = this.gamepads.get(0);

    if (
        this.keyboard.justPressed("ENTER") ||
        this.keyboard.justPressed("SPACE") ||
        this.keyboard.justPressed("ESCAPE") ||

        gamepad && (
            gamepad.justPressed(9) || // Options / Start på PS5
            gamepad.justPressed(0)    // X-knappen på PS5
        )
    ) {
        this.application.scenes.load([
            new runmysteriet.scene.Menu()
        ]);
    }
};
/**
 * Rensar credits-scenen.
 *
 * @return {undefined}
 */
runmysteriet.scene.Credits.prototype.dispose = function() {

    this.m_background = null;
    this.m_title = null;
    this.m_subText = null;
    this.m_backText = null;

    rune.scene.Scene.prototype.dispose.call(this);
};

//------------------------------------------------------------------------------
// Private prototype methods
//------------------------------------------------------------------------------

/**
 * Skapar bakgrunden.
 *
 * @return {undefined}
 */
runmysteriet.scene.Credits.prototype.m_initBackground = function() {

    this.m_background = new rune.display.Graphic(
        0,
        0,
        this.application.screen.width,
        this.application.screen.height,
        "background"
    );

    this.stage.addChild(this.m_background);
};

/**
 * Skapar rubriken.
 *
 * @return {undefined}
 */
runmysteriet.scene.Credits.prototype.m_initTitle = function() {

    this.m_title = new rune.text.BitmapField("KREDITERING");
    this.m_title.autoSize = true;
    this.m_title.x = this.application.screen.center.x - this.m_title.width / 2;
    this.m_title.y = 50;

    this.stage.addChild(this.m_title);
};

/**
 * Skapar krediteringstexten.
 *
 * @return {undefined}
 */
runmysteriet.scene.Credits.prototype.m_initSubText = function() {

    this.m_subText = new rune.text.BitmapField(
        "GAME\n"
  
    );

    this.m_subText.autoSize = true;
    this.m_subText.x = this.application.screen.center.x - this.m_subText.width / 2;
    this.m_subText.y = 150;

    this.stage.addChild(this.m_subText);
};

/**
 * Skapar tillbaka-texten.
 *
 * @return {undefined}
 */
runmysteriet.scene.Credits.prototype.m_initBackText = function() {

    this.m_backText = new rune.text.BitmapField("TRYCK ENTER FOR MENY");
    this.m_backText.autoSize = true;
    this.m_backText.x = this.application.screen.center.x - this.m_backText.width / 2;
    this.m_backText.y = 500;

    this.stage.addChild(this.m_backText);
};