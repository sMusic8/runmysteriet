//------------------------------------------------------------------------------
// PLATFORM HANDLER
//------------------------------------------------------------------------------

runmysteriet.handler.PlatformHandler = function(stage, screenWidth) {
    this.stage = stage;
    this.screenWidth = screenWidth;

    this.platforms = [];
    this.holes = [];
    this.enemySpawns = [];
    this.waterAreas = [];
    this.boats = [];
    this.endZones = [];
    this.diseaseSpawns = [];

    this.levelWidth = 0;
};

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.handler.PlatformHandler.prototype.init = function(levelNumber) {
    this.levelNumber = levelNumber || 1;

    this.platforms = [];
    this.holes = [];
    this.enemySpawns = [];
    this.waterAreas = [];
    this.boats = [];
    this.endZones = [];
    this.diseaseSpawns = [];

    var x = 0;
    var i = 0;
    var segment = null;
    var result = null;
    var SegmentClass = null;

    var pool = this.getSegmentPool();

    var beforeWaterCount = this.getSegmentsBeforeWaterCount();
    var afterWaterCount = this.getSegmentsAfterWaterCount();
    var totalRandomCount = beforeWaterCount + afterWaterCount;

    var chosenSegments = this.getRandomSegments(pool, totalRandomCount);

    //----------------------------------------------------------------------
    // START
    //----------------------------------------------------------------------

    segment = new runmysteriet.segments.Segment_Start();
    result = segment.ground(this.stage, x, this.levelNumber);
    this.addSegmentResult(result);
    x = result.endX;

    //----------------------------------------------------------------------
    // RANDOM SEGMENT FÖRE VATTEN
    //----------------------------------------------------------------------

    for (i = 0; i < beforeWaterCount; i++) {
        SegmentClass = chosenSegments[i];
        segment = new SegmentClass();

        result = segment.ground(this.stage, x, this.levelNumber);
        this.addSegmentResult(result);

        x = result.endX;
    }

    //----------------------------------------------------------------------
    // VATTEN I MITTEN
    //----------------------------------------------------------------------

    segment = new runmysteriet.segments.Segment_Water();
    result = segment.ground(this.stage, x, this.levelNumber);
    this.addSegmentResult(result);
    x = result.endX;

    //----------------------------------------------------------------------
    // RANDOM SEGMENT EFTER VATTEN
    //----------------------------------------------------------------------

    for (i = 0; i < afterWaterCount; i++) {
        SegmentClass = chosenSegments[beforeWaterCount + i];
        segment = new SegmentClass();

        result = segment.ground(this.stage, x, this.levelNumber);
        this.addSegmentResult(result);

        x = result.endX;
    }

    //----------------------------------------------------------------------
    // END
    //----------------------------------------------------------------------

    segment = new runmysteriet.segments.Segment_End();
    result = segment.ground(this.stage, x, this.levelNumber);
    this.addSegmentResult(result);
    x = result.endX;

    this.levelWidth = x;

    console.log("levelWidth:", this.levelWidth);
};

//------------------------------------------------------------------------------
// HELPERS
//------------------------------------------------------------------------------

runmysteriet.handler.PlatformHandler.prototype.addPlatforms = function(platforms) {
    if (!platforms) return;

    for (var i = 0; i < platforms.length; i++) {
        this.platforms.push(platforms[i]);
    }
};

runmysteriet.handler.PlatformHandler.prototype.addHoles = function(holes) {
    if (!holes) return;

    for (var i = 0; i < holes.length; i++) {
        this.holes.push(holes[i]);
    }
};

