//------------------------------------------------------------------------------
// PLATFORM HANDLER
//------------------------------------------------------------------------------

/**
 * Hanterar generering och lagring av alla plattformsrelaterade element i en bana.
 *
 * @constructor
 * @param {rune.scene.Scene} stage - Scenen där segment renderas.
 * @param {number} screenWidth - Skärmbredden.
 */
runmysteriet.handler.PlatformHandler = function(stage, screenWidth) {

    /** @type {rune.scene.Scene} */
    this.stage = stage;

    /** @type {number} */
    this.screenWidth = screenWidth;

    /** @type {Array} */
    this.platforms = [];

    /** @type {Array} */
    this.holes = [];

    /** @type {Array} */
    this.enemySpawns = [];

    /** @type {Array} */
    this.waterAreas = [];

    /** @type {Array} */
    this.boats = [];

    /** @type {Array} */
    this.endZones = [];

    /** @type {Array} */
    this.diseaseSpawns = [];

    /** @type {Array} */
    this.runeSpawns = [];

    /** @type {Array} */
    this.armorSpawns = [];

    /** @type {number} */
    this.levelWidth = 0;
};

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

/**
 * Initierar levelgenerering och bygger hela banan.
 *
 * @param {number=} levelNumber - Nivånummer.
 */
runmysteriet.handler.PlatformHandler.prototype.init = function(levelNumber) {

    this.levelNumber = levelNumber || 1;

    // Reset state
    this.platforms = [];
    this.holes = [];
    this.enemySpawns = [];
    this.waterAreas = [];
    this.boats = [];
    this.endZones = [];
    this.diseaseSpawns = [];
    this.runeSpawns = [];
    this.armorSpawns = [];

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

    //------------------------------------------------------------------------------
    // START SEGMENT
    //------------------------------------------------------------------------------

    segment = new runmysteriet.segments.Segment_Start();
    result = segment.ground(this.stage, x, this.levelNumber);
    this.addSegmentResult(result);
    x = result.endX;

    //------------------------------------------------------------------------------
    // SEGMENTS BEFORE WATER
    //------------------------------------------------------------------------------

    for (i = 0; i < beforeWaterCount; i++) {
        SegmentClass = chosenSegments[i];
        segment = new SegmentClass();

        result = segment.ground(this.stage, x, this.levelNumber);
        this.addSegmentResult(result);

        x = result.endX;
    }

    //------------------------------------------------------------------------------
    // WATER SEGMENT
    //------------------------------------------------------------------------------

    segment = new runmysteriet.segments.Segment_Water();
    result = segment.ground(this.stage, x, this.levelNumber);
    this.addSegmentResult(result);
    x = result.endX;

    //------------------------------------------------------------------------------
    // SEGMENTS AFTER WATER
    //------------------------------------------------------------------------------

    for (i = 0; i < afterWaterCount; i++) {
        SegmentClass = chosenSegments[beforeWaterCount + i];
        segment = new SegmentClass();

        result = segment.ground(this.stage, x, this.levelNumber);
        this.addSegmentResult(result);

        x = result.endX;
    }

    //------------------------------------------------------------------------------
    // END SEGMENT
    //------------------------------------------------------------------------------

    segment = new runmysteriet.segments.Segment_End();
    result = segment.ground(this.stage, x, this.levelNumber);
    this.addSegmentResult(result);
    x = result.endX;

    this.levelWidth = x;

    console.log("levelWidth:", this.levelWidth);
    console.log("runeSpawns:", this.runeSpawns.length);
};

//------------------------------------------------------------------------------
// HELPERS
//------------------------------------------------------------------------------

/**
 * Lägger till plattformar.
 *
 * @param {Array} platforms
 */
runmysteriet.handler.PlatformHandler.prototype.addPlatforms = function(platforms) {
    if (!platforms) return;

    for (var i = 0; i < platforms.length; i++) {
        this.platforms.push(platforms[i]);
    }
};

/**
 * Lägger till hål (fallzoner).
 *
 * @param {Array} holes
 */
runmysteriet.handler.PlatformHandler.prototype.addHoles = function(holes) {
    if (!holes) return;

    for (var i = 0; i < holes.length; i++) {
        this.holes.push(holes[i]);
    }
};

