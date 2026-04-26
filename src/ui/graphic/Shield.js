//------------------------------------------------------------------------------
// SHIELD
//------------------------------------------------------------------------------

var runmysteriet = runmysteriet || {};
runmysteriet.ui = runmysteriet.ui || {};

runmysteriet.ui.Shield = function() {

    rune.display.Graphic.call(this,
        0,
        0,
        40,
        40,
        "shield"
    );

    this.rune = "";
    this.__collected = false;
    this.active = true;

    //------------------------------------------------------------------------------ 
    // TEXT
    //------------------------------------------------------------------------------

    this.m_text = new rune.text.BitmapField("");
    this.m_text.autoSize = true;

    this.addChild(this.m_text);

    //------------------------------------------------------------------------------ 
    // PULS
    //------------------------------------------------------------------------------

    this.m_baseScale = 1;
    this.m_pulseSpeed = 0.05;
    this.m_pulseValue = 0;
};

// inheritance
runmysteriet.ui.Shield.prototype = Object.create(rune.display.Graphic.prototype);
runmysteriet.ui.Shield.prototype.constructor = runmysteriet.ui.Shield;

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

runmysteriet.ui.Shield.prototype.update = function() {

    if (this.__collected) return;

    this.m_pulseValue += this.m_pulseSpeed;

    var scale = this.m_baseScale + Math.sin(this.m_pulseValue) * 0.08;

    this.scaleX = scale;
    this.scaleY = scale;
};

//------------------------------------------------------------------------------
// CENTER TEXT (VIKTIG FIX)
//------------------------------------------------------------------------------

runmysteriet.ui.Shield.prototype.centerText = function() {

    // center baserat på textens storlek
    this.m_text.x = (this.width - this.m_text.width) / 2;
    this.m_text.y = (this.height - this.m_text.height) / 2;
};

//------------------------------------------------------------------------------
// SET LETTER
//------------------------------------------------------------------------------

runmysteriet.ui.Shield.prototype.setRune = function(letter) {

    this.rune = letter;

    this.m_text.text = letter;

    // 🔥 centrera EFTER att texten satts
    this.centerText();

    console.log("Shield letter:", letter);
};