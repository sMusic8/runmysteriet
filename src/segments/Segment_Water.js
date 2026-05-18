//------------------------------------------------------------------------------
// SEGMENT WATER
//------------------------------------------------------------------------------

/**
 * Vattensegment.
 * Innehåller mark, vatten, flotte, båt och sjukdomar.
 *
 * @constructor
 */
runmysteriet.segments.Segment_Water = function() {

    /** @type {number} */
    this.tileSize = 280;

    /** @type {number} */
    this.groundY = 200;

    /** @type {number} */
    this.waterWidth = 402;

    /** @type {number} */
    this.waterHeight = 32;
};

//------------------------------------------------------------------------------
// PUBLIC METHODS
//------------------------------------------------------------------------------

/**
 * Skapar vattensegmentet.
 *
 * @param {!rune.display.Stage} stage
 * @param {number=} startX
 * @param {number=} levelNumber
 * @return {{
 *   platforms: !Array<!Object>,
 *   holes: !Array<!Object>,
 *   enemySpawns: !Array<!Object>,
 *   diseaseSpawns: !Array<!Object>,
 *   waterAreas: !Array<!Object>,
 *   boats: !Array<!Object>,
 *   endX: number
 * }}
 */
runmysteriet.segments.Segment_Water.prototype.ground = function(stage, startX, levelNumber) {
    var x = startX || 0;

    var platforms = [];
    var holes = [];
    var enemySpawns = [];
    var diseaseSpawns = [];
    var waterAreas = [];
    var boats = [];
    var runeSpawns = [];
    var armorSpawns = [];

    var leftLandX = x;
    var water = null;
    var rightLandX = 0;

    this.addLeftLand(stage, platforms, x);
    x += this.tileSize;

    water = this.addWater(stage, waterAreas, x);

    this.addRaft(stage, platforms, water);
    this.addBoat(stage, boats, water);


    x += this.waterWidth;

    rightLandX = x;
    this.addRightLand(stage, platforms, x);

    x += this.tileSize;

    this.addDiseases(diseaseSpawns, leftLandX, rightLandX, levelNumber);
    this.addRuneSpawns(runeSpawns, leftLandX, rightLandX);
    this.addArmorSpawns(armorSpawns, leftLandX, rightLandX);



    return {
        platforms: platforms,
        holes: holes,
        enemySpawns: enemySpawns,
        diseaseSpawns: diseaseSpawns,
        runeSpawns: runeSpawns,
        armorSpawns: armorSpawns,
        waterAreas: waterAreas,
        boats: boats,
        endX: x
        
    };
};

//------------------------------------------------------------------------------
// LAND
//------------------------------------------------------------------------------

/**
 * Lägger till vänster mark.
 *
 * @param {!rune.display.Stage} stage
 * @param {!Array<!Object>} platforms
 * @param {number} x
 */
runmysteriet.segments.Segment_Water.prototype.addLeftLand = function(stage, platforms, x) {
    var platform = new runmysteriet.ui.Platform();

    platform.x = x;
    platform.y = this.groundY;

    stage.addChild(platform);
    platforms.push(platform);
};

/**
 * Lägger till höger mark.
 *
 * @param {!rune.display.Stage} stage
 * @param {!Array<!Object>} platforms
 * @param {number} x
 */
runmysteriet.segments.Segment_Water.prototype.addRightLand = function(stage, platforms, x) {
    var platform = new runmysteriet.ui.Platform();

    platform.x = x;
    platform.y = this.groundY;

    stage.addChild(platform);
    platforms.push(platform);
};

//------------------------------------------------------------------------------
// WATER
//------------------------------------------------------------------------------

/**
 * Lägger till vattenområdet.
 *
 * @param {!rune.display.Stage} stage
 * @param {!Array<!Object>} waterAreas
 * @param {number} x
 * @return {!runmysteriet.ui.graphic.Water}
 */
runmysteriet.segments.Segment_Water.prototype.addWater = function(stage, waterAreas, x) {
    var water = new runmysteriet.ui.graphic.Water(
        x,
        this.groundY - 8
    );

    stage.addChild(water);
    waterAreas.push(water);

    return water;
};

//------------------------------------------------------------------------------
// RAFT
//------------------------------------------------------------------------------

/**
 * Lägger till flotten.
 *
 * @param {!rune.display.Stage} stage
 * @param {!Array<!Object>} platforms
 * @param {!runmysteriet.ui.graphic.Water} water
 */