/**
 * Uppdaterar hål och kontrollerar om spelare faller.
 *
 * @param {Array.<Object>} players
 * @param {Function=} onPlayerDead
 */
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

/**
 * Lägger till enemy spawn points.
 *
 * @param {Array} enemySpawns
 */
runmysteriet.handler.PlatformHandler.prototype.addEnemySpawns = function(enemySpawns) {
    if (!enemySpawns) return;

    for (var i = 0; i < enemySpawns.length; i++) {
        this.enemySpawns.push(enemySpawns[i]);
    }
};

/**
 * @return {Array}
 */
runmysteriet.handler.PlatformHandler.prototype.getEnemySpawns = function() {
    return this.enemySpawns;
};

/**
 * @param {Array} waterAreas
 */
runmysteriet.handler.PlatformHandler.prototype.addWaterAreas = function(waterAreas) {
    if (!waterAreas) return;

    for (var i = 0; i < waterAreas.length; i++) {
        this.waterAreas.push(waterAreas[i]);
    }
};

/**
 * @param {Array} boats
 */
runmysteriet.handler.PlatformHandler.prototype.addBoats = function(boats) {
    if (!boats) return;

    for (var i = 0; i < boats.length; i++) {
        this.boats.push(boats[i]);
    }
};

/**
 * Startar tween-animationer för båtar.
 *
 * @param {Object} tweens
 */
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

//------------------------------------------------------------------------------
// SEGMENT LOGIC
//------------------------------------------------------------------------------

/**
 * @return {number}
 */
runmysteriet.handler.PlatformHandler.prototype.getSegmentsBeforeWaterCount = function() {
    if (this.levelNumber >= 11) {
        return 3;
    }
    return 2;
};

/**
 * @return {number}
 */
runmysteriet.handler.PlatformHandler.prototype.getSegmentsAfterWaterCount = function() {
    if (this.levelNumber >= 6) {
        return 2;
    }
    return 1;
};

/**
 * @return {Array}
 */
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

/**
 * @param {Object} result
 */
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
    this.addRuneSpawns(result.runeSpawns || []);
    this.addArmorSpawns(result.armorSpawns || []);
};

/**
 * @param {Array} pool
 * @param {number} count
 * @return {Array}
 */
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

//------------------------------------------------------------------------------
// SPAWN COLLECTION
//------------------------------------------------------------------------------

runmysteriet.handler.PlatformHandler.prototype.addEndZones = function(endZones) {
    if (!endZones) return;

    for (var i = 0; i < endZones.length; i++) {
        this.endZones.push(endZones[i]);
    }
};

runmysteriet.handler.PlatformHandler.prototype.getEndZones = function() {
    return this.endZones;
};

runmysteriet.handler.PlatformHandler.prototype.addDiseaseSpawns = function(diseaseSpawns) {
    if (!diseaseSpawns) return;

    for (var i = 0; i < diseaseSpawns.length; i++) {
        this.diseaseSpawns.push(diseaseSpawns[i]);
    }
};

runmysteriet.handler.PlatformHandler.prototype.getDiseaseSpawns = function() {
    return this.diseaseSpawns;
};

runmysteriet.handler.PlatformHandler.prototype.addRuneSpawns = function(runeSpawns) {
    if (!runeSpawns) return;

    for (var i = 0; i < runeSpawns.length; i++) {
        this.runeSpawns.push(runeSpawns[i]);
    }
};

runmysteriet.handler.PlatformHandler.prototype.getRuneSpawns = function() {
    return this.runeSpawns;
};

runmysteriet.handler.PlatformHandler.prototype.addArmorSpawns = function(armorSpawns) {
    if (!armorSpawns) return;

    for (var i = 0; i < armorSpawns.length; i++) {
        this.armorSpawns.push(armorSpawns[i]);
    }
};

runmysteriet.handler.PlatformHandler.prototype.getArmorSpawns = function() {
    return this.armorSpawns;
};

/**
 * @return {number}
 */
runmysteriet.handler.PlatformHandler.prototype.getArmorCount = function() {
    if (this.levelNumber >= 11) {
        return 4;
    }

    if (this.levelNumber >= 6) {
        return 3;
    }

    return 2;
};