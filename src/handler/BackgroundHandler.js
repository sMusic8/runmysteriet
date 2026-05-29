//------------------------------------------------------------------------------
// BACKGROUND HANDLER
//------------------------------------------------------------------------------

/**
 * Loopa igenom bakgrunder.
 *
 * @constructor
 * @param {!rune.display.Stage} stage
 * @param {!rune.camera.Camera} camera
 * @param {number} screenWidth
 * @param {number} screenHeight
 */
runmysteriet.handler.BackgroundHandler = function(stage, camera, screenWidth, screenHeight) {

    /** @type {!rune.display.Stage} */
    this.stage = stage;

    /** @type {!rune.camera.Camera} */
    this.camera = camera;

    /** @type {number} */
    this.screenWidth = screenWidth;

    /** @type {number} */
    this.screenHeight = screenHeight;

    /** @type {!Array<!rune.display.Graphic>} */
    this.backgrounds = [];

    /** @type {!Array<string>} */
    this.backgroundTextures = [
        "background1",
        "background2",
        "backgroundExtra",
        "background4"
    ];

    /** @type {number} */
    this.backgroundCount = this.backgroundTextures.length;

    /** @type {number} */
    this.levelWidth = this.screenWidth * this.backgroundCount;
};

/**
 * Skapar bakgrunden.
 *
 * @return {void}
 */
runmysteriet.handler.BackgroundHandler.prototype.init = function() {

    for (var i = 0; i < this.backgroundTextures.length; i++) {

        var background = new rune.display.Graphic(
            i * this.screenWidth,
            0,
            this.screenWidth,
            this.screenHeight,
            this.backgroundTextures[i]
        );

        this.backgrounds.push(background);
        this.stage.addChild(background);
    }
};

/**
 * Uppdaterar skrollnigen av bakgrunden
 *
 * @return {void}
 */
runmysteriet.handler.BackgroundHandler.prototype.update = function() {

    if (!this.camera || !this.camera.viewport) {
        return;
    }

    var cameraX = this.camera.viewport.x;

    for (var i = 0; i < this.backgrounds.length; i++) {

        var background = this.backgrounds[i];

        if (background.x + this.screenWidth < cameraX) {
            background.x += this.levelWidth;
        }

        if (background.x > cameraX + this.screenWidth) {
            background.x -= this.levelWidth;
        }
    }
};

//------------------------------------------------------------------------------
// REMOVE DISPLAY OBJECT
//------------------------------------------------------------------------------

/**
 * Tar bort ett display object från stage.
 *
 * @param {?Object} object
 * @return {void}
 */
runmysteriet.handler.BackgroundHandler.prototype.removeDisplayObject = function(object) {

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
 * Tar bort alla bakgrunder från stage.
 *
 * @return {void}
 */
runmysteriet.handler.BackgroundHandler.prototype.clear = function() {

    var i = 0;
    var background = null;

    if (!this.backgrounds) {
        this.backgrounds = [];
        return;
    }

    for (i = 0; i < this.backgrounds.length; i++) {
        background = this.backgrounds[i];
        this.removeDisplayObject(background);
    }

    this.backgrounds = [];
};

//------------------------------------------------------------------------------
// DISPOSE
//------------------------------------------------------------------------------

/**
 * Rensar BackgroundHandler helt.
 *
 * @return {void}
 */
runmysteriet.handler.BackgroundHandler.prototype.dispose = function() {

    this.clear();

    this.stage = null;
    this.camera = null;
    this.screenWidth = 0;
    this.screenHeight = 0;
    this.backgroundTextures = [];
    this.backgroundCount = 0;
    this.levelWidth = 0;
};