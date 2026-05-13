//------------------------------------------------------------------------------
// SEGMENT 6
//------------------------------------------------------------------------------

runmysteriet.segments.Segment_6 = function() {
    this.tileSize = 268;
    this.groundY = 200;

    this.tileW = 32;
    this.tileH = 20;
};

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

    buildGrass(x, this.groundY, 6, this);
    x += 6 * this.tileW;

    for (var i = 0; i < 5; i++) {

        var hole = new runmysteriet.ui.graphic.Hole(
            x,
            this.groundY,
            80,
            200
        );

        stage.addChild(hole);
        holes.push(hole);

        x += 80;

        var py = this.groundY - (i * 20);

        buildStone(x, py, 3, this);

        x += 3 * this.tileW;
    }

    buildGrass(x, this.groundY, 6, this);
    x += 6 * this.tileW;

    return {
        platforms: platforms,
        holes: holes,
        enemySpawns: enemySpawns,
        endX: x
    };
};