//------------------------------------------------------------------------------
// Constructor scope
//------------------------------------------------------------------------------

/**
 * Creates a new instance of the Main class.
 *
 * @constructor
 * 
 * @class
 * @classdesc
 * 
 * Entry point class.
 */
runmysteriet.system.Main = function() {

    //--------------------------------------------------------------------------
    // Super call
    //--------------------------------------------------------------------------
    
    /**
     * Extend (Rune) Application.
     */
    rune.system.Application.call(this, {
        developer: "se.lnu",
        app: "runmysteriet",
        build: "0.0.0",
        scene: runmysteriet.scene.Menu,
        resources: runmysteriet.data.Requests,
        useGamepads:true,
        useKeyboard:true,
        framerate: 30,
        debug: true
    });
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

runmysteriet.system.Main.prototype = Object.create(rune.system.Application.prototype);
runmysteriet.system.Main.prototype.constructor = runmysteriet.system.Main;