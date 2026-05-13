//------------------------------------------------------------------------------
// SEGMENT 1
//------------------------------------------------------------------------------

runmysteriet.segments.Segment_1 = function() {
    this.tileSize = 268;
    this.groundY = 200;

    this.tileW = 32;
    this.tileH = 20;
};

runmysteriet.segments.Segment_1.prototype.ground = function(stage, startX) {

    var x = startX || 0;

    var platforms = [];
    var holes = [];
    var enemySpawns = [];

    //----------------------------------------------------------------------
    // HJÄLPFUNKTION: GRÄS (MARK)
    //----------------------------------------------------------------------

    function buildGrass(px, py, tiles, _this) {

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

    //----------------------------------------------------------------------
    // HJÄLPFUNKTION: STEN (HOPPPLATTFORM)
    //----------------------------------------------------------------------

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
    // HOPPPLATTFORMAR (STEN - ANNORLUNDA)
    //----------------------------------------------------------------------

    var count = 6;
    var spacing = 95;

    for (var i = 0; i < count; i++) {

        var px = x + 30 + (i * spacing);

        // lite variation i höjd
        var py = this.groundY - (70 + (i % 3) * 30);

        // sten istället för gräs
        buildStone(px, py, 2, this);

        if (i % 2 === 0) {
            enemySpawns.push({
                type: "kristen",
                x: px + 20,
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
    // EXTRA MARK (lite variation)
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