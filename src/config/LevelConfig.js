/**
 * Level konfiguering.
 *
 * @constructor
 * @param {number=} levelNummer
 */
runmysteriet.config.LevelConfig = function(levelNumber) {

    /** @type {number} */
    this.levelNumber = levelNumber || 1;
};

/**
 * Retunera max antal levlar
 *
 * @return {number}
 */
runmysteriet.config.LevelConfig.prototype.getMaxLevel = function() {
    return 20;
};

/**
 * Retunera max antal kristna fiender för en bana
 *
 * @return {number}
 */
runmysteriet.config.LevelConfig.prototype.getKristenCount = function() {

    /** @type {number} */
    var count = 1 + Math.floor((this.levelNumber - 1) / 2);

    if (count > 25) {
        count = 25;
    }

    return count;
};