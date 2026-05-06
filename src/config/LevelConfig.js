/**
 * Level configuration.
 *
 * @constructor
 * @param {number=} levelNumber
 */
runmysteriet.config.LevelConfig = function(levelNumber) {

    /** @type {number} */
    this.levelNumber = levelNumber || 1;
};

//------------------------------------------------------------------------------
// LEVEL LIMIT
//------------------------------------------------------------------------------

/**
 * Returns maximum level in game.
 *
 * @return {number}
 */
runmysteriet.config.LevelConfig.prototype.getMaxLevel = function() {
    return 100;
};

//------------------------------------------------------------------------------
// ENEMY BALANCE
//------------------------------------------------------------------------------

/**
 * Returns number of Kristen enemies for this level.
 *
 * @return {number}
 */
runmysteriet.config.LevelConfig.prototype.getKristenCount = function() {

    /** @type {number} */
    var count = 1 + Math.floor((this.levelNumber - 1) / 3);

    if (count > 25) {
        count = 25;
    }

    return count;
};