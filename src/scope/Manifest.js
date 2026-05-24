//------------------------------------------------------------------------------
// Namespace
//------------------------------------------------------------------------------

/**
 * The application namespace.
 * 
 * @namespace runmysteriet
 */
var runmysteriet = function() {

    //--------------------------------------------------------------------------
    // Public static scope
    //--------------------------------------------------------------------------
    
    /**
     * Public scope.
     *
     * @type {Object}
     * @private
     */
    var m_this = {};

    //--------------------------------------------------------------------------
    // Package structure
    //--------------------------------------------------------------------------
    
    /**
     * This package contains classes that represent data, or that are used to 
     * manage data. Data can consist of concrete information, or of raw data 
     * such as resource files.
     *
     * @namespace data
     * @memberof runmysteriet
     * @since 1.0
     */
    m_this.data = {};
    
    /**
     * This package includes the scenes that make up the application. Scenes 
     * are used to represent graphical parts (also known as views) of an 
     * application.
     *
     * @namespace scene
     * @memberof runmysteriet
     * @since 1.0
     */
    m_this.scene = {};

    /**
     * This package contains the application's most vital classes.
     *
     * @namespace system
     * @memberof runmysteriet
     * @since 1.0
     */
    m_this.system = {};
    
    //--------------------------------------------------------------------------
    // Return public scope object
    //--------------------------------------------------------------------------
    /**
     * This package includes the entities that make up the application. Entities
     * @namespace entity
     * @memberof runmysteriet
     * @since 1.0
     */
    m_this.entity ={};

/**
     * This package includes 
     * @namespace ui
     * @memberof runmysteriet
     * @since 1.0
     */
    m_this.ui ={};
    m_this.ui.graphic ={};
    
    /**
     * Public scope.
     */
    m_this.Shield = {};

    /**
     * This package includes 
     * @namespace handler
     * @memberof runmysteriet
     * @since 1.0
     */
    m_this.handler = {};

    /**
     * This package includes 
     * @namespace segments
     * @memberof runmysteriet
     * @since 1.0
     */
    m_this.segments = {};
    

     /**
     * This package includes 
     * @namespace config
     * @memberof runmysteriet
     * @since 1.0
     */
    m_this.config = {};
    /**
    * This package includes 
    * @namespace logic
    * @memberof runmysteriet
    * @since 1.0
    */
    m_this.logic = {};

    /**
     * This package includes 
     * @namespace input
     * @memberof runmysteriet
     * @since 1.0
     */
    m_this.input = {};


    /**
     * This package includes 
     * @namespace attack
     * @memberof runmysteriet
     * @since 1.0
     */

    m_this.attack = {};


     /**
     * This package includes 
     * @namespace particle
     * @memberof runmysteriet
     * @since 1.0
     */

    m_this.particle = {};


    /**
     * Public scope.
     */
    return m_this;
}();

//------------------------------------------------------------------------------
// Public static methods
//------------------------------------------------------------------------------

/**
 * The secret bootstrap. This method enables simple startup of the application, 
 * without knowledge of the internal package structure or the classes included 
 * in it.
 *
 * @ignore
 */
runmysteriet.bootstrap = function(callback) {
    var app = new runmysteriet.system.Main();
        app.start(callback);
        
    return app;
};