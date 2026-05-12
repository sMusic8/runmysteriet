


runmysteriet.segments.Segment_2 = function() {
    this.tileSize = 268;
    this.groundY = 220;
    this.holeHeight = 200;
};

runmysteriet.segments.Segment_2.prototype.ground = function(stage, startX) {
    var x = startX;
    var platforms = [];
    var holes = [];
    var enemySpawns = [];

    var platform1 = new runmysteriet.ui.Platform();
    platform1.x = x;
    platform1.y = this.groundY;
    stage.addChild(platform1);
    platforms.push(platform1);

    x += this.tileSize;

    enemySpawns.push({
    type: "kristen",
    x: x + 90,
    y: this.groundY - 35
});


    enemySpawns.push({
        type: "kristen",
        x: x + 210,
        y: this.groundY - 40
    });
    var hole1 = new runmysteriet.ui.graphic.Hole(
        x,
        this.groundY,
        60,
        this.holeHeight
    );

    stage.addChild(hole1);
    holes.push(hole1);

    x += hole1.width;

    var platform2 = new runmysteriet.ui.Platform();
    platform2.x = x;
    platform2.y = this.groundY;
    stage.addChild(platform2);
    platforms.push(platform2);

    enemySpawns.push({
    type: "kristen",
    x: x + 100,
    y: this.groundY - 40
});

    enemySpawns.push({
    type: "kristen",
    x: x + 190,
    y: this.groundY - 40
});
    x += this.tileSize;

    var platform3 = new runmysteriet.ui.Platform();
    platform3.x = x;
    platform3.y = this.groundY;
    stage.addChild(platform3);
    platforms.push(platform3);

    enemySpawns.push({
    type: "kristen",
    x: x + 140,
    y: this.groundY - 40
});

    x += this.tileSize;

  return {
    platforms: platforms,
    holes: holes,
    enemySpawns: enemySpawns,
    endX: x
};
};