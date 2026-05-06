//------------------------------------------------------------------------------
// CAMERA HANDLER
//------------------------------------------------------------------------------

/**
 * Handles camera following logic.
 *
 * @constructor
 * @param {!rune.camera.Camera} camera
 * @param {!runmysteriet.handler.PlayerHandler} playerHandler
 * @param {number} levelWidth
 */
runmysteriet.handler.CameraHandler = function(camera, playerHandler, levelWidth) {

    /** @type {!rune.camera.Camera} */
    this.camera = camera;

    /** @type {!runmysteriet.handler.PlayerHandler} */
    this.playerHandler = playerHandler;

    /** @type {number} */
    this.levelWidth = levelWidth;
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

/**
 * Updates camera position based on living players.
 *
 * @return {void}
 */
runmysteriet.handler.CameraHandler.prototype.update = function() {

    if (!this.camera || !this.camera.viewport) {
        return;
    }

    if (!this.playerHandler || !this.playerHandler.players) {
        return;
    }

    var players = this.playerHandler.players;
    var livingPlayers = [];

    for (var i = 0; i < players.length; i++) {

        if (players[i] && players[i].isDead !== true) {
            livingPlayers.push(players[i]);
        }
    }

    if (livingPlayers.length === 0) {
        return;
    }

    var playerWidth = 32;
    var centerX = 0;

    for (var j = 0; j < livingPlayers.length; j++) {
        centerX += livingPlayers[j].x + playerWidth / 2;
    }

    centerX = centerX / livingPlayers.length;

    this.camera.viewport.x = centerX - this.camera.viewport.width / 2;

    if (this.camera.viewport.x < 0) {
        this.camera.viewport.x = 0;
    }

    var maxX = this.levelWidth - this.camera.viewport.width;

    if (this.camera.viewport.x > maxX) {
        this.camera.viewport.x = maxX;
    }

    this.camera.viewport.y = 0;
};