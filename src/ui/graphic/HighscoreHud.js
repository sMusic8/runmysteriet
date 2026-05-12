//------------------------------------------------------------------------------
// HIGHSCORE HUD
//------------------------------------------------------------------------------

/**
 * Visar bästa highscore på skärmen.
 *
 * @constructor
 * @extends rune.text.BitmapField
 *
 * @param {!Object} application
 */
runmysteriet.ui.graphic.HighscoreHud = function(application) {

    rune.text.BitmapField.call(this, "HIGHSCORE: -");

    this.application = application;

    this.autoSize = true;
    this.scale = 0.7;

    this.reload();
};

//------------------------------------------------------------------------------
// INHERITANCE
//------------------------------------------------------------------------------

runmysteriet.ui.graphic.HighscoreHud.prototype =
    Object.create(rune.text.BitmapField.prototype);

runmysteriet.ui.graphic.HighscoreHud.prototype.constructor =
    runmysteriet.ui.graphic.HighscoreHud;

//------------------------------------------------------------------------------
// PUBLIC METHODS
//------------------------------------------------------------------------------

/**
 * Laddar om highscore-texten.
 *
 * @return {undefined}
 */
runmysteriet.ui.graphic.HighscoreHud.prototype.reload = function() {

    var highscore = null;
    var name = "";
    var score = 0;

    if (!this.application || !this.application.highscores) {
        this.text = "HIGHSCORE: -";
        return;
    }

    highscore = this.application.highscores.get(0, 0);

    if (!highscore) {
        this.text = "HIGHSCORE: -";
        return;
    }

    name = highscore.name || highscore.username || "PLAYER";
    score = highscore.score || 0;

    if (score <= 0) {
        this.text = "HIGHSCORE: -";
        return;
    }

    this.text = "HIGHSCORE: " + name + " " + score;
};