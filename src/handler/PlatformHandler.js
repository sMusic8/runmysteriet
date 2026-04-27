//------------------------------------------------------------------------------
// PLATFORM HANDLER
//------------------------------------------------------------------------------

runmysteriet.handler.PlatformHandler = function(stage, screenWidth) {

    this.stage = stage;
    this.screenWidth = screenWidth;

    this.platforms = [];

    this.tileSize = 50;
    this.groundY = 220;
};

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.handler.PlatformHandler.prototype.init = function() {

    for (var x = 0; x < this.screenWidth; x += this.tileSize) {

        var platform = new runmysteriet.ui.Platform();

        platform.x = x;
        platform.y = this.groundY;

        this.platforms.push(platform);
        this.stage.addChild(platform);
    }
};