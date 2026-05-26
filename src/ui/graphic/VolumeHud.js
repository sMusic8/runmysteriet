//------------------------------------------------------------------------------
// VOLUME HUD
//------------------------------------------------------------------------------

/**
 * Visar aktuell volym på skärmen.
 *
 * @constructor
 * @extends {rune.text.BitmapField}
 * @param {!Object} application
 * @param {?Object} sound
 */
runmysteriet.ui.graphic.VolumeHud = function(application, sound) {

    rune.text.BitmapField.call(this, "VOLUME: 0%");

    this.application = application;
    this.sound = sound;

    this.autoSize = true;

    this.x = 15;
    this.y = 15;

    this.updateText();
};

//------------------------------------------------------------------------------
// INHERITANCE
//------------------------------------------------------------------------------

runmysteriet.ui.graphic.VolumeHud.prototype =
    Object.create(rune.text.BitmapField.prototype);

runmysteriet.ui.graphic.VolumeHud.prototype.constructor =
    runmysteriet.ui.graphic.VolumeHud;

//------------------------------------------------------------------------------
// PUBLIC METHODS
//------------------------------------------------------------------------------

/**
 * Byter vilket ljud HUD:en ska läsa volym från.
 *
 * @param {?Object} sound
 * @return {void}
 */
runmysteriet.ui.graphic.VolumeHud.prototype.setSound = function(sound) {

    this.sound = sound;
    this.updateText();
};

/**
 * Uppdaterar volymtexten.
 *
 * @return {void}
 */
runmysteriet.ui.graphic.VolumeHud.prototype.updateText = function() {

    var volume = 0;

    if (!this.sound) {
        this.text = "VOLUME: 0%";
        return;
    }

    volume = parseFloat(this.sound.volume);

    if (isNaN(volume)) {
        volume = 0;
    }

    if (volume < 0) {
        volume = 0;
    }

    if (volume > 1) {
        volume = 1;
    }

    volume = Math.round(volume * 100);

    this.text = "VOLUME: " + volume + "%";
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
runmysteriet.ui.graphic.VolumeHud.prototype.removeDisplayObject = function(object) {

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
 * Tar bort VolumeHud från stage.
 *
 * @return {void}
 */
runmysteriet.ui.graphic.VolumeHud.prototype.remove = function() {

    this.removeDisplayObject(this);
};

//------------------------------------------------------------------------------
// DISPOSE
//------------------------------------------------------------------------------

/**
 * Rensar VolumeHud.
 *
 * @return {void}
 */
runmysteriet.ui.graphic.VolumeHud.prototype.dispose = function() {

    this.remove();

    this.application = null;
    this.sound = null;
    this.text = "";
};