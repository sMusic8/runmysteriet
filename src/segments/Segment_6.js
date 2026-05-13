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

    var x = startX || 0;

    var platforms = [];
    var holes = [];
    var enemySpawns = [];

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

    buildGrass(x, this.groundY, 6, this);
    x += 6 * this.tileW;

    //----------------------------------------------------------------------

    for (var i = 0; i < 5; i++) {

        var hole = new runmysteriet.ui.graphic.Hole(
            x,
            this.groundY,
            80,
            200
        );

        stage.addChild(hole);
        holes.push(hole);

        // 🔥 LAVA (TILLAGD)
        var lavaCols = Math.ceil(80 / this.tileW);
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

        x += 80;

        var py = this.groundY - (i * 20);

        buildStone(x, py, 3, this);

        x += 3 * this.tileW;
    }

    //----------------------------------------------------------------------

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