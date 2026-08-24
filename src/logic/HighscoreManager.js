//------------------------------------------------------------------------------
// HIGHSCORE MANAGER
//------------------------------------------------------------------------------

/**
 * Hanterar highscore via Rune SDK..
 *
 * @constructor
 * @param {!Object} application
 */
runmysteriet.logic.HighscoreManager = function(application) {

    /** @type {!Object} */
    this.application = application;
};

/**
 * Sparar score till highscore.
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

    //Om färre än 5 finns sparade ska spelaren få skriva namn.
     
    if (highscores.length < 5) {
        return true;
    }

    lowestTopScore = this.getLowestTopScore();

    return score > lowestTopScore;
};

/**
 *
 * Returnerar
 * 1 = nytt bästa highscore
 * 2-5 = top 5 score
 * -1 = hamnar inte på top 5
 *
 * @param {number} score
 * @return {number}
 */
/**
 * Kollar om score är bättre än plats 1.
 *
 * @param {number} score
 * @return {boolean}
 */
runmysteriet.logic.HighscoreManager.prototype.isBestScore = function(score) {

    var best = null;
    var bestScore = 0;

    score = this.normalizeScore(score);

    if (score <= 0) {
        return false;
    }

    best = this.getBest();

    //Om det inte finns något sparat score än är detta första plats.
     
    if (!best) {
        return true;
    }

    bestScore = this.normalizeScore(best.score);

    return score > bestScore;
};
runmysteriet.logic.HighscoreManager.prototype.getPlacement = function(score) {

    var highscores = null;
    var item = null;
    var itemScore = 0;
    var i = 0;

    score = this.normalizeScore(score);

    if (score <= 0) {
        return -1;
    }

    if (!this.hasHighscoreSystem()) {
        return -1;
    }

    highscores = this.getAll();

    for (i = 0; i < highscores.length; i++) {
        item = highscores[i];

        if (!item) {
            continue;
        }

        itemScore = this.normalizeScore(item.score);

        if (score > itemScore) {
            return i + 1;
        }
    }

    //När listan har mindre än 5 resultat får score en plats sist
     
    if (highscores.length < 5) {
        return highscores.length + 1;
    }

    return -1;
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

    item = highscores[4];
    if (!item) {
        return 0;
    }

    return this.normalizeScore(item.score);
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

/**
 * Kontrollerar att highscore-system finns.
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

/**
 * Rensar HighscoreManager.
 *
 * @return {void}
 */
runmysteriet.logic.HighscoreManager.prototype.dispose = function() {

    this.application = null;
};