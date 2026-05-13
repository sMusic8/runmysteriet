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

    this.tileSize = 268;
    this.groundY = 200;
    this.tileW = 32;
    this.tileH = 20;

    console.log("Segment 3");
};

/**
 * Generates the ground layout for Segment 3.
 */
runmysteriet.segments.Segment_3.prototype.ground = function(stage, startX) {

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

    // START
    buildGrass(x, this.groundY, 8, this);

    enemySpawns.push({
        type: "kristen",
        x: x + 120,
        y: this.groundY - 40
    });

    x += 8 * this.tileW;

    // HOLE
    var holeWidth = 520;

    var hole = new runmysteriet.ui.graphic.Hole(
        x,
        this.groundY,
        holeWidth,
        200
    );

    stage.addChild(hole);
    holes.push(hole);

    // -----------------------------
    // 🔥 LAVA (FIXAD VISUELL DEL)
    // -----------------------------

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

    // STAIR
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

    // LANDING
    x += holeWidth;

    buildGrass(x, this.groundY, 8, this);

    enemySpawns.push({
        type: "kristen",
        x: x + 120,
        y: this.groundY - 40
    });

    x += 8 * this.tileW;

    // EXTRA
    buildGrass(x, this.groundY, 6, this);

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