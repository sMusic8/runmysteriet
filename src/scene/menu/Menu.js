//------------------------------------------------------------------------------
// Constructor scope
//------------------------------------------------------------------------------

/**
 * Menu scene constructor.
 *
 * @constructor
 * @extends rune.scene.Scene
 */
runmysteriet.scene.Menu = function() {

    rune.scene.Scene.call(this);

    /**
     * List of menu item bitmap fields.
     * @type {Array<rune.text.BitmapField>}
     */
    this.menuItems = [];

    /**
     * Currently selected menu index.
     * @type {number}
     */
    this.selectedIndex = 0;

    this.menuSound = null;
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

runmysteriet.scene.Menu.prototype = Object.create(rune.scene.Scene.prototype);
runmysteriet.scene.Menu.prototype.constructor = runmysteriet.scene.Menu;

//------------------------------------------------------------------------------
// Init
//------------------------------------------------------------------------------

runmysteriet.scene.Menu.prototype.init = function() {

    rune.scene.Scene.prototype.init.call(this);

    this.menuSound = this.application.sounds.sound.get("sound_menu");

    var text = new rune.text.BitmapField("Valkommen till runmysteriet!");
    text.autoSize = true;
    text.center = this.application.screen.center;
    text.y -= 40;
    text.flicker.start(750, 0.5);
    this.stage.addChild(text);

    var text2 = new rune.text.BitmapField("From battle to brain, earn the final word!");
    text2.autoSize = true;
    text2.center = this.application.screen.center;
    text2.y -= 20;
    text2.scale = 0.8;
    text2.flicker.start(750, 0.5);
    this.stage.addChild(text2);

    var labels = ["Starta spelet", "Las mer", "Credits"];

    for (var i = 0; i < labels.length; i++) {

        var item = new rune.text.BitmapField(labels[i]);
        item.autoSize = true;
        item.center = this.application.screen.center;
        item.y += 40 + (i * 15);
        item.scale = 0.8;

        this.stage.addChild(item);
        this.menuItems.push(item);
    }

    this.updateMenu();
};

//------------------------------------------------------------------------------
// Update
//------------------------------------------------------------------------------

runmysteriet.scene.Menu.prototype.update = function(step) {

    rune.scene.Scene.prototype.update.call(this, step);

    var gamepad = null;

    if (
        this.application &&
        this.application.inputs &&
        this.application.inputs.gamepads
    ) {
        gamepad = this.application.inputs.gamepads.get(0);
    }

    var startIsPressed = false;
    var downIsPressed = false;
    var upIsPressed = false;

    if (gamepad !== null && gamepad !== undefined) {
            //console.log(gamepad);
        if (typeof gamepad.justPressed === "function") {

            startIsPressed =
                gamepad.justPressed("START") ||
                gamepad.justPressed(9) ||
                gamepad.justPressed(0);

            downIsPressed =
                gamepad.justPressed("DOWN") ||
                gamepad.justPressed(13);

            upIsPressed =
                gamepad.justPressed("UP") ||
                gamepad.justPressed(12);
        }
        
    }

    if (this.keyboard.justPressed("DOWN") || downIsPressed) {

        if (this.menuSound) {
            this.menuSound.play();
        }

        this.selectedIndex++;

        if (this.selectedIndex >= this.menuItems.length) {
            this.selectedIndex = 0;
        }

        this.updateMenu();
    }

    if (this.keyboard.justPressed("UP") || upIsPressed) {

        if (this.menuSound) {
            this.menuSound.play();
        }

        this.selectedIndex--;

        if (this.selectedIndex < 0) {
            this.selectedIndex = this.menuItems.length - 1;
        }

        this.updateMenu();
    }

    if (
        this.keyboard.justPressed("SPACE") ||
        this.keyboard.justPressed("ENTER") ||
        startIsPressed
    ) {
        if (this.selectedIndex === 0) {
            this.application.scenes.load([
                new runmysteriet.scene.Game()
            ]);
        }
        else if (this.selectedIndex === 1) {
            this.application.scenes.load([
                new runmysteriet.scene.More()
            ]);
        }
        else if (this.selectedIndex === 2) {
            this.application.scenes.load([
                new runmysteriet.scene.Credits()
            ]);
        }
    }
    
};

//------------------------------------------------------------------------------
// Update menu UI
//------------------------------------------------------------------------------

runmysteriet.scene.Menu.prototype.updateMenu = function() {

    for (var i = 0; i < this.menuItems.length; i++) {

        var item = this.menuItems[i];

        var text = item.text.replace("> ", "");

        if (i === this.selectedIndex) {
            item.text = "> " + text;
        }
        else {
            item.text = text;
        }
    }
};

//------------------------------------------------------------------------------
// Dispose
//------------------------------------------------------------------------------

runmysteriet.scene.Menu.prototype.dispose = function() {

    rune.scene.Scene.prototype.dispose.call(this);
};