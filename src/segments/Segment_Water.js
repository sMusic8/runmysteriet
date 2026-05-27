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
    this.waterWidth = 405;

    /** @type {number} */
    this.waterHeight = 32;

    /** @type {number} */
this.backgroundWidth = 405;

/** @type {number} */
this.backgroundHeight = 225;

/** @type {string} */

this.backgroundTexture = "backgroundWater";

};

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
    console.log("Segment vatten");
    
    var x = startX || 0;
this.addBackground(stage, x);
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
 * Lägger till bakgrunden för vattensegmentet.
 *
 * @param {!rune.display.Stage} stage
 * @param {number} segmentStart
 */
runmysteriet.segments.Segment_Water.prototype.addBackground = function(stage, segmentStart) {

    var background = new rune.display.Graphic(
        segmentStart,
        0,
        this.backgroundWidth,
        this.backgroundHeight,
        this.backgroundTexture
    );

    stage.addChild(background);
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

/**
 * Lägger till flotten.
 *
 * @param {!rune.display.Stage} stage
 * @param {!Array<!Object>} platforms
 * @param {!runmysteriet.ui.graphic.Water} water
 */
runmysteriet.segments.Segment_Water.prototype.addRaft = function(stage, platforms, water) {

    var raftStartX = water.x - 20;
    var raftStartY = water.y - 9;

    var raft = new runmysteriet.ui.graphic.Raft(
        raftStartX,
        raftStartY
    );

    raft.minX = raftStartX;
    raft.maxX = water.x + this.waterWidth - raft.width + 20;

    stage.addChild(raft);

    //Flotten räknas som plattform så spelaren kan stå på den.
    platforms.push(raft);
};

/**
 * Lägger till den engelska båten.
 *
 * @param {!rune.display.Stage} stage
 * @param {!Array<!Object>} boats
 * @param {!runmysteriet.ui.graphic.Water} water
 */
runmysteriet.segments.Segment_Water.prototype.addBoat = function(stage, boats, water) {

    var boatX = water.x - 150;
    var boatY = water.y - 75;

    var boatMinX = water.x - 150;
    var boatMaxX = water.x + 50;

    var boat = new runmysteriet.entity.EnglishBoat(
        boatX,
        boatY
    );

    boat.minX = boatMinX;
    boat.maxX = boatMaxX;

    stage.addChild(boat);
    boats.push(boat);
};

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
            type: "brown",
            x: rightLandX + 80,
            y: this.groundY - 50
        },
        {
            type: "red",
            x: rightLandX + 150,
            y: this.groundY - 50
        },
        {
            type: "gray",
            x: leftLandX + 190,
            y: this.groundY - 50
        }
    ];
};
/**
 * Lägger till rune-positioner i en lista av spawn-punkter.
 *
 * @this {runmysteriet.segments.Segment_Water}
 * @param {!Array<!{x: number, y: number}>} runeSpawns Lista som fylls med rune-positioner.
 * @param {number} leftLandX X-position för vänster land.
 * @param {number} rightLandX X-position för höger land.
 * @return {void}
 */
runmysteriet.segments.Segment_Water.prototype.addRuneSpawns = function(runeSpawns, leftLandX, rightLandX) {
    var positions = this.getRunePositions(leftLandX, rightLandX);
    var i = 0;

    for (i = 0; i < positions.length; i++) {
        runeSpawns.push(positions[i]);
    }
};

/**
 * Returnerar positioner där runor ska spawnas i vatten-segmentet.
 *
 * @this {runmysteriet.segments.Segment_Water}
 * @param {number} leftLandX X-position för vänster landmassa.
 * @param {number} rightLandX X-position för höger landmassa.
 * @return {!Array<!{x: number, y: number}>} Lista med rune-koordinater.
 */
runmysteriet.segments.Segment_Water.prototype.getRunePositions = function(leftLandX, rightLandX) {
    return [
    //spawnplats för runor
    ];
};

/**
 * Lägger till armor-positioner i en lista av spawn-punkter.
 *
 * @this {runmysteriet.segments.Segment_Water}
 * @param {!Array<!{x: number, y: number}>} armorSpawns Lista som fylls med armor-positioner.
 * @param {number} leftLandX X-position för vänster landmassa.
 * @param {number} rightLandX X-position för höger landmassa.
 * @return {void}
 */
runmysteriet.segments.Segment_Water.prototype.addArmorSpawns = function(armorSpawns, leftLandX, rightLandX) {
    var positions = this.getArmorPositions(leftLandX, rightLandX);
    var i = 0;

    for (i = 0; i < positions.length; i++) {
        armorSpawns.push(positions[i]);
    }
};

/**
 * Returnerar positioner där armor ska spawnas i vatten-segmentet.
 *
 * @this {runmysteriet.segments.Segment_Water}
 * @param {number} leftLandX X-position för vänster landmassa.
 * @param {number} rightLandX X-position för höger landmassa.
 * @return {!Array<!{x: number, y: number}>} Lista med armor-koordinater.
 */
runmysteriet.segments.Segment_Water.prototype.getArmorPositions = function(leftLandX, rightLandX) {
    return [
    
        {
            x: rightLandX + 220,
            y: this.groundY - 45
        }
    ];
};