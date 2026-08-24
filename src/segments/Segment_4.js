//------------------------------------------------------------------------------
// SEGMENT 4
//------------------------------------------------------------------------------

/**
 * Segment 4.
 *
 * @constructor
 */
runmysteriet.segments.Segment_4 = function() {

    /** @type {number} */
    this.length = 1000;

    /** @type {number} */
    this.groundY = 200;

    /** @type {number} */
    this.tileW = 32;

    /** @type {number} */
    this.tileH = 20;

    /** @type {string} */
    this.groundTexture = "bana-gras1";

    /** @type {string} */
    this.platformTexture = "grass_block";

    /** @type {string} */
    this.lavaTexture = "lava";
        console.log("segment4");

};

/**
 * Skapar Segment 4.
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
runmysteriet.segments.Segment_4.prototype.ground = function(stage, startX, levelNumber) {

    var segmentStart = startX || 0;
    var segmentEnd = segmentStart + this.length;
    var x = segmentStart;

    var platforms = [];
    var holes = [];
    var enemySpawns = [];
    var diseaseSpawns = [];
    var armorSpawns = [];
    var waterAreas = [];
    var boats = [];
    var runeSpawns = [];

    var holeWidth = 360;

    this.addStartGround(stage, platforms, x);
    x += 6 * this.tileW;

    this.addLavaHole(stage, holes, x, holeWidth);
    this.addZigZagPlatforms(stage, platforms, x);

    x += holeWidth;

    this.addTiles(stage, platforms, x, this.groundY, 5, this.groundTexture);
    x += 5 * this.tileW;

    this.addLavaHole(stage, holes, x, 96);
    x += 96;

    this.addRemainingGround(stage, platforms, x, segmentEnd);
    this.addDiseases(diseaseSpawns, segmentStart, levelNumber);
    this.addRuneSpawns(runeSpawns, segmentStart);
    this.addArmorSpawns(armorSpawns, segmentStart);

    return {
        platforms: platforms,
        holes: holes,
        enemySpawns: enemySpawns,
        diseaseSpawns: diseaseSpawns,
        runeSpawns: runeSpawns,
        armorSpawns: armorSpawns,
        waterAreas: waterAreas,
        boats: boats,
        endX: segmentEnd
    };
};

/**
 * Lägger till startmark.
 *
 * @param {!rune.display.Stage} stage
 * @param {!Array<!Object>} platforms
 * @param {number} x
 */
runmysteriet.segments.Segment_4.prototype.addStartGround = function(stage, platforms, x) {
    this.addTiles(stage, platforms, x, this.groundY, 6, this.groundTexture);
};

/**
 * Lägger till landningsmark.
 *
 * @param {!rune.display.Stage} stage
 * @param {!Array<!Object>} platforms
 * @param {number} x
 */
runmysteriet.segments.Segment_4.prototype.addLandingGround = function(stage, platforms, x) {
    this.addTiles(stage, platforms, x, this.groundY, 8, this.groundTexture);
};

/**
 * Fyller ut resten av segmentet med mark.
 *
 * @param {!rune.display.Stage} stage
 * @param {!Array<!Object>} platforms
 * @param {number} x
 * @param {number} segmentEnd
 */
runmysteriet.segments.Segment_4.prototype.addRemainingGround = function(stage, platforms, x, segmentEnd) {
    var remainingWidth = 0;
    var remainingTiles = 0;

    if (x >= segmentEnd) {
        return;
    }

    remainingWidth = segmentEnd - x;
    remainingTiles = Math.ceil(remainingWidth / this.tileW);

    this.addTiles(stage, platforms, x, this.groundY, remainingTiles, this.groundTexture);
};

/**
 * Skapar flera tiles.
 *
 * @param {!rune.display.Stage} stage
 * @param {!Array<!Object>} platforms
 * @param {number} x
 * @param {number} y
 * @param {number} amount
 * @param {string} texture
 */
runmysteriet.segments.Segment_4.prototype.addTiles = function(stage, platforms, x, y, amount, texture) {
    var i = 0;
    var tile = null;

    for (i = 0; i < amount; i++) {
        tile = new rune.display.Graphic(
            x + (i * this.tileW),
            y,
            this.tileW,
            this.tileH,
            texture
        );

        stage.addChild(tile);
        platforms.push(tile);
    }
};

/**
 * Lägger till lavahål.
 *
 * @param {!rune.display.Stage} stage
 * @param {!Array<!Object>} holes
 * @param {number} x
 * @param {number} holeWidth
 */
runmysteriet.segments.Segment_4.prototype.addLavaHole = function(stage, holes, x, holeWidth) {

    var hole = new runmysteriet.ui.graphic.Hole(
        x,
        this.groundY,
        holeWidth,
        200
    );

    //Hole lägger själv ut sin lava.
    hole.addToStage(stage);

    //Hole sparas för dödslogik.
     
    holes.push(hole);
};

