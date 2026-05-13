//------------------------------------------------------------------------------
// SEGMENT 1
//------------------------------------------------------------------------------

/**
 * Segment_1 constructor.
 * @constructor
 */
runmysteriet.segments.Segment_1 = function() {

    /** @type {number} */
    this.tileSize = 268;

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
 *   endX: number
 * }}
 */
runmysteriet.segments.Segment_1.prototype.ground = function(stage, startX) {

    /** @type {number} */
    var x = startX || 0;

    /** @type {!Array<!rune.display.Graphic>} */
    var platforms = [];

    /** @type {!Array<!runmysteriet.ui.graphic.Hole>} */
    var holes = [];

    /** @type {!Array<!Object>} */
    var enemySpawns = [];

    /**
     * Builds grass tiles.
     *
     * @param {number} px
     * @param {number} py
     * @param {number} tiles
     * @param {!runmysteriet.segments.Segment_1} _this
     */
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

    /**
     * Builds stone tiles.
     *
     * @param {number} px
     * @param {number} py
     * @param {number} tiles
     * @param {!runmysteriet.segments.Segment_1} _this
     */
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

    buildGrass(x, this.groundY, 8, this);

    enemySpawns.push({
        type: "kristen",
        x: x + 120,
        y: this.groundY - 40
    });

    x += 8 * this.tileW;

    //----------------------------------------------------------------------

    var holeWidth = 520;

    var hole = new runmysteriet.ui.graphic.Hole(
        x,
        this.groundY,
        holeWidth,
        200
    );

    stage.addChild(hole);
    holes.push(hole);

    //----------------------------------------------------------------------

    var count = 6;
    var spacing = 95;

    for (var i = 0; i < count; i++) {

        var px = x + 30 + (i * spacing);
        var py = this.groundY - (70 + (i % 3) * 30);

        buildStone(px, py, 2, this);

        if (i % 2 === 0) {
            enemySpawns.push({
                type: "kristen",
                x: px + 20,
                y: py - 35
            });
        }
    }

    //----------------------------------------------------------------------

    x += holeWidth;

    buildGrass(x, this.groundY, 8, this);

    enemySpawns.push({
        type: "kristen",
        x: x + 120,
        y: this.groundY - 40
    });

    x += 8 * this.tileW;

    //----------------------------------------------------------------------

    buildGrass(x, this.groundY, 6, this);

    enemySpawns.push({
        type: "kristen",
        x: x + 80,
        y: this.groundY - 40
    });

    x += 6 * this.tileW;

    //----------------------------------------------------------------------

    return {
        platforms: platforms,
        holes: holes,
        enemySpawns: enemySpawns,
        endX: x
    };
};