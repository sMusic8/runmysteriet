/**
 * Hanterar skapande och utdelning av runor i UI.
 *
 * @constructor
 */
runmysteriet.ui.Rune = function () {

    /**
     * Lista med alla skapade runor.
     * @type {!Array<!rune.display.Graphic>}
     */
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

    /**
     * Prefix för sprite-filer.
     * @type {string}
     */
    this.filePrefix = "";

    /**
     * Filnamnsdelar för run-sprites.
     * @type {!Array<string>}
     */
    this.fileName = [];
};

/**
 * Skapar alla runor, shufflar dem och returnerar listan.
 *
 * @this {runmysteriet.ui.Rune}
 * @return {!Array<!rune.display.Graphic>} Lista med rune-sprites.
 */
runmysteriet.ui.Rune.prototype.makeAllRunes = function () {

    this.filePrefix = "rune_";
    this.fileName = ["d", "f", "r", "t", "u", "y"];

    this.allRunes = [];

    for (var i = 0; i < this.fileName.length; i++) {

        var spriteName = this.filePrefix + this.fileName[i];

        var runeSprite = new rune.display.Graphic(
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

/**
 * Blandar runorna slumpmässigt (Fisher–Yates shuffle).
 *
 * @this {runmysteriet.ui.Rune}
 * @return {void}
 */
runmysteriet.ui.Rune.prototype.shuffleRunes = function () {

    for (var i = this.allRunes.length - 1; i > 0; i--) {

        var j = Math.floor(Math.random() * (i + 1));

        var temp = this.allRunes[i];
        this.allRunes[i] = this.allRunes[j];
        this.allRunes[j] = temp;
    }
};

/**
 * Returnerar nästa rune från listan (efter shuffle).
 *
 * @this {runmysteriet.ui.Rune}
 * @return {?rune.display.Graphic} En rune eller null om inga finns kvar.
 */
runmysteriet.ui.Rune.prototype.getOneRune = function () {

    if (this.allRunes.length === 0) {
        return null;
    }

    // Ta första runan (efter shuffle)
    this.oneRune = this.allRunes.shift();

    return this.oneRune;
};