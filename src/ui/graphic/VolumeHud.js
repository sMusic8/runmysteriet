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

runmysteriet.ui.graphic.VolumeHud.prototype.setSound = function(sound) {
    this.sound = sound;
    this.updateText();
};

runmysteriet.ui.graphic.VolumeHud.prototype.updateText = function() {

    var volume = 0;

    if (!this.sound) {
        this.text = "VOLUME: 0%";
        return;
    }

    volume = Math.round(this.sound.volume * 100);

    this.text = "VOLUME: " + volume + "%";
};