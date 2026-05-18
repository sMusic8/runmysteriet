/**
 * More info scene.
 *
 * @constructor
 * @extends {rune.scene.Scene}
 */
runmysteriet.scene.More = function() {
    rune.scene.Scene.call(this);

    this.m_backButton = null;
    this.m_text = null;
    this.m_background = null;

    this.backgroundMusic = null;
    this.menuSound = null;
};

runmysteriet.scene.More.prototype = Object.create(rune.scene.Scene.prototype);
runmysteriet.scene.More.prototype.constructor = runmysteriet.scene.More;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.scene.More.prototype.init = function() {

    rune.scene.Scene.prototype.init.call(this);

    this.backgroundMusic = this.application.sounds.sound.get("sound_musicMenu");
    this.menuSound = this.application.sounds.sound.get("sound_menu");

    if (this.backgroundMusic) {
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.5;
        this.backgroundMusic.play();
    }

    // BACKGROUND
    this.m_background = new rune.display.Graphic(
        0,
        0,
        this.application.screen.width,
        this.application.screen.height,
        "background_menu"
    );

    this.stage.addChild(this.m_background);

    // BOX
    var boxWidth = 520;
    var boxHeight = 300;

    var box = new rune.display.Graphic(0, 0, boxWidth, boxHeight);
    box.fill = true;
    box.fillColor = "#ffffff";

    box.x = this.application.screen.center.x - boxWidth / 2;
    box.y = this.application.screen.center.y - boxHeight / 2;

    this.stage.addChild(box);

    // TEXT
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
        "E/Q = Volume"
    );

    this.m_text.autoSize = true;
    this.stage.addChild(this.m_text);

    this.m_text.x = box.x + (boxWidth - this.m_text.width) / 2;
    this.m_text.y = box.y + (boxHeight - this.m_text.height) / 2;

    // BACK BUTTON
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

    // 🔥 DEBUG (så du SER att input funkar)
    if (keyboard.justPressed("E")) {
        console.log("E pressed");
    }

    if (keyboard.justPressed("Q")) {
        console.log("Q pressed");
    }

    // -----------------------
    // VOLUME CONTROL
    // -----------------------
    if (this.backgroundMusic) {

        var stepVol = 0.1;

        if (keyboard.justPressed("e") || (gamepad && gamepad.justPressed(5))) {

            this.backgroundMusic.volume += stepVol;

            if (this.backgroundMusic.volume > 1) {
                this.backgroundMusic.volume = 0;
            }

            console.log("Volym:", this.backgroundMusic.volume.toFixed(2));
        }

        if (keyboard.justPressed("q") || (gamepad && gamepad.justPressed(4))) {

            this.backgroundMusic.volume -= stepVol;

            if (this.backgroundMusic.volume < 0) {
                this.backgroundMusic.volume = 1;
            }

            console.log("Volym:", this.backgroundMusic.volume.toFixed(2));
        }
    }

    // BACK NAVIGATION
    if (
        keyboard.justPressed("ESCAPE") ||
        keyboard.justPressed("ENTER") ||
        keyboard.justPressed("SPACE")
    ) {
        this.goToMenu();
    }

    if (gamepad && (gamepad.justPressed(9) || gamepad.justPressed(0))) {
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