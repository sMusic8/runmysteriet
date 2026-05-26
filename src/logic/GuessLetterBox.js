//------------------------------------------------------------------------------
// GUESS LETTER BOX
//------------------------------------------------------------------------------

runmysteriet.logic = runmysteriet.logic || {};

/**
 * En ruta för en bokstav i GuessWord.
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
};

//------------------------------------------------------------------------------
// CREATE
//------------------------------------------------------------------------------

/**
 * Skapar boxen och texterna.
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

    this.box.backgroundColor = "#ffffff";
    stage.addChild(this.box);

    /*
     * Skapa inte BitmapField med tom text.
     * Rune kan krascha om texten får 0 i bredd/höjd.
     */
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

//------------------------------------------------------------------------------
// LETTER STATE
//------------------------------------------------------------------------------

/**
 * Visar en låst/insamlad bokstav.
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
 * Visar den bokstav spelaren bläddrar till.
 *
 * @param {string} letter
 * @return {void}
 */
runmysteriet.logic.GuessLetterBox.prototype.setPreviewLetter = function(letter) {

    if (this.letterText) {
        this.letterText.text = String(letter || "A").toUpperCase();
        this.letterText.visible = true;
    }
};

/**
 * Tömmer bara den visuella bokstaven i boxen.
 * Tar inte bort displayobjekten från stage.
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

    if (this.box) {
        if (active === true) {
            this.box.backgroundColor = "#0000ff";
        } else {
            this.box.backgroundColor = "#008100";
        }
    }

    if (this.upArrowText) {
        this.upArrowText.visible = active === true;
    }

    if (this.downArrowText) {
        this.downArrowText.visible = active === true;
    }
};

//------------------------------------------------------------------------------
// REMOVE DISPLAY OBJECT
//------------------------------------------------------------------------------

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

//------------------------------------------------------------------------------
// DISPOSE
//------------------------------------------------------------------------------

/**
 * Rensar ut GuessLetterBox helt
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

    this.index = 0;
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
};
