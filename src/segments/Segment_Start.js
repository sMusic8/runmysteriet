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
};

/**
 * Skapar startsegmentets mark.
 *
 * @param {!rune.display.Stage} stage
 * @param {number=} startX
 * @param {number=} levelNumber
 * @return {{
 *   platforms: !Array<!rune.display.Graphic>,
 *   holes: !Array<!Object>,
 *   enemySpawns: !Array<!Object>,
 *   diseaseSpawns: !Array<!Object>,
 *   waterAreas: !Array<!Object>,
 *   boats: !Array<!Object>,
 *   endX: number
 * }}
 */
runmysteriet.segments.Segment_Start.prototype.ground = function(stage, startX, levelNumber) {

    var x = startX || 0;

    var platforms = [];
    var holes = [];
    var enemySpawns = [];
    var diseaseSpawns = [];
    var waterAreas = [];
    var boats = [];

    var tiles = Math.ceil(this.length / this.tileW);

    function getDiseaseCount(levelNumber) {
        if (levelNumber >= 11) {
            return 4;
        }

        if (levelNumber >= 6) {
            return 3;
        }

        return 2;
    }

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

    /*
     * Sjukdomar placeras inte direkt vid spelarens start.
     * De ligger längre fram i startsegmentet så början fortfarande är rättvis.
     */
    var diseaseCount = getDiseaseCount(levelNumber);

    var diseasePositions = [
        {
            type: "gray",
            x: x + 220,
            y: this.groundY - 40
        },
        {
            type: "brown",
            x: x + 320,
            y: this.groundY - 40
        },
        {
            type: "red",
            x: x + 400,
            y: this.groundY - 40
        },
        {
            type: "gray",
            x: x + 460,
            y: this.groundY - 40
        }
    ];

    for (var j = 0; j < diseaseCount; j++) {
        diseaseSpawns.push(diseasePositions[j]);
    }

    return {
        platforms: platforms,
        holes: holes,
        enemySpawns: enemySpawns,
        diseaseSpawns: diseaseSpawns,
        waterAreas: waterAreas,
        boats: boats,
        endX: x + this.length
    };
};