//------------------------------------------------------------------------------
// SEGMENT 4
//------------------------------------------------------------------------------

runmysteriet.segments.Segment_4 = function() {
    this.tileSize = 268;
    this.groundY = 200;

    this.tileW = 32;
    this.tileH = 20;
};

runmysteriet.segments.Segment_4.prototype.ground = function(stage, startX) {

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
                "grass_block"
            );
            stage.addChild(tile);
            platforms.push(tile);
        }
    }

    buildGrass(x, this.groundY, 6, this);
    x += 6 * this.tileW;

    var holeWidth = 400;

    var hole = new runmysteriet.ui.graphic.Hole(
        x,
        this.groundY,
        holeWidth,
        200
    );

    stage.addChild(hole);
    holes.push(hole);

    // zig-zag plattformar
    for (var i = 0; i < 6; i++) {

        var px = x + 40 + (i * 70);
        var py = this.groundY - (i % 2 === 0 ? 60 : 110);

        buildStone(px, py, 2, this);
    }

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