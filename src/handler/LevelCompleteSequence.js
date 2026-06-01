//------------------------------------------------------------------------------
// LEVEL COMPLETE SEQUENCE
//------------------------------------------------------------------------------

runmysteriet.handler = runmysteriet.handler || {};

/**
 * Hanterar segersekvensen när en level är klar.
 *
 * @constructor
 * @param {!rune.display.Stage} stage
 * @param {!Object} application
 * @param {?Object} camera
 * @param {?runmysteriet.handler.PlayerHandler} playerHandler
 */
runmysteriet.handler.LevelCompleteSequence = function(
    stage,
    application,
    camera,
    playerHandler
) {

    this.m_stage = stage;
    this.m_application = application;
    this.m_camera = camera;
    this.m_playerHandler = playerHandler;

    this.m_active = false;
    this.m_timer = 0;
    this.m_duration = 75;

    this.m_text = null;
    this.m_overlay = null;

    this.m_playersData = [];

    this.m_onComplete = null;
    this.m_completeData = null;

    this.m_hasPlayedSound = false;
    this.m_cheerSound = null;

    this.m_flowers = [];
    this.m_flowerData = [];

    this.m_flowerTextures = [
        "b1",
        "b2",
        "b3",
        "b4",
        "b5",
        "b1",
        "b2",
        "b3",
        "b4",
        "b5",
        "b1",
        "b2",
        "b3",
        "b4",
        "b5"
    ];

    if (
        this.m_application &&
        this.m_application.sounds &&
        this.m_application.sounds.sound
    ) {
        this.m_cheerSound =
            this.m_application.sounds.sound.get("lvl_up");
    }
};

//------------------------------------------------------------------------------
// PUBLIC METHODS
//------------------------------------------------------------------------------

/**
 * Startar level complete-sekvensen.
 *
 * @param {!Object} completeData
 * @param {!Function} onComplete
 * @return {void}
 */
runmysteriet.handler.LevelCompleteSequence.prototype.start = function(
    completeData,
    onComplete
) {

    if (this.m_active === true) {
        return;
    }

    /*
     * Säkerställ att inget gammalt ligger kvar.
     */
    this.clear();

    this.m_active = true;
    this.m_timer = 0;

    this.m_completeData = completeData || null;
    this.m_onComplete = onComplete || null;

    this.m_hasPlayedSound = false;

    this.savePlayersStartData();

    /*
     * Ordning:
     * overlay först, sedan blommor, text sist.
     * Då hamnar LEVEL COMPLETE överst.
     */
    this.createOverlay();
    this.createFlowers();
    this.createText();

    this.updateTextPop();
    this.updateTextPosition();
};

/**
 * Uppdaterar sekvensen.
 *
 * @return {void}
 */
runmysteriet.handler.LevelCompleteSequence.prototype.update = function() {

    if (this.m_active !== true) {
        return;
    }

    this.m_timer++;

    this.updatePlayers();
    this.updateFlowers();
    this.updateTextPop();
    this.updateTextPosition();

    if (this.m_timer === 20) {
        this.playCheerSound();
    }

    if (this.m_timer >= this.m_duration) {
        this.finish();
    }
};

/**
 * Kollar om sekvensen är aktiv.
 *
 * @return {boolean}
 */
runmysteriet.handler.LevelCompleteSequence.prototype.isActive = function() {

    return this.m_active === true;
};

//------------------------------------------------------------------------------
// CREATE
//------------------------------------------------------------------------------

/**
 * Skapar mörk overlay.
 *
 * @return {void}
 */
runmysteriet.handler.LevelCompleteSequence.prototype.createOverlay = function() {

    if (!this.m_stage || !this.m_application || !this.m_application.screen) {
        return;
    }

    this.m_overlay = new rune.display.Graphic(
        this.getCameraX(),
        this.getCameraY(),
        this.m_application.screen.width,
        this.m_application.screen.height
    );

    this.m_overlay.backgroundColor = "#000000";
    this.m_overlay.alpha = 0.25;

    this.m_stage.addChild(this.m_overlay);
};

/**
 * Skapar LEVEL COMPLETE-text.
 *
 * @return {void}
 */
