//------------------------------------------------------------------------------
// SCENE DELAY
//------------------------------------------------------------------------------

/**
 * Hanterar en fördröjning innan en callback körs.
 *
 * @constructor
 * @param {number=} delayFrames Antal frames att vänta.
 * @param {Function=} onComplete Funktion som körs när tiden är slut.
 */
runmysteriet.logic.SceneDelay = function(delayFrames, onComplete) {

    /** @type {number} */
    this.m_delayFrames = delayFrames || 90;

    /** @type {number} */
    this.m_timer = 0;

    /** @type {boolean} */
    this.m_active = false;

    /** @type {?Function} */
    this.m_onComplete = onComplete || null;

};

/**
 * Startar fördröjningen.
 *
 * @param {number=} delayFrames valfritt nytt antal frames.
 * @return {void}
 */
runmysteriet.logic.SceneDelay.prototype.start = function(delayFrames) {

    if (typeof delayFrames === "number") {
        this.m_delayFrames = delayFrames;
    }

    this.m_timer = this.m_delayFrames;
    this.m_active = true;
};

/**
 * Uppdaterar timern.
 *
 * @return {void}
 */
runmysteriet.logic.SceneDelay.prototype.update = function() {

    if (this.m_active !== true) {
        return;
    }

    if (this.m_timer > 0) {
        this.m_timer--;
    }

    if (this.m_timer <= 0) {
        this.complete();
    }
};

/**
 * Kör callback och stoppar fördröjningen.
 *
 * @return {void}
 */
runmysteriet.logic.SceneDelay.prototype.complete = function() {

    this.m_active = false;
    this.m_timer = 0;

    if (this.m_onComplete) {
        this.m_onComplete();
    }
};

/**
 * Avbryter fördröjningen.
 *
 * @return {void}
 */
runmysteriet.logic.SceneDelay.prototype.cancel = function() {

    this.m_active = false;
    this.m_timer = 0;
};

/**
 * Returnerar om fördröjningen är aktiv.
 *
 * @return {boolean}
 */
runmysteriet.logic.SceneDelay.prototype.isActive = function() {

    return this.m_active === true;
};

/**
 * Returnerar antal frames som är kvar.
 *
 * @return {number}
 */
runmysteriet.logic.SceneDelay.prototype.getRemainingFrames = function() {

    return this.m_timer;
};

/**
 * Returnerar antal sekunder som är kvar.
 *
 * @param {number=} fps Frames per second. Standard är 30.
 * @return {number}
 */
runmysteriet.logic.SceneDelay.prototype.getRemainingSeconds = function(fps) {

    fps = fps || 30;

    return Math.ceil(this.m_timer / fps);
};

/**
 * Rensar SceneDelay.
 *
 * @return {void}
 */
runmysteriet.logic.SceneDelay.prototype.dispose = function() {

    this.cancel();

    this.m_delayFrames = 0;
    this.m_onComplete = null;
};