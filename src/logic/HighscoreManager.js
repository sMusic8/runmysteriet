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
 * Hämtar alla highscores, max 5 st.
 *
 * @return {!Array<!Object>}
 */
runmysteriet.logic.HighscoreManager.prototype.getAll = function() {

    var highscores = [];
    var item = null;
    var score = 0;
    var i = 0;

    if (!this.application || !this.application.highscores) {
        return highscores;
    }

    for (i = 0; i < 5; i++) {
        item = this.application.highscores.get(i, 0);

        if (!item) {
            continue;
        }

        score = parseInt(item.score, 10) || 0;

        if (score <= 0) {
            continue;
        }

        highscores.push(item);
    }

    return highscores;
};

/**
 * Kollar om score hamnar på top 5-listan.
 *
 * @param {number} score
 * @return {boolean}
 */
runmysteriet.logic.HighscoreManager.prototype.isNewRecord = function(score) {

    var highscores = null;
    var lowestTopScore = 0;

    score = parseInt(score, 10) || 0;

    if (score <= 0) {
        return false;
    }

    highscores = this.getAll();

    /*
     * Om färre än 5 finns sparade ska spelaren få skriva namn.
     */
    if (highscores.length < 5) {
        return true;
    }
    lowestTopScore = parseInt(highscores[4].score, 10) || 0;

    return score > lowestTopScore;
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

    for (i = 0; i < 5; i++) {
        item = this.application.highscores.get(i, 0);

        if (!item) {
            continue;
        }

        if (
            String(item.name || item.username || "").toUpperCase() === name &&
            parseInt(item.score, 10) === score
        ) {
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
    var score = 0;

    if (!this.application || !this.application.highscores) {
        return null;
    }

    item = this.application.highscores.get(0, 0);

    if (!item) {
        return null;
    }

    score = parseInt(item.score, 10) || 0;

    if (score <= 0) {
        return null;
    }

    return item;
};