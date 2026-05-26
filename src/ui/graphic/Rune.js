//------------------------------------------------------------------------------
// RUNE
//------------------------------------------------------------------------------

/**
 * Skapar och hanterar rune-grafik.
 *
 * @constructor
 */
runmysteriet.ui.Rune = function() {

    this.allRunes = [];

    /**
     * Senast utdelade rune.
     * @type {?rune.display.Graphic}
     */
    this.oneRune = null;

    /**
     * Index för nuvarande position (används ej aktivt i denna implementation).
     * @type {number}
     */
    this.currentIndex = 0;

    this.filePrefix = "rune_";

    this.fileName = [
        "d",
        "f",
        "r",
        "t",
        "u",
        "y"
    ];
};

//------------------------------------------------------------------------------
// CREATE
//------------------------------------------------------------------------------

/**
 * Skapar alla runor och blandar dem.
 *
 * @return {!Array<!rune.display.Graphic>}
 */
runmysteriet.ui.Rune.prototype.makeAllRunes = function() {

    var i = 0;
    var spriteName = "";
    var runeSprite = null;

    this.clear();

    for (i = 0; i < this.fileName.length; i++) {
        spriteName = this.filePrefix + this.fileName[i];

        runeSprite = new rune.display.Graphic(
            0,
            0,
            14,
            20,
            spriteName
        );

        this.allRunes.push(runeSprite);
    }

    this.shuffleRunes();

    return this.allRunes;
};

//------------------------------------------------------------------------------
// SHUFFLE
//------------------------------------------------------------------------------

/**
 * Blandar rune-listan.
 *
 * @return {void}
 */
runmysteriet.ui.Rune.prototype.shuffleRunes = function() {

    var i = 0;
    var j = 0;
    var temp = null;

    for (i = this.allRunes.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));

        temp = this.allRunes[i];
        this.allRunes[i] = this.allRunes[j];
        this.allRunes[j] = temp;
    }
};

//------------------------------------------------------------------------------
// GET
//------------------------------------------------------------------------------

/**
 * Hämtar en rune från listan.
 *
 * @return {?rune.display.Graphic}
 */
runmysteriet.ui.Rune.prototype.getOneRune = function() {

    if (!this.allRunes || this.allRunes.length === 0) {
        return null;
    }

    /*
     * Ta första runan efter shuffle.
     */
    this.oneRune = this.allRunes.shift();

    return this.oneRune;
};

//------------------------------------------------------------------------------
// REMOVE DISPLAY OBJECT
//------------------------------------------------------------------------------

/**
 * Tar bort display object från stage.
 *
 * @param {?Object} object
 * @return {void}
 */
runmysteriet.ui.Rune.prototype.removeDisplayObject = function(object) {

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
// CLEAR
//------------------------------------------------------------------------------

/**
 * Tar bort runor som klassen fortfarande äger.
 *
 * @return {void}
 */
runmysteriet.ui.Rune.prototype.clear = function() {

    var i = 0;
    var runeSprite = null;

    if (this.allRunes) {
        for (i = 0; i < this.allRunes.length; i++) {
            runeSprite = this.allRunes[i];

            this.removeDisplayObject(runeSprite);
        }
    }

    this.removeDisplayObject(this.oneRune);

    this.allRunes = [];
    this.oneRune = null;
    this.currentIndex = 0;
};

//------------------------------------------------------------------------------
// DISPOSE
//------------------------------------------------------------------------------

/**
 * Rensar Rune helt.
 *
 * @return {void}
 */
runmysteriet.ui.Rune.prototype.dispose = function() {

    this.clear();

    this.filePrefix = "";
    this.fileName = [];
};