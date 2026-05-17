//------------------------------------------------------------------------------
// SEGMENT 3
//------------------------------------------------------------------------------

/**
 * Segment 3 constructor.
 * Creates a lava hole with rising stone platforms.
 *
 * @constructor
 */
runmysteriet.segments.Segment_3 = function() {

    /** @type {number} */
    this.length = 1000;

    /** @type {number} */
    this.groundY = 200;

    /** @type {number} */
    this.tileW = 32;

    /** @type {number} */
    this.tileH = 20;
    console.log("Segment 3");

};

/**
 * Generates the ground layout for Segment 3.
 *
 * @param {!rune.display.Stage} stage
 * @param {number=} startX
 * @return {{
 *   platforms: !Array<!rune.display.Graphic>,
 *   holes: !Array<!runmysteriet.ui.graphic.Hole>,
 *   enemySpawns: !Array<!Object>,
 *   waterAreas: !Array<!Object>,
 *   boats: !Array<!Object>,
 *   endX: number
 * }}
 */
runmysteriet.segments.Segment_3.prototype.ground = function(stage, startX) {

    var segmentStart = startX || 0;
    var segmentEnd = segmentStart + this.length;

    var x = segmentStart;

    var platforms = [];
    var holes = [];
    var enemySpawns = [];
    var waterAreas = [];
    var boats = [];

    function buildGrass(px, py, tiles, _this) {

        for (var i = 0; i < tiles; i++) {

            var tile = new rune.display.Graphic(
                px + (i * _this.tileW),
                py,
                _this.tileW,
                _this.tileH,
                "bana-gras1"
            );

            stage.addChild(tile);
            platforms.push(tile);
        }
    }

    function buildStone(px, py, tiles, _this) {

        for (var i = 0; i < tiles; i++) {

            var tile = new rune.display.Graphic(
                px + (i * _this.tileW),
                py,
                _this.tileW,
                _this.tileH,
                "tree_block"
            );

            stage.addChild(tile);
            platforms.push(tile);
        }
    }

    //----------------------------------------------------------------------
    // STARTMARK
    //----------------------------------------------------------------------

    buildGrass(x, this.groundY, 6, this);

    enemySpawns.push({
        type: "kristen",
        x: x + 100,
        y: this.groundY - 40
    });

    x += 6 * this.tileW;

    //----------------------------------------------------------------------
    // LAVAHÅL
    //----------------------------------------------------------------------

    var holeWidth = 430;

    var hole = new runmysteriet.ui.graphic.Hole(
        x,
        this.groundY,
        holeWidth,
        200
    );

    stage.addChild(hole);
    holes.push(hole);

    var lavaCols = Math.ceil(holeWidth / this.tileW);
    var lavaRows = 6;

    for (var ly = 0; ly < lavaRows; ly++) {
        for (var lx = 0; lx < lavaCols; lx++) {

            var lava = new rune.display.Graphic(
                x + (lx * this.tileW),
                this.groundY + (ly * this.tileH),
                this.tileW,
                this.tileH,
                "lava"
            );

            stage.addChild(lava);
        }
    }

    //----------------------------------------------------------------------
    // TRAPPPLATTFORMAR ÖVER LAVAN
    //----------------------------------------------------------------------

    var steps = 5;

    for (var j = 0; j < steps; j++) {

        var px = x + 35 + (j * 78);
        var py = this.groundY - (40 + j * 22);

        buildStone(px, py, 2, this);

        if (j === 2 || j === 4) {
            enemySpawns.push({
                type: "kristen",
                x: px + 10,
                y: py - 35
            });
        }
    }

    x += holeWidth;

    //----------------------------------------------------------------------
    // LANDNINGSMARK
    //----------------------------------------------------------------------

    buildGrass(x, this.groundY, 6, this);

    enemySpawns.push({
        type: "kristen",
        x: x + 100,
        y: this.groundY - 40
    });

    x += 6 * this.tileW;

    //----------------------------------------------------------------------
    // FYLL UT RESTEN TILL 1000 PX
    //----------------------------------------------------------------------

    if (x < segmentEnd) {
        var remainingWidth = segmentEnd - x;
        var remainingTiles = Math.ceil(remainingWidth / this.tileW);

        buildGrass(x, this.groundY, remainingTiles, this);
    }

    return {
        platforms: platforms,
        holes: holes,
        enemySpawns: enemySpawns,
        waterAreas: waterAreas,
        boats: boats,
        endX: segmentEnd
    };
};