runmysteriet.handler.LevelCompleteSequence.prototype.createText = function() {

    if (!this.m_stage) {
        return;
    }

    this.m_text = new rune.text.BitmapField("LEVEL COMPLETE");
    this.m_text.autoSize = true;
    this.m_text.visible = true;

    this.m_text.scaleX = 0.2;
    this.m_text.scaleY = 0.2;

    this.m_stage.addChild(this.m_text);
};

//------------------------------------------------------------------------------
// PLAYERS
//------------------------------------------------------------------------------

/**
 * Sparar spelarnas startpositioner.
 *
 * @return {void}
 */
runmysteriet.handler.LevelCompleteSequence.prototype.savePlayersStartData = function() {

    var players = null;
    var player = null;
    var i = 0;

    this.m_playersData = [];

    if (!this.m_playerHandler || !this.m_playerHandler.players) {
        return;
    }

    players = this.m_playerHandler.players;

    for (i = 0; i < players.length; i++) {
        player = players[i];

        if (!player || player.isDead === true) {
            continue;
        }

        this.m_playersData.push({
            player: player,
            startX: player.x,
            startY: player.y
        });
    }
};

/**
 * Uppdaterar huka/hoppa-animationen.
 *
 * @return {void}
 */
runmysteriet.handler.LevelCompleteSequence.prototype.updatePlayers = function() {

    var i = 0;
    var data = null;
    var player = null;
    var jumpOffset = 0;

    if (!this.m_playersData) {
        return;
    }

    for (i = 0; i < this.m_playersData.length; i++) {
        data = this.m_playersData[i];
        player = data.player;

        if (!player) {
            continue;
        }

        /*
         * 0-15 frames:
         * Spelaren hukar.
         */
        if (this.m_timer <= 15) {
            player.y = data.startY + 8;
        }

        /*
         * 16-45 frames:
         * Spelaren hoppar upp och landar.
         */
        else if (this.m_timer <= 45) {
            jumpOffset = Math.sin((this.m_timer - 15) / 30 * Math.PI) * 28;
            player.y = data.startY - jumpOffset;
        }

        /*
         * Efter hoppet:
         * tillbaka till startposition.
         */
        else {
            player.y = data.startY;
        }
    }
};

/**
 * Återställer spelarnas positioner.
 *
 * @return {void}
 */
runmysteriet.handler.LevelCompleteSequence.prototype.restorePlayers = function() {

    var i = 0;
    var data = null;

    if (!this.m_playersData) {
        return;
    }

    for (i = 0; i < this.m_playersData.length; i++) {
        data = this.m_playersData[i];

        if (data && data.player) {
            data.player.y = data.startY;
        }
    }
};

//------------------------------------------------------------------------------
// TEXT
//------------------------------------------------------------------------------

/**
 * Uppdaterar textens position så den ligger i mitten av kameran.
 *
 * @return {void}
 */
runmysteriet.handler.LevelCompleteSequence.prototype.updateTextPosition = function() {

    if (!this.m_text || !this.m_application || !this.m_application.screen) {
        return;
    }

    this.m_text.x =
        this.getCameraX() +
        this.m_application.screen.width / 2 -
        this.m_text.width / 2;

    this.m_text.y =
        this.getCameraY() +
        this.m_application.screen.height / 2 -
        this.m_text.height / 2;
};
/**
 * Placerar texten i mitten av kameran om spelare saknas.
 *
 * @return {void}
 */
runmysteriet.handler.LevelCompleteSequence.prototype.positionTextCenterScreen = function() {

    if (!this.m_text || !this.m_application || !this.m_application.screen) {
        return;
    }

    this.m_text.x =
        this.getCameraX() +
        this.m_application.screen.width / 2 -
        this.m_text.width / 2;

    this.m_text.y =
        this.getCameraY() +
        this.m_application.screen.height / 2 -
        this.m_text.height / 2;
};

/**
 * pop-effekt på texten i slutet av lvl
 *
 * @return {void}
 */
