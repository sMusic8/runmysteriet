/**
 * Shield UI element.
 * @constructor
 * @extends {rune.display.Graphic}
 */
runmysteriet.ui.Shield = function() {

    rune.display.Graphic.call(this,
        0,
        0,
        40,
        40,
        "shield"
    );

    // Rune manager
    this.runes = new runmysteriet.ui.Rune();

    this.runes.makeAllRunes();

    var randomRune = this.runes.getOneRune();
    console.log("Slumpad rune:", randomRune);

    // Spara runan
    this.runeGraphic = randomRune;

    // Lägg till som child om den finns
    if (this.runeGraphic) {
        this.addChild(this.runeGraphic);

        // centrera i 40x40 sköld
        this.runeGraphic.x = (22 - this.runeGraphic.width) / 2;
        this.runeGraphic.y = (20 - this.runeGraphic.height) / 2;
    }

    /** @type {string} */
    this.rune = "";

    /** @private @type {boolean} */
    this.__collected = false;

    /** @type {boolean} */
    this.active = true;

    // TEXT

    /** @type {rune.text.BitmapField} */
    this.m_text = new rune.text.BitmapField(" ");

    this.m_text.autoSize = true;

    this.addChild(this.m_text);

    // PULSE
    this.m_baseScale = 1.7;
    this.m_pulseSpeed = 0.08;
    this.m_pulseValue = 0;
};

// inheritance
runmysteriet.ui.Shield.prototype = Object.create(rune.display.Graphic.prototype);
runmysteriet.ui.Shield.prototype.constructor = runmysteriet.ui.Shield;

/**
 * Update loop.
 */
runmysteriet.ui.Shield.prototype.update = function() {

    if (this.__collected) return;

    this.m_pulseValue += this.m_pulseSpeed;

    var scale = this.m_baseScale + Math.sin(this.m_pulseValue) * 0.08;

    this.scaleX = scale;
    this.scaleY = scale;
};

/**
 * Centers the text inside the shield.
 */
runmysteriet.ui.Shield.prototype.centerText = function() {

    this.m_text.x = (this.width - this.m_text.width) / 2;
    this.m_text.y = (this.height - this.m_text.height) / 2;
};

/**
 * Sets the rune letter.
 */
runmysteriet.ui.Shield.prototype.setRune = function(letter) {

    this.rune = letter;

    this.m_text.text = letter;

    this.centerText();
};

runmysteriet.ui.Shield.prototype.getRune = function () {
    return this.rune;
};