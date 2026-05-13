//------------------------------------------------------------------------------
// SEGMENT 4
//------------------------------------------------------------------------------

/**
 * Segment 4 constructor.
 * Handles grass, stone platforms and zig-zag jump section.
 *
 * @constructor
 */
runmysteriet.segments.Segment_4 = function() {

    /** @type {number} */
    this.tileSize = 268;

    /** @type {number} */
    this.groundY = 200;

    /** @type {number} */
    this.tileW = 32;

    /** @type {number} */
    this.tileH = 20;

    console.log("Segment 4");
};

/**
 * Generates Segment 4 ground layout.
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
runmysteriet.segments.Segment_4.prototype.ground = function(stage, startX) {

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
     * @param {!runmysteriet.segments.Segment_4} _this
     * @return {void}
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
     * @param {!runmysteriet.segments.Segment_4} _this
     * @return {void}
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

    // START
    buildGrass(x, this.groundY, 6, this);
    x += 6 * this.tileW;

    // HOLE
    var holeWidth = 400;

    var hole = new runmysteriet.ui.graphic.Hole(
        x,
        this.groundY,
        holeWidth,
        200
    );

    stage.addChild(hole);
    holes.push(hole);

    // 🔥 LAVA
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

    // ZIG ZAG
    for (var i = 0; i < 6; i++) {

        var px = x + 40 + (i * 70);
        var py = this.groundY - (i % 2 === 0 ? 60 : 110);

        buildStone(px, py, 2, this);
    }

    // LANDING
    x += holeWidth;

    buildGrass(x, this.groundY, 8, this);
    x += 8 * this.tileW;

    buildGrass(x, this.groundY, 6, this);
    x += 6 * this.tileW;

    return {
        platforms: platforms,
        holes: holes,
        enemySpawns: enemySpawns,
        endX: x
    };
};