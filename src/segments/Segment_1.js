//------------------------------------------------------------------------------
// NAMESPACE SAFETY
//------------------------------------------------------------------------------
var runmysteriet = runmysteriet || {};
runmysteriet.segments = runmysteriet.segments || {};
runmysteriet.ui = runmysteriet.ui || {};
runmysteriet.ui.graphic = runmysteriet.ui.graphic || {};

//------------------------------------------------------------------------------
// SEGMENT 1
//------------------------------------------------------------------------------
runmysteriet.segments.Segment_1 = function(stage) {

    this.stage = stage;

    this.platforms = [];
    this.levelWidth = 0;
};

//------------------------------------------------------------------------------
// GROUND
//------------------------------------------------------------------------------
runmysteriet.segments.Segment_1.prototype.ground = function() {

    console.log("gris");

    this.groundObj = new runmysteriet.ui.graphic.Ground(
        this.stage,
        0,
        350,
        800,
        25,
        "rand"
    );
};

//------------------------------------------------------------------------------
// PLATFORMS
//------------------------------------------------------------------------------
runmysteriet.segments.Segment_1.prototype.createPlatforms = function() {

    var startX = 50;
    var startY = 200; // flyttat upp så de syns säkert

    var stepX = 35;
    var stepY = 40;

    var width = 35;
    var height = 20;

    // 🔼 upp
    for (var i = 0; i < 4; i++) {

        var p = new runmysteriet.ui.Platform(
            startX + (i * stepX),
            startY - (i * stepY),
            width,
            height,
            "bana-gras1"
        );

        this.stage.addChild(p);
        p.init(); // 🔥 VIKTIG FIX
        this.platforms.push(p);
    }

    // 🔽 ner
    for (var j = 0; j < 4; j++) {

        var p2 = new runmysteriet.ui.Platform(
            startX + (4 * stepX) + (j * stepX),
            startY - (4 * stepY) + (j * stepY),
            width,
            height,
            "bana-gras1"
        );

        this.stage.addChild(p2);
        p2.init(); // 🔥 VIKTIG FIX
        this.platforms.push(p2);
    }

    var last = this.platforms[this.platforms.length - 1];
    this.levelWidth = last.x + last.width;
};

//------------------------------------------------------------------------------
// BUILD
//------------------------------------------------------------------------------
runmysteriet.segments.Segment_1.prototype.build = function() {

    this.createPlatforms();
    this.ground();
};