//------------------------------------------------------------------------------
// HIGHSCORE MANAGER
//------------------------------------------------------------------------------

/**
 * Hanterar highscore via Rune SDK.
 *
 * Rune SDK sparar highscores i localStorage.
 * Spelet ska inte skriva tillbaka till JSON-filen i asset-mappen.
 *
 * @constructor
 * @param {!Object} application
 */
runmysteriet.logic.HighscoreManager = function(application) {

    /** @type {!Object} */
    this.application = application;
};

//------------------------------------------------------------------------------
// SAVE
//------------------------------------------------------------------------------

/**
 * Sparar score till Rune highscore.
 *
 * @param {!runmysteriet.logic.HighscoreEntry} entry
 * @return {number}
 */
runmysteriet.logic.HighscoreManager.prototype.save = function(entry) {

    var name = "";
    var score = 0;

    if (!this.hasHighscoreSystem()) {
        return -1;
    }

    if (!entry) {
        return -1;
    }

    name = this.normalizeName(entry.name);
    score = this.normalizeScore(entry.score);

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

//------------------------------------------------------------------------------
// GET
//------------------------------------------------------------------------------

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

    if (!this.hasHighscoreSystem()) {
        return highscores;
    }

    for (i = 0; i < 5; i++) {
        item = this.application.highscores.get(i, 0);

        if (!item) {
            continue;
        }

        score = this.normalizeScore(item.score);

        if (score <= 0) {
            continue;
        }

        highscores.push(item);
    }

    return highscores;
};

/**
 * Hämtar bästa highscore.
 *
 * @return {?Object}
 */
runmysteriet.logic.HighscoreManager.prototype.getBest = function() {

    var item = null;
    var score = 0;

    if (!this.hasHighscoreSystem()) {
        return null;
    }

    item = this.application.highscores.get(0, 0);

    if (!item) {
        return null;
    }

    score = this.normalizeScore(item.score);

    if (score <= 0) {
        return null;
    }

    return item;
};

//------------------------------------------------------------------------------
// TOP 5 CHECK
//------------------------------------------------------------------------------

/**
 * Kollar om score hamnar på top 5-listan.
 *
 * @param {number} score
 * @return {boolean}
 */
runmysteriet.logic.HighscoreManager.prototype.isNewRecord = function(score) {

    var highscores = null;
    var lowestTopScore = 0;

    score = this.normalizeScore(score);

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

    lowestTopScore = this.getLowestTopScore();

    return score > lowestTopScore;
};

/**
 * Hämtar lägsta score på top 5-listan.
 *
 * @return {number}
 */
runmysteriet.logic.HighscoreManager.prototype.getLowestTopScore = function() {

    var highscores = null;
    var item = null;

    highscores = this.getAll();

    if (highscores.length < 5) {
        return 0;
    }

    /*
     * Rune-listan antas vara sorterad:
     * 0 = plats 1
     * 4 = plats 5
     */
    item = highscores[4];
    if (!item) {
        return 0;
    }

    return this.normalizeScore(item.score);
};

//------------------------------------------------------------------------------
// DUPLICATE CHECK
//------------------------------------------------------------------------------

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
    var itemName = "";
    var itemScore = 0;

    if (!this.hasHighscoreSystem()) {
        return false;
    }

    name = this.normalizeName(name);
    score = this.normalizeScore(score);

    for (i = 0; i < 5; i++) {
        item = this.application.highscores.get(i, 0);

        if (!item) {
            continue;
        }

        itemName = this.normalizeName(item.name || item.username);
        itemScore = this.normalizeScore(item.score);

        if (itemName === name && itemScore === score) {
            return true;
        }
    }

    return false;
};

//------------------------------------------------------------------------------
// HELPERS
//------------------------------------------------------------------------------

/**
 * Kontrollerar att Rune highscore-system finns.
 *
 * @return {boolean}
 */
runmysteriet.logic.HighscoreManager.prototype.hasHighscoreSystem = function() {

    return (
        this.application &&
        this.application.highscores
    );
};

/**
 * Normaliserar namn.
 *
 * @param {string=} name
 * @return {string}
 */
runmysteriet.logic.HighscoreManager.prototype.normalizeName = function(name) {

    name = String(name || "PLAYER").toUpperCase();

    if (name.length <= 0) {
        name = "PLAYER";
    }

    return name;
};

/**
 * Normaliserar score.
 *
 * @param {number|string=} score
 * @return {number}
 */
runmysteriet.logic.HighscoreManager.prototype.normalizeScore = function(score) {

    score = parseInt(score, 10) || 0;

    if (score < 0) {
        score = 0;
    }

    return score;
};

//------------------------------------------------------------------------------
// DISPOSE
//------------------------------------------------------------------------------

/**
 * Rensar HighscoreManager.
 *
 * @return {void}
 */
runmysteriet.logic.HighscoreManager.prototype.dispose = function() {

    this.application = null;
};