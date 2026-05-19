//------------------------------------------------------------------------------
// AUTO SCROLL CAMERA HANDLER
//------------------------------------------------------------------------------

/**
 * Hanterar autoscroll-kamera.
 * Kameran rör sig automatiskt åt höger,
 * men pausas vid vattensegmentet med flotte/båt.
 *
 * @constructor
 * @param {!rune.camera.Camera} camera
 * @param {!runmysteriet.handler.PlayerHandler} playerHandler
 * @param {!runmysteriet.handler.PlatformHandler} platformHandler
 * @param {number} levelWidth
 */
runmysteriet.handler.AutoScrollCameraHandler = function(camera, playerHandler, platformHandler, levelWidth) {

    this.camera = camera;
    this.playerHandler = playerHandler;
    this.platformHandler = platformHandler;

    this.levelWidth = levelWidth || 0;

    /*
     * Hastighet för autoscroll.
     * Börja lågt för att inte göra spelet orättvist.
     */
    this.speed = 1.5;

    /*
     * Kameran stannar lite före vattenområdet.
     */
    this.waterStopOffsetX = 20;

    /*
     * Spelarna måste passera lite efter vattenområdet
     * innan autoscroll startar igen.
     */
    this.waterResumeMarginX = 30;

    this.isPausedForWater = false;
    this.currentWaterArea = null;
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

/**
 * Uppdaterar autoscroll-kameran.
 *
 * @param {number=} step
 * @return {void}
 */

runmysteriet.handler.AutoScrollCameraHandler.prototype.update = function(step) {

    if (!this.camera || !this.camera.viewport) {
        return;
    }

    /*
     * Om kameran är pausad vid vatten/flotte:
     * starta igen endast när alla levande spelare står på flotten.
     */
    if (this.isPausedForWater === true) {

        if (this.areAllActivePlayersOnRaft() === true) {
            this.isPausedForWater = false;

            if (this.currentWaterArea) {
                this.currentWaterArea.autoScrollDone = true;
            }

            this.currentWaterArea = null;
        } else {
            return;
        }
    }

    /*
     * Om kameran inte är pausad:
     * kontrollera om den ska stanna vid vattenområdet.
     */
    this.checkWaterPause();

    if (this.isPausedForWater === true) {
        return;
    }

    this.moveCamera();
};

runmysteriet.handler.AutoScrollCameraHandler.prototype.isAnyActivePlayerOnRaft = function() {

    var i = 0;
    var player = null;

    if (!this.playerHandler || !this.playerHandler.players) {
        return false;
    }

    for (i = 0; i < this.playerHandler.players.length; i++) {

        player = this.playerHandler.players[i];

        if (!player || player.isDead === true) {
            continue;
        }

        if (player.currentPlatform && player.currentPlatform.isRaft === true) {
            return true;
        }
    }

    return false;
};
//------------------------------------------------------------------------------
// CAMERA MOVEMENT
//------------------------------------------------------------------------------

/**
 * Flyttar kameran automatiskt åt höger.
 *
 * @return {void}
 */
runmysteriet.handler.AutoScrollCameraHandler.prototype.moveCamera = function() {

    var maxX = 0;

    maxX = this.levelWidth - this.camera.viewport.width;

    if (maxX < 0) {
        maxX = 0;
    }

    this.camera.viewport.x += this.speed;

    if (this.camera.viewport.x > maxX) {
        this.camera.viewport.x = maxX;
    }
};

//------------------------------------------------------------------------------
// WATER PAUSE
//------------------------------------------------------------------------------

/**
 * Pausar autoscroll vid vattenområdet och startar igen
 * när alla levande spelare kommit förbi vattnet.
 *
 * @return {void}
 */
runmysteriet.handler.AutoScrollCameraHandler.prototype.updateWaterPause = function() {

    var water = null;

    if (!this.platformHandler || !this.platformHandler.waterAreas) {
        return;
    }

    /*
     * Om kameran redan är pausad vid ett vattenområde,
     * vänta tills alla levande spelare har passerat.
     */
    if (this.isPausedForWater === true) {

        water = this.currentWaterArea;

        if (!water) {
            this.isPausedForWater = false;
            return;
        }

        if (this.haveAllActivePlayersPassedWater(water) === true) {
            water.autoScrollDone = true;
            this.currentWaterArea = null;
            this.isPausedForWater = false;
        }

        return;
    }

    /*
     * Leta efter nästa vattenområde där autoscroll ska pausas.
     */
    water = this.findNextWaterAreaToPauseAt();

    if (water) {
        this.currentWaterArea = water;
        this.isPausedForWater = true;

        /*
         * Lås kameran ungefär vid början av vattnet.
         */
        this.camera.viewport.x = water.x - this.waterStopOffsetX;

        if (this.camera.viewport.x < 0) {
            this.camera.viewport.x = 0;
        }
    }
};



//------------------------------------------------------------------------------
// WATER PAUSE
//------------------------------------------------------------------------------

runmysteriet.handler.AutoScrollCameraHandler.prototype.checkWaterPause = function() {

    var water = null;

    if (!this.platformHandler || !this.platformHandler.waterAreas) {
        return;
    }

    water = this.findNextWaterAreaToPauseAt();

    if (!water) {
        return;
    }

    this.currentWaterArea = water;
    this.isPausedForWater = true;

    /*
     * Kameran stannar precis före vatten/flotte-delen.
     */
    this.camera.viewport.x = water.x - this.waterStopOffsetX;

    if (this.camera.viewport.x < 0) {
        this.camera.viewport.x = 0;
    }
};

runmysteriet.handler.AutoScrollCameraHandler.prototype.findNextWaterAreaToPauseAt = function() {

    var i = 0;
    var water = null;
    var nextCameraX = 0;

    nextCameraX = this.camera.viewport.x + this.speed;

    for (i = 0; i < this.platformHandler.waterAreas.length; i++) {

        water = this.platformHandler.waterAreas[i];

        if (!water || water.autoScrollDone === true) {
            continue;
        }

        if (nextCameraX >= water.x - this.waterStopOffsetX) {
            return water;
        }
    }

    return null;
};

runmysteriet.handler.AutoScrollCameraHandler.prototype.areAllActivePlayersOnRaft = function() {

    var i = 0;
    var player = null;
    var hasActivePlayer = false;

    if (!this.playerHandler || !this.playerHandler.players) {
        return false;
    }

    for (i = 0; i < this.playerHandler.players.length; i++) {

        player = this.playerHandler.players[i];

        if (!player || player.isDead === true) {
            continue;
        }

        hasActivePlayer = true;

        /*
         * Viktigt:
         * Det räcker inte att spelaren står på en vanlig plattform.
         * Spelaren måste stå på flotten.
         */
        if (!player.currentPlatform || player.currentPlatform.isRaft !== true) {
            return false;
        }
    }

    return hasActivePlayer;
};