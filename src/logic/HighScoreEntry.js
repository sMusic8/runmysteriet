//------------------------------------------------------------------------------
// HIGHSCORE ENTRY
//------------------------------------------------------------------------------

/**
 * En highscore-post.
 *
 * @constructor
 * @param {string} name
 * @param {number} score
 */
runmysteriet.logic.HighscoreEntry = function(name, score) {

    this.name = name || "PLAYER";
    this.score = score || 0;
};