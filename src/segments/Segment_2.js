//------------------------------------------------------------------------------
// SEGMENT 2
//------------------------------------------------------------------------------

/**
 * Segment 2 constructor.
 * Handles stone platforms and large hole traversal section.
 *
 * @constructor
 */
runmysteriet.segments.Segment_2 = function() {

    /** @type {number} */
    this.tileSize = 268;

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
 *   endX: number
 * }}
 */
runmysteriet.segments.Segment_2.prototype.ground = function(stage, startX) {

    /** @type {number} */
    var x = startX || 0;

    /** @type {!Array<!rune.display.Graphic>} */
    var platforms = [];

    /** @type {!Array<!runmysteriet.ui.graphic.Hole>} */
    var holes = [];

    /** @type {!Array<!Object>} */
    var enemySpawns = [];

    /**
     * Builds a stone platform using tiles.
     *
     * @param {number} px
     * @param {number} py
     * @param {number} widthTiles
     * @return {!Array<!rune.display.Graphic>}
     */
    var buildStonePlatform = (function(_this) {

        /**
         * @param {number} px
         * @param {number} py
         * @param {number} widthTiles
         * @return {!Array<!rune.display.Graphic>}
         */
        return function(px, py, widthTiles) {

            /** @type {!Array<!rune.display.Graphic>} */
            var group = [];

            for (var i = 0; i < widthTiles; i++) {

                var tile = new rune.display.Graphic(
                    px + (i * _this.tileW),
                    py,
                    _this.tileW,
                    _this.tileH,
                    "bana-gras1"
                );

                stage.addChild(tile);
                platforms.push(tile);
                group.push(tile);
            }

            return group;
        };

    })(this);

    //----------------------------------------------------------------------

    // START PLATFORM
    buildStonePlatform(x, this.groundY, 8);

    enemySpawns.push({
        type: "kristen",
        x: x + 120,
        y: this.groundY - 40
    });

    x += 8 * this.tileW;

    //----------------------------------------------------------------------

    // LARGE HOLE SECTION
    var holeWidth = 520;

    var hole = new runmysteriet.ui.graphic.Hole(
        x,
        this.groundY,
        holeWidth,
        this.holeHeight
    );

    stage.addChild(hole);
    holes.push(hole);

    //----------------------------------------------------------------------

    // MID AIR PLATFORM SECTION
    var platformCount = 5;
    var spacing = 110;

    for (var i = 0; i < platformCount; i++) {

        var px = x + 30 + (i * spacing);
        var py = this.groundY - (60 + (i % 2) * 40);

        buildStonePlatform(px, py, 2);

        if (i % 2 === 0) {

            enemySpawns.push({
                type: "kristen",
                x: px + 20,
                y: py - 35
            });
        }
    }

    //----------------------------------------------------------------------

    // LANDING PLATFORM
    x += holeWidth;

    buildStonePlatform(x, this.groundY, 8);

    enemySpawns.push({
        type: "kristen",
        x: x + 120,
        y: this.groundY - 40
    });

    x += 8 * this.tileW;

    //----------------------------------------------------------------------

    // FINAL PLATFORM
    buildStonePlatform(x, this.groundY, 6);

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