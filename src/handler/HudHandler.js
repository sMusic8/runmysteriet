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

    this.stage = stage;
    this.application = application;
    this.cameras = cameras;

    this.m_timerText = null;
    this.m_scoreText = null;
    this.m_highscoreHud = null;

    this.m_runeTextBg = null;
    this.m_runeText = null;

    this.m_shieldHandler = null;
};

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.handler.HudHandler.prototype.init = function() {

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

//------------------------------------------------------------------------------
// PUBLIC METHODS
//------------------------------------------------------------------------------

runmysteriet.handler.HudHandler.prototype.connectShieldHandler = function(shieldHandler) {

    var self = this;

    if (!shieldHandler) {
        return;
    }

    this.m_shieldHandler = shieldHandler;

    shieldHandler.onCollectedChanged = function(text) {
        self.setRuneText(text);
    };
};

runmysteriet.handler.HudHandler.prototype.update = function() {

    var camera = null;
    var cameraX = 0;
    var cameraY = 0;
    var screenWidth = 0;
    var screenHeight = 0;
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

runmysteriet.handler.HudHandler.prototype.setTimerText = function(text) {

    if (this.m_timerText && this.m_timerText.text !== text) {
        this.m_timerText.text = text;
    }
};

runmysteriet.handler.HudHandler.prototype.setScoreText = function(text) {

    if (this.m_scoreText && this.m_scoreText.text !== text) {
        this.m_scoreText.text = text;
    }
};

runmysteriet.handler.HudHandler.prototype.setRuneText = function(text) {

    if (this.m_runeText) {
        this.m_runeText.text = "RUNES: " + text;
    }
};

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

runmysteriet.handler.HudHandler.prototype.removeDisplayObject = function(object) {

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

runmysteriet.handler.HudHandler.prototype.clear = function() {

    if (this.m_shieldHandler) {
        this.m_shieldHandler.onCollectedChanged = null;
    }

    if (this.m_highscoreHud) {
        if (typeof this.m_highscoreHud.clear === "function") {
            this.m_highscoreHud.clear();
        } else if (typeof this.m_highscoreHud.dispose === "function") {
            this.m_highscoreHud.dispose();
        }
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
    this.stage = null;
    this.application = null;
    this.cameras = null;
};