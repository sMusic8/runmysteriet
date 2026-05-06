runmysteriet.segments.Segment_1 = function() {
    this.groundY = 220;
};

runmysteriet.segments.Segment_1.prototype.ground = function(stage, startX) {

    var ground = new runmysteriet.ui.Platform();
    ground.x = 0;
    ground.y = this.groundY;
    ground.width = 4000;   // gör den lång
    stage.addChild(ground);

   var platform = new runmysteriet.ui.Platform(
    50,
    180,
    100,
    32,
    "stone"
);

stage.addChild(platform);

    return {
        platforms: [ground],
        holes: [],
        enemySpawns: [],
        endX: 4000
    };
};
runmysteriet.segments.Segment_1.prototype.platforms = function(stage, startX) {



    return {
        platforms: [platform],
        holes: [],
        enemySpawns: [],
        endX: x + 268
    };
};