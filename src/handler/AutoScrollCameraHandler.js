//------------------------------------------------------------------------------
// AUTO SCROLL CAMERA HANDLER
//------------------------------------------------------------------------------

/**
 * Hanterar autoscroll-kamera.
 * Kameran rör sig automatiskt åt höger.
 * Kameran pausas när flotten hamnar i mitten av skärmen.
 * Autoscroll startar igen när alla levande spelare står på flotten.
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

    //Flytta med hela pixlar för att undvika HUD/text-skakar
    this.speed = 2;

    /*
     * 1 = varje frame
     * 2 = varannan frame
     * 3 = var tredje frame
     */
    this.scrollDelay = 1;
    this.scrollCounter = 0;

    this.deathSlowTimer = 0;
    this.deathSlowDuration = 90; // 30 fps * 3 sekunder
    this.deathSlowScrollDelay = 6;

    //Raft-paus.
    this.isPausedForRaft = false;
    this.currentRaft = null;

    /*
     * Justering om flotten ska hamna lite mer vänster/höger när kameran pausar.
     */
    this.raftStopOffsetX = 0;
};

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
    this.updateDeathSlowMotion();

    //Om kameran är pausad vid flotten vänta tills alla levande spelare står på flotten.

    if (this.isPausedForRaft === true) {

        if (this.areAllActivePlayersOnRaft() === true) {

            if (this.currentRaft) {
                this.currentRaft.autoScrollDone = true;
            }

            this.currentRaft = null;
            this.isPausedForRaft = false;
        } else {
            return;
        }
    }

    /*
     * Kameran rör sig först efter det kollar vi om flotten nu ligger i mitten.
     */
    this.moveCamera();

    this.checkRaftPause();
};

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

    this.scrollCounter++;

    if (this.scrollCounter < this.getCurrentScrollDelay()) {
    return;
}

    this.scrollCounter = 0;

    this.camera.viewport.x += this.speed;

    if (this.camera.viewport.x > maxX) {
        this.camera.viewport.x = maxX;
    }

    //För att minska HUD/text-skak.
    this.camera.viewport.x = Math.round(this.camera.viewport.x);
};

/**
 * Pausar kameran när flotten hamnar ungefär i mitten av skärmen.
 *
 * @return {void}
 */
runmysteriet.handler.AutoScrollCameraHandler.prototype.checkRaftPause = function() {

    var raft = null;

    raft = this.findNextRaftToPauseAt();

    if (!raft) {
        return;
    }

    this.currentRaft = raft;
    this.isPausedForRaft = true;
};

/**
 * Hittar nästa flotte som kameran ska pausa vid.
 *
 * @return {?Object}
 */
runmysteriet.handler.AutoScrollCameraHandler.prototype.findNextRaftToPauseAt = function() {

    var i = 0;
    var platform = null;
    var raft = null;

    var cameraCenterX = 0;
    var raftCenterX = 0;

    if (!this.platformHandler || !this.platformHandler.platforms) {
        return null;
    }

    cameraCenterX =
        this.camera.viewport.x +
        this.camera.viewport.width / 2;

    for (i = 0; i < this.platformHandler.platforms.length; i++) {

        platform = this.platformHandler.platforms[i];

        if (!platform || platform.isRaft !== true) {
            continue;
        }

        raft = platform;

        if (raft.autoScrollDone === true) {
            continue;
        }

        raftCenterX = raft.x + raft.width / 2;

        //Pausa först när kamerans mitt har nått flotten.
         
        if (cameraCenterX >= raftCenterX) {
            return raft;
        }
    }

    return null;
};
/**
 * Returnerar true bara när alla levande spelare står på flotten.
 *
 * @return {boolean}
 */
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

        //Spelaren måste stå på flotten.
        
        if (!player.currentPlatform || player.currentPlatform.isRaft !== true) {
            return false;
        }
    }

    return hasActivePlayer;
};
/**
 * Startar "death slow motion"-läget för kameraskrollning.
 * Funktionen aktiverar en temporär slowdown-effekt som används när en spelare dör.
 *
 * @return {void}
 */
runmysteriet.handler.AutoScrollCameraHandler.prototype.startDeathSlowMotion = function() {

    if (this.deathSlowTimer > 0) {
        return;
    }

    this.deathSlowTimer = this.deathSlowDuration;
    this.scrollCounter = 0;
};

/**
 * Uppdaterar death slow motion-timern.
 * Funktionen minskar timern varje frame tills den når 0,
 *
 * @return {void}
 */
runmysteriet.handler.AutoScrollCameraHandler.prototype.updateDeathSlowMotion = function() {

    if (this.deathSlowTimer > 0) {
        this.deathSlowTimer--;
    }
};

/**
 * Returnerar aktuell scroll-delay beroende på om death slow motion är aktivt.
 *
 * @return {number} Delay i frames mellan kameraskrollningar.
 */
runmysteriet.handler.AutoScrollCameraHandler.prototype.getCurrentScrollDelay = function() {

    if (this.deathSlowTimer > 0) {
        return this.deathSlowScrollDelay;
    }

    return this.scrollDelay;
};