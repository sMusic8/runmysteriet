//------------------------------------------------------------------------------
// SEGMENT 1
//------------------------------------------------------------------------------

/**
 * Segment 1.
 * Skapar ett lavasegment med små plattformar, fiender och sjukdomar.
 *
 * @constructor
 */
runmysteriet.segments.Segment_1 = function() {

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

    console.log("segment1");
};

/**
 * Skapar mark och hinder för Segment 1.
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
runmysteriet.segments.Segment_1.prototype.ground = function(stage, startX, levelNumber) {
console.log("Segment 1")
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

    this.addStartGround(stage, platforms, enemySpawns, x);
    x += 6 * this.tileW;

    this.addLavaHole(stage, holes, x, holeWidth);
    this.addPlatformsOverLava(stage, platforms, enemySpawns, x);

    x += holeWidth;

    this.addLandingGround(stage, platforms, enemySpawns, x);
    x += 6 * this.tileW;

    this.addRemainingGround(stage, platforms, enemySpawns, x, segmentEnd);
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
 * @param {!Array<!Object>} enemySpawns
 * @param {number} x
 */
runmysteriet.segments.Segment_1.prototype.addStartGround = function(stage, platforms, enemySpawns, x) {
    this.addTiles(stage, platforms, x, this.groundY, 6, this.groundTexture);

    enemySpawns.push({
        type: "kristen",
        x: x + 100,
        y: this.groundY - 40
    });
};

/**
 * Lägger till landningsmark efter lavahålet.
 *
 * @param {!rune.display.Stage} stage
 * @param {!Array<!Object>} platforms
 * @param {!Array<!Object>} enemySpawns
 * @param {number} x
 */
runmysteriet.segments.Segment_1.prototype.addLandingGround = function(stage, platforms, enemySpawns, x) {
    this.addTiles(stage, platforms, x, this.groundY, 6, this.groundTexture);

    enemySpawns.push({
        type: "kristen",
        x: x + 100,
        y: this.groundY - 40
    });
};

/**
 * Fyller ut resten av segmentet med mark.
 *
 * @param {!rune.display.Stage} stage
 * @param {!Array<!Object>} platforms
 * @param {!Array<!Object>} enemySpawns
 * @param {number} x
 * @param {number} segmentEnd
 */
runmysteriet.segments.Segment_1.prototype.addRemainingGround = function(stage, platforms, enemySpawns, x, segmentEnd) {
    var remainingWidth = 0;
    var remainingTiles = 0;

    if (x >= segmentEnd) {
        return;
    }

    remainingWidth = segmentEnd - x;
    remainingTiles = Math.ceil(remainingWidth / this.tileW);

    this.addTiles(stage, platforms, x, this.groundY, remainingTiles, this.groundTexture);

    enemySpawns.push({
        type: "kristen",
        x: x + 80,
        y: this.groundY - 40

    });
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
runmysteriet.segments.Segment_1.prototype.addTiles = function(stage, platforms, x, y, amount, texture) {
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
runmysteriet.segments.Segment_1.prototype.addLavaHole = function(stage, holes, x, holeWidth) {

    var hole = new runmysteriet.ui.graphic.Hole(
        x,
        this.groundY,
        holeWidth,
        200
    );

    //Hole lägger själv ut lava
     
    hole.addToStage(stage);

    //Hole sparas för dödslogik
     
    holes.push(hole);
};

/**
 * Lägger till små plattformar över lavan.
 *
 * @param {!rune.display.Stage} stage
 * @param {!Array<!Object>} platforms
 * @param {!Array<!Object>} enemySpawns
 * @param {number} x
 */
runmysteriet.segments.Segment_1.prototype.addPlatformsOverLava = function(stage, platforms, enemySpawns, x) {
    var count = 5;
    var spacing = 78;
    var j = 0;
    var px = 0;
    var py = 0;

    for (j = 0; j < count; j++) {
        px = x + 30 + (j * spacing);
        py = this.groundY - (70 + (j % 3) * 30);

        this.addTiles(stage, platforms, px, py, 2, this.platformTexture);

        if (j % 2 === 0) {
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
 * @param {number=} levelNumber
 * @return {number}
 */
runmysteriet.segments.Segment_1.prototype.getDiseaseCount = function(levelNumber) {
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
 * Lägger till sjukdomar på säkra ytor i segmentet.
 *
 * @param {!Array<!Object>} diseaseSpawns
 * @param {number} segmentStart
 * @param {number=} levelNumber
 */
runmysteriet.segments.Segment_1.prototype.addDiseases = function(diseaseSpawns, segmentStart, levelNumber) {
    var diseaseCount = this.getDiseaseCount(levelNumber);
    var diseasePositions = this.getDiseasePositions(segmentStart);
    var i = 0;

    for (i = 0; i < diseaseCount && i < diseasePositions.length; i++) {
        diseaseSpawns.push(diseasePositions[i]);
    }
};

/**
 * Returnerar sjukdomspositioner för Segment 1.
 * Positionerna ligger på startmark/slutmark, inte mitt över lavahålet.
 *
 * @param {number} segmentStart
 * @return {!Array<!Object>}
 */
runmysteriet.segments.Segment_1.prototype.getDiseasePositions = function(segmentStart) {
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
 * @this {runmysteriet.segments.Segment_1}
 * @param {!Array<!{x: number, y: number}>} runeSpawns Lista som fylls med positioner.
 * @param {number} segmentStart Startposition för segmentet på x-axeln.
 * @return {void}
 */
runmysteriet.segments.Segment_1.prototype.addRuneSpawns = function(runeSpawns, segmentStart) {
    var positions = this.getRunePositions(segmentStart);
    var i = 0;

    for (i = 0; i < positions.length; i++) {
        runeSpawns.push(positions[i]);
    }
};

/**
 * Returnerar en lista med positioner där runor ska spawnas.
 *
 * @this {runmysteriet.segments.Segment_1}
 * @param {number} segmentStart Startposition för segmentet på x-axeln.
 * @return {!Array<!{x: number, y: number}>} Lista med koordinater.
 */
runmysteriet.segments.Segment_1.prototype.getRunePositions = function(segmentStart) {
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
 * @this {runmysteriet.segments.Segment_1}
 * @param {!Array<!{x: number, y: number}>} armorSpawns Lista som fylls med armor-positioner.
 * @param {number} segmentStart Startposition för segmentet på x-axeln.
 * @return {void}
 */
runmysteriet.segments.Segment_1.prototype.addArmorSpawns = function(armorSpawns, segmentStart) {
    var positions = this.getArmorPositions(segmentStart);
    var i = 0;

    for (i = 0; i < positions.length; i++) {
        armorSpawns.push(positions[i]);
    }
};

/**
 * Returnerar positioner där armor ska spawnas.
 *
 * @this {runmysteriet.segments.Segment_1}
 * @param {number} segmentStart Startposition för segmentet på x-axeln.
 * @return {!Array<!{x: number, y: number}>} Lista med koordinater för armor-spawns.
 */
runmysteriet.segments.Segment_1.prototype.getArmorPositions = function(segmentStart) {
    return [
        {
            x: segmentStart + 850,
            y: this.groundY - 70
        }
    ];
};