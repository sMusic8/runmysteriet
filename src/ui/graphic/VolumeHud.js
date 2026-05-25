//------------------------------------------------------------------------------
// VOLUME HUD
//------------------------------------------------------------------------------

/**
 * Visar aktuell volym på skärmen.
 *
 * @constructor
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

    // Konvertera volym (0–1) till procent
    volume = Math.round(this.sound.volume * 100);

    this.text = "VOLUME: " + volume + "%";
};