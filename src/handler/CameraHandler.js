

runmysteriet.handler.CameraHandler = function(camera, playerHandler){

this.camera = camera;
this.playerHandler = playerHandler;

}

runmysteriet.handler.CameraHandler.prototype.update = function(){

    if (this.camera === null || this.camera === undefined) {
        return;
    }

    if (this.playerHandler === null || this.playerHandler === undefined) {
        return;
    }

    var players = this.playerHandler.players; 

    if(players.length === 0){
        return;

    }
    var player1 = players[0];
    var player2 = players[1];

    var centerX = player1.x + player1.width / 2;

    if (player2!== null && player2 !== undefined){
        centerX = (player1.x + player1.width / 2 + player2.x + player2.width / 2 ) / 2;

    }


this.camera.x = centerX -this.camera.width / 2;
this.camera.y = 0;
};