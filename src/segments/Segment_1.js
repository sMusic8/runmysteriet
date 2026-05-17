//------------------------------------------------------------------------------
// SEGMENT 1
//------------------------------------------------------------------------------

/**
 * Segment_1 constructor.
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
    
    console.log("Segment 1");
};

/**
 * Generates ground for Segment 1.
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
runmysteriet.segments.Segment_1.prototype.ground = function(stage, startX) {

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
                "grass_block"
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

    var cols = Math.ceil(hole.width / this.tileW);
    var rows = Math.ceil(hole.height / this.tileH);

    for (var ly = 0; ly < rows; ly++) {
        for (var lx = 0; lx < cols; lx++) {

            var lava = new rune.display.Graphic(
                hole.x + (lx * this.tileW),
                hole.y + (ly * this.tileH),
                this.tileW,
                this.tileH,
                "lava"
            );

            stage.addChild(lava);
        }
    }

    //----------------------------------------------------------------------
    // PLATTFORMAR ÖVER LAVAN
    //----------------------------------------------------------------------

    var count = 5;
    var spacing = 78;

    for (var j = 0; j < count; j++) {

        var px = x + 30 + (j * spacing);
        var py = this.groundY - (70 + (j % 3) * 30);

        buildStone(px, py, 2, this);

        if (j % 2 === 0) {
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

        enemySpawns.push({
            type: "kristen",
            x: x + 80,
            y: this.groundY - 40
        });
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