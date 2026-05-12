//------------------------------------------------------------------------------
// HIGHSCORE MANAGER
//------------------------------------------------------------------------------

/**
 * Hanterar highscore via Rune SDK.
 *
 * Rune SDK sparar highscores i localStorage. En JSON-fil i asset-mappen kan
 * användas som läsbar resurs, men spelet kan inte skriva tillbaka till den
 * filen direkt från webbläsaren.
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

    var name = "PLAYER";
    var score = 0;

    if (!this.application || !this.application.highscores || !entry) {
        return -1;
    }

    name = String(entry.name || "PLAYER").toUpperCase();
    score = parseInt(entry.score, 10) || 0;

    if (score <= 0) {
        return -1;
    }

    if (this.hasSameEntry(name, score)) {
        return -1;
    }

    return this.application.highscores.send(
        score,
        name,
        0
    );
};

/**
 * Hindrar att samma namn + samma score läggs in flera gånger.
 *
 * @param {string} name
 * @param {number} score
 * @return {boolean}
 */
runmysteriet.logic.HighscoreManager.prototype.hasSameEntry = function(name, score) {

    var i = 0;
    var item = null;

    if (!this.application || !this.application.highscores) {
        return false;
    }

    for (i = 0; i < 10; i++) {
        item = this.application.highscores.get(i, 0);

        if (!item) {
            continue;
        }

        if (String(item.name || "").toUpperCase() === name && item.score === score) {
            return true;
        }
    }

    return false;
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