/**
 * Lägger till roligare plattformar över lavan.
 * Plattformarna skapar en låg väg och en högre
 *
 * @param {!rune.display.Stage} stage
 * @param {!Array<!Object>} platforms
 * @param {number} x
 */
runmysteriet.segments.Segment_4.prototype.addZigZagPlatforms = function(stage, platforms, x) {

    //tiles över lavan
    this.addTiles(stage, platforms, x + 35,  this.groundY - 45, 2, this.platformTexture);
    this.addTiles(stage, platforms, x + 105, this.groundY - 75, 2, this.platformTexture);
    this.addTiles(stage, platforms, x + 175, this.groundY - 45, 2, this.platformTexture);
    this.addTiles(stage, platforms, x + 245, this.groundY - 75, 2, this.platformTexture);
    this.addTiles(stage, platforms, x + 145, this.groundY - 125, 2, this.platformTexture);
    this.addTiles(stage, platforms, x + 305, this.groundY - 105, 2, this.platformTexture);
    this.addTiles(stage, platforms, x + 325, this.groundY - 45, 2, this.platformTexture);
};

/**
 * Returnerar sjukdomar.
 *
 * @param {number=} levelNumber
 * @return {number}
 */
runmysteriet.segments.Segment_4.prototype.getDiseaseCount = function(levelNumber) {
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
 * Lägger till sjukdomar på olika markytor.
 *
 * @param {!Array<!Object>} diseaseSpawns
 * @param {number} segmentStart
 * @param {number=} levelNumber
 */
runmysteriet.segments.Segment_4.prototype.addDiseases = function(diseaseSpawns, segmentStart, levelNumber) {
    var diseaseCount = this.getDiseaseCount(levelNumber);
    var diseasePositions = this.getDiseasePositions(segmentStart);
    var i = 0;

    for (i = 0; i < diseaseCount && i < diseasePositions.length; i++) {
        diseaseSpawns.push(diseasePositions[i]);
    }
};

/**
 * Returnerar sjukdomspositioner
 *
 * @param {number} segmentStart
 * @return {!Array<!Object>}
 */
runmysteriet.segments.Segment_4.prototype.getDiseasePositions = function(segmentStart) {
    return [
         {
            type: "gray",
            x: segmentStart + 80,
            y: this.groundY - 50
        },
        {
            type: "red",
            x: segmentStart + 315,
            y: this.groundY - 120
        },
        {
            type: "brown",
            x: segmentStart + 455,
            y: this.groundY - 95
        },
        {
            type: "red",
            x: segmentStart + 670,
            y: this.groundY - 50
        },
        {
            type: "gray",
            x: segmentStart + 850,
            y: this.groundY - 50
        }
    ];
};

/**
 * Lägger till rune-positioner i en lista av spawn-punkter.
 *
 * @this {runmysteriet.segments.Segment_4}
 * @param {!Array<!{x: number, y: number}>} runeSpawns Lista som fylls med rune-positioner.
 * @param {number} segmentStart Startposition för segmentet på x-axeln.
 * @return {void}
 */
runmysteriet.segments.Segment_4.prototype.addRuneSpawns = function(runeSpawns, segmentStart) {
    var positions = this.getRunePositions(segmentStart);
    var i = 0;

    for (i = 0; i < positions.length; i++) {
        runeSpawns.push(positions[i]);
    }
};

/**
 * Returnerar positioner där runor ska spawnas i Segment_4.
 *
 * @this {runmysteriet.segments.Segment_4}
 * @param {number} segmentStart Startposition för segmentet på x-axeln.
 * @return {!Array<!{x: number, y: number}>} Lista med rune-koordinater.
 */
runmysteriet.segments.Segment_4.prototype.getRunePositions = function(segmentStart) {
    return [
        {
            x: segmentStart + 360,
            y: this.groundY - 160
        }
    ];
};

/**
 * Lägger till armor-positioner i en lista av spawn-punkter.
 *
 * @this {runmysteriet.segments.Segment_4}
 * @param {!Array<!{x: number, y: number}>} armorSpawns Lista som fylls med armor-positioner.
 * @param {number} segmentStart Startposition för segmentet på x-axeln.
 * @return {void}
 */
runmysteriet.segments.Segment_4.prototype.addArmorSpawns = function(armorSpawns, segmentStart) {
    var positions = this.getArmorPositions(segmentStart);
    var i = 0;

    for (i = 0; i < positions.length; i++) {
        armorSpawns.push(positions[i]);
    }
};

/**
 * Returnerar positioner där armor ska spawnas i Segment_4.
 *
 * @this {runmysteriet.segments.Segment_4}
 * @param {number} segmentStart Startposition för segmentet på x-axeln.
 * @return {!Array<!{x: number, y: number}>} Lista med armor-koordinater.
 */
runmysteriet.segments.Segment_4.prototype.getArmorPositions = function(segmentStart) {
    return [
        {
            x: segmentStart + 880,
            y: this.groundY - 45
        }
    ];
};