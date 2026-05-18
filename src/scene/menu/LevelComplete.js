var runmysteriet = runmysteriet || {};
runmysteriet.scene = runmysteriet.scene || {};

//------------------------------------------------------------------------------
// LEVEL COMPLETE SCENE
//------------------------------------------------------------------------------

runmysteriet.scene.LevelComplete = function(levelNumber, totalScore, earnedScore, playerName) {
console.log("grus")
    rune.scene.Scene.call(this);

    this.levelNumber = levelNumber || 1;
    this.totalScore = totalScore || 0;
    this.earnedScore = earnedScore || 0;
    this.playerName = playerName || "PLAYER";

    this.levelConfig = new runmysteriet.config.LevelConfig(this.levelNumber);
    this.maxLevel = this.levelConfig.getMaxLevel();

    this.menuItems = [];
    this.selectedIndex = 0;

    this.menuSound = null;
    this.backgroundMusic = null;

    this.m_highscoreHud = null;
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

    var title = new rune.text.BitmapField(titleText);
    title.autoSize = true;
    title.center = this.application.screen.center;
    title.y -= 75;
    this.stage.addChild(title);

    var nameText = new rune.text.BitmapField("NAME " + this.playerName);
    nameText.autoSize = true;
    nameText.center = this.application.screen.center;
    nameText.y -= 50;
    nameText.scale = 0.75;
    this.stage.addChild(nameText);

    var earned = new rune.text.BitmapField("EARNED SCORE +" + this.earnedScore);
    earned.autoSize = true;
    earned.center = this.application.screen.center;
    earned.y -= 25;
    this.stage.addChild(earned);

    var total = new rune.text.BitmapField("TOTAL SCORE " + this.totalScore);
    total.autoSize = true;
    total.center = this.application.screen.center;
    total.y -= 5;
    this.stage.addChild(total);

    this.createMenu();
    this.updateMenu();
};

//------------------------------------------------------------------------------
// VOLUME CONTROL (EXAKT SOM MORE)
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
                this.playerName
            )
        ]);

        return;
    }

    this.application.scenes.load([
        new runmysteriet.scene.Menu()
    ]);
};

//------------------------------------------------------------------------------
// DISPOSE
//------------------------------------------------------------------------------

runmysteriet.scene.LevelComplete.prototype.dispose = function() {

    rune.scene.Scene.prototype.dispose.call(this);
};