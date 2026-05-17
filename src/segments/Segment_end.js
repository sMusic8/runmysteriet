//------------------------------------------------------------------------------
// SEGMENT END
//------------------------------------------------------------------------------

/**
 * Slutsegment för en nivå.
 * Segmentet skapar målområdet, bakgrund, sjukdomar och målzon.
 *
 * @constructor
 */
runmysteriet.segments.Segment_End = function() {

    /** @type {number} */
    this.length = 1000;

    /** @type {number} */
    this.groundY = 200;

    /** @type {number} */
    this.tileW = 32;

    /** @type {number} */
    this.tileH = 20;

    /** @type {number} */
    this.backgroundWidth = 1000;

    /** @type {number} */
    this.backgroundHeight = 225;

    /** @type {string} */
    this.backgroundTexture = "end";

    /** @type {string} */
    this.groundTexture = "bana-gras1";

    /** @type {string} */
    this.markerTexture = "grass_block";
};

//------------------------------------------------------------------------------
// PUBLIC METHODS
//------------------------------------------------------------------------------

/**
 * Skapar slutsegmentets bana.
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
 *   endZones: !Array<!Object>,
 *   endX: number
 * }}
 */
runmysteriet.segments.Segment_End.prototype.ground = function(stage, startX, levelNumber) {

    var segmentStart = startX || 0;
    var segmentEnd = segmentStart + this.length;
    var x = segmentStart;

    var platforms = [];
    var holes = [];
    var enemySpawns = [];
    var diseaseSpawns = [];
    var waterAreas = [];
    var boats = [];
    var endZones = [];

    var gateX = segmentStart + this.length - 240;
    var gateY = this.groundY - 100;

    this.addBackground(stage, segmentStart);
    this.addGround(stage, platforms, x);
    this.addGoalMarkers(stage, gateX, gateY);
    this.addDiseases(diseaseSpawns, segmentStart, levelNumber);
    this.addEndZone(stage, endZones, segmentEnd);

    return {
        platforms: platforms,
        holes: holes,
        enemySpawns: enemySpawns,
        diseaseSpawns: diseaseSpawns,
        waterAreas: waterAreas,
        boats: boats,
        endZones: endZones,
        endX: segmentEnd
    };
};

//------------------------------------------------------------------------------
// BACKGROUND
//------------------------------------------------------------------------------

/**
 * Lägger till bakgrunden för slutsegmentet.
 *
 * @param {!rune.display.Stage} stage
 * @param {number} segmentStart
 */
runmysteriet.segments.Segment_End.prototype.addBackground = function(stage, segmentStart) {

    var background = new rune.display.Graphic(
        segmentStart,
        0,
        this.backgroundWidth,
        this.backgroundHeight,
        this.backgroundTexture
    );

    stage.addChild(background);
};

//------------------------------------------------------------------------------
// GROUND
//------------------------------------------------------------------------------

/**
 * Lägger till marken i slutsegmentet.
 *
 * @param {!rune.display.Stage} stage
 * @param {!Array<!Object>} platforms
 * @param {number} x
 */
runmysteriet.segments.Segment_End.prototype.addGround = function(stage, platforms, x) {
    var grassTiles = Math.ceil(this.length / this.tileW);

    this.addTiles(
        stage,
        platforms,
        x,
        this.groundY,
        grassTiles,
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
runmysteriet.segments.Segment_End.prototype.addTiles = function(stage, platforms, x, y, amount, texture) {
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
// GOAL VISUALS
//------------------------------------------------------------------------------

/**
 * Lägger till visuella markörer vid målområdet.
 *
 * @param {!rune.display.Stage} stage
 * @param {number} gateX
 * @param {number} gateY
 */
runmysteriet.segments.Segment_End.prototype.addGoalMarkers = function(stage, gateX, gateY) {
    var j = 0;
    var marker = null;

    for (j = 0; j < 2; j++) {
        marker = new rune.display.Graphic(
            gateX + 20 + (j * 22),
            gateY - 30 - ((j % 2) * 10),
            this.tileW,
            this.tileH,
            this.markerTexture
        );

        stage.addChild(marker);
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
runmysteriet.segments.Segment_End.prototype.getDiseaseCount = function(levelNumber) {
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
 * Lägger till sjukdomar i början/mitten av slutsegmentet.
 * De placeras inte nära målzonen.
 *
 * @param {!Array<!Object>} diseaseSpawns
 * @param {number} segmentStart
 * @param {number=} levelNumber
 */
runmysteriet.segments.Segment_End.prototype.addDiseases = function(diseaseSpawns, segmentStart, levelNumber) {
    var diseaseCount = this.getDiseaseCount(levelNumber);
    var diseasePositions = this.getDiseasePositions(segmentStart);
    var i = 0;

    for (i = 0; i < diseaseCount && i < diseasePositions.length; i++) {
        diseaseSpawns.push(diseasePositions[i]);
    }
};

/**
 * Returnerar säkra sjukdomspositioner för slutsegmentet.
 *
 * @param {number} segmentStart
 * @return {!Array<!Object>}
 */
runmysteriet.segments.Segment_End.prototype.getDiseasePositions = function(segmentStart) {
    return [
        {
            type: "gray",
            x: segmentStart + 190,
            y: this.groundY - 40
        },
        {
            type: "brown",
            x: segmentStart + 320,
            y: this.groundY - 40
        },
        {
            type: "red",
            x: segmentStart + 460,
            y: this.groundY - 40
        },
        {
            type: "gray",
            x: segmentStart + 600,
            y: this.groundY - 40
        }
    ];
};

//------------------------------------------------------------------------------
// END ZONE
//------------------------------------------------------------------------------

/**
 * Lägger till osynlig målzon längst mot slutet av segmentet.
 *
 * @param {!rune.display.Stage} stage
 * @param {!Array<!Object>} endZones
 * @param {number} segmentEnd
 */
runmysteriet.segments.Segment_End.prototype.addEndZone = function(stage, endZones, segmentEnd) {
    var endZoneWidth = 80;
    var endZoneHeight = 120;

    var endZone = new rune.display.Graphic(
        segmentEnd - endZoneWidth - 5,
        this.groundY - endZoneHeight,
        endZoneWidth,
        endZoneHeight,
        this.markerTexture
    );

    endZone.visible = false;
    endZone.isEndZone = true;

    stage.addChild(endZone);
    endZones.push(endZone);
};