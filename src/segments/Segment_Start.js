//------------------------------------------------------------------------------
// SEGMENT START
//------------------------------------------------------------------------------

/**
 * Startsegment för en nivå.
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

    /** @type {string} */
    this.jumpTileTexture = "grass_block";

        console.log("segmentStart");

};

/**
 * Skapar startsegmentets mark, lava, sjukdomar, runor och armor.
 *
 * @param {!rune.display.Stage} stage
 * @param {number=} startX
 * @param {number=} levelNumber
 * @return {{
 *   platforms: !Array<!Object>,
 *   holes: !Array<!Object>,
 *   enemySpawns: !Array<!Object>,
 *   diseaseSpawns: !Array<!Object>,
 *   runeSpawns: !Array<!Object>,
 *   armorSpawns: !Array<!Object>,
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
    var runeSpawns = [];
    var armorSpawns = [];

    //Bygger startmarken i delar så vi kan ha ett litet lavahål och en plattform/tile ovanför lavan.
     
    this.addGroundWithLavaAndJumpTile(stage, platforms, holes, segmentStart);

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
 * Lägger till startmark, ett litet lavahål och en tile/plattform att hoppa på.
 *
 * @param {!rune.display.Stage} stage
 * @param {!Array<!Object>} platforms
 * @param {!Array<!Object>} holes
 * @param {number} segmentStart
 */
runmysteriet.segments.Segment_Start.prototype.addGroundWithLavaAndJumpTile = function(stage, platforms, holes, segmentStart) {

    var x = segmentStart;
    var holeWidth = 96;

    //Trygg startmark före lavan.
    
    this.addTiles(
        stage,
        platforms,
        x,
        this.groundY,
        6,
        this.groundTexture
    );

    x += 6 * this.tileW;

    //Litet lavahål.
     
    this.addLavaHole(stage, holes, x, holeWidth);

    //En tile/plattform ovanför lavan.
    this.addTiles(
        stage,
        platforms,
        x + 32,
        this.groundY - 65,
        1,
        this.jumpTileTexture
    );

    x += holeWidth;

    //Mark efter lavan.
     
    this.addTiles(
        stage,
        platforms,
        x,
        this.groundY,
        Math.ceil((this.length - (x - segmentStart)) / this.tileW),
        this.groundTexture
    );
};

/**
 * Lägger till vanligt marksegment.
 * Används inte just nu eftersom addGroundWithLavaAndJumpTile används.
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
 * Lägger till ett lavahål.
 *
 * @param {!rune.display.Stage} stage
 * @param {!Array<!Object>} holes
 * @param {number} x
 * @param {number} holeWidth
 */
runmysteriet.segments.Segment_Start.prototype.addLavaHole = function(stage, holes, x, holeWidth) {

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
 *
 * @param {number} segmentStart
 * @return {!Array<!Object>}
 */
runmysteriet.segments.Segment_Start.prototype.getDiseasePositions = function(segmentStart) {
    return [
        {
            type: "gray",
            x: segmentStart + 300,
            y: this.groundY - 50
        },
        {
            type: "brown",
            x: segmentStart + 420,
            y: this.groundY - 50
        }
    ];
};
/**
 * Lägger till rune-positioner i en lista av spawn-punkter.
 *
 * @this {runmysteriet.segments.Segment_Start}
 * @param {!Array<!{x: number, y: number}>} runeSpawns Lista som fylls med rune-positioner.
 * @param {number} segmentStart Startposition för segmentet på x-axeln.
 * @return {void}
 */
runmysteriet.segments.Segment_Start.prototype.addRuneSpawns = function(runeSpawns, segmentStart) {
    var positions = this.getRunePositions(segmentStart);
    var i = 0;

    for (i = 0; i < positions.length; i++) {
        runeSpawns.push(positions[i]);
    }
};

/**
 * Returnerar positioner där runor ska spawnas i Segment_Start.
 *
 * @this {runmysteriet.segments.Segment_Start}
 * @param {number} segmentStart Startposition för segmentet på x-axeln.
 * @return {!Array<!{x: number, y: number}>} Lista med rune-koordinater.
 */
runmysteriet.segments.Segment_Start.prototype.getRunePositions = function(segmentStart) {
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
 * @this {runmysteriet.segments.Segment_Start}
 * @param {!Array<!{x: number, y: number}>} armorSpawns Lista som fylls med armor-positioner.
 * @param {number} segmentStart Startposition för segmentet på x-axeln.
 * @return {void}
 */
runmysteriet.segments.Segment_Start.prototype.addArmorSpawns = function(armorSpawns, segmentStart) {
    var positions = this.getArmorPositions(segmentStart);
    var i = 0;

    for (i = 0; i < positions.length; i++) {
        armorSpawns.push(positions[i]);
    }
};

/**
 * Returnerar positioner där armor ska spawnas i Segment_Start.
 *
 * @this {runmysteriet.segments.Segment_Start}
 * @param {number} segmentStart Startposition för segmentet på x-axeln.
 * @return {!Array<!{x: number, y: number}>} Lista med armor-koordinater.
 */
runmysteriet.segments.Segment_Start.prototype.getArmorPositions = function(segmentStart) {
    return [
        {
            x: segmentStart + 800,
            y: this.groundY - 110
        }
    ];
};