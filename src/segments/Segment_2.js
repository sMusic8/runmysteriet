//------------------------------------------------------------------------------
// SEGMENT 2
//------------------------------------------------------------------------------

runmysteriet.segments.Segment_2 = function() {
    this.tileSize = 268;
    this.groundY = 200;
    this.holeHeight = 200;

    // 🔥 storlek på varje stone tile
    this.tileW = 32;
    this.tileH = 20;
};

runmysteriet.segments.Segment_2.prototype.ground = function(stage, startX) {

    var x = startX || 0;

    var platforms = [];
    var holes = [];
    var enemySpawns = [];

    //----------------------------------------------------------------------
    // HJÄLPFUNKTION: bygg stenplattform av tiles
    //----------------------------------------------------------------------

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

    //----------------------------------------------------------------------
    // FÖRSTA MARK
    //----------------------------------------------------------------------

    buildStonePlatform(x, this.groundY, 8);

    enemySpawns.push({
        type: "kristen",
        x: x + 120,
        y: this.groundY - 40
    });

    x += 8 * this.tileW;

    //----------------------------------------------------------------------
    // STORT HÅL
    //----------------------------------------------------------------------

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
    // SMÅ PLATTFORMAR ÖVER HÅLET (STONE TILES)
    //----------------------------------------------------------------------

    var platformCount = 5;
    var spacing = 110;

    for (var i = 0; i < platformCount; i++) {

        var px = x + 30 + (i * spacing);
        var py = this.groundY - (60 + (i % 2) * 40);

        // små 2-tile plattformar
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
    // LANDNING EFTER HÅL
    //----------------------------------------------------------------------

    x += holeWidth;

    buildStonePlatform(x, this.groundY, 8);

    enemySpawns.push({
        type: "kristen",
        x: x + 120,
        y: this.groundY - 40
    });

    x += 8 * this.tileW;

    //----------------------------------------------------------------------
    // EXTRA PLATTFORM
    //----------------------------------------------------------------------

    buildStonePlatform(x, this.groundY, 6);

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