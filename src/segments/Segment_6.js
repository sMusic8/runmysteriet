//------------------------------------------------------------------------------
// SEGMENT 6
//------------------------------------------------------------------------------

/**
 * Segment 6.
 * Skapar växlande lavahål, stenplattformar och sjukdomar.
 *
 * @constructor
 */
runmysteriet.segments.Segment_6 = function() {

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
    this.platformTexture = "tree_block";

    /** @type {string} */
    this.lavaTexture = "lava";
        console.log("segment6");

};

/**
 * Skapar Segment 6.
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
runmysteriet.segments.Segment_6.prototype.ground = function(stage, startX, levelNumber) {

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

    this.addStartGround(stage, platforms, x);
    x += 5 * this.tileW;

    x = this.addAlternatingLavaHoles(stage, platforms, holes, x);

    this.addLandingGround(stage, platforms, x);
    x += 4 * this.tileW;

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
runmysteriet.segments.Segment_6.prototype.addStartGround = function(stage, platforms, x) {
    this.addTiles(stage, platforms, x, this.groundY, 5, this.groundTexture);
};

/**
 * Lägger till landningsmark.
 *
 * @param {!rune.display.Stage} stage
 * @param {!Array<!Object>} platforms
 * @param {number} x
 */
runmysteriet.segments.Segment_6.prototype.addLandingGround = function(stage, platforms, x) {
    this.addTiles(stage, platforms, x, this.groundY, 4, this.groundTexture);
};

/**
 * Fyller ut resten av segmentet med mark.
 *
 * @param {!rune.display.Stage} stage
 * @param {!Array<!Object>} platforms
 * @param {number} x
 * @param {number} segmentEnd
 */
runmysteriet.segments.Segment_6.prototype.addRemainingGround = function(stage, platforms, x, segmentEnd) {
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
runmysteriet.segments.Segment_6.prototype.addTiles = function(stage, platforms, x, y, amount, texture) {
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
 * Lägger till växlande lavahål och stenplattformar.
 *
 * @param {!rune.display.Stage} stage
 * @param {!Array<!Object>} platforms
 * @param {!Array<!Object>} holes
 * @param {number} x
 * @return {number}
 */
runmysteriet.segments.Segment_6.prototype.addAlternatingLavaHoles = function(stage, platforms, holes, x) {
    var j = 0;
    var holeWidth = 80;
    var py = 0;

    for (j = 0; j < 4; j++) {
        this.addLavaHole(stage, holes, x, holeWidth);

        x += holeWidth;

        py = this.groundY - (j * 18);

        this.addTiles(
            stage,
            platforms,
            x,
            py,
            3,
            this.platformTexture
        );

        x += 3 * this.tileW;
    }

    return x;
};

/**
 * Lägger till ett lavahål.
 *
 * @param {!rune.display.Stage} stage
 * @param {!Array<!Object>} holes
 * @param {number} x
 * @param {number} holeWidth
 */
runmysteriet.segments.Segment_6.prototype.addLavaHole = function(stage, holes, x, holeWidth) {

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
 * Returnerar antal sjukdomar baserat på level.
 *
 * Level 1-5: 2 sjukdomar
 * Level 6-10: 3 sjukdomar
 * Level 11+: 4 sjukdomar
 *
 * @param {number=} levelNumber
 * @return {number}
 */
runmysteriet.segments.Segment_6.prototype.getDiseaseCount = function(levelNumber) {
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
runmysteriet.segments.Segment_6.prototype.addDiseases = function(diseaseSpawns, segmentStart, levelNumber) {
    var diseaseCount = this.getDiseaseCount(levelNumber);
    var diseasePositions = this.getDiseasePositions(segmentStart);
    var i = 0;

    for (i = 0; i < diseaseCount && i < diseasePositions.length; i++) {
        diseaseSpawns.push(diseasePositions[i]);
    }
};

/**
 * Returnerar sjukdomspositioner för Segment 6.
 * Positionerna ligger på säkra markytor, inte över lavahålen.
 *
 * @param {number} segmentStart
 * @return {!Array<!Object>}
 */
runmysteriet.segments.Segment_6.prototype.getDiseasePositions = function(segmentStart) {
    return [
        {
            type: "gray",
            x: segmentStart + 80,
            y: this.groundY - 50
        },
        {
            type: "red",
            x: segmentStart + 550,
            y: this.groundY - 50  
        },
        {
             type: "brown",
            x: segmentStart + 760,
            y: this.groundY - 50
        }
    ];
};
/**
 * Lägger till rune-positioner i en lista av spawn-punkter.
 *
 * @this {runmysteriet.segments.Segment_6}
 * @param {!Array<!{x: number, y: number}>} runeSpawns Lista som fylls med rune-positioner.
 * @param {number} segmentStart Startposition för segmentet på x-axeln.
 * @return {void}
 */
runmysteriet.segments.Segment_6.prototype.addRuneSpawns = function(runeSpawns, segmentStart) {
    var positions = this.getRunePositions(segmentStart);
    var i = 0;

    for (i = 0; i < positions.length; i++) {
        runeSpawns.push(positions[i]);
    }
};

/**
 * Returnerar positioner där runor ska spawnas i Segment_6.
 *
 * @this {runmysteriet.segments.Segment_6}
 * @param {number} segmentStart Startposition för segmentet på x-axeln.
 * @return {!Array<!{x: number, y: number}>} Lista med rune-koordinater.
 */
runmysteriet.segments.Segment_6.prototype.getRunePositions = function(segmentStart) {
    return [
        {
            x: segmentStart + 600,
            y: this.groundY - 70
        }
    ];
};

/**
 * Lägger till armor-positioner i en lista av spawn-punkter.
 *
 * @this {runmysteriet.segments.Segment_6}
 * @param {!Array<!{x: number, y: number}>} armorSpawns Lista som fylls med armor-positioner.
 * @param {number} segmentStart Startposition för segmentet på x-axeln.
 * @return {void}
 */
runmysteriet.segments.Segment_6.prototype.addArmorSpawns = function(armorSpawns, segmentStart) {
    var positions = this.getArmorPositions(segmentStart);
    var i = 0;

    for (i = 0; i < positions.length; i++) {
        armorSpawns.push(positions[i]);
    }
};

/**
 * Returnerar positioner där armor ska spawnas i Segment_6.
 *
 * @this {runmysteriet.segments.Segment_6}
 * @param {number} segmentStart Startposition för segmentet på x-axeln.
 * @return {!Array<!{x: number, y: number}>} Lista med armor-koordinater.
 */
runmysteriet.segments.Segment_6.prototype.getArmorPositions = function(segmentStart) {
    return [
        {
            x: segmentStart + 820,
            y: this.groundY - 95
        }
    ];
};