runmysteriet.handler.LevelCompleteSequence.prototype.updateTextPop = function() {

    var scale = 2;
    var bounce = 0;

    if (!this.m_text) {
        return;
    }

    /*
     * Snabb pop in.
     */
    if (this.m_timer < 10) {
        scale = 0.3 + this.m_timer * 0.17;
    }

    /*
     * Bounce i ungefär 1 sekund.
     * Vid 30 fps är 30 frames ungefär 1 sekund.
     */
    else if (this.m_timer < 60) {
        bounce = Math.sin((this.m_timer - 10) * 0.45) * 0.16;
        scale = 2 + bounce;
    }

    /*
     * Stabil storlek efter bounce.
     */
    else {
        scale = 2;
    }

    this.m_text.scaleX = scale;
    this.m_text.scaleY = scale;
};

//------------------------------------------------------------------------------
// FLOWERS
//------------------------------------------------------------------------------

/**
 * Skapar små blommor runt avatarerna.
 *
 * @return {void}
 */
runmysteriet.handler.LevelCompleteSequence.prototype.createFlowers = function() {

    var centerX = 0;
    var baseY = 0;
    var i = 0;
    var flower = null;
    var texture = "";
    var offsetX = 0;

    if (!this.m_stage || !this.m_application || !this.m_application.screen) {
        return;
    }

    centerX = this.getPlayersCenterX();
    baseY = this.getPlayersTopY();

    if (baseY === 0) {
        baseY = this.getCameraY() + this.m_application.screen.height / 2;
    }

    for (i = 0; i < this.m_flowerTextures.length; i++) {
        texture = this.m_flowerTextures[i];

        offsetX = -78 + i * 24;

        flower = new rune.display.Graphic(
            centerX + offsetX,
            baseY - 20,
            16,
            16,
            texture
        );

        flower.visible = false;
        flower.rotation = 0;

        this.m_stage.addChild(flower);

        this.m_flowers.push(flower);

        this.m_flowerData.push({
            flower: flower,
            velocityX: -2.4 + i * 0.4,
            velocityY: -4.2 - Math.random() * 2.5,
            gravity: 0.20,
            rotationSpeed: -10 + i * 2
            
        });
    }
};

/**
 * Uppdaterar blom-effekten.
 *
 * @return {void}
 */
runmysteriet.handler.LevelCompleteSequence.prototype.updateFlowers = function() {

    var i = 0;
    var data = null;
    var flower = null;

    if (!this.m_flowerData) {
        return;
    }

    /*
     * Blommorna börjar när avatarerna hoppar.
     */
    if (this.m_timer < 18) {
        return;
    }

    for (i = 0; i < this.m_flowerData.length; i++) {
        data = this.m_flowerData[i];

        if (!data) {
            continue;
        }

        flower = data.flower;

        if (!flower) {
            continue;
        }

        flower.visible = true;

        data.velocityY += data.gravity;

        flower.x += data.velocityX;
        flower.y += data.velocityY;

        flower.rotation += data.rotationSpeed;
    }
};

/**
 * Tar bort alla blommor från stage.
 *
 * @return {void}
 */
runmysteriet.handler.LevelCompleteSequence.prototype.clearFlowers = function() {

    var i = 0;
    var flower = null;

    if (!this.m_flowers) {
        this.m_flowers = [];
        this.m_flowerData = [];
        return;
    }

    for (i = 0; i < this.m_flowers.length; i++) {
        flower = this.m_flowers[i];

        this.removeDisplayObject(flower);
    }

    this.m_flowers = [];
    this.m_flowerData = [];
};

//------------------------------------------------------------------------------
// SOUND
//------------------------------------------------------------------------------

/**
 * Spelar jubelljud.
 *
 * @return {void}
 */
runmysteriet.handler.LevelCompleteSequence.prototype.playCheerSound = function() {

    if (this.m_hasPlayedSound === true) {
        return;
    }

    this.m_hasPlayedSound = true;

    if (this.m_cheerSound &&
        typeof this.m_cheerSound.play === "function") {

        this.m_cheerSound.play();
    }
};

//------------------------------------------------------------------------------
// POSITION HELPERS
//------------------------------------------------------------------------------

