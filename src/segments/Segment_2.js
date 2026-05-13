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

    var x = startX || 0;
    var platforms = [];
    var holes = [];
    var enemySpawns = [];

    var buildStonePlatform = (function(_this) {

        return function(px, py, widthTiles) {

            var group = [];

            for (var i = 0; i < widthTiles; i++) {

                var tile = new rune.display.Graphic(
                    px + (i * _this.tileW),
                    py,
                    _this.tileW,
                    _this.tileH,
                    "stone_block"
                );

                stage.addChild(tile);
                platforms.push(tile);
                group.push(tile);
            }

            return group;
        };

    })(this);

    // START PLATFORM
    buildStonePlatform(x, this.groundY, 8);

    enemySpawns.push({
        type: "kristen",
        x: x + 120,
        y: this.groundY - 40
    });

    x += 8 * this.tileW;

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

    // -----------------------------
    // 🔥 LAVA (NYTT TILLAGT)
    // -----------------------------

    var lavaTileW = this.tileW;
    var lavaTileH = this.tileH;
    var lavaRows = 6; // fyller ner i hålet
    var lavaCols = Math.ceil(holeWidth / lavaTileW);

    for (var ly = 0; ly < lavaRows; ly++) {

        for (var lx = 0; lx < lavaCols; lx++) {

            var lavaTile = new rune.display.Graphic(
                x + (lx * lavaTileW),
                this.groundY + (ly * lavaTileH),
                lavaTileW,
                lavaTileH,
                "lava"
            );

            stage.addChild(lavaTile);
        }
    }

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

    x += holeWidth;

    buildStonePlatform(x, this.groundY, 8);

    enemySpawns.push({
        type: "kristen",
        x: x + 120,
        y: this.groundY - 40
    });

    x += 8 * this.tileW;

    buildStonePlatform(x, this.groundY, 6);

    enemySpawns.push({
        type: "kristen",
        x: x + 80,
        y: this.groundY - 40
    });

    x += 6 * this.tileW;

    return {
        platforms: platforms,
        holes: holes,
        enemySpawns: enemySpawns,
        endX: x
    };
};