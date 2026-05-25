//------------------------------------------------------------------------------
// LEVEL COMPLETE SCENE
//------------------------------------------------------------------------------

runmysteriet.scene.LevelComplete = function(levelNumber, totalScore, earnedScore, avatarData) {
    console.log("grus")
    rune.scene.Scene.call(this);
    this.m_avatarData = avatarData || null;

    this.levelNumber = levelNumber || 1;
    this.totalScore = totalScore || 0;
    this.earnedScore = earnedScore || 0;

    this.levelConfig = new runmysteriet.config.LevelConfig(this.levelNumber);
    this.maxLevel = this.levelConfig.getMaxLevel();

    this.menuItems = [];
    this.selectedIndex = 0;

    this.menuSound = null;
    this.backgroundMusic = null;

    this.m_highscoreHud = null;

    this.m_titleText = null;
    this.m_earnedText = null;
    this.m_totalText = null;
    this.m_gameInput = null;
};

//------------------------------------------------------------------------------
// INHERITANCE
//------------------------------------------------------------------------------

runmysteriet.scene.LevelComplete.prototype = Object.create(rune.scene.Scene.prototype);
runmysteriet.scene.LevelComplete.prototype.constructor = runmysteriet.scene.LevelComplete;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.scene.LevelComplete.prototype.init = function() {

    rune.scene.Scene.prototype.init.call(this);

    this.menuSound = this.application.sounds.sound.get("sound_menu");

    // 🎵 SAMMA LJUDSYSTEM SOM MORE
    this.backgroundMusic = this.application.sounds.sound.get("sound_musicMenu");

    if (this.backgroundMusic) {
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.5;
        this.backgroundMusic.play();
    }

    var titleText = (this.levelNumber >= this.maxLevel)
        ? "YOU WON THE WHOLE GAME"
        : "LEVEL " + this.levelNumber + " COMPLETE";

    this.m_titleText = new rune.text.BitmapField(titleText);
    this.m_titleText.autoSize = true;
    this.m_titleText.center = this.application.screen.center;
    this.m_titleText.y -= 75;
    this.stage.addChild(this.m_titleText);

    this.m_earnedText = new rune.text.BitmapField(
        "EARNED SCORE +" + this.earnedScore
    );
    this.m_earnedText.autoSize = true;
    this.m_earnedText.center = this.application.screen.center;
    this.m_earnedText.y -= 45;
    this.stage.addChild(this.m_earnedText);

    this.m_totalText = new rune.text.BitmapField(
        "TOTAL SCORE " + this.totalScore
    );
    this.m_totalText.autoSize = true;
    this.m_totalText.center = this.application.screen.center;
    this.m_totalText.y -= 25;
    this.stage.addChild(this.m_totalText);

    this.createMenu();
    this.updateMenu();
};

//------------------------------------------------------------------------------
// VOLUME CONTROL
//------------------------------------------------------------------------------

runmysteriet.scene.LevelComplete.prototype.update = function(step) {

    rune.scene.Scene.prototype.update.call(this, step);

    var keyboard = this.keyboard;
    var gamepad = this.gamepads.get(0);

    // 🔊 VOLUME
    if (this.backgroundMusic) {

        var stepVol = 0.1;

        // E / RB = VOLYM UPP
        if (keyboard.justPressed("e") || (gamepad && gamepad.justPressed(5))) {

            this.backgroundMusic.volume += stepVol;

            if (this.backgroundMusic.volume > 1) {
                this.backgroundMusic.volume = 0;
            }

            console.log("Volym:", this.backgroundMusic.volume.toFixed(2));
        }

        // Q / LB = VOLYM NER
        if (keyboard.justPressed("q") || (gamepad && gamepad.justPressed(4))) {

            this.backgroundMusic.volume -= stepVol;

            if (this.backgroundMusic.volume < 0) {
                this.backgroundMusic.volume = 1;
            }

            console.log("Volym:", this.backgroundMusic.volume.toFixed(2));
        }
    }

    // MENU INPUT
    var startIsPressed =
        (gamepad && (
            gamepad.justPressed("START") ||
            gamepad.justPressed(9) ||
            gamepad.justPressed(0)
        )) ||
        keyboard.justPressed("SPACE") ||
        keyboard.justPressed("ENTER");

    if (startIsPressed) {
        this.chooseSelected();
    }
};

//------------------------------------------------------------------------------
// MENU
//------------------------------------------------------------------------------

runmysteriet.scene.LevelComplete.prototype.createMenu = function() {

    var labels = (this.levelNumber < this.maxLevel)
        ? ["NEXT LEVEL", "BACK TO MAIN MENU"]
        : ["BACK TO MAIN MENU"];

    for (var i = 0; i < labels.length; i++) {

        var item = new rune.text.BitmapField(labels[i]);
        item.autoSize = true;
        item.center = this.application.screen.center;
        item.y += 50 + i * 20;
        item.scale = 0.8;

        this.stage.addChild(item);
        this.menuItems.push(item);
    }
};

runmysteriet.scene.LevelComplete.prototype.updateMenu = function() {

    for (var i = 0; i < this.menuItems.length; i++) {

        var item = this.menuItems[i];
        var text = item.text.replace(" > ", "");

        item.text = (i === this.selectedIndex)
            ? " > " + text
            : text;
    }
};

//------------------------------------------------------------------------------
// CHOOSE
//------------------------------------------------------------------------------

runmysteriet.scene.LevelComplete.prototype.chooseSelected = function() {

    if (this.levelNumber < this.maxLevel && this.selectedIndex === 0) {

        this.application.scenes.load([
            new runmysteriet.scene.Game(
                this.levelNumber + 1,
                this.totalScore,
                this.m_avatarData
            )
        ]);

        return;
    }

    this.application.scenes.load([
        new runmysteriet.scene.Menu()
    ]);
};
//------------------------------------------------------------------------------
// REMOVE DISPLAY OBJECT
//------------------------------------------------------------------------------

/**
 * Tar bort objekt från stage.
 *
 * @param {?Object} object
 * @return {void}
 */
runmysteriet.scene.LevelComplete.prototype.removeDisplayObject = function(object) {

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
// DISPOSE
//------------------------------------------------------------------------------

runmysteriet.scene.LevelComplete.prototype.dispose = function() {

    var i = 0;

    if (this.backgroundMusic) {
        if (
            this.backgroundMusic.m_source &&
            this.backgroundMusic.m_source.mediaElement
        ) {
            this.backgroundMusic.m_source.mediaElement.pause();
        }
    }

    this.removeDisplayObject(this.m_titleText);
    this.removeDisplayObject(this.m_earnedText);
    this.removeDisplayObject(this.m_totalText);

    if (this.menuItems) {
        for (i = 0; i < this.menuItems.length; i++) {
            this.removeDisplayObject(this.menuItems[i]);
        }
    }

    this.m_titleText = null;
    this.m_earnedText = null;
    this.m_totalText = null;

    this.menuItems = [];
    this.selectedIndex = 0;

    this.menuSound = null;
    this.backgroundMusic = null;
    this.levelConfig = null;
    this.m_avatarData = null;
    this.m_highscoreHud = null;
    this.m_gameInput = null;

    rune.scene.Scene.prototype.dispose.call(this);
};