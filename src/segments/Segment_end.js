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

    /** @type {boolean} */  
this.extrap = false;
};

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
 *   runeSpawns: !Array<!Object>,
 *   armorSpawns: !Array<!Object>,
 *   waterAreas: !Array<!Object>,
 *   boats: !Array<!Object>,
 *   endZones: !Array<!Object>,
 *   endX: number
 * }}
 */
runmysteriet.segments.Segment_End.prototype.ground = function(stage, startX, levelNumber) {

    var segmentStart = startX || 0;
    var segmentEnd = segmentStart + this.length;

    var platforms = [];
    var holes = [];
    var enemySpawns = [];
    var diseaseSpawns = [];
    var armorSpawns = [];
    var waterAreas = [];
    var boats = [];
    var endZones = [];
    var runeSpawns = [];

    var gateX = segmentStart + this.length - 240;
    var gateY = this.groundY - 100;

    this.addBackground(stage, segmentStart);

    //Marken byggs i delar så små lavahål kan finnas mellan markbitarna.
     
    this.addGroundWithSmallLavaHoles(stage, platforms, holes, segmentStart);
    this.addJumpPlatforms(stage, platforms, segmentStart);
    this.addGoalMarkers(stage, gateX, gateY);
    this.addDiseases(diseaseSpawns, segmentStart, levelNumber);
    this.addRuneSpawns(runeSpawns, segmentStart);
    this.addEndZone(stage, endZones, segmentEnd);
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
        endZones: endZones,
        endX: segmentEnd
    };
};

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

/**
 * Lägger mark med små lavahål i slutsegmentet.
 *
 * @param {!rune.display.Stage} stage
 * @param {!Array<!Object>} platforms
 * @param {!Array<!Object>} holes
 * @param {number} segmentStart
 */
runmysteriet.segments.Segment_End.prototype.addGroundWithSmallLavaHoles = function(stage, platforms, holes, segmentStart) {

    var x = segmentStart;
    var holeWidth = 64;

    //Mark före första hålet.
     
    this.addTiles(
        stage,
        platforms,
        x,
        this.groundY,
        8,
        this.groundTexture
    );

    x += 8 * this.tileW;

    //Första lilla lavahålet.
     
    this.addLavaHole(stage, holes, x, holeWidth);

    x += holeWidth;

    //Mark mellan hålen.
     
    this.addTiles(
        stage,
        platforms,
        x,
        this.groundY,
        7,
        this.groundTexture
    );

    x += 7 * this.tileW;

    //Andra lilla lavahålet.
     
    this.addLavaHole(stage, holes, x, holeWidth);

    x += holeWidth;

    //Resten av marken fram till slutet.
     
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
 * Lägger till ett litet lavahål.
 *
 * @param {!rune.display.Stage} stage
 * @param {!Array<!Object>} holes
 * @param {number} x
 * @param {number} holeWidth
 */
runmysteriet.segments.Segment_End.prototype.addLavaHole = function(stage, holes, x, holeWidth) {

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
 * Lägger till vanlig mark över hela segmentet.
 * Används inte just nu eftersom addGroundWithSmallLavaHoles används.
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

/**
 * Returnerar antal sjukdomar baserat på level.
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
/**
 * Lägger till rune-positioner i en lista av spawn-punkter.
 *
 * @this {runmysteriet.segments.Segment_End}
 * @param {!Array<!{x: number, y: number}>} runeSpawns Lista som fylls med rune-positioner.
 * @param {number} segmentStart Startposition för segmentet på x-axeln.
 * @return {void}
 */
runmysteriet.segments.Segment_End.prototype.addRuneSpawns = function(runeSpawns, segmentStart) {
    var positions = this.getRunePositions(segmentStart);
    var i = 0;

    for (i = 0; i < positions.length; i++) {
        runeSpawns.push(positions[i]);
    }
};

/**
 * Returnerar positioner där runor ska spawnas i Segment_End.
 *
 * @this {runmysteriet.segments.Segment_End}
 * @param {number} segmentStart Startposition för segmentet på x-axeln.
 * @return {!Array<!{x: number, y: number}>} Lista med rune-koordinater.
 */
runmysteriet.segments.Segment_End.prototype.getRunePositions = function(segmentStart) {
    return [
        {
            x: segmentStart + 250,
            y: this.groundY - 70
        },
        {
            x: segmentStart + 520,
            y: this.groundY - 70
        }
    ];
};

/**
 * Lägger till armor-positioner i en lista av spawn-punkter.
 *
 * @this {runmysteriet.segments.Segment_End}
 * @param {!Array<!{x: number, y: number}>} armorSpawns Lista som fylls med armor-positioner.
 * @param {number} segmentStart Startposition för segmentet på x-axeln.
 * @return {void}
 */
runmysteriet.segments.Segment_End.prototype.addArmorSpawns = function(armorSpawns, segmentStart) {
    var positions = this.getArmorPositions(segmentStart);
    var i = 0;

    for (i = 0; i < positions.length; i++) {
        armorSpawns.push(positions[i]);
    }
};

/**
 * Returnerar positioner där armor ska spawnas i Segment_End.
 *
 * @this {runmysteriet.segments.Segment_End}
 * @param {number} segmentStart Startposition för segmentet på x-axeln.
 * @return {!Array<!{x: number, y: number}>} Lista med armor-koordinater.
 */
runmysteriet.segments.Segment_End.prototype.getArmorPositions = function(segmentStart) {
    return [
        {
            x: segmentStart + 700,
            y: this.groundY - 45
        }
    ];
};

/**
 * Lägger till extra plattformar i slutsegmentet.
 *
 * @param {!rune.display.Stage} stage
 * @param {!Array<!Object>} platforms
 * @param {number} segmentStart
 */
runmysteriet.segments.Segment_End.prototype.addJumpPlatforms = function(stage, platforms, segmentStart) {

    this.addPlatform(
        stage,
        platforms,
        segmentStart + 180,
        this.groundY - 55,
        3
    );

    this.addPlatform(
        stage,
        platforms,
        segmentStart + 340,
        this.groundY - 85,
        3
    );

    this.addPlatform(
        stage,
        platforms,
        segmentStart + 520,
        this.groundY - 65,
        4
    );

    this.addPlatform(
        stage,
        platforms,
        segmentStart + 720,
        this.groundY - 95,
        3
    );

    this.m_extra = new rune.display.Graphic(
    segmentStart + 720 + (3 * this.tileW) - 15,
    this.groundY - 95 - 25,
    30,
    30,
    "extra"
);

stage.addChild(this.m_extra);
this.m_extraCollected = false;
};

/**
 * Skapar en hoppplattform.
 *
 * @param {!rune.display.Stage} stage
 * @param {!Array<!Object>} platforms
 * @param {number} x
 * @param {number} y
 * @param {number} amount
 */
runmysteriet.segments.Segment_End.prototype.addPlatform = function(stage, platforms, x, y, amount) {

    var i = 0;
    var tile = null;

    for (i = 0; i < amount; i++) {
        tile = new rune.display.Graphic(
            x + i * this.tileW,
            y,
            this.tileW,
            this.tileH,
            this.markerTexture
        );

        stage.addChild(tile);
        platforms.push(tile);
    }
};