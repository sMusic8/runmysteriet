//------------------------------------------------------------------------------
// SEGMENT END
//------------------------------------------------------------------------------

/**
 * Segment_End constructor.
 * Final level segment with ascending staircase structure.
 *
 * @constructor
 */
runmysteriet.segments.Segment_End = function() {

    /** @type {number} */
    this.tileSize = 268;

    /** @type {number} */
    this.groundY = 200;

    /** @type {number} */
    this.tileW = 32;

    /** @type {number} */
    this.tileH = 20;

    console.log("Segment end");
};

/**
 * Generates end segment terrain.
 *
 * @param {!rune.display.Stage} stage
 * @param {number=} startX
 * @return {{
 *   platforms: !Array<!rune.display.Graphic>,
 *   holes: !Array<!Object>,
 *   enemySpawns: !Array<!Object>,
 *   endX: number
 * }}
 */
runmysteriet.segments.Segment_End.prototype.ground = function(stage, startX) {

    /** @type {number} */
    var x = startX || 0;

    /** @type {!Array<!rune.display.Graphic>} */
    var platforms = [];

    /** @type {!Array<!Object>} */
    var holes = [];

    /** @type {!Array<!Object>} */
    var enemySpawns = [];

    /**
     * Builds a horizontal platform using tiles.
     *
     * @param {number} px
     * @param {number} py
     * @param {number} tiles
     * @param {!runmysteriet.segments.Segment_End} _this
     * @param {string} texture
     */
    function build(px, py, tiles, _this, texture) {

        for (var i = 0; i < tiles; i++) {

            var tile = new rune.display.Graphic(
                px + (i * _this.tileW),
                py,
                _this.tileW,
                _this.tileH,
                texture
            );

            stage.addChild(tile);
            platforms.push(tile);
        }
    }

    //----------------------------------------------------------------------

    /** @type {string} */
    var texture = "wood_block";

    //----------------------------------------------------------------------

    // START PLATFORM
    build(x, this.groundY, 8, this, texture);
    x += 8 * this.tileW;

    //----------------------------------------------------------------------

    // STAIR STEP 1 (LOW)
    var stepSpacingX = 140;
    var stepSpacingY = 55;

    /** @type {number} */
    var startY = this.groundY;

    build(x, startY, 6, this, texture);
    x += stepSpacingX;

    //----------------------------------------------------------------------

    // STAIR STEP 2 (MID)
    build(x, startY - stepSpacingY, 6, this, texture);
    x += stepSpacingX;

    //----------------------------------------------------------------------

    // STAIR STEP 3 (HIGH)
    build(x, startY - (stepSpacingY * 2), 6, this, texture);
    x += stepSpacingX;

    //----------------------------------------------------------------------

    // FINAL PLATFORM (TOP LANDING)
    build(x, startY - (stepSpacingY * 2), 8, this, texture);
    x += 8 * this.tileW;

    //----------------------------------------------------------------------

    return {
        platforms: platforms,
        holes: holes,
        enemySpawns: enemySpawns,
        endX: x
    };
};