


runmysteriet.handler.BackgroundHandler = function(stage, camera, screenWidth, screenHeight) {

    this.stage = stage; 
    this.camera = camera;
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
   // this.levelWidth = this.screenWidth * this.backgrounds.length;
    this.backgrounds = [];
    this.backgroundTextures = ["background", "background1", "background2", "background3"];
   
this.backgroundCount = this.backgroundTextures.length;
this.levelWidth = this.screenWidth * this.backgroundCount;
}

    runmysteriet.handler.BackgroundHandler.prototype.init = function() {

        for(var i = 0; i < this.backgroundTextures.length; i++){
            
            var background = new rune.display.Graphic(
                i * this.screenWidth,
                0,
                this.screenWidth,
                this.screenHeight,
                this.backgroundTextures[i]
            );
            this.backgrounds.push(background);
            this.stage.addChild(background);
        }
    }

runmysteriet.handler.BackgroundHandler.prototype.update = function() {

if (this.camera === null || this.camera === undefined || this.camera.viewport === null || this.camera.viewport === undefined) {

    return;
}
var cameraX = this.camera.viewport.x;

    for (var i = 0; i < this.backgrounds.length; i++){
        var background = this.backgrounds[i];
   

    if (background.x + this.screenWidth < cameraX) {
        background.x += this.levelWidth;
    }
    if (background.x > cameraX + this.screenWidth) {
        background.x -= this.levelWidth;
    }

 }

}