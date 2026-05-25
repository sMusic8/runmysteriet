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

    this.runes = new runmysteriet.ui.Rune();

    this.runes.makeAllRunes();

    var randomRune = this.runes.getOneRune();
    console.log("Slumpad rune:", randomRune);

    //Spara runan
    this.runeGraphic = randomRune;

    //Lägg till som child om den finns
    if (this.runeGraphic) {
        this.addChild(this.runeGraphic);

        //Centrera i 40x40 sköld
        this.runeGraphic.x = (22 - this.runeGraphic.width) / 2;
        this.runeGraphic.y = (20 - this.runeGraphic.height) / 2;
    }

    /** @type {string} */
    this.rune = "";

    /** @private @type {boolean} */
    this.__collected = false;

    /** @type {boolean} */
    this.active = true;

    /** @type {rune.text.BitmapField} */
    this.m_text = new rune.text.BitmapField(" ");

    this.m_text.autoSize = true;

    this.addChild(this.m_text);

    // PULSE
    this.m_baseScale = 1.7;
    this.m_pulseSpeed = 0.08;
    this.m_pulseValue = 0;
};

//Inheritance
runmysteriet.ui.Shield.prototype = Object.create(rune.display.Graphic.prototype);
runmysteriet.ui.Shield.prototype.constructor = runmysteriet.ui.Shield;

/**
 * Uppdateringsloop för shield.
 * Sköter pulserande animation och scaling.
 *
 * @this {runmysteriet.ui.Shield}
 * @return {void}
 */
runmysteriet.ui.Shield.prototype.update = function() {

    //Hoppa över update om skölden redan är insamlad
    if (this.__collected) return;

    this.m_pulseValue += this.m_pulseSpeed;

    var scale = this.m_baseScale + Math.sin(this.m_pulseValue) * 0.08;

    this.scaleX = scale;
    this.scaleY = scale;
};

/**
 * Centrerar texten inne i skölden.
 *
 * @this {runmysteriet.ui.Shield}
 * @return {void}
 */
runmysteriet.ui.Shield.prototype.centerText = function() {

    this.m_text.x = (this.width - this.m_text.width) / 2;
    this.m_text.y = (this.height - this.m_text.height) / 2;
};
/**
 * Sätter runans bokstav och uppdaterar texten i shielden.
 *
 * @this {runmysteriet.ui.Shield}
 * @param {string} letter Bokstaven som ska visas på runan.
 * @return {void}
 */
runmysteriet.ui.Shield.prototype.setRune = function(letter) {

    this.rune = letter;

    this.m_text.text = letter;

    // Recentrera texten efter uppdatering
    this.centerText();
};

/**
 * Returnerar aktuell rune-bokstav.
 *
 * @this {runmysteriet.ui.Shield}
 * @return {string} Den aktuella runan.
 */
runmysteriet.ui.Shield.prototype.getRune = function () {
    return this.rune;
};