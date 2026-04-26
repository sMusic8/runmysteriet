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

    this.rune = "";

    this.__collected = false;
    this.active = true;

    // ⭐ PULS DATA
    this.m_baseScale = 1;
    this.m_pulseSpeed = 0.05;
    this.m_pulseValue = 0;
};

// inheritance
runmysteriet.ui.Shield.prototype = Object.create(rune.display.Graphic.prototype);
runmysteriet.ui.Shield.prototype.constructor = runmysteriet.ui.Shield;

//------------------------------------------------------------------------------
// UPDATE (PULS)
//------------------------------------------------------------------------------

runmysteriet.ui.Shield.prototype.update = function() {

    if (this.__collected) return;

    this.m_pulseValue += this.m_pulseSpeed;

    var scale = this.m_baseScale + Math.sin(this.m_pulseValue) * 0.05;

    this.scaleX = scale;
    this.scaleY = scale;
};

//------------------------------------------------------------------------------
// SET LETTER
//------------------------------------------------------------------------------

runmysteriet.ui.Shield.prototype.setRune = function(letter) {

    this.rune = letter;

    console.log("Shield received letter:", this.rune);
};