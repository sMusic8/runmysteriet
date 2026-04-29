//------------------------------------------------------------------------------
// PLATFORM HANDLER
//------------------------------------------------------------------------------

// Denna klassen hanterar alla plattformar i spelet, skapar och kontrolerar dess kolision med players. 
runmysteriet.handler.PlatformHandler = function(stage, screenWidth) {

    this.stage = stage;
    this.screenWidth = screenWidth;
    this.levelWidth = screenWidth * 4; //då vi tänkt göra 4 segment till att börja med

    this.platforms = [];

    this.tileSize = 30;
    this.groundY = 220;
};

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------
//funktionen init skapar plattformar över hela skärmen, 
//med hjälp av tileSize för att bestämma avståndet mellan dem.
runmysteriet.handler.PlatformHandler.prototype.init = function() {

   
        for (var x = 0; x < this.levelWidth; x += this.tileSize) {

        var platform = new runmysteriet.ui.Platform();
       
        console.log(platform);
        platform.x = x;
        platform.y = this.groundY;

        this.platforms.push(platform);
        this.stage.addChild(platform);
    }
    
    
};

runmysteriet.handler.PlatformHandler.prototype.init = function() {

    for (var x = 0; x < this.screenWidth; x += this.tileSize) {

        var platform = new runmysteriet.ui.Platform();

        platform.x = x;
        platform.y = this.groundY;

        this.platforms.push(platform);
        this.stage.addChild(platform);
    }
};