runmysteriet.segments.Segment_Water.prototype.addRaft = function(stage, platforms, water) {
    var raft = new runmysteriet.ui.graphic.Raft(
        water.x + 5,
        water.y - 8
    );

    raft.minX = water.x - 5;
    raft.maxX = water.x + this.waterWidth - raft.width + 20;

    stage.addChild(raft);

    /*
     * Flotten räknas som plattform så spelaren kan stå på den.
     */
    platforms.push(raft);
};

//------------------------------------------------------------------------------
// BOAT
//------------------------------------------------------------------------------

/**
 * Lägger till den engelska båten.
 *
 * @param {!rune.display.Stage} stage
 * @param {!Array<!Object>} boats
 * @param {!runmysteriet.ui.graphic.Water} water
 */
runmysteriet.segments.Segment_Water.prototype.addBoat = function(stage, boats, water) {
    var boat = new runmysteriet.entity.EnglishBoat(
        water.x + 60,
        water.y - 75
    );

    boat.minX = water.x - 160;
    boat.maxX = water.x + this.waterWidth - boat.width - 120;

    stage.addChild(boat);
    boats.push(boat);
};

//------------------------------------------------------------------------------
// DISEASES
//------------------------------------------------------------------------------

/**
 * Returnerar antal sjukdomar baserat på level.
 *
 * Level 1-5: 2 sjukdomar
 * Level 6-10: 3 sjukdomar
 * Level 11+: 4 sjukdomar
 *
 * @param {number=} levelNumber
 * @return {number}
 */
runmysteriet.segments.Segment_Water.prototype.getDiseaseCount = function(levelNumber) {
    levelNumber = levelNumber || 1;

    if (levelNumber >= 11) {
        return 4;
    }

    if (levelNumber >= 6) {
        return 3;
    }

    return 2;
};

/**
 * Lägger till sjukdomar på landytorna.
 * Sjukdomar placeras inte i vattenområdet.
 *
 * @param {!Array<!Object>} diseaseSpawns
 * @param {number} leftLandX
 * @param {number} rightLandX
 * @param {number=} levelNumber
 */
runmysteriet.segments.Segment_Water.prototype.addDiseases = function(diseaseSpawns, leftLandX, rightLandX, levelNumber) {
    var diseaseCount = this.getDiseaseCount(levelNumber);
    var diseasePositions = this.getDiseasePositions(leftLandX, rightLandX);
    var i = 0;

    for (i = 0; i < diseaseCount && i < diseasePositions.length; i++) {
        diseaseSpawns.push(diseasePositions[i]);
    }
};

/**
 * Returnerar sjukdomspositioner för vattensegmentet.
 * Positionerna ligger på vänster och höger mark.
 *
 * @param {number} leftLandX
 * @param {number} rightLandX
 * @return {!Array<!Object>}
 */
runmysteriet.segments.Segment_Water.prototype.getDiseasePositions = function(leftLandX, rightLandX) {
    return [
        {
            type: "gray",
            x: leftLandX + 90,
            y: this.groundY - 40
        },
        {
            type: "brown",
            x: rightLandX + 80,
            y: this.groundY - 40
        },
        {
            type: "red",
            x: rightLandX + 170,
            y: this.groundY - 40
        },
        {
            type: "gray",
            x: leftLandX + 190,
            y: this.groundY - 40
        }
    ];
};

//------------------------------------------------------------------------------
// RUNES
//------------------------------------------------------------------------------

runmysteriet.segments.Segment_Water.prototype.addRuneSpawns = function(runeSpawns, leftLandX, rightLandX) {
    var positions = this.getRunePositions(leftLandX, rightLandX);
    var i = 0;

    for (i = 0; i < positions.length; i++) {
        runeSpawns.push(positions[i]);
    }
};

runmysteriet.segments.Segment_Water.prototype.getRunePositions = function(leftLandX, rightLandX) {
    return [
        {
            x: leftLandX + 150,
            y: this.groundY - 70
        },
        {
            x: rightLandX + 150,
            y: this.groundY - 70
        }
    ];
};

//------------------------------------------------------------------------------
// ARMOR
//------------------------------------------------------------------------------

runmysteriet.segments.Segment_Water.prototype.addArmorSpawns = function(armorSpawns, leftLandX, rightLandX) {
    var positions = this.getArmorPositions(leftLandX, rightLandX);
    var i = 0;

    for (i = 0; i < positions.length; i++) {
        armorSpawns.push(positions[i]);
    }
};

runmysteriet.segments.Segment_Water.prototype.getArmorPositions = function(leftLandX, rightLandX) {
    return [
        {
            x: leftLandX + 210,
            y: this.groundY - 45
        },
        {
            x: rightLandX + 220,
            y: this.groundY - 45
        }
    ];
};

