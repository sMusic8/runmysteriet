//------------------------------------------------------------------------------
// Constructor scope
//------------------------------------------------------------------------------

/**
 * Creates a new object.
 *
 * @constructor
 * @extends rune.scene.Scene
 *
 * @class
 * @classdesc
 * 
 * Menu scene.
 */
runmysteriet.scene.Menu = function() {

    //--------------------------------------------------------------------------
    // Super call
    //--------------------------------------------------------------------------
    
    /**
     * Calls the constructor method of the super class.
     */
    rune.scene.Scene.call(this);
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

runmysteriet.scene.Menu.prototype = Object.create(rune.scene.Scene.prototype);
runmysteriet.scene.Menu.prototype.constructor = runmysteriet.scene.Menu;

//------------------------------------------------------------------------------
// Override public prototype methods (ENGINE)
//------------------------------------------------------------------------------

/**
 * This method is automatically executed once after the scene is instantiated. 
 * The method is used to create objects to be used within the scene.
 *
 * @returns {undefined}
 */
runmysteriet.scene.Menu.prototype.init = function() {

    rune.scene.Scene.prototype.init.call(this);
    
    // första raden
    var text = new rune.text.BitmapField("Hello Menu!");
    text.autoSize = true;
    text.center = this.application.screen.center;
    text.y -= 15; // 🔥 flytta upp
text.flicker.start(1000, 0.5);
    
    this.stage.addChild(text);

    // andra raden
    var text2 = new rune.text.BitmapField("Hello player!");
    text2.autoSize = true;
    text2.center = this.application.screen.center;
    text2.y += 15; // 🔥 flytta ner
    
    this.stage.addChild(text2);
};

/**
 * This method is automatically executed once per "tick". The method is used for 
 * calculations such as application logic.
 *
 * @param {number} step Fixed time step.
 *
 * @returns {undefined}
 */
runmysteriet.scene.Menu.prototype.update = function(step) {
    rune.scene.Scene.prototype.update.call(this, step);

    if(this.keyboard.justPressed("SPACE")) {
        this.application.scenes.load([
            new runmysteriet.scene.Game()
        ])
    }
};

/**
 * This method is automatically called once just before the scene ends. Use 
 * the method to reset references and remove objects that no longer need to 
 * exist when the scene is destroyed. The process is performed in order to 
 * avoid memory leaks.
 *
 * @returns {undefined}
 */
runmysteriet.scene.Menu.prototype.dispose = function() {
    rune.scene.Scene.prototype.dispose.call(this);
};