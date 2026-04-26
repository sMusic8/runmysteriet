//------------------------------------------------------------------------------
// SHIELD
//------------------------------------------------------------------------------

var runmysteriet = runmysteriet || {};
runmysteriet.ui = runmysteriet.ui || {};

runmysteriet.ui.Shield = function() {

    rune.display.Graphic.call(this,
        0,
        0,
        20,
        20,
        "shield"
    );

    // bokstav per sköld
    this.rune = "";
    this.__collected = false;
    this.active = true;
};

// inheritance
runmysteriet.ui.Shield.prototype = Object.create(rune.display.Graphic.prototype);
runmysteriet.ui.Shield.prototype.constructor = runmysteriet.ui.Shield;

//------------------------------------------------------------------------------
// SET LETTER
//------------------------------------------------------------------------------

runmysteriet.ui.Shield.prototype.setRune = function(letter) {

    this.rune = letter;

    // DEBUG (NU KOMMER DET FUNKA)
    console.log("Shield received letter:", this.rune);
};