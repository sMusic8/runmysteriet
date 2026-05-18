//------------------------------------------------------------------------------
// SEGMENT 4
//------------------------------------------------------------------------------

/**
 * Segment 4.
 * Skapar ett lavahål med zig-zag-plattformar och sjukdomar.
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
};

//------------------------------------------------------------------------------
// PUBLIC METHODS
//------------------------------------------------------------------------------

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
    var waterAreas = [];
    var boats = [];

    var holeWidth = 360;

    this.addStartGround(stage, platforms, x);
    x += 6 * this.tileW;

    this.addLavaHole(stage, holes, x, holeWidth);
    this.addZigZagPlatforms(stage, platforms, x);

    x += holeWidth;

    this.addLandingGround(stage, platforms, x);
    x += 8 * this.tileW;

    this.addRemainingGround(stage, platforms, x, segmentEnd);
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

//------------------------------------------------------------------------------
// LAVA
//------------------------------------------------------------------------------

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

    stage.addChild(hole);
    holes.push(hole);

    this.addLavaTiles(stage, hole);
};

/**
 * Fyller lavahålet med lavagrafik.
 *
 * @param {!rune.display.Stage} stage
 * @param {!runmysteriet.ui.graphic.Hole} hole
 */
runmysteriet.segments.Segment_4.prototype.addLavaTiles = function(stage, hole) {
    var lavaCols = Math.ceil(hole.width / this.tileW);
    var lavaRows = Math.ceil(hole.height / this.tileH);
    var lx = 0;
    var ly = 0;
    var lava = null;

    for (ly = 0; ly < lavaRows; ly++) {
        for (lx = 0; lx < lavaCols; lx++) {
            lava = new rune.display.Graphic(
                hole.x + (lx * this.tileW),
                hole.y + (ly * this.tileH),
                this.tileW,
                this.tileH,
                this.lavaTexture
            );

            stage.addChild(lava);
        }
    }
};

/**
 * Lägger till zig-zag-plattformar över lavan.
 *
 * @param {!rune.display.Stage} stage
 * @param {!Array<!Object>} platforms
 * @param {number} x
 */
runmysteriet.segments.Segment_4.prototype.addZigZagPlatforms = function(stage, platforms, x) {
    var j = 0;
    var px = 0;
    var py = 0;

    for (j = 0; j < 6; j++) {
        px = x + 35 + (j * 58);
        py = this.groundY - (j % 2 === 0 ? 60 : 105);

        this.addTiles(stage, platforms, px, py, 2, this.platformTexture);
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
 * Lägger till sjukdomar på säkra markytor.
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
 * Returnerar sjukdomspositioner för Segment 4.
 * Positionerna ligger på startmark/slutmark, inte över lavahålet.
 *
 * @param {number} segmentStart
 * @return {!Array<!Object>}
 */
runmysteriet.segments.Segment_4.prototype.getDiseasePositions = function(segmentStart) {
    return [
        {
            type: "gray",
            x: segmentStart + 80,
            y: this.groundY - 40
        },
        {
            type: "brown",
            x: segmentStart + 650,
            y: this.groundY - 40
        },
        {
            type: "red",
            x: segmentStart + 780,
            y: this.groundY - 40
        },
        {
            type: "gray",
            x: segmentStart + 900,
            y: this.groundY - 40
        }
    ];
};