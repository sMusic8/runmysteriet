


runmysteriet.segments.Segment_1 = function() {
    this.tileSize = 268;
    this.groundY = 220;
    this.holeHeight = 200;
};

runmysteriet.segments.Segment_1.prototype.ground = function(stage, startX) {
    var x = startX || 0;

    var platforms = [];
    var holes = [];
    var enemySpawns = [];

    var platform1 = new runmysteriet.ui.Platform();
    platform1.x = x;
    platform1.y = this.groundY;
    stage.addChild(platform1);
    platforms.push(platform1);

    enemySpawns.push({
        type: "kristen",
        x: x + 120,
        y: this.groundY - 40
    });

    x += this.tileSize;

    var platform2 = new runmysteriet.ui.Platform();
    platform2.x = x;
    platform2.y = this.groundY;
    stage.addChild(platform2);
    platforms.push(platform2);

    x += this.tileSize;

    var hole = new runmysteriet.ui.graphic.Hole(
        x,
        this.groundY,
        80,
        this.holeHeight
    );

    stage.addChild(hole);
    holes.push(hole);

    x += hole.width;

    var platform3 = new runmysteriet.ui.Platform();
    platform3.x = x;
    platform3.y = this.groundY;
    stage.addChild(platform3);
    platforms.push(platform3);

    x += this.tileSize;

    return {
        platforms: platforms,
        holes: holes,
        enemySpawns: enemySpawns,
        endX: x
    };
};