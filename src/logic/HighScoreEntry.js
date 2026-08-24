//------------------------------------------------------------------------------
// HIGHSCORE ENTRY
//------------------------------------------------------------------------------

/**
 * En highscore-post.
 *
 * @constructor
 * @param {string=} name
 * @param {number=} score
 */
runmysteriet.logic.HighscoreEntry = function(name, score) {

    /** @type {string} */
    this.name = String(name || "PLAYER").toUpperCase();

    /** @type {number} */
    this.score = parseInt(score, 10) || 0;

    if (this.score < 0) {
        this.score = 0;
    }
};