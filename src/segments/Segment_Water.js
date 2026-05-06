

runmysteriet.segments.Segment_Water = function() {
    this.tileSize = 268;
    this.groundY = 220;

    this.waterWidth = 134;
    this.waterHeight = 96;
};

runmysteriet.segments.Segment_Water.prototype.ground = function(stage, startX) {
    var x = startX || 0;

    var platforms = [];
    var holes = [];
    var enemySpawns = [];
    var waterAreas = [];
    var movingPlatforms = [];
    var boats = [];


    /*
     * vänster mark 
     */
    var platform1 = new runmysteriet.ui.Platform();
    platform1.x = x;
    platform1.y = this.groundY;
    stage.addChild(platform1);
    platforms.push(platform1);

    x += this.tileSize;

    /*
     * vatten
     */
    var water = new runmysteriet.ui.graphic.Water(
        x,
        this.groundY -10 
    );

    stage.addChild(water);
    waterAreas.push(water);

    console.log("EnglishBoat:", runmysteriet.entity.EnglishBoat);

 var boat = new runmysteriet.entity.EnglishBoat(
        water.x + 35,
        water.y - 32
    );

    stage.addChild(boat);
    boats.push(boat);

    x += this.waterWidth;
    /*
     * höger mark
     */
    var platform2 = new runmysteriet.ui.Platform();
    platform2.x = x;
    platform2.y = this.groundY;
    stage.addChild(platform2);
    platforms.push(platform2);

    x += this.tileSize;

    return {
        platforms: platforms,
        holes: holes,
        enemySpawns: enemySpawns,
        waterAreas: waterAreas,
        movingPlatforms: movingPlatforms,
        boats: boats,
        endX: x
    };
};