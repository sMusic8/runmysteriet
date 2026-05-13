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
    this.tileSize = 268;

    /** @type {number} */
    this.groundY = 200;

    /** @type {number} */
    this.tileW = 32;

    /** @type {number} */
    this.tileH = 20;

    console.log("Segment 6");
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
 *   endX: number
 * }}
 */
runmysteriet.segments.Segment_6.prototype.ground = function(stage, startX) {

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
     * @param {!runmysteriet.segments.Segment_6} _this
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
     * @param {!runmysteriet.segments.Segment_6} _this
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

    // START PLATFORM
    buildGrass(x, this.groundY, 6, this);
    x += 6 * this.tileW;

    //----------------------------------------------------------------------

    // HOLE + PLATFORM MIX SECTION
    for (var i = 0; i < 5; i++) {

        // HOLE
        var hole = new runmysteriet.ui.graphic.Hole(
            x,
            this.groundY,
            80,
            200
        );

        stage.addChild(hole);
        holes.push(hole);

        x += 80;

        // STONE PLATFORM AFTER HOLE (SLIGHTLY ASCENDING)
        var py = this.groundY - (i * 20);

        buildStone(x, py, 3, this);

        x += 3 * this.tileW;
    }

    //----------------------------------------------------------------------

    // END PLATFORM
    buildGrass(x, this.groundY, 6, this);
    x += 6 * this.tileW;

    //----------------------------------------------------------------------

    return {
        platforms: platforms,
        holes: holes,
        enemySpawns: enemySpawns,
        endX: x
    };
};