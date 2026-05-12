//------------------------------------------------------------------------------
// CLOUD HANDLER
//------------------------------------------------------------------------------

/**
 * Handles cloud spawning and movement.
 *
 * @constructor
 * @param {!rune.display.Stage} stage
 * @param {number} screenWidth
 */
runmysteriet.handler.CloudHandler = function(stage, screenWidth) {

    this.stage = stage;
    this.screenWidth = screenWidth;
    this.levelWidth = screenWidth * 4;

    this.clouds = [];

    this.cloudResources = [
        "moln1",
        "moln2",
        "moln3",
        "moln4",
        "moln5",
        "moln6",
        "moln7",
        "moln8",
        "moln9"
    ];
};

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.handler.CloudHandler.prototype.init = function() {

    var cloudCount = 20;     // 🔥 fler moln
    var spacing = 80;        // 🔥 tätare mellanrum

    for (var i = 0; i < cloudCount; i++) {

        var randomIndex = Math.floor(Math.random() * this.cloudResources.length);

        // 🔥 slumpa storlek för variation
        var scale = 0.7 + Math.random() * 0.8;

        var cloud = new rune.display.Graphic(
            Math.random() * this.levelWidth,          // 🔥 sprid över hela banan
            20 + Math.random() * 100,
            100 * scale,
            60 * scale,
            this.cloudResources[randomIndex]
        );

        cloud.speed = 0.3 + Math.random() * 0.5;

        this.clouds.push(cloud);
        this.stage.addChild(cloud);
    }
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

runmysteriet.handler.CloudHandler.prototype.update = function() {

    for (var i = 0; i < this.clouds.length; i++) {

        var cloud = this.clouds[i];

        cloud.x += cloud.speed;

        if (cloud.x > this.levelWidth + 200) {

            cloud.x = -200;
            cloud.y = 20 + Math.random() * 100;
        }
    }
};