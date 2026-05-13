//------------------------------------------------------------------------------
// SEGMENT 1
//------------------------------------------------------------------------------

runmysteriet.segments.Segment_3 = function() {
    this.tileSize = 268;
    this.groundY = 200;

    this.tileW = 32;
    this.tileH = 20;
};

runmysteriet.segments.Segment_3.prototype.ground = function(stage, startX) {

    var x = startX || 0;

    var platforms = [];
    var holes = [];
    var enemySpawns = [];

    //----------------------------------------------------------------------
    // GRÄS (MARK)
    //----------------------------------------------------------------------

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

    //----------------------------------------------------------------------
    // STEN (SMÅ BLOCK)
    //----------------------------------------------------------------------

    function buildStone(px, py, tiles, _this) {
        for (var i = 0; i < tiles; i++) {
            var tile = new rune.display.Graphic(
                px + (i * _this.tileW),
                py,
                _this.tileW,
                _this.tileH,
                "tree_block" // 🔥 ändrad till stone
            );
            stage.addChild(tile);
            platforms.push(tile);
        }
    }

    //----------------------------------------------------------------------
    // MARK
    //----------------------------------------------------------------------

    buildGrass(x, this.groundY, 8, this);

    enemySpawns.push({
        type: "kristen",
        x: x + 120,
        y: this.groundY - 40
    });

    x += 8 * this.tileW;

    //----------------------------------------------------------------------
    // HÅL
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
    // TRAPPA AV SMÅ BLOCK 🔥
    //----------------------------------------------------------------------

    var steps = 6;

    for (var i = 0; i < steps; i++) {

        var px = x + 40 + (i * 80);

        // varje steg högre upp
        var py = this.groundY - (40 + i * 25);

        // små block (1–2 tiles)
        buildStone(px, py, 2, this);

        // fiender på vissa steg
        if (i === 2 || i === 4) {
            enemySpawns.push({
                type: "kristen",
                x: px + 10,
                y: py - 35
            });
        }
    }

    //----------------------------------------------------------------------
    // LANDNING
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
    // EXTRA MARK
    //----------------------------------------------------------------------

    buildGrass(x, this.groundY, 6, this);

    enemySpawns.push({
        type: "kristen",
        x: x + 80,
        y: this.groundY - 40
    });

    x += 6 * this.tileW;

    //----------------------------------------------------------------------
    // RETURN
    //----------------------------------------------------------------------

    return {
        platforms: platforms,
        holes: holes,
        enemySpawns: enemySpawns,
        endX: x
    };
};