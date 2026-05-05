runmysteriet.config.LevelConfig = function(levelNumber) {
    this.levelNumber = levelNumber || 1;
};

runmysteriet.config.LevelConfig.prototype.getKristenCount = function() {
    return Math.ceil(this.levelNumber / 2);
};