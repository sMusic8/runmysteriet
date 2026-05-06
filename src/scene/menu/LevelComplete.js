//------------------------------------------------------------------------------
// LEVEL COMPLETE SCENE
//------------------------------------------------------------------------------

runmysteriet.scene.LevelComplete = function(levelNumber, totalScore, earnedScore) {
    rune.scene.Scene.call(this);

    this.levelNumber = levelNumber || 1;
    this.totalScore = totalScore || 0;
    this.earnedScore = earnedScore || 0;

    this.levelConfig = new runmysteriet.config.LevelConfig(this.levelNumber);
    this.maxLevel = this.levelConfig.getMaxLevel();

    this.menuItems = [];
    this.selectedIndex = 0;
    this.menuSound = null;
};

runmysteriet.scene.LevelComplete.prototype = Object.create(rune.scene.Scene.prototype);
runmysteriet.scene.LevelComplete.prototype.constructor = runmysteriet.scene.LevelComplete;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.scene.LevelComplete.prototype.init = function() {
    rune.scene.Scene.prototype.init.call(this);

    this.menuSound = this.application.sounds.sound.get("sound_menu");

    var titleText = "LEVEL " + this.levelNumber + " KLAR";

    if (this.levelNumber >= this.maxLevel) {
        titleText = "DU VANN HELA SPELET";
    }

    var title = new rune.text.BitmapField(titleText);
    title.autoSize = true;
    title.center = this.application.screen.center;
    title.y -= 65;
    this.stage.addChild(title);

    var earned = new rune.text.BitmapField("TIDSPOANG +" + this.earnedScore);
    earned.autoSize = true;
    earned.center = this.application.screen.center;
    earned.y -= 35;
    earned.scale = 0.8;
    this.stage.addChild(earned);

    var total = new rune.text.BitmapField("TOTAL POANG " + this.totalScore);
    total.autoSize = true;
    total.center = this.application.screen.center;
    total.y -= 15;
    total.scale = 0.8;
    this.stage.addChild(total);

    this.createMenu();
    this.updateMenu();
};

//------------------------------------------------------------------------------
// MENU
//------------------------------------------------------------------------------

runmysteriet.scene.LevelComplete.prototype.createMenu = function() {
    var labels = [];
    var item = null;

    if (this.levelNumber < this.maxLevel) {
        labels = ["NASTA LEVEL", "TILLBAKA TILL STARTMENY"];
    } else {
        labels = ["TILLBAKA TILL STARTMENY"];
    }

    for (var i = 0; i < labels.length; i++) {
        item = new rune.text.BitmapField(labels[i]);
        item.autoSize = true;
        item.center = this.application.screen.center;
        item.y += 35 + i * 20;
        item.scale = 0.8;

        this.stage.addChild(item);
        this.menuItems.push(item);
    }
};

runmysteriet.scene.LevelComplete.prototype.updateMenu = function() {
    var item = null;
    var text = "";

    for (var i = 0; i < this.menuItems.length; i++) {
        item = this.menuItems[i];
        text = item.text.replace("> ", "");

        if (i === this.selectedIndex) {
            item.text = "> " + text;
        } else {
            item.text = text;
        }
    }
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

runmysteriet.scene.LevelComplete.prototype.update = function(step) {
    rune.scene.Scene.prototype.update.call(this, step);

    var gamepad = null;
    var startIsPressed = false;
    var downIsPressed = false;
    var upIsPressed = false;

    if (
        this.application &&
        this.application.inputs &&
        this.application.inputs.gamepads
    ) {
        gamepad = this.application.inputs.gamepads.get(0);
    }

    if (gamepad !== null && gamepad !== undefined) {
        if (typeof gamepad.justPressed === "function") {
            startIsPressed =
                gamepad.justPressed("START") ||
                gamepad.justPressed(9) ||
                gamepad.justPressed(0);

            downIsPressed =
                gamepad.justPressed("DOWN") ||
                gamepad.justPressed(13);

            upIsPressed =
                gamepad.justPressed("UP") ||
                gamepad.justPressed(12);
        }
    }

    if (this.keyboard.justPressed("DOWN") || downIsPressed) {
        if (this.menuSound) {
            this.menuSound.play();
        }

        this.selectedIndex++;

        if (this.selectedIndex >= this.menuItems.length) {
            this.selectedIndex = 0;
        }

        this.updateMenu();
    }

    if (this.keyboard.justPressed("UP") || upIsPressed) {
        if (this.menuSound) {
            this.menuSound.play();
        }

        this.selectedIndex--;

        if (this.selectedIndex < 0) {
            this.selectedIndex = this.menuItems.length - 1;
        }

        this.updateMenu();
    }

    if (
        this.keyboard.justPressed("SPACE") ||
        this.keyboard.justPressed("ENTER") ||
        startIsPressed
    ) {
        this.chooseSelected();
    }
};

runmysteriet.scene.LevelComplete.prototype.chooseSelected = function() {
    if (this.levelNumber < this.maxLevel && this.selectedIndex === 0) {
        this.application.scenes.load([
            new runmysteriet.scene.Game(
                this.levelNumber + 1,
                this.totalScore
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