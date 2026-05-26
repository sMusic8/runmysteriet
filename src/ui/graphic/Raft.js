//------------------------------------------------------------------------------
// RAFT
//------------------------------------------------------------------------------

/**
 * Flotte som kan börja röra sig när spelaren kliver på den.
 *
 * @constructor
 * @extends {rune.display.Graphic}
 * @param {number=} x
 * @param {number=} y
 */
runmysteriet.ui.graphic.Raft = function(x, y) {

    rune.display.Graphic.call(
        this,
        x || 0,
        y || 0,
        64,
        20,
        "flotte"
    );
    this.isRaft = true; 
    //Gör att spelaren kan följa med flotten när spelaren står ovanpå den.
    
    this.sticky = true;
    this.immovable = true;

    this.startX = x || 0;
    this.minX = this.startX;
    this.maxX = this.startX + 100;

    this.speed = 1.4;
    this.direction = 1;

    this.previousX = this.x;
    this.deltaX = 0;

    /*
     * Flotten ska inte röra sig direkt.
     */
    this.hasStarted = false;
    this.hasArrived = false;
};

//------------------------------------------------------------------------------
// INHERITANCE
//------------------------------------------------------------------------------

runmysteriet.ui.graphic.Raft.prototype =
    Object.create(rune.display.Graphic.prototype);

runmysteriet.ui.graphic.Raft.prototype.constructor =
    runmysteriet.ui.graphic.Raft;

//------------------------------------------------------------------------------
// START
//------------------------------------------------------------------------------

/**
 * Startar flotten.
 *
 * @return {void}
 */
runmysteriet.ui.graphic.Raft.prototype.start = function() {

    /*
     * VIKTIGT - ta inte bort denna check
     * annars kan rörelsen startas om varje frame och då hackar flotten
     */
    if (this.hasStarted === true || this.hasArrived === true) {
        return;
    }

    this.hasStarted = true;
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

/**
 * Uppdaterar flottens rörelse.
 *
 * @param {number=} step
 * @return {void}
 */
runmysteriet.ui.graphic.Raft.prototype.update = function(step) {

    //Spara position före rörelse.
     
    this.previousX = this.x;

    //Om flotten inte har startat ska den stå still.
     
    if (this.hasStarted !== true || this.hasArrived === true) {
        this.deltaX = 0;
        return;
    }

    //Flytta flotten mjukt åt höger.
     
    this.x += this.speed;

    //Stoppa vid maxX.
     
    if (this.x >= this.maxX) {
        this.x = this.maxX;
        this.hasArrived = true;
    }

    //Hur mycket flotten flyttade denna frame. Spelaren använder detta för att följa med.
     
    this.deltaX = this.x - this.previousX;
};

//------------------------------------------------------------------------------
// REMOVE DISPLAY OBJECT
//------------------------------------------------------------------------------

/**
 * Tar bort display object från stage.
 *
 * @param {?Object} object
 * @return {void}
 */
runmysteriet.ui.graphic.Raft.prototype.removeDisplayObject = function(object) {

    if (!object) {
        return;
    }

    if (object.parent) {
        object.parent.removeChild(object);
        return;
    }

    if (object.stage) {
        object.stage.removeChild(object);
    }
};

//------------------------------------------------------------------------------
// REMOVE
//------------------------------------------------------------------------------

/**
 * Tar bort flotten från stage.
 *
 * @return {void}
 */
runmysteriet.ui.graphic.Raft.prototype.remove = function() {

    this.removeDisplayObject(this);
};

//------------------------------------------------------------------------------
// DISPOSE
//------------------------------------------------------------------------------

/**
 * Rensar Raft.
 *
 * @return {void}
 */
runmysteriet.ui.graphic.Raft.prototype.dispose = function() {

    this.remove();

    this.isRaft = false;
    this.sticky = false;
    this.immovable = false;

    this.startX = 0;
    this.minX = 0;
    this.maxX = 0;

    this.speed = 0;
    this.direction = 0;

    this.previousX = 0;
    this.deltaX = 0;

    this.hasStarted = false;
    this.hasArrived = false;
};