//------------------------------------------------------------------------------
// HUD HANDLER
//------------------------------------------------------------------------------

/**
 * Hanterar all HUD i Game-scenen.
 *
 * @constructor
 * @param {!rune.display.DisplayObjectContainer} stage
 * @param {!Object} application
 * @param {!Object} cameras
 */
runmysteriet.handler.HudHandler = function(stage, application, cameras) {

    this.stage = stage;
    this.application = application;
    this.cameras = cameras;

    this.m_timerText = null;
    this.m_scoreText = null;
    this.m_highscoreHud = null;

    this.m_runeTextBg = null;
    this.m_runeText = null;
};

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.handler.HudHandler.prototype.init = function() {

    /*
     * Timer.
     */
    this.m_timerText = new rune.text.BitmapField("TIME LEFT: 200");
    this.m_timerText.x = 15;
    this.m_timerText.y = 15;
    this.stage.addChild(this.m_timerText);

    /*
     * Score / level.
     */
    this.m_scoreText = new rune.text.BitmapField(" ");
    this.m_scoreText.x = 15;
    this.m_scoreText.y = 30;
    this.stage.addChild(this.m_scoreText);

    /*
     * Bästa highscore under spelet.
     */
    this.m_highscoreHud = new runmysteriet.ui.graphic.HighscoreHud(
        this.application
    );

    this.stage.addChild(this.m_highscoreHud);

    /*
     * Bakgrund bakom runtext.
     */
    this.m_runeTextBg = new rune.display.Graphic(
        0,
        0,
        150,
        22
    );

    this.m_runeTextBg.backgroundColor = "#000000";
    this.m_runeTextBg.alpha = 0.6;

    this.stage.addChild(this.m_runeTextBg);

    /*
     * Runtext.
     */
    this.m_runeText = new rune.text.BitmapField("RUNOR: ");
    this.m_runeText.autoSize = true;

    this.stage.addChild(this.m_runeText);

    this.update();
};

//------------------------------------------------------------------------------
// PUBLIC METHODS
//------------------------------------------------------------------------------

/**
 * Kopplar ShieldHandler till HUD.
 *
 * @param {!runmysteriet.handler.ShieldHandler} shieldHandler
 * @return {void}
 */
runmysteriet.handler.HudHandler.prototype.connectShieldHandler = function(shieldHandler) {

    var self = this;

    if (!shieldHandler) {
        return;
    }

    shieldHandler.onCollectedChanged = function(text) {
        self.setRuneText(text);
    };
};

/**
 * Uppdaterar HUD-positioner så de följer kameran.
 *
 * @return {void}
 */
runmysteriet.handler.HudHandler.prototype.update = function() {

    var camera = null;
    var runeBoxWidth = 0;

    if (!this.cameras) {
        return;
    }

    camera = this.cameras.getCameraAt(0);

    if (!camera || !camera.viewport) {
        return;
    }

    /*
     * Timer vänster.
     */
    if (this.m_timerText) {
        this.m_timerText.x = camera.viewport.x + 15;
        this.m_timerText.y = camera.viewport.y + 15;
    }

    /*
     * Score vänster.
     */
    if (this.m_scoreText) {
        this.m_scoreText.x = camera.viewport.x + 15;
        this.m_scoreText.y = camera.viewport.y + 30;
    }

    /*
    * Bästa highscore i höger kant.
    */
    if (this.m_highscoreHud) {
        this.m_highscoreHud.x =
            camera.viewport.x +
            camera.viewport.width -
            this.m_highscoreHud.width -
            15;

        this.m_highscoreHud.y = camera.viewport.y + 15;
    }

    /*
 * Runtext längst ner till vänster.
 */
    if (this.m_runeText && this.m_runeTextBg) {

        runeBoxWidth = this.m_runeText.width + 10; //

        if (runeBoxWidth < 150) {
            runeBoxWidth = 120;
        }

        this.m_runeTextBg.width = runeBoxWidth;
        this.m_runeTextBg.height = 15; // Höjden är konstant

        /*
        * Vänster längst ner i kamerans synliga fönster.
        */
        this.m_runeTextBg.x = camera.viewport.x + 5; // 5px padding från vänster
        this.m_runeTextBg.y =
            camera.viewport.y +
            camera.viewport.height -
            this.m_runeTextBg.height -
            2;// 15px padding från botten

        this.m_runeText.x = this.m_runeTextBg.x + 5; // 5px padding från vänster
        this.m_runeText.y = this.m_runeTextBg.y + 3;// 3px padding uppifrån
    }
};

/**
 * Sätter timertext.
 *
 * @param {string} text
 * @return {void}
 */
runmysteriet.handler.HudHandler.prototype.setTimerText = function(text) {

    if (this.m_timerText) {
        this.m_timerText.text = text;
    }
};

/**
 * Sätter scoretext.
 *
 * @param {string} text
 * @return {void}
 */
runmysteriet.handler.HudHandler.prototype.setScoreText = function(text) {

    if (this.m_scoreText) {
        this.m_scoreText.text = text;
    }
};

/**
 * Sätter runtext.
 *
 * @param {string} text
 * @return {void}
 */
runmysteriet.handler.HudHandler.prototype.setRuneText = function(text) {

    if (this.m_runeText) {
        this.m_runeText.text = "RUNES: " + text;
    }
};

/**
 * Laddar om highscore.
 *
 * @return {void}
 */
runmysteriet.handler.HudHandler.prototype.reloadHighscore = function() {

    if (this.m_highscoreHud &&
        typeof this.m_highscoreHud.reload === "function") {

        this.m_highscoreHud.reload();
    }
};