/**
 * More info scene.
 *
 * Visar instruktioner + hur man går tillbaka till menyn.
 *
 * @constructor
 * @extends {rune.scene.Scene}
 */
runmysteriet.scene.More = function() {
    rune.scene.Scene.call(this);

    /** @private */
    this.m_backButton = null;

    /** @private */
    this.m_text = null;

    // ✔ FIX: background
    this.m_background = null;
};

//------------------------------------------------------------------------------
// INHERITANCE
//------------------------------------------------------------------------------

runmysteriet.scene.More.prototype = Object.create(rune.scene.Scene.prototype);
runmysteriet.scene.More.prototype.constructor = runmysteriet.scene.More;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.scene.More.prototype.init = function() {

    rune.scene.Scene.prototype.init.call(this);

    // ✔ FIX: BACKGROUND ONLY
    this.m_background = new rune.display.Graphic(
        0,
        0,
        this.application.screen.width,
        this.application.screen.height,
        "background_menu"
    );

    this.stage.addChild(this.m_background);

    //----------------------------------------------------------------------  
    // BOX
    //----------------------------------------------------------------------

    var boxWidth = 520;
    var boxHeight = 300;

    var box = new rune.display.Graphic(0, 0, boxWidth, boxHeight);
    box.fill = true;
    box.fillColor = "#ffffff";

    box.x = this.application.screen.center.x - boxWidth / 2;
    box.y = this.application.screen.center.y - boxHeight / 2;

    this.stage.addChild(box);

    //----------------------------------------------------------------------  
    // TEXT
    //----------------------------------------------------------------------

    this.m_text = new rune.text.BitmapField(
        "This is the game where you help the Vikings\n" +
        "reach their home ship while avoiding obstacles.\n\n" +

        "Jump across platforms, fight priests,\n" +
        "and avoid being captured.\n\n" +

        "To board the ship you must guess\n" +
        "the secret password.\n\n" +

        "Collect shields with runes along the way.\n\n" +

        "< BACK\n" +
        "Press ENTER / SPACE / ESC\n" +
        "Gamepad: START or X"
    );

    this.m_text.autoSize = true;

    this.stage.addChild(this.m_text);

    // centrera text i box
    this.m_text.x = box.x + (boxWidth - this.m_text.width) / 2;
    this.m_text.y = box.y + (boxHeight - this.m_text.height) / 2;

    //----------------------------------------------------------------------  
    // BACK BUTTON
    //----------------------------------------------------------------------

    this.m_backButton = new rune.text.BitmapField("BACK");
    this.m_backButton.autoSize = true;

    this.stage.addChild(this.m_backButton);

    this.m_backButton.x = this.application.screen.center.x - this.m_backButton.width / 2;
    this.m_backButton.y = box.y + boxHeight + 15;
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

runmysteriet.scene.More.prototype.update = function(step) {

    rune.scene.Scene.prototype.update.call(this, step);

    var keyboard = this.keyboard;
    var gamepad = this.gamepads.get(0);

    if (
        keyboard &&
        (
            keyboard.justPressed("ESCAPE") ||
            keyboard.justPressed("ENTER") ||
            keyboard.justPressed("SPACE")
        )
    ) {
        this.goToMenu();
    }

    if (
        gamepad &&
        (
            gamepad.justPressed(9) ||
            gamepad.justPressed(0)
        )
    ) {
        this.goToMenu();
    }
};

//------------------------------------------------------------------------------
// NAVIGATION
//------------------------------------------------------------------------------

runmysteriet.scene.More.prototype.goToMenu = function() {

    this.application.scenes.load([
        new runmysteriet.scene.Menu()
    ]);
};