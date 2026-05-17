//------------------------------------------------------------------------------
// SEGMENT END
//------------------------------------------------------------------------------

/**
 * Slutsegment för en nivå.
 * Segmentet visar målområdet och ger spelaren en tydlig känsla av att nivån är klar.
 *
 * @constructor
 */
runmysteriet.segments.Segment_End = function() {

    /** @type {number} */
    this.length = 900;

    /** @type {number} */
    this.groundY = 200;

    /** @type {number} */
    this.tileW = 32;

    /** @type {number} */
    this.tileH = 20;

    /** @type {string} */
    this.backgroundTexture = "end";
};

/**
 * Skapar slutsegmentets bana.
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
runmysteriet.segments.Segment_End.prototype.ground = function(stage, startX) {

    var segmentStart = startX || 0;
    var segmentEnd = segmentStart + this.length;

    var x = segmentStart;

    var platforms = [];
    var holes = [];
    var enemySpawns = [];
    var waterAreas = [];
    var boats = [];

    //--------------------------------------------------------------------------
    // BAKGRUND
    //--------------------------------------------------------------------------

    /*
     * Byt "end_background" till namnet på din faktiska bakgrundsbild
     * i Requests.js om den heter något annat.
     */
    var background = new rune.display.Graphic(
        segmentStart,
        0,
        this.length,
        240,
        this.backgroundTexture
    );

    stage.addChild(background);

    //--------------------------------------------------------------------------
    // MARK
    //--------------------------------------------------------------------------

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

    //--------------------------------------------------------------------------
    // MÅLPORT / LEVEL CLEAR-OMRÅDE
    //--------------------------------------------------------------------------

    /*
     * Detta är den visuella målporten.
     */
    var goal = new rune.display.Graphic(
        segmentStart + this.length - 180,
        this.groundY - 96,
        96,
        96,
        "b2"
    );

    stage.addChild(goal);

    /*
     * Markerar målet så Game/LevelComplete-logik kan hitta det om du vill.
     */
    goal.isLevelEnd = true;

    //--------------------------------------------------------------------------
    // VISUELLA EFFEKTER
    //--------------------------------------------------------------------------

    /*
     * Små dekorativa ljuspunkter runt målet.
     * Dessa är bara visuella och påverkar inte collision.
     */
    for (var j = 0; j < 6; j++) {

        var sparkle = new rune.display.Graphic(
            goal.x + 10 + (j * 14),
            goal.y - 20 - ((j % 2) * 12),
            8,
            8,
            "sparkle"
        );

        stage.addChild(sparkle);

        /*
         * Om tween-systemet används senare kan dessa animeras.
         * Just nu är de säkra statiska effekter.
         */
        sparkle.isDecoration = true;
    }

    //--------------------------------------------------------------------------
    // SÄKER LANDNINGSYTA EFTER MÅLET
    //--------------------------------------------------------------------------

    /*
     * Extra mark efter målbilden gör att spelaren inte faller direkt
     * när level clear triggas.
     */
    var safeTiles = 4;

    for (var k = 0; k < safeTiles; k++) {

        var safeTile = new rune.display.Graphic(
            segmentEnd - ((safeTiles - k) * this.tileW),
            this.groundY,
            this.tileW,
            this.tileH,
            "bana-gras1"
        );

        stage.addChild(safeTile);
        platforms.push(safeTile);
    }

    return {
        platforms: platforms,
        holes: holes,
        enemySpawns: enemySpawns,
        waterAreas: waterAreas,
        boats: boats,
        endX: segmentEnd
    };
};