runmysteriet.segments.Segment_3 = function() {
    this.tileSize = 268;
    this.groundY = 220;
    this.holeHeight = 200;
};

runmysteriet.segments.Segment_3.prototype.ground = function(stage, startX) {
    var x = startX;
    var platforms = [];
    var holes = [];
    var enemySpawns = [];
    for (var i = 0; i < 3; i++) {
        var platform = new runmysteriet.ui.Platform();
        platform.x = x;
        platform.y = this.groundY;
        stage.addChild(platform);
        platforms.push(platform);

        x += this.tileSize;
    }

    var hole = new runmysteriet.ui.graphic.Hole(
        x,
        this.groundY,
        40,
        this.holeHeight
    );

    stage.addChild(hole);
    holes.push(hole);

    x += hole.width;

    enemySpawns.push({
        type: "kristen",
        x: x + 180,
        y: this.groundY - 40
    });

    var lastPlatform = new runmysteriet.ui.Platform();
    lastPlatform.x = x;
    lastPlatform.y = this.groundY;
    stage.addChild(lastPlatform);
    platforms.push(lastPlatform);

    x += this.tileSize;

 return {
    platforms: platforms,
    holes: holes,
    enemySpawns: enemySpawns,
    endX: x
};
};