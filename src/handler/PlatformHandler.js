//------------------------------------------------------------------------------
// PLATFORM HANDLER
//------------------------------------------------------------------------------

// Denna klassen hanterar alla plattformar i spelet, skapar och kontrolerar dess kolision med players. 
runmysteriet.handler.PlatformHandler = function(stage, screenWidth) {

    this.stage = stage;
    this.screenWidth = screenWidth;
    this.levelWidth = screenWidth * 4; //då vi tänkt göra 4 segment till att börja med

    this.platforms = [];
    this.holes=[];

    this.tileSize = 268;//storleken på varje plattform, används för att skapa plattformar i init funktionen
    this.groundY = 220;//y-positionen där plattformarna ska placeras, används i init funktionen
    this.holeWidth = 60;
    
    this.holesAfterPlatform = [
        2,
        4,
        6,
        8



    ];

};

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------
//funktionen init skapar plattformar på skärmen, 
runmysteriet.handler.PlatformHandler.prototype.init = function() {
    var x = 0;
    var platformIndex = 0;

    while (x<this.levelWidth){

    var platform = new runmysteriet.ui.Platform();
        platform.x = x;
        platform.y = this.groundY;

        this.platforms.push(platform);
        this.stage.addChild(platform);
        x += this.tileSize;

   
        if(this.hasHoleAfterPlatform(platformIndex)){
            this.createHole(x)
            x += this.holeWidth;//om det finns ett hål i plattformen ska hoppa över att så det inte skapas en plattform där
        }
        platformIndex++;


 }
    
};

runmysteriet.handler.PlatformHandler.prototype.hasHoleAfterPlatform = function(platformIndex) {
    
    for (var i = 0; i < this.holesAfterPlatform.length; i++) {

        if (this.holesAfterPlatform[i]===platformIndex)   {
            return true;
        }

    }

return false;

}
runmysteriet.handler.PlatformHandler.prototype.createHole = function(x){
    var hole = new rune.display.DisplayObject(
        x,
        this.groundY,
        this.holeWidth,
        200
    );
    hole.backgroundColor = "#000000";
    this.holes.push(hole);
    this.stage.addChild(hole);

};