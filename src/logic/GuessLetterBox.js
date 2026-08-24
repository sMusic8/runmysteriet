//------------------------------------------------------------------------------
// GUESS LETTER BOX
//------------------------------------------------------------------------------
/**
 *
 * @constructor
 * @param {number} x
 * @param {number} y
 * @param {number} index
 */
runmysteriet.logic.GuessLetterBox = function(x, y, index) {

    /** @type {number} */
    this.x = x || 0;

    /** @type {number} */
    this.y = y || 0;

    /** @type {number} */
    this.index = index || 0;

    /** @type {number} */
    this.width = 28;

    /** @type {number} */
    this.height = 28;

    /** @type {?rune.display.Graphic} */
    this.box = null;

    /** @type {?rune.text.BitmapField} */
    this.letterText = null;

    /** @type {?rune.text.BitmapField} */
    this.upArrowText = null;

    /** @type {?rune.text.BitmapField} */
    this.downArrowText = null;

    /** @type {string} */
    this.foundColor = "#4e8f4e";

    /** @type {string} */
    this.emptyColor = "#3d3d6f";
};

/**
 * Skapar boxen och texterna
 *
 * @param {!Object} stage
 * @return {void}
 */
runmysteriet.logic.GuessLetterBox.prototype.create = function(stage) {

    this.box = new rune.display.Graphic(
        this.x,
        this.y,
        this.width,
        this.height
    );

    this.box.backgroundColor = this.emptyColor;
    stage.addChild(this.box);

    this.letterText = new rune.text.BitmapField("A");
    this.letterText.autoSize = true;
    this.letterText.x = this.x + 9;
    this.letterText.y = this.y + 8;
    this.letterText.visible = false;
    stage.addChild(this.letterText);

    this.upArrowText = new rune.text.BitmapField("UP");
    this.upArrowText.autoSize = true;
    this.upArrowText.x = this.x + 3;
    this.upArrowText.y = this.y - 18;
    this.upArrowText.visible = false;
    stage.addChild(this.upArrowText);

    this.downArrowText = new rune.text.BitmapField("DN");
    this.downArrowText.autoSize = true;
    this.downArrowText.x = this.x + 3;
    this.downArrowText.y = this.y + 30;
    this.downArrowText.visible = false;
    stage.addChild(this.downArrowText);
};

/**
 *
 * @param {string} letter
 * @return {void}
 */
runmysteriet.logic.GuessLetterBox.prototype.setFound = function(letter) {

    this.setLetter(letter);
    this.setBoxColor(this.foundColor);
    this.setArrowsVisible(false);
};

/**
 * Visar den bokstav spelaren bläddrar 

 * @param {string} letter
 * @return {void}
 */
runmysteriet.logic.GuessLetterBox.prototype.setPreview = function(letter) {

    this.setLetter(letter);
    this.setBoxColor(this.emptyColor);
    this.setArrowsVisible(true);
};

/**
 * Visar en tom ej hittad ruta
 * tomma rutor ska vara blå
 *
 * @return {void}
 */
runmysteriet.logic.GuessLetterBox.prototype.setEmpty = function() {

    this.clear();
    this.setBoxColor(this.emptyColor);
    this.setArrowsVisible(false);
};

/**
 * Visar en insamlad runa
 *
 * @param {string} letter
 * @return {void}
 */
runmysteriet.logic.GuessLetterBox.prototype.setLetter = function(letter) {

    if (this.letterText) {
        this.letterText.text = String(letter || "A").toUpperCase();
        this.letterText.visible = true;
    }
};

/**
 * Visar den bokstav spelaren bläddrar till
 *
 * @param {string} letter
 * @return {void}
 */
runmysteriet.logic.GuessLetterBox.prototype.setPreviewLetter = function(letter) {

    this.setLetter(letter);
};

/**
 * Tar inte bort displayobjekten från stage bara den bokstav som visas i box
 *
 * @return {void}
 */
runmysteriet.logic.GuessLetterBox.prototype.clear = function() {

    if (this.letterText) {
        this.letterText.visible = false;
    }
};

/**
 * Markerar om boxen är aktiv.
 *
 * @param {boolean} active
 * @return {void}
 */
runmysteriet.logic.GuessLetterBox.prototype.setActive = function(active) {

    if (active === true) {
        this.setBoxColor(this.emptyColor);
        this.setArrowsVisible(true);
    } else {
        this.setBoxColor(this.foundColor);
        this.setArrowsVisible(false);
    }
};

/**
 * Sätter färg på boxen.
 *
 * @param {string} color
 * @return {void}
 */
runmysteriet.logic.GuessLetterBox.prototype.setBoxColor = function(color) {

    if (this.box) {
        this.box.backgroundColor = color;
    }
};

/**
 * Visar eller döljer UP/DN.
 *
 * @param {boolean} visible
 * @return {void}
 */
runmysteriet.logic.GuessLetterBox.prototype.setArrowsVisible = function(visible) {

    if (this.upArrowText) {
        this.upArrowText.visible = visible === true;
    }

    if (this.downArrowText) {
        this.downArrowText.visible = visible === true;
    }
};

/**
 * Tar bort ett display object från stage.
 *
 * @param {?Object} object
 * @return {void}
 */
runmysteriet.logic.GuessLetterBox.prototype.removeDisplayObject = function(object) {

    if (!object) {
        return;
    }

    if (object.parent) {
        object.parent.removeChild(object);
        return;
    }

    if (object.stage) {
        object.stage.removeChild(object);
    }
};

/**
 * Rensar ut GuessLetterBox helt.
 *
 * @return {void}
 */
runmysteriet.logic.GuessLetterBox.prototype.dispose = function() {

    this.removeDisplayObject(this.downArrowText);
    this.removeDisplayObject(this.upArrowText);
    this.removeDisplayObject(this.letterText);
    this.removeDisplayObject(this.box);

    this.box = null;
    this.letterText = null;
    this.upArrowText = null;
    this.downArrowText = null;

    this.foundColor = "";
    this.emptyColor = "";

    this.index = 0;
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
};