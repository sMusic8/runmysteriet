//------------------------------------------------------------------------------
// SEGMENT 2
//------------------------------------------------------------------------------

/**
 * Segment 2.
 * Skapar ett stenbaserat lavasegment med plattformar, fiender och sjukdomar.
 *
 * @constructor
 */
runmysteriet.segments.Segment_2 = function() {

    /** @type {number} */
    this.length = 1000;

    /** @type {number} */
    this.groundY = 200;

    /** @type {number} */
    this.holeHeight = 200;

    /** @type {number} */
    this.tileW = 32;

    /** @type {number} */
    this.tileH = 20;

    /** @type {string} */
    this.platformTexture = "stone_block";

    /** @type {string} */
    this.lavaTexture = "lava";

        console.log("segment2");

};

/**
 * Skapar Segment 2.
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
runmysteriet.segments.Segment_2.prototype.ground = function(stage, startX, levelNumber) {

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

    var holeWidth = 430;

    this.addStartPlatform(stage, platforms, enemySpawns, x);
    x += 6 * this.tileW;

    this.addLavaHole(stage, holes, x, holeWidth);
    this.addPlatformsOverLava(stage, platforms, enemySpawns, x);

    x += holeWidth;

    this.addLandingPlatform(stage, platforms, enemySpawns, x);
    x += 6 * this.tileW;

    this.addRemainingPlatform(stage, platforms, x, segmentEnd);
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
 * Lägger till startplattform.
 *
 * @param {!rune.display.Stage} stage
 * @param {!Array<!Object>} platforms
 * @param {!Array<!Object>} enemySpawns
 * @param {number} x
 */
runmysteriet.segments.Segment_2.prototype.addStartPlatform = function(stage, platforms, enemySpawns, x) {
    this.addTiles(
        stage,
        platforms,
        x,
        this.groundY,
        6,
        this.platformTexture
    );

    enemySpawns.push({
        type: "kristen",
        x: x + 100,
        y: this.groundY - 40
    });
};

/**
 * Lägger till landningsplattform efter lavahålet.
 *
 * @param {!rune.display.Stage} stage
 * @param {!Array<!Object>} platforms
 * @param {!Array<!Object>} enemySpawns
 * @param {number} x
 */
runmysteriet.segments.Segment_2.prototype.addLandingPlatform = function(stage, platforms, enemySpawns, x) {
    this.addTiles(
        stage,
        platforms,
        x,
        this.groundY,
        6,
        this.platformTexture
    );

    enemySpawns.push({
        type: "kristen",
        x: x + 90,
        y: this.groundY - 40
    });
};

/**
 * Fyller ut resten av segmentet med plattform.
 *
 * @param {!rune.display.Stage} stage
 * @param {!Array<!Object>} platforms
 * @param {number} x
 * @param {number} segmentEnd
 */
