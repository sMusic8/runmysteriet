//------------------------------------------------------------------------------
// HUD HANDLER
//------------------------------------------------------------------------------

/**
 * Hanterar HUD i Game-scenen.
 *
 * @constructor
 * @param {!rune.display.DisplayObjectContainer} stage
 * @param {!Object} application
 * @param {!Object} cameras
 */
runmysteriet.handler.HudHandler = function(stage, application, cameras) {

    /** @type {!rune.display.DisplayObjectContainer} */
    this.stage = stage;

    /** @type {!Object} */
    this.application = application;

    /** @type {!Object} */
    this.cameras = cameras;

    /** @type {?rune.text.BitmapField} */
    this.m_timerText = null;

    /** @type {?rune.text.BitmapField} */
    this.m_scoreText = null;

    /** @type {?runmysteriet.ui.graphic.HighscoreHud} */
    this.m_highscoreHud = null;

    /** @type {?rune.display.Graphic} */
    this.m_runeTextBg = null;

    /** @type {?rune.text.BitmapField} */
    this.m_runeText = null;

    /** @type {?runmysteriet.handler.ShieldHandler} */
    this.m_shieldHandler = null;
};

/**
 * Initierar HUD: skapar textfält, highscore-display och rune UI.
 *
 * @return {void}
 */
runmysteriet.handler.HudHandler.prototype.init = function() {

    /*
     * Säkerhet om HUD råkar initieras om.
     */
    this.clear();

    this.m_timerText = new rune.text.BitmapField("COLLECT ALL RUNES");
    this.m_timerText.x = 15;
    this.m_timerText.y = 15;
    this.stage.addChild(this.m_timerText);

    this.m_scoreText = new rune.text.BitmapField(" ");
    this.m_scoreText.x = 15;
    this.m_scoreText.y = 30;
    this.stage.addChild(this.m_scoreText);

    this.m_highscoreHud = new runmysteriet.ui.graphic.HighscoreHud(
        this.application
    );

    this.stage.addChild(this.m_highscoreHud);

    this.m_runeTextBg = new rune.display.Graphic(
        0,
        0,
        150,
        22
    );

    this.m_runeTextBg.backgroundColor = "#000000";
    this.m_runeTextBg.alpha = 0.6;

    this.stage.addChild(this.m_runeTextBg);

    this.m_runeText = new rune.text.BitmapField("RUNES: ");
    this.m_runeText.autoSize = true;

    this.stage.addChild(this.m_runeText);

    this.update();
};
/**
 * Kopplar HUD:en till en ShieldHandler för att uppdatera run-text när något samlas in.
 *
 * @param {runmysteriet.handler.ShieldHandler} shieldHandler
 * @return {void}
 */
runmysteriet.handler.HudHandler.prototype.connectShieldHandler = function(shieldHandler) {

    /** @type {runmysteriet.handler.HudHandler} */
    var self = this;

    if (!shieldHandler) {
        return;
    }

    /**
     * Intern referens till ShieldHandler.
     * @type {runmysteriet.handler.ShieldHandler}
     */
    this.m_shieldHandler = shieldHandler;

    /**
     * Callback: triggas när en rune samlas upp.
     *
     * @param {string} text Den aktuella run-strängen
     * @return {void}
     */
    shieldHandler.onCollectedChanged = function(text) {
        self.setRuneText(text);
    };
};

/**
 * Uppdaterar HUD-positioner efter kameran.
 *
 * @return {void}
 */
