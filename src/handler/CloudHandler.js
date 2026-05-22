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
runmysteriet.handler.CloudHandler = function(stage, screenWidth, levelWidth) {

    this.stage = stage;
    this.screenWidth = screenWidth;
    this.levelWidth = levelWidth || screenWidth * 4;

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

    var cloudCount = 30;
    var spacing = this.levelWidth / cloudCount;

    for (var i = 0; i < cloudCount; i++) {

        var randomIndex = Math.floor(Math.random() * this.cloudResources.length);

        var scale = 0.8 + Math.random() * 0.4;

        var cloudWidth = 160 * scale;
        var cloudHeight = 90 * scale;

        var cloud = new rune.display.Graphic(
            i * spacing + Math.random() * spacing,
            0 + Math.random() * 45,
            cloudWidth,
            cloudHeight,
            this.cloudResources[randomIndex]
        );

        cloud.speed = 0.15 + Math.random() * 0.25;

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

        if (!cloud) {
            continue;
        }

        cloud.x += cloud.speed;

        /*
         * Molnet ska röra sig under hela leveln.
         * När det lämnar levelns högerkant börjar det om från vänster.
         */
        if (cloud.x > this.levelWidth + cloud.width) {

            cloud.x = -cloud.width;
            cloud.y = 0 + Math.random() * 45;
        }
    }
};
//------------------------------------------------------------------------------
// CLEAR
//------------------------------------------------------------------------------

/**
 * Tar bort alla moln från stage.
 *
 * @return {void}
 */
runmysteriet.handler.CloudHandler.prototype.clear = function() {

    var i = 0;
    var cloud = null;

    if (!this.clouds) {
        this.clouds = [];
        return;
    }

    for (i = 0; i < this.clouds.length; i++) {
        cloud = this.clouds[i];

        if (!cloud) {
            continue;
        }

        if (cloud.parent) {
            cloud.parent.removeChild(cloud);
        }
    }

    this.clouds = [];
};