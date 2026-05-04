//------------------------------------------------------------------------------
// PLATFORM HANDLER
//------------------------------------------------------------------------------

// Denna klassen hanterar alla plattformar i spelet, skapar och kontrolerar dess kolision med players. 
runmysteriet.handler.PlatformHandler = function(stage, screenWidth) {

    this.stage = stage;
    this.screenWidth = screenWidth;
    this.levelWidth = screenWidth * 4; //då vi tänkt göra 4 segment till att börja med

    this.platforms = [];

    this.tileSize = 268;//storleken på varje plattform, används för att skapa plattformar i init funktionen
    this.groundY = 220;//y-positionen där plattformarna ska placeras, används i init funktionen
    this.holes = [
        { x: 500, width: 100},
        { x: 900, width: 90},
        { x: 1300, width: 80},
        { x: 1700, width: 70},
        { x: 2100, width: 60},



    ];

};

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------
//funktionen init skapar plattformar på skärmen, 
runmysteriet.handler.PlatformHandler.prototype.init = function() {

    for (var x = 0; x < this.levelWidth; x += this.tileSize) {
        if(this.holeInPlatform(x)){
            continue;//om det finns ett hål i plattformen ska hoppa över att så det inte skapas en plattform där
        }

        var platform = new runmysteriet.ui.Platform();

        platform.x = x;
        platform.y = this.groundY;

        this.platforms.push(platform);
        this.stage.addChild(platform);
    }
};

runmysteriet.handler.PlatformHandler.prototype.holeInPlatform = function(platformX) {
    var platformStart = platformX;
    var platformEnd = platformX + this.tileSize;
  
    for (var i = 0; i < this.holes.length; i++) {

        var hole = this.holes[i];
        var holeStart = hole.x;
        var holeEnd = hole.x + hole.width;
        if (platformStart < holeEnd && platformEnd > holeStart) {
            return true;
        }

    }



}