/**
 * Hämtar mittenpositionen mellan levande spelare.
 *
 * @return {number}
 */
runmysteriet.handler.LevelCompleteSequence.prototype.getPlayersCenterX = function() {

    var i = 0;
    var data = null;
    var player = null;
    var totalX = 0;
    var count = 0;

    if (!this.m_playersData) {
        return this.getCameraX();
    }

    for (i = 0; i < this.m_playersData.length; i++) {
        data = this.m_playersData[i];
        player = data.player;

        if (!player) {
            continue;
        }

        totalX += player.x + player.width / 2;
        count++;
    }

    if (count <= 0) {
        if (this.m_application && this.m_application.screen) {
            return this.getCameraX() + this.m_application.screen.width / 2;
        }

        return this.getCameraX();
    }

    return totalX / count;
};

/**
 * Hämtar högsta Y-positionen bland spelarna.
 *
 * @return {number}
 */
runmysteriet.handler.LevelCompleteSequence.prototype.getPlayersTopY = function() {

    var i = 0;
    var data = null;
    var player = null;
    var topY = 999999;

    if (!this.m_playersData) {
        return 0;
    }

    for (i = 0; i < this.m_playersData.length; i++) {
        data = this.m_playersData[i];
        player = data.player;

        if (!player) {
            continue;
        }

        if (player.y < topY) {
            topY = player.y;
        }
    }

    if (topY === 999999) {
        return 0;
    }

    return topY;
};

/**
 * Hämtar kamerans X.
 *
 * @return {number}
 */
runmysteriet.handler.LevelCompleteSequence.prototype.getCameraX = function() {

    if (this.m_camera && this.m_camera.viewport) {
        return this.m_camera.viewport.x;
    }

    return 0;
};

/**
 * Hämtar kamerans Y.
 *
 * @return {number}
 */
runmysteriet.handler.LevelCompleteSequence.prototype.getCameraY = function() {

    if (this.m_camera && this.m_camera.viewport) {
        return this.m_camera.viewport.y;
    }

    return 0;
};

//------------------------------------------------------------------------------
// FINISH
//------------------------------------------------------------------------------

/**
 * Avslutar sekvensen och kör callback.
 *
 * @return {void}
 */
runmysteriet.handler.LevelCompleteSequence.prototype.finish = function() {

    var onComplete = this.m_onComplete;
    var completeData = this.m_completeData;

    this.clear();

    if (typeof onComplete === "function") {
        onComplete(completeData);
    }
};

//------------------------------------------------------------------------------
// REMOVE DISPLAY OBJECT
//------------------------------------------------------------------------------

/**
 * Tar bort ett objekt från stage.
 *
 * @param {?Object} object
 * @return {void}
 */
runmysteriet.handler.LevelCompleteSequence.prototype.removeDisplayObject = function(object) {

    if (!object) {
        return;
    }

    if (object.parent) {
        object.parent.removeChild(object);
        return;
    }

    if (object.stage) {
        object.stage.removeChild(object);
    }
};

//------------------------------------------------------------------------------
// CLEAR
//------------------------------------------------------------------------------

/**
 * Rensar sekvensen.
 *
 * @return {void}
 */
runmysteriet.handler.LevelCompleteSequence.prototype.clear = function() {

    this.restorePlayers();

    this.removeDisplayObject(this.m_text);
    this.removeDisplayObject(this.m_overlay);

    this.clearFlowers();

    this.m_text = null;
    this.m_overlay = null;

    this.m_playersData = [];

    this.m_active = false;
    this.m_timer = 0;

    this.m_onComplete = null;
    this.m_completeData = null;

    this.m_hasPlayedSound = false;
};

//------------------------------------------------------------------------------
// DISPOSE
//------------------------------------------------------------------------------

/**
 * Rensar alla referenser.
 *
 * @return {void}
 */
runmysteriet.handler.LevelCompleteSequence.prototype.dispose = function() {

    this.clear();

    this.m_stage = null;
    this.m_application = null;
    this.m_camera = null;
    this.m_playerHandler = null;

    this.m_cheerSound = null;

    this.m_duration = 0;
    this.m_flowerTextures = [];
};