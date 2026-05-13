//------------------------------------------------------------------------------
// PLATFORM HANDLER
//------------------------------------------------------------------------------

// Denna klassen hanterar alla plattformar i spelet, skapar och kontrolerar dess kolision med players. 
runmysteriet.handler.PlatformHandler = function(stage, screenWidth) {
    this.stage = stage;
    this.screenWidth = screenWidth;

    this.platforms = [];
    this.holes = [];
    this.enemySpawns = [];
    this.waterAreas = [];
    this.boats = [];                                    

    this.levelWidth = 0;
};

//------------------------------------------------------------------------------
// PLATFORM HANDLER INIT
//------------------------------------------------------------------------------

runmysteriet.handler.PlatformHandler.prototype.init = function(levelNumber) {
    levelNumber = levelNumber || 1;

    this.platforms = [];
    this.holes = [];
    this.enemySpawns = [];
    this.waterAreas = [];
    this.levelWidth = 0;
    this.boats = [];

    var x = 0;

    //--------------------------------------------------------------------------
    // SEGMENTS
    //--------------------------------------------------------------------------

    var waterSegment = runmysteriet.segments.Segment_Water;

    var segments = [
        runmysteriet.segments.Segment_1,
        runmysteriet.segments.Segment_2,
        runmysteriet.segments.Segment_3,
        runmysteriet.segments.Segment_4,
        runmysteriet.segments.Segment_5,
        runmysteriet.segments.Segment_6
    ];

    var endSegment = runmysteriet.segments.Segment_End;

    //--------------------------------------------------------------------------
    // shuffle (alla segment används exakt en gång)
    //--------------------------------------------------------------------------

    for (var i = segments.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = segments[i];
        segments[i] = segments[j];
        segments[j] = temp;
    }

    //--------------------------------------------------------------------------
    // WATER FÖRST
    //--------------------------------------------------------------------------

    if (waterSegment) {
        var water = new waterSegment();
        var waterResult = water.ground(this.stage, x);

        this.addPlatforms(waterResult.platforms);
        this.addHoles(waterResult.holes);
        this.addEnemySpawns(waterResult.enemySpawns);
        this.addWaterAreas(waterResult.waterAreas || []);
        this.addBoats(waterResult.boats || []);

        x = waterResult.endX;
    }

    //--------------------------------------------------------------------------
    // ALLA SEGMENT EXACT ONCE
    //--------------------------------------------------------------------------

    for (var k = 0; k < segments.length; k++) {

        var SegmentClass = segments[k];
        var segment = new SegmentClass();

        var result = segment.ground(this.stage, x);

        this.addPlatforms(result.platforms);
        this.addHoles(result.holes);
        this.addEnemySpawns(result.enemySpawns);
        this.addWaterAreas(result.waterAreas || []);
        this.addBoats(result.boats || []);

        x = result.endX;
    }

    //--------------------------------------------------------------------------
    // END SIST
    //--------------------------------------------------------------------------

    if (endSegment) {

        var end = new endSegment();
        var endResult = end.ground(this.stage, x);

        this.addPlatforms(endResult.platforms);
        this.addHoles(endResult.holes);
        this.addEnemySpawns(endResult.enemySpawns);
        this.addWaterAreas(endResult.waterAreas || []);
        this.addBoats(endResult.boats || []);

        x = endResult.endX;
    }

    this.levelWidth = x;

    console.log("levelWidth:", this.levelWidth);
};

runmysteriet.handler.PlatformHandler.prototype.addPlatforms = function(platforms) {
    if (!platforms) {
        return;
    }

    for (var i = 0; i < platforms.length; i++) {
        this.platforms.push(platforms[i]);
    }
};



runmysteriet.handler.PlatformHandler.prototype.addHoles = function(holes) {
    if (!holes) {
        return;
    }

    for (var i = 0; i < holes.length; i++) {
        this.holes.push(holes[i]);
    }
};

runmysteriet.handler.PlatformHandler.prototype.updateHoles = function(players, onPlayerDead) {
    if (!players) {
        return;
    }

    for (var i = 0; i < players.length; i++) {
        var player = players[i];

        if (!player || player.isDead === true) {
            continue;
        }

        for (var j = 0; j < this.holes.length; j++) {
            var hole = this.holes[j];

            if (hole.hasPlayerFallen(player)) {
                if (onPlayerDead) {
                    onPlayerDead(player, i);
                }

                break;
            }
        }
    }
};

runmysteriet.handler.PlatformHandler.prototype.addEnemySpawns = function(enemySpawns) {

    if (!enemySpawns) {
        return;
    }

    for (var i = 0; i < enemySpawns.length; i++) {
        this.enemySpawns.push(enemySpawns[i]);
    }
};

runmysteriet.handler.PlatformHandler.prototype.getEnemySpawns = function() {
    return this.enemySpawns;
};

///
runmysteriet.handler.PlatformHandler.prototype.addWaterAreas = function(waterAreas) {
    if(!this.waterAreas){
        this.waterAreas = [];
    }
    
    for (var i = 0; i < waterAreas.length; i++) {
        this.waterAreas.push(waterAreas[i]);
    }
};


runmysteriet.handler.PlatformHandler.prototype.addBoats = function(boats) {
    
    if(!this.boats){
        this.boats = [];
    }
    for (var i = 0; i < boats.length; i++) {
        this.boats.push(boats[i]);
    }
};


runmysteriet.handler.PlatformHandler.prototype.startBoatTweens = function(tweens) {
    var boat = null;

    if (!this.boats) {
        console.log("No boat array");
        return;
    }
        console.log("boat count", this.boats.length);

    for (var i = 0; i < this.boats.length; i++) {
        boat = this.boats[i];

        if (boat && typeof boat.startTween === "function") {
            boat.startTween(
                tweens,
                boat.minX,
                boat.maxX
            );
            console.log("saknar startTween:", boat);
        }
    }
};
