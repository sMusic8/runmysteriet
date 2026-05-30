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
 * Returnerar max antal level
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

    if (count > 10) {
        count = 10;
    }

    return count;
};

//------------------------------------------------------------------------------
// CAMERA
//------------------------------------------------------------------------------

/**
 * Returnerar autoscroll-speed baserat på level.
 * Level 1 startar med nuvarande speed.
 * Varje level efter det ökar speed med 2%.
 *
 * @param {number} baseSpeed
 * @return {number}
 */
runmysteriet.config.LevelConfig.prototype.getAutoScrollSpeed = function(baseSpeed) {

    var speed = baseSpeed * (1 + ((this.levelNumber - 1) * 0.02));

    return speed;
};