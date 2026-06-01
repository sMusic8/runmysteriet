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
     * Flotten ska inte röra sig direkt
     */
    this.hasStarted = false;
    this.hasArrived = false;

        /** @type {?rune.display.Graphic} */
    this.m_warningIndicator = null;

    /** @type {?rune.text.BitmapField} */
    this.m_warningText = null;

    /** @type {number} */
    this.m_warningTimer = 0;

    /** @type {boolean} */
    this.m_isWarning = false;

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
// WARNING
//------------------------------------------------------------------------------

/**
 * Sätter om flotten ska visa varning.
 *
 * @param {boolean} value
 * @return {void}
 */
runmysteriet.ui.graphic.Raft.prototype.setWarning = function(value) {

    value = value === true;

    if (this.m_isWarning === value) {
        return;
    }

    this.m_isWarning = value;

    if (this.m_isWarning === true) {
        this.showWarning();
    } else {
        this.hideWarning();
    }
};

/**
 * Visar varning ovanför flotten.
 *
 * @return {void}
 */
runmysteriet.ui.graphic.Raft.prototype.showWarning = function() {

    if (this.m_warningIndicator || this.m_warningText) {
        return;
    }

    if (!this.stage) {
        return;
    }

    this.m_warningIndicator = new rune.display.Graphic(
        this.x + 2,
        this.y - 18,
        80,
        16,
        "boat_indicator"
    );

    this.m_warningText = new rune.text.BitmapField("DANGER,WAIT");
    this.m_warningText.autoSize = true;
    this.m_warningText.x = this.x + 7;
    this.m_warningText.y = this.y - 17;

    this.stage.addChild(this.m_warningIndicator);
    this.stage.addChild(this.m_warningText);

    this.m_warningTimer = 0;
};
/**
 * Tar bort varningen från flotten.
 *
 * @return {void}
 */
runmysteriet.ui.graphic.Raft.prototype.hideWarning = function() {

    if (this.m_warningIndicator) {
        this.removeDisplayObject(this.m_warningIndicator);
        this.m_warningIndicator = null;
    }

    if (this.m_warningText) {
        this.removeDisplayObject(this.m_warningText);
        this.m_warningText = null;
    }

    this.m_warningTimer = 0;
};

/**
 * Uppdaterar blinkande varning.
 *
 * @return {void}
 */
runmysteriet.ui.graphic.Raft.prototype.updateWarning = function() {

    var alpha = 1;

    if (this.m_isWarning !== true) {
        return;
    }

    if (!this.m_warningIndicator || !this.m_warningText) {
        this.showWarning();
    }

    if (!this.m_warningIndicator || !this.m_warningText) {
        return;
    }

    this.m_warningTimer += 0.20;

    alpha = 0.50 + Math.abs(Math.sin(this.m_warningTimer)) * 0.65;

    this.m_warningIndicator.x = this.x + 2;
    this.m_warningIndicator.y = this.y - 18;

    this.m_warningText.x = this.x + 7;
    this.m_warningText.y = this.y - 17;

    this.m_warningIndicator.alpha = alpha;
    this.m_warningText.alpha = alpha;
};

//------------------------------------------------------------------------------
// COLLISION
//------------------------------------------------------------------------------

/**
 * Returnerar flottens övre kollisionsyta.
 *
 * @return {number}
 */
runmysteriet.ui.graphic.Raft.prototype.getCollisionTop = function() {
    return this.y;
};

/**
 * Returnerar flottens vänstra kollisionsgräns.
 * Gör flotten mindre känslig från vänster kant.
 *
 * @return {number}
 */
runmysteriet.ui.graphic.Raft.prototype.getCollisionLeft = function() {
    return this.x + 10;
};

/**
 * Returnerar flottens högra kollisionsgräns.
 * Gör flotten mindre känslig från höger kant.
 *
 * @return {number}
 */
runmysteriet.ui.graphic.Raft.prototype.getCollisionRight = function() {
    return this.x + this.width - 10;
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

    this.updateWarning();

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

    //Hur mycket flotten flyttade denna frame och spelaren använder detta för att följa med flotten
     
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
 * Tar bort flotten från stage
 *
 * @return {void}
 */
runmysteriet.ui.graphic.Raft.prototype.remove = function() {
    this.hideWarning();
    this.removeDisplayObject(this);
};

//------------------------------------------------------------------------------
// DISPOSE
//------------------------------------------------------------------------------

/**
 * Rensar Raft
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

    this.m_warningIndicator = null;
    this.m_warningText = null;
    this.m_warningTimer = 0;
    this.m_isWarning = false;
};