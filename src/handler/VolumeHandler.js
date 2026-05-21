//------------------------------------------------------------------------------
// VOLUME HANDLER
//------------------------------------------------------------------------------

runmysteriet.handler = runmysteriet.handler || {};

runmysteriet.handler.VolumeHandler = function(audio) {

    this.audio = audio;
    this.step = 0.1;

    this.min = 0;
    this.max = 1;

    console.log("VolumeHandler init");
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

runmysteriet.handler.VolumeHandler.prototype.update = function(input, gamepad, keyboard) {

    if (!this.audio) {
        return;
    }

    var increasePressed =
        (keyboard && keyboard.justPressed("U")) ||
        (gamepad && (gamepad.justPressed("RB") || gamepad.justPressed(5)));

    var decreasePressed =
        (keyboard && keyboard.justPressed("Y")) ||
        (gamepad && (gamepad.justPressed("LB") || gamepad.justPressed(4)));

    // ----------------------------
    // 🔊 VOLUME UP
    // ----------------------------
    if (increasePressed) {

        this.audio.volume += this.step;

        if (this.audio.volume > this.max) {
            this.audio.volume = this.min; // wrap
        }

        console.log("Volym:", this.audio.volume.toFixed(2));
    }

    // ----------------------------
    // 🔉 VOLUME DOWN
    // ----------------------------
    if (decreasePressed) {

        this.audio.volume -= this.step;

        if (this.audio.volume < this.min) {
            this.audio.volume = this.max; // wrap
        }

        console.log("Volym:", this.audio.volume.toFixed(2));
    }
};

//------------------------------------------------------------------------------
// SET AUDIO (om du vill byta musik senare)
//------------------------------------------------------------------------------

runmysteriet.handler.VolumeHandler.prototype.setAudio = function(audio) {
    this.audio = audio;
};