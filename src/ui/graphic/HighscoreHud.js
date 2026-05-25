//------------------------------------------------------------------------------
// HIGHSCORE HUD
//------------------------------------------------------------------------------

/**
 * Visar highscore på skärmen.
 *
 * Om maxItems är 1 visas bara bästa highscore.
 * Om maxItems är 5 visas top 5-lista.
 *
 * @constructor
 * @extends rune.text.BitmapField
 *
 * @param {!Object} application
 * @param {number=} maxItems
 */
runmysteriet.ui.graphic.HighscoreHud = function(application, maxItems) {

    rune.text.BitmapField.call(this, "HIGHSCORE: -");

    this.application = application;

    /*
     * 1 = visa bara bästa highscore.
     * 5 = visa top 5.
     */
    this.m_maxItems = maxItems || 1;

    this.autoSize = true;

    this.reload();
};

runmysteriet.ui.graphic.HighscoreHud.prototype =
    Object.create(rune.text.BitmapField.prototype);

runmysteriet.ui.graphic.HighscoreHud.prototype.constructor =
    runmysteriet.ui.graphic.HighscoreHud;


/**
 * Laddar om highscore-texten.
 *
 * @return {undefined}
 */
runmysteriet.ui.graphic.HighscoreHud.prototype.reload = function() {

    if (!this.application || !this.application.highscores) {
        this.text = "HIGHSCORE: -";
        return;
    }

    if (this.m_maxItems <= 1) {
        this.text = this.createBestText();
    } else {
        this.text = this.createTopListText();
    }
};

/**
 * Skapar text för bästa highscore.
 *
 * @return {string}
 */
runmysteriet.ui.graphic.HighscoreHud.prototype.createBestText = function() {

    var item = null;
    var name = "";
    var score = 0;

    item = this.application.highscores.get(0, 0);

    if (!item) {
        return "HIGHSCORE: \n-";
    }

    name = item.name || item.username || "PLAYER";
    score = parseInt(item.score, 10) || 0;

    if (score <= 0) {
        return "HIGHSCORE: \n-";
    }

    return "HIGHSCORE: \n" + name + " " + score;
};

/**
 * Skapar text för top 5-listan.
 *
 * @return {string}
 */
runmysteriet.ui.graphic.HighscoreHud.prototype.createTopListText = function() {

    var lines = [];
    var item = null;
    var name = "";
    var score = 0;
    var i = 0;
    var count = 0;

    lines.push("TOP 5 HIGHSCORE");

    for (i = 0; i < this.m_maxItems; i++) {

        item = this.application.highscores.get(i, 0);

        if (!item) {
            continue;
        }

        score = parseInt(item.score, 10) || 0;

        if (score <= 0) {
            continue;
        }

        name = item.name || item.username || "PLAYER";

        count++;

        lines.push(count + ". " + name + " " + score);
    }

    if (count === 0) {
        lines.push("-");
    }

    return lines.join("\n");
};