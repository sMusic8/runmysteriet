
//segment 1 - första del av bana

//------------------------------------------------------------------------------
// SEGMENT 1
//------------------------------------------------------------------------------

runmysteriet.segments.Segment_1 = function() {
    this.tileSize = 268; // Storleken på en "tile" i segmentet. Används för att positionera plattformar och annat.
    this.groundY = 220; // Y-positionen för marken i segmentet. Används för att positionera plattformar och fiender på rätt höjd.
    this.holeHeight = 200; // Höjden på hålet i marken. Används för att skapa hålet som spelaren måste hoppa över.
};

//------------------------------------------------------------------------------
// GROUND
//------------------------------------------------------------------------------
//grounden i segmentet där skapas alla plattformar hål och fiender

runmysteriet.segments.Segment_1.prototype.ground = function(stage, startX) {
    
    var x = startX || 0; // Start-X för segmentet, används för att positionera plattformar och annat på rätt plats i världen.

    var platforms = [];
    var holes = [];
    var enemySpawns = []; //kristna fiender som spawnar på marken
    var waterAreas = [];
    var movingPlatforms = []; //rörliga plattformar, används i vattensegmentet
    var boats = []; //båtar som spelaren kan stå på, används i vattensegmentet

    //--------------------------------------------------------------------------
    // FÖRSTA PLATTFORMEN
    //--------------------------------------------------------------------------

    var platform1 = new runmysteriet.ui.Platform();
    platform1.x = x;
    platform1.y = this.groundY;

    stage.addChild(platform1);
    platforms.push(platform1);

    // Enemy spawn på första plattformen
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

    var platform2 = new runmysteriet.ui.Platform();
    platform2.x = x;
    platform2.y = this.groundY;

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

    //--------------------------------------------------------------------------
    // LUFTPLATTFORM OVANFÖR HÅLET
    //--------------------------------------------------------------------------

    var airPlatform = new runmysteriet.ui.Platform();
    airPlatform.x = holeX - 100;
    airPlatform.y = this.groundY - 90;

    stage.addChild(airPlatform);
    platforms.push(airPlatform);

    x += hole.width;

    //--------------------------------------------------------------------------
    // TREDJE PLATTFORMEN
    //--------------------------------------------------------------------------

    var platform3 = new runmysteriet.ui.Platform();
    platform3.x = x;
    platform3.y = this.groundY;

    stage.addChild(platform3);
    platforms.push(platform3);

    x += this.tileSize;

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