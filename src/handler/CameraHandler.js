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
    this.levelWidth = levelWidth || 0;

    /**
     * Kamerans riktiga X-värde sparas som decimal.
     * camera.viewport.x avrundas bara när värdet skrivs ut till Rune.
     * Detta minskar skakning som kan uppstå när smoothing blandas med Math.round.
     *
     * @type {number}
     */
    this.m_cameraX = 0;

    /** @type {boolean} */
    this.m_hasCameraPosition = false;

    /**
     * Lägre värde = mjukare/långsammare kamera.
     *
     * @type {number}
     */
    this.m_smoothing = 0.12;

    /**
     * Små skillnader ignoreras så kameran inte darrar runt ett mål.
     *
     * @type {number}
     */
    this.m_snapDistance = 0.25;

    /**
     * Säkerhetsmarginal i kameran.
     * Samma idé som i PlayerHandler.keepPlayersInsideCamera.
     *
     * @type {number}
     */
    this.m_margin = 8;
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

    var players = null;
    var livingPlayers = [];
    var player = null;
    var i = 0;
    var centerX = 0;
    var targetX = 0;
    var maxX = 0;
    var diff = 0;
    var viewportWidth = 0;
    var playerWidth = 32;

    if (!this.camera || !this.camera.viewport) {
        return;
    }

    if (!this.playerHandler || !this.playerHandler.players) {
        return;
    }

    players = this.playerHandler.players;
    viewportWidth = this.camera.viewport.width || 0;

    if (viewportWidth <= 0) {
        return;
    }

    /*
     * Kameran ska bara följa levande spelare.
     */
    for (i = 0; i < players.length; i++) {
        player = players[i];

        if (player && player.isDead !== true) {
            livingPlayers.push(player);
        }
    }

    if (livingPlayers.length === 0) {
        return;
    }

    /*
     * Räkna ut mitten mellan levande spelare.
     */
    for (i = 0; i < livingPlayers.length; i++) {
        player = livingPlayers[i];
        playerWidth = player.width || 32;

        centerX += player.x + playerWidth / 2;
    }

    centerX = centerX / livingPlayers.length;
    targetX = centerX - viewportWidth / 2;

    /*
     * Stoppa kameran från att gå utanför banan.
     */
    maxX = this.levelWidth - viewportWidth;

    if (maxX < 0) {
        maxX = 0;
    }

    targetX = this.clamp(targetX, 0, maxX);

    /*
     * Justera target så kameran inte själv försöker lämna levande spelare utanför bilden.
     * Detta minskar konflikt mellan kamera-följning och PlayerHandler.keepPlayersInsideCamera.
     */
    targetX = this.keepTargetInsidePlayers(
        targetX,
        livingPlayers,
        viewportWidth,
        maxX
    );

    if (this.m_hasCameraPosition !== true) {
        this.m_cameraX = targetX;
        this.m_hasCameraPosition = true;
    } else {
        diff = targetX - this.m_cameraX;

        if (Math.abs(diff) <= this.m_snapDistance) {
            this.m_cameraX = targetX;
        } else {
            this.m_cameraX += diff * this.m_smoothing;
        }
    }

    this.m_cameraX = this.clamp(this.m_cameraX, 0, maxX);

    /*
     * Avrunda bara värdet som skickas till Rune.
     * Smoothing fortsätter använda m_cameraX som decimal nästa frame.
     */
    this.camera.viewport.x = Math.round(this.m_cameraX);
    this.camera.viewport.y = 0;
};

//------------------------------------------------------------------------------
// HELPERS
//------------------------------------------------------------------------------

/**
 * Clamps a value between min and max.
 *
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
runmysteriet.handler.CameraHandler.prototype.clamp = function(value, min, max) {

    if (value < min) {
        return min;
    }

    if (value > max) {
        return max;
    }

    return value;
};

/**
 * Keeps the camera target inside the range where living players can stay visible.
 *
 * @param {number} targetX
 * @param {!Array<!Object>} players
 * @param {number} viewportWidth
 * @param {number} maxX
 * @return {number}
 */
runmysteriet.handler.CameraHandler.prototype.keepTargetInsidePlayers = function(
    targetX,
    players,
    viewportWidth,
    maxX
) {

    var minCameraX = 0;
    var maxCameraX = maxX;
    var player = null;
    var playerWidth = 32;
    var leftAllowed = 0;
    var rightAllowed = 0;
    var i = 0;

    if (!players || players.length === 0) {
        return targetX;
    }

    for (i = 0; i < players.length; i++) {
        player = players[i];

        if (!player || player.isDead === true) {
            continue;
        }

        playerWidth = player.width || 32;

        /*
         * För att spelarens högersida ska synas måste kameran minst ligga här.
         */
        leftAllowed = player.x + playerWidth + this.m_margin - viewportWidth;

        /*
         * För att spelarens vänstersida ska synas får kameran högst ligga här.
         */
        rightAllowed = player.x - this.m_margin;

        if (leftAllowed > minCameraX) {
            minCameraX = leftAllowed;
        }

        if (rightAllowed < maxCameraX) {
            maxCameraX = rightAllowed;
        }
    }

    minCameraX = this.clamp(minCameraX, 0, maxX);
    maxCameraX = this.clamp(maxCameraX, 0, maxX);

    /*
     * Om spelarna är längre ifrån varandra än kamerans bredd går det inte att hålla
     * båda helt synliga. Då använder vi vanlig target-clamp istället för att skapa ryck.
     */
    if (minCameraX > maxCameraX) {
        return this.clamp(targetX, 0, maxX);
    }

    return this.clamp(targetX, minCameraX, maxCameraX);
};