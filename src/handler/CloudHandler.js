//moln handler
// Klassen som skapar moln och hanterar dess rörelse

runmysteriet.handler.CloudHandler = function(stage, screenWidth) {

this.stage = stage;
this.screenWidth = screenWidth;
this.levelWidth = screenWidth * 4; //då vi tänkt göra 4 segment till att börja med


this.clouds = [];
this.cloudResources = ["moln1", "moln2", "moln3"];

};

//Init-funktionen skapar moln med hjälp av en loop. 
//Loopen placerar ut molnen med ett visst avstånd (spacing) och ger dem en slupmässig y-positon och en slumpmässig hastighet. 
//Molnen läggs sedan till på scenen.
runmysteriet.handler.CloudHandler.prototype.init = function() {

    var startX = 0;
    var spacing = 160;

    for (var i = 0; i< 8; i++ ){
        var randomIndex = Math.floor(Math.random() * this.cloudResources.length);
        
        var cloud = new rune.display.Graphic(
            startX + (i * spacing), 
            20 + Math.random() * 70,//
            100,
            60,
            this.cloudResources[randomIndex]
        );
        cloud.speed = 0.5 + Math.random() * 0.3;
        this.clouds.push(cloud);
        this.stage.addChild(cloud);
        
    }
}

//Uppdaterar molnens position och slumpar ny position för samma när molnen är utanför screenWidth.


runmysteriet.handler.CloudHandler.prototype.update = function(){

    for (var i = 0; i < this.clouds.length; i++){
        var cloud = this.clouds[i];
        cloud.x += cloud.speed;

        if( cloud.x > this.levelWidth + 150){
            cloud.x = -150; 
            cloud.y = 20 + Math.random() * 70; 

        }

    }

};