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

    segment = new runmysteriet.segments.Segment_Start();
    result = segment.ground(this.stage, x, this.levelNumber);
    this.addSegmentResult(result);
    x = result.endX;

    for (i = 0; i < beforeWaterCount; i++) {
        SegmentClass = chosenSegments[i];
        segment = new SegmentClass();

        result = segment.ground(this.stage, x, this.levelNumber);
        this.addSegmentResult(result);

        x = result.endX;
    }

    segment = new runmysteriet.segments.Segment_Water();
    result = segment.ground(this.stage, x, this.levelNumber);
    this.addSegmentResult(result);
    x = result.endX;

    for (i = 0; i < afterWaterCount; i++) {
        SegmentClass = chosenSegments[beforeWaterCount + i];
        segment = new SegmentClass();

        result = segment.ground(this.stage, x, this.levelNumber);
        this.addSegmentResult(result);

        x = result.endX;
    }

    segment = new runmysteriet.segments.Segment_End();
    result = segment.ground(this.stage, x, this.levelNumber);
    this.addSegmentResult(result);
    x = result.endX;

    this.levelWidth = x;
};

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
 * Lägger till hål.
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
 * Returnerar alla enemy spawn-punkter.
 *
 * @return {!Array}
 */
runmysteriet.handler.PlatformHandler.prototype.getEnemySpawns = function() {
    return this.enemySpawns;
};

/**
 * Lägger till vattenområden till platform handler.
 *
 * @param {!Array} waterAreas
 * @return {void}
 */
runmysteriet.handler.PlatformHandler.prototype.addWaterAreas = function(waterAreas) {

    if (!waterAreas) {
        return;
    }

    for (var i = 0; i < waterAreas.length; i++) {
        this.waterAreas.push(waterAreas[i]);
    }
};
/**
 * Lägger till båtar i PlatformHandler.
 *
 * @param {!Array} boats
 * @return {void}
 */
runmysteriet.handler.PlatformHandler.prototype.addBoats = function(boats) {

    if (!boats) {
        return;
    }

    for (var i = 0; i < boats.length; i++) {
        this.boats.push(boats[i]);
    }
};

/**
 * Startar tween-animationer för alla registrerade båtar.
 *
 * Använder varje båts `startTween`-metod om den finns.
 *
 * @param {Object} tweens Tween-manager som hanterar animationer.
 * @return {void}
 */
runmysteriet.handler.PlatformHandler.prototype.startBoatTweens = function(tweens) {

    /** @type {number} */
    var i = 0;

    /** @type {?Object} */
    var boat = null;

    if (!tweens) {
        return;
    }

    if (!this.boats) {
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
        }
    }
};
/**
 * Uppdaterar alla holes och plattformar i scenen.
 *
 * @param {number} step Tidssteg från game loop
 * @return {void}
 */
runmysteriet.handler.PlatformHandler.prototype.update = function(step) {

    /** @type {number} */
    var i = 0;

    /** @type {?Object} */
    var hole = null;

    /** @type {?Object} */
    var platform = null;

    for (i = 0; i < this.holes.length; i++) {
        hole = this.holes[i];

        if (hole && typeof hole.update === "function") {
            hole.update(step);
        }
    }

    for (i = 0; i < this.platforms.length; i++) {
        platform = this.platforms[i];

        if (!platform || platform.isRaft !== true) {
            continue;
        }

        if (typeof platform.update === "function") {
            platform.update(step);
        }
    }
};

/**
 * Returnerar antal plattformssegment som ska placeras före vattenområdet.
 * Används för att variera level-design beroende på svårighetsgrad.
 *
 * @return {number}
 */
runmysteriet.handler.PlatformHandler.prototype.getSegmentsBeforeWaterCount = function() {

    if (this.levelNumber >= 11) {
        return 3;
    }

    return 2;
};

/**
 * Returnerar antal plattformssegment som ska placeras efter vattenområdet.
 * Används för att balansera level-layout beroende på levelnummer.
 *
 * @return {number}
 */
runmysteriet.handler.PlatformHandler.prototype.getSegmentsAfterWaterCount = function() {

    if (this.levelNumber >= 6) {
        return 2;
    }

    return 1;
};
/**
 * Returnerar en pool av tillgängliga level-segment baserat på levelnummer.
 * Högre level låser upp fler och svårare segment.
 *
 * @return {!Array<Function>} Array av segment-konstruktörer
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
        runmysteriet.segments.Segment_3,
        runmysteriet.segments.Segment_4,
        runmysteriet.segments.Segment_5,
        runmysteriet.segments.Segment_6
    ];
};
/**
 * Lägger till ett segment-resultat i PlatformHandler.
 * Ett segment innehåller olika typer av level-objekt som plattformar,
 * hål, enemies, vattenområden, båtar och spawnpunkter.
 *
 * @param {{platforms: Array=, holes: Array=, enemySpawns: Array=, waterAreas: Array=, boats: Array=, endZones: Array=, diseaseSpawns: Array=, runeSpawns: Array=, armorSpawns: Array=}} result
 * @return {void}
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
/**
 * Lägger till end zones i PlatformHandler.
 *
 * @param {!Array} endZones
 * @return {void}
 */
runmysteriet.handler.PlatformHandler.prototype.addEndZones = function(endZones) {

    if (!endZones) {
        return;
    }

    for (var i = 0; i < endZones.length; i++) {
        this.endZones.push(endZones[i]);
    }
};

/**
 * Returnerar alla end zones.
 *
 * @return {!Array}
 */
runmysteriet.handler.PlatformHandler.prototype.getEndZones = function() {
    return this.endZones;
};

/**
 * Lägger till disease spawn-punkter i PlatformHandler.
 *
 * @param {!Array} diseaseSpawns
 * @return {void}
 */
runmysteriet.handler.PlatformHandler.prototype.addDiseaseSpawns = function(diseaseSpawns) {

    if (!diseaseSpawns) {
        return;
    }

    for (var i = 0; i < diseaseSpawns.length; i++) {
        this.diseaseSpawns.push(diseaseSpawns[i]);
    }
};
/**
 * Returnerar alla disease spawn-punkter.
 *
 * @return {!Array}
 */
runmysteriet.handler.PlatformHandler.prototype.getDiseaseSpawns = function() {
    return this.diseaseSpawns;
};

/**
 * Lägger till rune spawn-punkter i PlatformHandler.
 *
 * @param {!Array} runeSpawns
 * @return {void}
 */
runmysteriet.handler.PlatformHandler.prototype.addRuneSpawns = function(runeSpawns) {

    if (!runeSpawns) {
        return;
    }

    for (var i = 0; i < runeSpawns.length; i++) {
        this.runeSpawns.push(runeSpawns[i]);
    }
};

/**
 * Returnerar alla rune spawn-punkter.
 *
 * @return {!Array}
 */
runmysteriet.handler.PlatformHandler.prototype.getRuneSpawns = function() {
    return this.runeSpawns;
};
runmysteriet.handler.PlatformHandler.prototype.addArmorSpawns = function(armorSpawns) {
    if (!armorSpawns) return;

    for (var i = 0; i < armorSpawns.length; i++) {
        this.armorSpawns.push(armorSpawns[i]);
    }
};
/**
 * Returnerar alla armor spawn-punkter.
 *
 * @return {!Array}
 */
runmysteriet.handler.PlatformHandler.prototype.getArmorSpawns = function() {
    return this.armorSpawns;
};

/**
 * Returnerar antal armor som ska spawnas beroende på level.
 *
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