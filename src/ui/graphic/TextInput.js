var runmysteriet = runmysteriet || {};
runmysteriet.ui = runmysteriet.ui || {};

runmysteriet.ui.TextInput = function(application) {

    this.application = application;

    this.letters = [
        "a","b","c","d","e","f","g",
        "h","i","j","k","l","m","n",
        "o","p","q","r","s","t",
        "u","v","w","x","y","z"
    ];

    this.index = 0;
};

runmysteriet.ui.TextInput.prototype.update = function(keyboard) {

    var gamepad = null;

    if (this.application &&
        this.application.inputs &&
        this.application.inputs.gamepads) {

        gamepad = this.application.inputs.gamepads.get(0);
    }

    var left = keyboard && keyboard.justPressed("LEFT");
    var right = keyboard && keyboard.justPressed("RIGHT");

    var choose = keyboard && keyboard.justPressed("ENTER");
    var back = keyboard && keyboard.justPressed("BACKSPACE");

    var space = keyboard && keyboard.justPressed("SPACE");

    var gpLeft = gamepad && gamepad.justPressed("LEFT");
    var gpRight = gamepad && gamepad.justPressed("RIGHT");

    var gpChoose = gamepad && gamepad.justPressed("A");
    var gpBack = gamepad && gamepad.justPressed("B");

    left = left || gpLeft;
    right = right || gpRight;
    choose = choose || gpChoose;
    back = back || gpBack;

    if (right) this.index++;
    if (left) this.index--;

    if (this.index < 0) this.index = this.letters.length - 1;
    if (this.index >= this.letters.length) this.index = 0;

    return {
        letter: this.letters[this.index],
        choose: choose,
        back: back,
        space: space
    };
};