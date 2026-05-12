//segment 1 - första del av bana

//------------------------------------------------------------------------------
// SEGMENT 1
//------------------------------------------------------------------------------

runmysteriet.segments.Segment_1 = function() {
    console.log("Bacon")
    this.tileSize = 268;
    this.groundY = 220;
    this.holeHeight = 200;
};

//------------------------------------------------------------------------------
// GROUND
//------------------------------------------------------------------------------

runmysteriet.segments.Segment_1.prototype.ground = function(stage, startX) {
    
    var x = startX || 0;

    var platforms = [];
    var holes = [];
    var enemySpawns = [];
    var waterAreas = [];
    var movingPlatforms = [];
    var boats = [];

    //--------------------------------------------------------------------------
    // FÖRSTA PLATTFORMEN
    //--------------------------------------------------------------------------

    var platform1 = new runmysteriet.ui.Platform(x, this.groundY);

    stage.addChild(platform1);
    platforms.push(platform1);

    enemySpawns.push({
        type: "kristen",
        x: x + 120,
        y: this.groundY - 40
    });

    enemySpawns.push({
        type: "kristen",
        x: x + 210,
        y: this.groundY - 40
    });

    x += this.tileSize;

    //--------------------------------------------------------------------------
    // ANDRA PLATTFORMEN
    //--------------------------------------------------------------------------

    var platform2 = new runmysteriet.ui.Platform(x, this.groundY);

    stage.addChild(platform2);
    platforms.push(platform2);

    x += this.tileSize;

    //--------------------------------------------------------------------------
    // HÅL
    //--------------------------------------------------------------------------

    var holeX = x;

    var hole = new runmysteriet.ui.graphic.Hole(
        holeX,
        this.groundY,
        40,
        this.holeHeight
    );

    stage.addChild(hole);
    holes.push(hole);

    //----------------------------------------------------------------------
    // FLERA LUFTPLATTFORMAR (NU FUNGERAR)
    //----------------------------------------------------------------------

    var airPlatform1 = new runmysteriet.ui.Platform(
        holeX - 120,
        this.groundY - 80
    );

    var airPlatform2 = new runmysteriet.ui.Platform(
        holeX + 40,
        this.groundY - 140
    );

    var airPlatform3 = new runmysteriet.ui.Platform(
        holeX + 200,
        this.groundY - 100
    );

    stage.addChild(airPlatform1);
    stage.addChild(airPlatform2);
    stage.addChild(airPlatform3);

    platforms.push(airPlatform1, airPlatform2, airPlatform3);

    x += hole.width;

    //--------------------------------------------------------------------------
    // TREDJE PLATTFORMEN
    //--------------------------------------------------------------------------

    var platform3 = new runmysteriet.ui.Platform(x, this.groundY);

    stage.addChild(platform3);
    platforms.push(platform3);

    x += this.tileSize;
//console.log(platforms)
    //--------------------------------------------------------------------------
    // RETURNERA SEGMENTETS DATA
    //--------------------------------------------------------------------------

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