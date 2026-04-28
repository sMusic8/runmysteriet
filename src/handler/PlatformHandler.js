//------------------------------------------------------------------------------
// PLATFORM HANDLER
//------------------------------------------------------------------------------

// Denna klassen hanterar alla plattformar i spelet. 
// Den sköter om att skapa plattformar, rita dem och kolla kollisioner mellan spelaren och plattformarna. 
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
//funktionen init skapar plattformar över hela skärmen, 
//med hjälp av tileSize för att bestämma avståndet mellan dem.
runmysteriet.handler.PlatformHandler.prototype.init = function() {

    
    for (var x = 0; x < this.screenWidth; x += this.tileSize) {

        var platform = new runmysteriet.ui.Platform();

        platform.x = x;
        platform.y = this.groundY;

        this.platforms.push(platform);
        this.stage.addChild(platform);
    }
};