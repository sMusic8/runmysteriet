//------------------------------------------------------------------------------
// HIGHSCORE MANAGER
//------------------------------------------------------------------------------

/**
 * Hanterar highscore via Rune SDK.
 *
 * Rune SDK sparar highscores i localStorage.
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
 * Rune SDK ansvarar själv för att bara behålla de bästa resultaten.
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

    /*
     * Hindrar samma namn + score från att sparas flera gånger.
     */
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
 * Hämtar alla highscores som Rune har sparat.
 *
 * @return {!Array<!Object>}
 */
runmysteriet.logic.HighscoreManager.prototype.getAll = function() {

    var highscores = [];
    var item = null;
    var i = 0;

    if (!this.application || !this.application.highscores) {
        return highscores;
    }

    for (i = 0; i < 5; i++) {
        item = this.application.highscores.get(i, 0);

        if (!item) {
            continue;
        }

        if (!item.name && !item.score) {
            continue;
        }

        if ((parseInt(item.score, 10) || 0) <= 0) {
            continue;
        }

        highscores.push(item);
    }

    return highscores;
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
            String(item.name || "").toUpperCase() === name &&
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

    if (!this.application || !this.application.highscores) {
        return null;
    }

    item = this.application.highscores.get(0, 0);

    if (!item || item.score <= 0) {
        return null;
    }

    return item;
};

/**
 * Kollar om score hamnar bland de 5 bästa.
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
     * Om Rune har färre än 5 sparade resultat,
     * ska spelaren få skriva namn.
     */
    if (highscores.length < 5) {
        return true;
    }

    /*
     * Rune sparar topplistan på index:
     * 0 = plats 1
     * 1 = plats 2
     * 2 = plats 3
     * 3 = plats 4
     * 4 = plats 5
     */
    lowestTopScore = parseInt(highscores[4].score, 10) || 0;

    /*
     * Score måste vara bättre än plats 5.
     */
    return score > lowestTopScore;
};