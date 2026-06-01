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


runmysteriet.ui.graphic.VolumeHud.prototype =
    Object.create(rune.text.BitmapField.prototype);

runmysteriet.ui.graphic.VolumeHud.prototype.constructor =
    runmysteriet.ui.graphic.VolumeHud;

/**
 * Sätter ljudobjektet som styr volymen.
 *
 * @this {runmysteriet.ui.graphic.VolumeHud}
 * @param {?Object} sound Ljudobjektet som innehåller volyminformation.
 * @return {void}
 */
runmysteriet.ui.graphic.VolumeHud.prototype.setSound = function(sound) {

    this.sound = sound;
    this.updateText();
};

/**
 * Uppdaterar volymtexten.
 *
 * Uppdaterar texten som visar aktuell volym.
 *
 * @this {runmysteriet.ui.graphic.VolumeHud}
 * @return {void}
 */
runmysteriet.ui.graphic.VolumeHud.prototype.updateText = function() {

    var volume = 0;

    // Om inget ljud finns, visa 0%
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
    // Konvertera volym (0–1) till procent
    volume = Math.round(volume * 100);

    this.text = "VOLUME: " + volume + "%";
};

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

/**
 * Tar bort VolumeHud från stage.
 *
 * @return {void}
 */
runmysteriet.ui.graphic.VolumeHud.prototype.remove = function() {

    this.removeDisplayObject(this);
};

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