runmysteriet.handler.PlatformHandler.prototype.updateHoles = function(players, onPlayerDead) {
    if (!players) return;

    for (var i = 0; i < players.length; i++) {
        var player = players[i];

        if (!player || player.isDead === true) continue;

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
    if (!enemySpawns) return;

    for (var i = 0; i < enemySpawns.length; i++) {
        this.enemySpawns.push(enemySpawns[i]);
    }
};

runmysteriet.handler.PlatformHandler.prototype.getEnemySpawns = function() {
    return this.enemySpawns;
};

runmysteriet.handler.PlatformHandler.prototype.addWaterAreas = function(waterAreas) {
    if (!waterAreas) return;

    for (var i = 0; i < waterAreas.length; i++) {
        this.waterAreas.push(waterAreas[i]);
    }
};

runmysteriet.handler.PlatformHandler.prototype.addBoats = function(boats) {
    if (!boats) return;

    for (var i = 0; i < boats.length; i++) {
        this.boats.push(boats[i]);
    }
};

runmysteriet.handler.PlatformHandler.prototype.startBoatTweens = function(tweens) {

    var i = 0;
    var boat = null;

    if (!tweens) {
        console.log("PlatformHandler.startBoatTweens: tweens saknas");
        return;
    }

    if (!this.boats) {
        console.log("PlatformHandler.startBoatTweens: boats-array saknas");
        return;
    }

    for (i = 0; i < this.boats.length; i++) {

        boat = this.boats[i];

        if (!boat) {
            continue;
        }

        if (typeof boat.startTween === "function") {
            boat.startTween(
                tweens,
                boat.minX,
                boat.maxX
            );
        } else {
            console.log("PlatformHandler.startBoatTweens: båten saknar startTween", boat);
        }
    }
};


runmysteriet.handler.PlatformHandler.prototype.getSegmentsBeforeWaterCount = function() {
    if (this.levelNumber >= 11) {
        return 3;
    }

    return 2;
};

runmysteriet.handler.PlatformHandler.prototype.getSegmentsAfterWaterCount = function() {
    if (this.levelNumber >= 6) {
        return 2;
    }

    return 1;
};


runmysteriet.handler.PlatformHandler.prototype.getSegmentPool = function() {
    if (this.levelNumber >= 11) {
        return [
            runmysteriet.segments.Segment_1,
            runmysteriet.segments.Segment_2,
            runmysteriet.segments.Segment_3,
            runmysteriet.segments.Segment_4,
            runmysteriet.segments.Segment_5,
            runmysteriet.segments.Segment_6
        ];
    }

    if (this.levelNumber >= 6) {
        return [
            runmysteriet.segments.Segment_2,
            runmysteriet.segments.Segment_3,
            runmysteriet.segments.Segment_4,
            runmysteriet.segments.Segment_5,
            runmysteriet.segments.Segment_6
        ];
    }

    return [
        runmysteriet.segments.Segment_4,
        runmysteriet.segments.Segment_5,
        runmysteriet.segments.Segment_6
    ];
};

runmysteriet.handler.PlatformHandler.prototype.addSegmentResult = function(result) {
    if (!result) {
        return;
    }

    this.addPlatforms(result.platforms || []);
    this.addHoles(result.holes || []);
    this.addEnemySpawns(result.enemySpawns || []);
    this.addWaterAreas(result.waterAreas || []);
    this.addBoats(result.boats || []);
    this.addEndZones(result.endZones || []);
    this.addDiseaseSpawns(result.diseaseSpawns || []);
};

runmysteriet.handler.PlatformHandler.prototype.getRandomSegment = function(pool) {
    var index = Math.floor(Math.random() * pool.length);
    return pool[index];
};

runmysteriet.handler.PlatformHandler.prototype.getRandomSegments = function(pool, count) {
    var copy = pool.slice();
    var result = [];
    var index = 0;

    while (result.length < count && copy.length > 0) {
        index = Math.floor(Math.random() * copy.length);
        result.push(copy[index]);
        copy.splice(index, 1);
    }

    return result;
};

runmysteriet.handler.PlatformHandler.prototype.addEndZones = function(endZones) {
    if (!endZones) {
        return;
    }

    for (var i = 0; i < endZones.length; i++) {
        this.endZones.push(endZones[i]);
    }
};
runmysteriet.handler.PlatformHandler.prototype.getEndZones = function() {
    return this.endZones;
};

runmysteriet.handler.PlatformHandler.prototype.addDiseaseSpawns = function(diseaseSpawns) {
    if (!diseaseSpawns) {
        return;
    }

    for (var i = 0; i < diseaseSpawns.length; i++) {
        this.diseaseSpawns.push(diseaseSpawns[i]);
    }
};

runmysteriet.handler.PlatformHandler.prototype.getDiseaseSpawns = function() {
    return this.diseaseSpawns;
};

runmysteriet.handler.PlatformHandler.prototype.addDiseaseSpawns = function(diseaseSpawns) {
    if (!diseaseSpawns) {
        return;
    }

    for (var i = 0; i < diseaseSpawns.length; i++) {
        this.diseaseSpawns.push(diseaseSpawns[i]);
    }
};

runmysteriet.handler.PlatformHandler.prototype.getDiseaseSpawns = function() {
    return this.diseaseSpawns;
};