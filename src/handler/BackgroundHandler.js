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