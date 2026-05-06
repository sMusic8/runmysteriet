
//segment 1 - första del av bana
runmysteriet.segments.Segment_1 = function() {
    this.groundY = 220;
};
//grounden i segmentet där skapas alla plattformar hål och fiender
runmysteriet.segments.Segment_1.prototype.ground = function(stage, startX) {
    
    var x = startX || 0;

    var ground = new runmysteriet.ui.Platform();
    ground.x = 0;
    ground.y = this.groundY;
    ground.width = 4000;   // gör den lång
    stage.addChild(ground);

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
        60,
        this.holeHeight
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