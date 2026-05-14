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

    /**
     * Används för att kameran inte ska hoppa direkt.
     * @type {boolean}
     */
    this.m_hasCameraPosition = false;

    /**
     * Lägre värde = mjukare/långsammare kamera.
     * Högre värde = snabbare kamera.
     *
     * @type {number}
     */
    this.m_smoothing = 0.10;
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
    var i = 0;
    var j = 0;
    var player = null;
    var centerX = 0;
    var targetX = 0;
    var maxX = 0;
    var diff = 0;
    var playerWidth = 32;

    /*
     * Kameran ska bara följa levande spelare.
     */
    for (i = 0; i < players.length; i++) {

        player = players[i];

        if (player && player.isDead !== true) {
            livingPlayers.push(player);
        }
    }

    /*
     * Om alla är döda ska kameran ligga kvar där den är.
     */
    if (livingPlayers.length === 0) {
        return;
    }

    /*
     * Räkna ut mitten mellan levande spelare.
     */
    for (j = 0; j < livingPlayers.length; j++) {

        player = livingPlayers[j];
        playerWidth = player.width || 32;

        centerX += player.x + playerWidth / 2;
    }

    centerX = centerX / livingPlayers.length;

    /*
     * Kamerans målposition.
     */
    targetX = centerX - this.camera.viewport.width / 2;

    /*
     * Stoppa kameran från att gå utanför banan.
     */
    maxX = this.levelWidth - this.camera.viewport.width;

    if (maxX < 0) {
        maxX = 0;
    }

    if (targetX < 0) {
        targetX = 0;
    }

    if (targetX > maxX) {
        targetX = maxX;
    }

    /*
     * Första gången ska kameran sättas direkt,
     * annars kan den börja glida från fel position.
     */
    if (this.m_hasCameraPosition !== true) {
        this.camera.viewport.x = targetX;
        this.m_hasCameraPosition = true;
    } else {

        /*
         * Mjuk kamera.
         * Detta tar bort det synliga hacket när en spelare dör.
         */
        diff = targetX - this.camera.viewport.x;

        this.camera.viewport.x += diff * this.m_smoothing;

        /*
         * Om kameran nästan är framme, sätt exakt.
         * Annars kan den ligga och darra runt målet när spelare dör.
         */
        if (Math.abs(diff) < 0.5) {
            this.camera.viewport.x = targetX;
        }
    }

    this.camera.viewport.y = 0;
};