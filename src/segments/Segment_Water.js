


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
     * Vänster mark
     */
    var platform1 = new runmysteriet.ui.Platform();
    platform1.x = x;
    platform1.y = this.groundY;

    stage.addChild(platform1);
    platforms.push(platform1);

    x += this.tileSize;

    /*
     * Vatten, 134 x 96
     */
    var water = new runmysteriet.ui.graphic.Water(
        x,
        this.groundY - 36
    );

    stage.addChild(water);
    waterAreas.push(water);

    /*
     * Flotte.
     * Denna ska spelaren kunna stå på.
     */
    var raft = new runmysteriet.ui.graphic.Raft(
        water.x - 15,
        water.y + 20
    ); 

    raft.minX = water.x -10;
    raft.maxX = water.x + this.waterWidth - raft.width + 10;

    stage.addChild(raft);

    /*
     * Flotten läggs i platforms så spelaren kan stå på den.
     * Den läggs också i movingPlatforms så den kan röra sig.
     */
    platforms.push(raft);
    movingPlatforms.push(raft);

    /*
     * Engelsk båt.
     * Denna är farlig. Vid collision ska spelaren dö
     * ska åckså ligga ovan flotte och cirkulera
     */
    var boat = new runmysteriet.entity.EnglishBoat(
        water.x + 20,
        water.y - 150
    );

    /*
     * Rörelseområde för tween.
     * Om båten knappt rör sig, öka dessa värden.
     */
    boat.minX = water.x - 5;
    boat.maxX = water.x + this.waterWidth + 5;

    stage.addChild(boat);
    boats.push(boat);

    x += this.waterWidth;

    /*
     * Höger mark
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