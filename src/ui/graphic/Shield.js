var runmysteriet = runmysteriet || {};
runmysteriet.ui = runmysteriet.ui || {};

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

    /** @type {string} */
    this.rune = "";

    /** @private @type {boolean} */
    this.__collected = false;

    /** @type {boolean} */
    this.active = true;

    // TEXT

    /** @type {rune.text.BitmapField} */
    this.m_text = new rune.text.BitmapField("");

    this.m_text.autoSize = true;

    this.addChild(this.m_text);

    // PULSE

    /** @private @type {number} */
    this.m_baseScale = 1;

    /** @private @type {number} */
    this.m_pulseSpeed = 0.05;

    /** @private @type {number} */
    this.m_pulseValue = 0;
};

// inheritance
runmysteriet.ui.Shield.prototype = Object.create(rune.display.Graphic.prototype);
runmysteriet.ui.Shield.prototype.constructor = runmysteriet.ui.Shield;

/**
 * Update loop.
 * @return {void}
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
 * @return {void}
 */
runmysteriet.ui.Shield.prototype.centerText = function() {

    this.m_text.x = (this.width - this.m_text.width) / 2;
    this.m_text.y = (this.height - this.m_text.height) / 2;
};

/**
 * Sets the rune letter.
 * @param {string} letter
 * @return {void}
 */
runmysteriet.ui.Shield.prototype.setRune = function(letter) {

    this.rune = letter;

    this.m_text.text = letter;

    this.centerText();

    console.log("Shield letter:", letter);
};
runmysteriet.ui.Shield.prototype.getRune = function () {
    return this.rune;
};