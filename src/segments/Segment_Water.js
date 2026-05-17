//------------------------------------------------------------------------------
// SEGMENT WATER
//------------------------------------------------------------------------------

runmysteriet.segments.Segment_Water = function() {
    this.tileSize = 280;
    this.groundY = 200;

    this.waterWidth = 402;
    this.waterHeight = 32;

    console.log("Segment Water");
};

runmysteriet.segments.Segment_Water.prototype.ground = function(stage, startX, levelNumber) {
    var x = startX || 0;

    var platforms = [];
    var holes = [];
    var enemySpawns = [];
    var waterAreas = [];
    var boats = [];
    var diseaseSpawns = [];

    function getDiseaseCount(levelNumber) {
        if (levelNumber >= 11) {
            return 4;
        }

        if (levelNumber >= 6) {
            return 3;
        }

        return 2;
    }

    /*
     * Vänster mark.
     */
    var leftLandX = x;

    var platform1 = new runmysteriet.ui.Platform();
    platform1.x = x;
    platform1.y = this.groundY;

    stage.addChild(platform1);
    platforms.push(platform1);

    x += this.tileSize;

    /*
     * Vatten.
     */
    var water = new runmysteriet.ui.graphic.Water(
        x,
        this.groundY - 8
    );

    stage.addChild(water);
    waterAreas.push(water);

    /*
     * Flotte.
     * Denna ska spelaren kunna stå på.
     */
    var raft = new runmysteriet.ui.graphic.Raft(
        water.x + 5,
        water.y - 8
    );

    raft.minX = water.x - 5;
    raft.maxX = water.x + this.waterWidth - raft.width + 20;

    stage.addChild(raft);

    /*
     * Flotten läggs i platforms så spelaren kan stå på den.
     */
    platforms.push(raft);

    /*
     * Engelsk båt.
     * Denna är farlig. Vid collision ska spelaren dö.
     */
    var boat = new runmysteriet.entity.EnglishBoat(
        water.x + 60,
        water.y - 75
    );

    /*
     * Rörelseområde för tween.
     */
    boat.minX = water.x - 160;
    boat.maxX = water.x + this.waterWidth - boat.width - 120;

    stage.addChild(boat);
    boats.push(boat);

    x += this.waterWidth;

    /*
     * Höger mark.
     */
    var rightLandX = x;

    var platform2 = new runmysteriet.ui.Platform();
    platform2.x = x;
    platform2.y = this.groundY;

    stage.addChild(platform2);
    platforms.push(platform2);

    x += this.tileSize;

    /*
     * Sjukdomar.
     * De placeras på landytorna, inte i vattenområdet.
     */
    var diseaseCount = getDiseaseCount(levelNumber);

    var diseasePositions = [
        {
            type: "gray",
            x: leftLandX + 90,
            y: this.groundY - 40
        },
        {
            type: "brown",
            x: rightLandX + 80,
            y: this.groundY - 40
        },
        {
            type: "red",
            x: rightLandX + 170,
            y: this.groundY - 40
        },
        {
            type: "gray",
            x: leftLandX + 190,
            y: this.groundY - 40
        }
    ];

    for (var i = 0; i < diseaseCount && i < diseasePositions.length; i++) {
        diseaseSpawns.push(diseasePositions[i]);
    }

    return {
        platforms: platforms,
        holes: holes,
        enemySpawns: enemySpawns,
        diseaseSpawns: diseaseSpawns,
        waterAreas: waterAreas,
        boats: boats,
        endX: x
    };
};