runmysteriet.segments.Segment_2.prototype.addRemainingPlatform = function(stage, platforms, x, segmentEnd) {
    var remainingWidth = 0;
    var remainingTiles = 0;

    if (x >= segmentEnd) {
        return;
    }

    remainingWidth = segmentEnd - x;
    remainingTiles = Math.ceil(remainingWidth / this.tileW);

    this.addTiles(
        stage,
        platforms,
        x,
        this.groundY,
        remainingTiles,
        this.platformTexture
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
runmysteriet.segments.Segment_2.prototype.addTiles = function(stage, platforms, x, y, amount, texture) {
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
 * Lägger till lavahålet.
 *
 * @param {!rune.display.Stage} stage
 * @param {!Array<!Object>} holes
 * @param {number} x
 * @param {number} holeWidth
 */


runmysteriet.segments.Segment_2.prototype.addLavaHole = function(stage, holes, x, holeWidth) {

    var hole = new runmysteriet.ui.graphic.Hole(
        x,
        this.groundY,
        holeWidth,
        this.holeHeight
    );

    //Hole lägger själv ut sin lava.
     
    hole.addToStage(stage);

    //Själva hole-objektet sparas för dödslogik.
    holes.push(hole);
};


/**
 * Lägger till plattformar över lavan.
 *
 * @param {!rune.display.Stage} stage
 * @param {!Array<!Object>} platforms
 * @param {!Array<!Object>} enemySpawns
 * @param {number} x
 */
runmysteriet.segments.Segment_2.prototype.addPlatformsOverLava = function(stage, platforms, enemySpawns, x) {
    var platformCount = 4;
    var spacing = 95;
    var i = 0;
    var px = 0;
    var py = 0;

    for (i = 0; i < platformCount; i++) {
        px = x + 35 + (i * spacing);
        py = this.groundY - (60 + (i % 2) * 40);

        this.addTiles(
            stage,
            platforms,
            px,
            py,
            2,
            this.platformTexture
        );

        if (i === 1 || i === 3) {
            enemySpawns.push({
                type: "kristen",
                x: px + 20,
                y: py - 35
            });
        }
    }
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
runmysteriet.segments.Segment_2.prototype.getDiseaseCount = function(levelNumber) {
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
 * Lägger till sjukdomar på olika positioner.
 *
 * @param {!Array<!Object>} diseaseSpawns
 * @param {number} segmentStart
 * @param {number=} levelNumber
 */
runmysteriet.segments.Segment_2.prototype.addDiseases = function(diseaseSpawns, segmentStart, levelNumber) {
    var diseaseCount = this.getDiseaseCount(levelNumber);
    var diseasePositions = this.getDiseasePositions(segmentStart);
    var i = 0;

    for (i = 0; i < diseaseCount && i < diseasePositions.length; i++) {
        diseaseSpawns.push(diseasePositions[i]);
    }
};

/**
 * Returnerar sjukdomspositioner för Segment 2.
 * Positionerna ligger på olika stenytor, inte mitt i lavahålet.
 *
 * @param {number} segmentStart
 * @return {!Array<!Object>}
 */
runmysteriet.segments.Segment_2.prototype.getDiseasePositions = function(segmentStart) {
    return [
        {
            type: "gray",
            x: segmentStart + 80,
            y: this.groundY - 50
        },
        {
            type: "brown",
            x: segmentStart + 760,
            y: this.groundY - 50
        },
        {
            type: "red",
            x: segmentStart + 850,
            y: this.groundY - 50
        },
        {
            type: "gray",
            x: segmentStart + 930,
            y: this.groundY - 50
        }
    ];
};

/**
 * Lägger till rune-positioner i en lista av spawn-punkter.
 *
 * @this {runmysteriet.segments.Segment_2}
 * @param {!Array<!{x: number, y: number}>} runeSpawns Lista som fylls med rune-positioner.
 * @param {number} segmentStart Startposition för segmentet på x-axeln.
 * @return {void}
 */
runmysteriet.segments.Segment_2.prototype.addRuneSpawns = function(runeSpawns, segmentStart) {
    var positions = this.getRunePositions(segmentStart);
    var i = 0;

    for (i = 0; i < positions.length; i++) {
        runeSpawns.push(positions[i]);
    }
};

/**
 * Returnerar en lista med positioner där runor ska spawnas i Segment_2.
 *
 * @this {runmysteriet.segments.Segment_2}
 * @param {number} segmentStart Startposition för segmentet på x-axeln.
 * @return {!Array<!{x: number, y: number}>} Lista med koordinater.
 */
runmysteriet.segments.Segment_2.prototype.getRunePositions = function(segmentStart) {
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
 * @this {runmysteriet.segments.Segment_2}
 * @param {!Array<!{x: number, y: number}>} armorSpawns Lista som fylls med armor-positioner.
 * @param {number} segmentStart Startposition för segmentet på x-axeln.
 * @return {void}
 */
runmysteriet.segments.Segment_2.prototype.addArmorSpawns = function(armorSpawns, segmentStart) {
    var positions = this.getArmorPositions(segmentStart);
    var i = 0;

    for (i = 0; i < positions.length; i++) {
        armorSpawns.push(positions[i]);
    }
};

/**
 * Returnerar positioner där armor ska spawnas i Segment_2.
 *
 * @this {runmysteriet.segments.Segment_2}
 * @param {number} segmentStart Startposition för segmentet på x-axeln.
 * @return {!Array<!{x: number, y: number}>} Lista med armor-koordinater.
 */
runmysteriet.segments.Segment_2.prototype.getArmorPositions = function(segmentStart) {
    return [
        {
            x: segmentStart + 850,
            y: this.groundY - 45
        }
    ];
};