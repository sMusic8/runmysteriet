//måln handler

runmysteriet.handler.CloudHandler = function(stage, screenWidth) {

this.stage = stage;
this.screenWidth = screenWidth;

this.clouds = [];
this.cloudResources = ["moln1", "moln2", "moln3"];

};

//init

runmysteriet.handler.CloudHandler.prototype.init = function() {

    var startX = 0;
    var spacing = 160;

    for (var i = 0; i< 8; i++ ){
        var randomIndex = Math.floor(Math.random() * this.cloudResources.length);
        
        var cloud = new rune.display.Graphic(
            startX + (i * spacing),
            20 + Math.random() * 70,
            100,
            60,
            this.cloudResources[randomIndex]
        );
        cloud.speed = 0.2 + Math.random() * 0.3;
        this.clouds.push(cloud);
        this.stage.addChild(cloud);
        
    }
}

//Uppdate

runmysteriet.handler.CloudHandler.prototype.update = function(){

    for (var i = 0; i < this.clouds.length; i++){
        var cloud = this.clouds[i];
        cloud.x += cloud.speed;

        if( cloud.x > this.screenWidth + 150){
            cloud.x = -150;
            cloud.y = 20 + Math.random() * 70;

        }

    }

};