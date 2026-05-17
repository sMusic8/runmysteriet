


runmysteriet.segments.Segment_Water = function() {
    this.tileSize = 280; //
    this.groundY = 200; 

    this.waterWidth = 402;
    this.waterHeight = 32; 


        console.log("Segment Water");

};

runmysteriet.segments.Segment_Water.prototype.ground = function(stage, startX) {
    var x = startX || 0;

    var platforms = [];
    var holes = [];
    var enemySpawns = [];
    var waterAreas = [];
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
     * Vatten, 
     */
    var water = new runmysteriet.ui.graphic.Water(
        x,
        this.groundY - 8
    );

    stage.addChild(water);
    waterAreas.push(water);

    /*
     * Flotte.
     * Denna ska spelaren kunna stå på.
     */
    var raft = new runmysteriet.ui.graphic.Raft(
        water.x +5, 
        water.y - 8
    ); 

    raft.minX = water.x -5; //
    raft.maxX = water.x + this.waterWidth - raft.width + 20; //

    stage.addChild(raft);

    /*
     * Flotten läggs i platforms så spelaren kan stå på den.
     * Den läggs också i movingPlatforms så den kan röra sig.
     */
    platforms.push(raft);

    /*
     * Engelsk båt.
     * Denna är farlig. Vid collision ska spelaren dö
     * ska åckså ligga ovan flotte och cirkulera
     */
    var boat = new runmysteriet.entity.EnglishBoat(
        water.x + 60, /// 20 är avståndet mellan båten och flotten, kan justeras
        water.y - 75//  är avståndet mellan båten och vattnet, kan justeras
    );

    /*
     * Rörelseområde för tween. 
     * Om båten knappt rör sig, öka dessa värden.
     */
    boat.minX = water.x - 160;
    boat.maxX = water.x + this.waterWidth - boat.width - 120;

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
        boats: boats,
        endX: x
    };
};