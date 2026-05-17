//------------------------------------------------------------------------------
// SEGMENT 6
//------------------------------------------------------------------------------

/**
 * Segment 6 constructor.
 * Generates alternating holes and stone platforms.
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
};

/**
 * Generates Segment 6 ground layout.
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
runmysteriet.segments.Segment_6.prototype.ground = function(stage, startX) {

    var segmentStart = startX || 0;
    var segmentEnd = segmentStart + this.length;

    var x = segmentStart;

    var platforms = [];
    var holes = [];
    var enemySpawns = [];
    var waterAreas = [];
    var boats = [];
    var diseaseSpawns = [];

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

    buildGrass(x, this.groundY, 5, this);
    x += 5 * this.tileW;

    //----------------------------------------------------------------------
    // VÄXLANDE HÅL OCH STENPLATTFORMAR
    //----------------------------------------------------------------------

    for (var j = 0; j < 4; j++) {

        var holeWidth = 80;

        var hole = new runmysteriet.ui.graphic.Hole(
            x,
            this.groundY,
            holeWidth,
            200
        );

        stage.addChild(hole);
        holes.push(hole);

        /*
         * Lava placeras i hålet.
         */
        var lavaCols = Math.ceil(holeWidth / this.tileW);
        var lavaRows = 6;

        for (var ly = 0; ly < lavaRows; ly++) {
            for (var lx = 0; lx < lavaCols; lx++) {

                var lava = new rune.display.Graphic(
                    x + lx * this.tileW,
                    this.groundY + ly * this.tileH,
                    this.tileW,
                    this.tileH,
                    "lava"
                );

                stage.addChild(lava);
            }
        }

        x += holeWidth;

        var py = this.groundY - (j * 18);

        buildStone(x, py, 3, this);
        x += 3 * this.tileW;
    }

    //----------------------------------------------------------------------
    // LANDNINGSMARK
    //----------------------------------------------------------------------

    buildGrass(x, this.groundY, 4, this);
    x += 4 * this.tileW;

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
        diseaseSpawns: diseaseSpawns,
        waterAreas: waterAreas,
        boats: boats,
        endX: segmentEnd
    };
};