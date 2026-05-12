//------------------------------------------------------------------------------
// HIGHSCORE MANAGER
//------------------------------------------------------------------------------

/**
 * Hanterar highscore via Rune SDK.
 *
 * @constructor
 * @param {!Object} application
 */
runmysteriet.logic.HighscoreManager = function(application) {

    this.application = application;
};

/**
 * Sparar score till Rune highscore.
 *
 * @param {!runmysteriet.logic.HighscoreEntry} entry
 * @return {number}
 */
runmysteriet.logic.HighscoreManager.prototype.save = function(entry) {

    if (!this.application || !this.application.highscores) {
        return -1;
    }

    return this.application.highscores.send(
        entry.score,
        entry.name,
        0
    );
};

/**
 * Hämtar bästa highscore.
 *
 * @return {?Object}
 */
runmysteriet.logic.HighscoreManager.prototype.getBest = function() {

    var item = null;

    if (!this.application || !this.application.highscores) {
        return null;
    }

    item = this.application.highscores.get(0, 0);

    if (!item || item.score <= 0) {
        return null;
    }

    return item;
};