//------------------------------------------------------------------------------
// LEVEL CONFIG
//------------------------------------------------------------------------------

/**
 * Level konfiguration.
 *
 * @constructor
 * @param {number=} levelNumber
 */
runmysteriet.config.LevelConfig = function(levelNumber) {

    /** @type {number} */
    this.levelNumber = levelNumber || 1;
};

//------------------------------------------------------------------------------
// LEVELS
//------------------------------------------------------------------------------

/**
 * Returnerar max antal levels.
 *
 * @return {number}
 */
runmysteriet.config.LevelConfig.prototype.getMaxLevel = function() {

    return 20;
};

//------------------------------------------------------------------------------
// ENEMIES
//------------------------------------------------------------------------------

/**
 * Returnerar max antal kristna fiender för en bana.
 *
 * @return {number}
 */
runmysteriet.config.LevelConfig.prototype.getKristenCount = function() {

    var count = 1 + Math.floor((this.levelNumber - 1) / 2);

    if (count > 25) {
        count = 25;
    }

    return count;
};