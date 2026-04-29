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
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

runmysteriet.scene.Menu.prototype = Object.create(rune.scene.Scene.prototype);
runmysteriet.scene.Menu.prototype.constructor = runmysteriet.scene.Menu;

//------------------------------------------------------------------------------
// Init
//------------------------------------------------------------------------------

/**
 * Initializes the scene and creates menu items.
 *
 * @return {undefined}
 */
runmysteriet.scene.Menu.prototype.init = function() {
this.menuSound = this.application.sounds.sound.get("sound_menu");
 
    rune.scene.Scene.prototype.init.call(this);

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

    // -------------------------
    // MENY
    // -------------------------

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

/**
 * Updates the scene logic each frame.
 *
 * @param {number} step Fixed time step.
 * @return {undefined}
 */
runmysteriet.scene.Menu.prototype.update = function(step) {

    rune.scene.Scene.prototype.update.call(this, step);

    // ↓
    if (this.keyboard.justPressed("DOWN")) {
 this.menuSound.play(true);
        this.selectedIndex++;

        if (this.selectedIndex >= this.menuItems.length) {
            this.selectedIndex = 0;
        }

        this.updateMenu();
    }

    // ↑
    if (this.keyboard.justPressed("UP")) {
 this.menuSound.play(true);
        this.selectedIndex--;

        if (this.selectedIndex < 0) {
            this.selectedIndex = this.menuItems.length - 1;
        }

        this.updateMenu();
    }

    // SPACE = valj
    if (this.keyboard.justPressed("SPACE")) {

        if (this.selectedIndex === 0) {
            this.application.scenes.load([
                new runmysteriet.scene.Game()
            ]);
        }

        if (this.selectedIndex === 1) {
            new runmysteriet.scene.More;
        }

        if (this.selectedIndex === 2) {
            new runmysteriet.scene.Credits;
        }
    }
};

//------------------------------------------------------------------------------
// Update menu UI
//------------------------------------------------------------------------------

/**
 * Updates visual selection state of menu items.
 *
 * @return {undefined}
 */
runmysteriet.scene.Menu.prototype.updateMenu = function() {

    for (var i = 0; i < this.menuItems.length; i++) {

        var item = this.menuItems[i];

        var text = item.text.replace("> ", "");

        if (i === this.selectedIndex) {
            item.text = "> " + text;
        } else {
            item.text = text;
        }
    }
};

//------------------------------------------------------------------------------
// Dispose
//------------------------------------------------------------------------------

/**
 * Cleans up the scene before destruction.
 *
 * @return {undefined}
 */
runmysteriet.scene.Menu.prototype.dispose = function() {

    rune.scene.Scene.prototype.dispose.call(this);
};