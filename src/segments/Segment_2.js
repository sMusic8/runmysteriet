//------------------------------------------------------------------------------
// SEGMENT 2
//------------------------------------------------------------------------------

/**
 * Segment 2 constructor.
 * Handles stone platforms and a lava traversal section.
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
    console.log("Segment 2");
};

/**
 * Generates Segment 2 ground layout.
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
runmysteriet.segments.Segment_2.prototype.ground = function(stage, startX) {

    var segmentStart = startX || 0;
    var segmentEnd = segmentStart + this.length;

    var x = segmentStart;

    var platforms = [];
    var holes = [];
    var enemySpawns = [];
    var waterAreas = [];
    var boats = [];

    var buildStonePlatform = (function(_this) {
        return function(px, py, widthTiles) {
            for (var i = 0; i < widthTiles; i++) {
                var tile = new rune.display.Graphic(
                    px + (i * _this.tileW),
                    py,
                    _this.tileW,
                    _this.tileH,
                    "stone_block"
                );

                stage.addChild(tile);
                platforms.push(tile);
            }
        };
    })(this);

    //----------------------------------------------------------------------
    // STARTPLATTFORM
    //----------------------------------------------------------------------

    buildStonePlatform(x, this.groundY, 6);

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
        this.holeHeight
    );

    stage.addChild(hole);
    holes.push(hole);

    var lavaCols = Math.ceil(holeWidth / this.tileW);
    var lavaRows = 6;

    for (var ly = 0; ly < lavaRows; ly++) {
        for (var lx = 0; lx < lavaCols; lx++) {
            var lavaTile = new rune.display.Graphic(
                x + (lx * this.tileW),
                this.groundY + (ly * this.tileH),
                this.tileW,
                this.tileH,
                "lava"
            );

            stage.addChild(lavaTile);
        }
    }

    //----------------------------------------------------------------------
    // PLATTFORMAR ÖVER LAVAN
    //----------------------------------------------------------------------

    var platformCount = 4;
    var spacing = 95;

    for (var i = 0; i < platformCount; i++) {
        var px = x + 35 + (i * spacing);
        var py = this.groundY - (60 + (i % 2) * 40);

        buildStonePlatform(px, py, 2);

        if (i === 1 || i === 3) {
            enemySpawns.push({
                type: "kristen",
                x: px + 20,
                y: py - 35
            });
        }
    }

    x += holeWidth;

    //----------------------------------------------------------------------
    // LANDNINGSMARK
    //----------------------------------------------------------------------

    buildStonePlatform(x, this.groundY, 6);

    enemySpawns.push({
        type: "kristen",
        x: x + 90,
        y: this.groundY - 40
    });

    x += 6 * this.tileW;

    //----------------------------------------------------------------------
    // FYLL UT RESTEN TILL 1000 PX
    //----------------------------------------------------------------------

    if (x < segmentEnd) {
        var remainingWidth = segmentEnd - x;
        var remainingTiles = Math.ceil(remainingWidth / this.tileW);

        buildStonePlatform(x, this.groundY, remainingTiles);
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