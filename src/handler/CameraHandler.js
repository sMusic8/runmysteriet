

runmysteriet.handler.CameraHandler = function(camera, playerHandler){

this.camera = camera;
this.playerHandler = playerHandler;

}

runmysteriet.handler.CameraHandler.prototype.update = function(){

    if (!this.camera || !this.camera.viewport) {
        return;
    }

    if (!this.playerHandler || !this.playerHandler.players) {
        return;
    }

    var players = this.playerHandler.players; 

    if(players.length === 0){
        return;

    }
    var player1 = players[0];
    var player2 = players[1];
    if(!player1){
        return;

    }
    var playerWidth = 32;
    var centerX = player1.x + playerWidth / 2;

    if (player2){
        centerX = (player1.x + player1.width / 2 + player2.x + player2.width / 2 ) / 2;

    }


this.camera.viewport.x = centerX - this.camera.viewport.width / 2;
if (this.camera.viewport.x < 0) {
    this.camera.viewport.x = 0;
}
this.camera.viewport.y = 0;
};
 