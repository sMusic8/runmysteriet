//------------------------------------------------------------------------------
// SEGMENT START
//------------------------------------------------------------------------------

/**
 * Startsegment för en nivå.
 * Segmentet ger spelaren en startyta innan resten av banan börjar.
 *
 * @constructor
 */
runmysteriet.segments.Segment_Start = function() {

    /** @type {number} */
    this.length = 500;

    /** @type {number} */
    this.groundY = 200;

    /** @type {number} */
    this.tileW = 32;

    /** @type {number} */
    this.tileH = 20;

    /** @type {string} */
    this.groundTexture = "bana-gras1";
};

//------------------------------------------------------------------------------
// PUBLIC METHODS
//------------------------------------------------------------------------------

/**
 * Skapar startsegmentets mark och sjukdomar.
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
runmysteriet.segments.Segment_Start.prototype.ground = function(stage, startX, levelNumber) {
    var segmentStart = startX || 0;
    var segmentEnd = segmentStart + this.length;

    var platforms = [];
    var holes = [];
    var enemySpawns = [];
    var diseaseSpawns = [];
    var waterAreas = [];
    var boats = [];

    this.addGround(stage, platforms, segmentStart);
    this.addDiseases(diseaseSpawns, segmentStart, levelNumber);

    return {
        platforms: platforms,
        holes: holes,
        enemySpawns: enemySpawns,
        diseaseSpawns: diseaseSpawns,
        waterAreas: waterAreas,
        boats: boats,
        endX: segmentEnd
    };
};

//------------------------------------------------------------------------------
// GROUND
//------------------------------------------------------------------------------

/**
 * Lägger till marken i startsegmentet.
 *
 * @param {!rune.display.Stage} stage
 * @param {!Array<!Object>} platforms
 * @param {number} x
 */
runmysteriet.segments.Segment_Start.prototype.addGround = function(stage, platforms, x) {
    var tiles = Math.ceil(this.length / this.tileW);

    this.addTiles(
        stage,
        platforms,
        x,
        this.groundY,
        tiles,
        this.groundTexture
    );
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
runmysteriet.segments.Segment_Start.prototype.addTiles = function(stage, platforms, x, y, amount, texture) {
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
runmysteriet.segments.Segment_Start.prototype.getDiseaseCount = function(levelNumber) {
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
 * Lägger till sjukdomar längre fram i startsegmentet.
 *
 * @param {!Array<!Object>} diseaseSpawns
 * @param {number} segmentStart
 * @param {number=} levelNumber
 */
runmysteriet.segments.Segment_Start.prototype.addDiseases = function(diseaseSpawns, segmentStart, levelNumber) {
    var diseaseCount = this.getDiseaseCount(levelNumber);
    var diseasePositions = this.getDiseasePositions(segmentStart);
    var i = 0;

    for (i = 0; i < diseaseCount && i < diseasePositions.length; i++) {
        diseaseSpawns.push(diseasePositions[i]);
    }
};

/**
 * Returnerar sjukdomspositioner för startsegmentet.
 * Positionerna ligger inte direkt vid spelarens startpunkt.
 *
 * @param {number} segmentStart
 * @return {!Array<!Object>}
 */
runmysteriet.segments.Segment_Start.prototype.getDiseasePositions = function(segmentStart) {
    return [
        {
            type: "gray",
            x: segmentStart + 220,
            y: this.groundY - 40
        },
        {
            type: "brown",
            x: segmentStart + 320,
            y: this.groundY - 40
        },
        {
            type: "red",
            x: segmentStart + 400,
            y: this.groundY - 40
        },
        {
            type: "gray",
            x: segmentStart + 460,
            y: this.groundY - 40
        }
    ];
};