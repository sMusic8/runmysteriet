runmysteriet.ui.Rune = function () {
    this.allRunes = [];
    this.oneRune = null;
    this.currentIndex = 0;
};

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

runmysteriet.ui.Rune.prototype.shuffleRunes = function () {

    for (var i = this.allRunes.length - 1; i > 0; i--) {

        var j = Math.floor(Math.random() * (i + 1));

        var temp = this.allRunes[i];
        this.allRunes[i] = this.allRunes[j];
        this.allRunes[j] = temp;
    }
};

runmysteriet.ui.Rune.prototype.getOneRune = function () {

    if (this.allRunes.length === 0) {
        return null;
    }

    // ta första runan (efter shuffle)
    this.oneRune = this.allRunes.shift();

    return this.oneRune;
};