runmysteriet.handler.HudHandler.prototype.update = function() {

    /** @type {rune.camera.Camera} */
    var camera = null;

    /** @type {number} */
    var cameraX = 0;

    /** @type {number} */
    var cameraY = 0;

    /** @type {number} */
    var screenWidth = 0;

    /** @type {number} */
    var screenHeight = 0;

    /** @type {number} */
    var runeBoxWidth = 0;

    if (!this.cameras) {
        return;
    }

    camera = this.cameras.getCameraAt(0);

    if (!camera || !camera.viewport) {
        return;
    }

    cameraX = Math.round(camera.viewport.x);
    cameraY = Math.round(camera.viewport.y);

    screenWidth = camera.viewport.width;
    screenHeight = camera.viewport.height;

    if (this.m_timerText) {
        this.m_timerText.x = cameraX + 15;
        this.m_timerText.y = cameraY + 15;
    }

    if (this.m_scoreText) {
        this.m_scoreText.x = cameraX + 15;
        this.m_scoreText.y = cameraY + 30;
    }

    if (this.m_highscoreHud) {
        this.m_highscoreHud.x =
            cameraX +
            screenWidth -
            this.m_highscoreHud.width -
            15;

        this.m_highscoreHud.y = cameraY + 15;
    }

    if (this.m_runeText && this.m_runeTextBg) {
        runeBoxWidth = this.m_runeText.width + 10;

        if (runeBoxWidth < 190) {
            runeBoxWidth = 190;
        }

        this.m_runeTextBg.width = runeBoxWidth;
        this.m_runeTextBg.height = 15;

        this.m_runeTextBg.x = cameraX + 5;
        this.m_runeTextBg.y =
            cameraY +
            screenHeight -
            this.m_runeTextBg.height -
            2;

        this.m_runeText.x = this.m_runeTextBg.x + 5;
        this.m_runeText.y = this.m_runeTextBg.y + 3;
    }
};

/**
 * Sätter timertext i HUD om värdet har ändrats.
 *
 * @param {string} text
 * @return {void}
 */
runmysteriet.handler.HudHandler.prototype.setTimerText = function(text) {

    if (this.m_timerText && this.m_timerText.text !== text) {
        this.m_timerText.text = text;
    }
};

/**
 * Sätter scoretext i HUD om värdet har ändrats.
 *
 * @param {string} text
 * @return {void}
 */
runmysteriet.handler.HudHandler.prototype.setScoreText = function(text) {

    if (this.m_scoreText && this.m_scoreText.text !== text) {
        this.m_scoreText.text = text;
    }
};

/**
 * Uppdaterar run-text i HUD.
 *Visar insamlade runor i formatet "RUNES: <text>".
 *
 * @param {string} text
 * @return {void}
 */
runmysteriet.handler.HudHandler.prototype.setRuneText = function(text) {

    if (this.m_runeText) {
        this.m_runeText.text = "RUNES: " + String(text || "");
    }
};

/**
 * Laddar om highscore-HUD om den finns tillgänglig.
 * Anropar `reload()` på HighscoreHud-komponenten om metoden existerar.
 *
 * @return {void}
 */
runmysteriet.handler.HudHandler.prototype.reloadHighscore = function() {

    if (
        this.m_highscoreHud &&
        typeof this.m_highscoreHud.reload === "function"
    ) {
        this.m_highscoreHud.reload();
    }
};

//------------------------------------------------------------------------------
// REMOVE DISPLAY OBJECT
//------------------------------------------------------------------------------

/**
 * Tar bort display object från stage.
 *
 * @param {?Object} object
 * @return {void}
 */
runmysteriet.handler.HudHandler.prototype.removeDisplayObject = function(object) {

    if (!object) {
        return;
    }

    if (typeof object.dispose === "function") {
        object.dispose();
        return;
    }

    if (typeof object.remove === "function") {
        object.remove();
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
    /**
     * Rensar HUD och kopplade referenser.
     *
     * @return {void}
     */
runmysteriet.handler.HudHandler.prototype.clear = function() {

        if (this.m_shieldHandler) {
            this.m_shieldHandler.onCollectedChanged = null;
        }
}
//------------------------------------------------------------------------------
// CLEAR
//------------------------------------------------------------------------------

/**
 * Tar bort HUD-objekt från stage.
 *
 * @return {void}
 */
runmysteriet.handler.HudHandler.prototype.clear = function() {

    if (this.m_shieldHandler) {
        this.m_shieldHandler.onCollectedChanged = null;
    }

    this.removeDisplayObject(this.m_runeText);
    this.removeDisplayObject(this.m_runeTextBg);
    this.removeDisplayObject(this.m_highscoreHud);
    this.removeDisplayObject(this.m_scoreText);
    this.removeDisplayObject(this.m_timerText);

        this.m_timerText = null;
        this.m_scoreText = null;
        this.m_highscoreHud = null;

        this.m_runeTextBg = null;
        this.m_runeText = null;

    this.m_shieldHandler = null;
};

//------------------------------------------------------------------------------
// DISPOSE
//------------------------------------------------------------------------------

/**
 * Rensar HudHandler helt.
 *
 * @return {void}
 */
runmysteriet.handler.HudHandler.prototype.dispose = function() {

    this.clear();

    this.stage = null;
    this.application = null;
    this.cameras = null;
};
