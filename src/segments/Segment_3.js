//------------------------------------------------------------------------------
// SEGMENT 3
//------------------------------------------------------------------------------

/**
 * Segment 3 constructor.
 * Defines tile size and ground settings for this level segment.
 *
 * @constructor
 */
runmysteriet.segments.Segment_3 = function() {

    /** @type {number} */
    this.tileSize = 268;

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
 *   endX: number
 * }}
 */
runmysteriet.segments.Segment_3.prototype.ground = function(stage, startX) {

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
     * @param {!runmysteriet.segments.Segment_3} _this
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
     * Builds stone platform tiles.
     *
     * @param {number} px
     * @param {number} py
     * @param {number} tiles
     * @param {!runmysteriet.segments.Segment_3} _this
     */
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

    // START PLATFORM (GRASS)
    buildGrass(x, this.groundY, 8, this);

    enemySpawns.push({
        type: "kristen",
        x: x + 120,
        y: this.groundY - 40
    });

    x += 8 * this.tileW;

    //----------------------------------------------------------------------

    // HOLE SECTION
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

    // STAIR PLATFORM (STONE)
    var steps = 6;

    for (var i = 0; i < steps; i++) {

        var px = x + 40 + (i * 80);

        var py = this.groundY - (40 + i * 25);

        buildStone(px, py, 2, this);

        if (i === 2 || i === 4) {

            enemySpawns.push({
                type: "kristen",
                x: px + 10,
                y: py - 35
            });
        }
    }

    //----------------------------------------------------------------------

    // LANDING PLATFORM
    x += holeWidth;

    buildGrass(x, this.groundY, 8, this);

    enemySpawns.push({
        type: "kristen",
        x: x + 120,
        y: this.groundY - 40
    });

    x += 8 * this.tileW;

    //----------------------------------------------------------------------

    // EXTRA GROUND
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