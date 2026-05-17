//------------------------------------------------------------------------------
// SEGMENT START
//------------------------------------------------------------------------------

/**
 * Startsegment för en nivå.
 * Segmentet ger spelaren en säker start innan hinder börjar.
 *
 * @constructor
 */
runmysteriet.segments.Segment_Start = function() {

    /** @type {number} */
    this.length = 500;

    /** @type {number} */
    this.groundY = 200;

    /** @type {number} */
    this.tileW = 32;

    /** @type {number} */
    this.tileH = 20;

        console.log("Segment Start");

};

/**
 * Skapar startsegmentets mark.
 *
 * @param {!rune.display.Stage} stage
 * @param {number=} startX
 * @return {{
 *   platforms: !Array<!rune.display.Graphic>,
 *   holes: !Array<!Object>,
 *   enemySpawns: !Array<!Object>,
 *   waterAreas: !Array<!Object>,
 *   boats: !Array<!Object>,
 *   endX: number
 * }}
 */
runmysteriet.segments.Segment_Start.prototype.ground = function(stage, startX) {

    var x = startX || 0;

    var platforms = [];
    var holes = [];
    var enemySpawns = [];
    var waterAreas = [];
    var boats = [];

    var tiles = Math.ceil(this.length / this.tileW);

    for (var i = 0; i < tiles; i++) {

        var tile = new rune.display.Graphic(
            x + (i * this.tileW),
            this.groundY,
            this.tileW,
            this.tileH,
            "bana-gras1"
        );

        stage.addChild(tile);
        platforms.push(tile);
    }

    return {
        platforms: platforms,
        holes: holes,
        enemySpawns: enemySpawns,
        waterAreas: waterAreas,
        boats: boats,
        endX: x + this.length
    };
};