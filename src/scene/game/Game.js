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
 * Game scene.
 */
runmysteriet.scene.Game = function() {

    //--------------------------------------------------------------------------
    // Super call
    //--------------------------------------------------------------------------
    this.m_player = null;
    /**
     * Calls the constructor method of the super class.
     */
    rune.scene.Scene.call(this);
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

runmysteriet.scene.Game.prototype = Object.create(rune.scene.Scene.prototype);
runmysteriet.scene.Game.prototype.constructor = runmysteriet.scene.Game;

//------------------------------------------------------------------------------
// Override public prototype methods (ENGINE)
//------------------------------------------------------------------------------

/**
 * This method is automatically executed once after the scene is instantiated. 
 * The method is used to create objects to be used within the scene.
 *
 * @returns {undefined}
 */
runmysteriet.scene.Game.prototype.init = function() {
    rune.scene.Scene.prototype.init.call(this);

    this.m_player = new runmysteriet.entity.Player();
    this.m_player.x = 0;
    this.m_player.y = 180;

    this.stage.addChild(this.m_player);

    this.r_bana = new runmysteriet.ui.Platform();
    this.r_bana.x = 200;
    this.r_bana.y = 180;
    this.stage.addChild(this.r_bana);
    
    var text = new rune.text.BitmapField("Hello World!");
    text.autoSize = true;
    text.center = this.application.screen.center;
    
    this.stage.addChild(text);
};

/**
 * This method is automatically executed once per "tick". The method is used for 
 * calculations such as application logic.
 *
 * @param {number} step Fixed time step.
 *
 * @returns {undefined}
 */
runmysteriet.scene.Game.prototype.update = function(step) {
    rune.scene.Scene.prototype.update.call(this, step);

   
};

/**
 * This method is automatically called once just before the scene ends. Use 
 * the method to reset references and remove objects that no longer need to 
 * exist when the scene is destroyed. The process is performed in order to 
 * avoid memory leaks.
 *
 * @returns {undefined}
 */
runmysteriet.scene.Game.prototype.dispose = function() {
    rune.scene.Scene.prototype.dispose.call(this);
};