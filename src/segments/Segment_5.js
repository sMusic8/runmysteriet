//------------------------------------------------------------------------------
// SEGMENT 5
//------------------------------------------------------------------------------

/**
 * Segment 5 constructor.
 * Contains alternating holes and stone platform sections.
 *
 * @constructor
 */
runmysteriet.segments.Segment_5 = function() {

    this.tileSize = 268;
    this.groundY = 200;
    this.tileW = 32;
    this.tileH = 20;

    console.log("Segment 5");
};

/**
 * Generates Segment 5 ground layout.
 */
runmysteriet.segments.Segment_5.prototype.ground = function(stage, startX) {

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
                "stone_block"
            );

            stage.addChild(tile);
            platforms.push(tile);
        }
    }

    //----------------------------------------------------------------------

    // START PLATFORM (lite längre för säker start)
    buildGrass(x, this.groundY, 5, this);
    x += 5 * this.tileW;

    //----------------------------------------------------------------------

    // BALANSERAD HOLE LOOP
    for (var i = 0; i < 2; i++) {

        var holeWidth = 80; // ✔️ mindre hål

        var hole = new runmysteriet.ui.graphic.Hole(
            x,
            this.groundY,
            holeWidth,
            200
        );

        stage.addChild(hole);
        holes.push(hole);

        // 🔥 LAVA (matchar exakt hålet nu)
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

        // ✔️ större landningsyta
        var py = this.groundY - (i * 20);

        buildStone(x, py, 4, this);

        x += 4 * this.tileW;
    }

    //----------------------------------------------------------------------

    // SAFE END PLATFORM
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