


runmysteriet.config.LevelConfig = function(levelNumber) {
    this.levelNumber = levelNumber || 1;
};

runmysteriet.config.LevelConfig.prototype.getMaxLevel = function() {
    return 100;
};

runmysteriet.config.LevelConfig.prototype.getKristenCount = function() {
    var count = 1 + Math.floor((this.levelNumber - 1) / 3);

    if (count > 25) {
        count = 25;
    }

    return count;
};