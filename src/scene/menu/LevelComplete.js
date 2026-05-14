/**
 * Level complete scene.
 *
 * @constructor
 * @extends {rune.scene.Scene}
 * @param {number=} levelNumber
 * @param {number=} totalScore
 * @param {number=} earnedScore
 * @param {string=} playerName
 */
runmysteriet.scene.LevelComplete = function(levelNumber, totalScore, earnedScore, playerName) {

    rune.scene.Scene.call(this);

    /** @type {number} */
    this.levelNumber = levelNumber || 1;

    /** @type {number} */
    this.totalScore = totalScore || 0;

    /** @type {number} */
    this.earnedScore = earnedScore || 0;

    /** @type {string} */
    this.playerName = playerName || "PLAYER";

    /** @type {!runmysteriet.config.LevelConfig} */
    this.levelConfig = new runmysteriet.config.LevelConfig(this.levelNumber);

    /** @type {number} */
    this.maxLevel = this.levelConfig.getMaxLevel();

    /** @type {!Array<!rune.text.BitmapField>} */
    this.menuItems = [];

    /** @type {number} */
    this.selectedIndex = 0;

    /** @type {?Object} */
    this.menuSound = null;

    /** @type {boolean} */
    this.m_hasSavedHighscore = false;
};

//------------------------------------------------------------------------------
// INHERITANCE
//------------------------------------------------------------------------------

runmysteriet.scene.LevelComplete.prototype = Object.create(rune.scene.Scene.prototype);
runmysteriet.scene.LevelComplete.prototype.constructor = runmysteriet.scene.LevelComplete;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

/**
 * Initializes level complete scene.
 *
 * @return {void}
 */
runmysteriet.scene.LevelComplete.prototype.init = function() {

    var titleText = "LEVEL " + this.levelNumber + " KLAR";
    var title = null;
    var earned = null;
    var total = null;
    var nameText = null;
    var savedText = null;

    rune.scene.Scene.prototype.init.call(this);

    this.menuSound = this.application.sounds.sound.get("sound_menu");
     this.backgroundMusic = this.application.sounds.sound.get("sound_musicMenu");
  if (this.backgroundMusic) {
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.5;
    this.backgroundMusic.play();
  }

  //If gamepad eller kaybord justpresst ändra nummret på volume med ett steg i en loop

    if (this.levelNumber >= this.maxLevel) {
        titleText = "DU VANN HELA SPELET";
    }

    title = new rune.text.BitmapField(titleText);
    title.autoSize = true;
    title.center = this.application.screen.center;
    title.y -= 75;
    this.stage.addChild(title);

    nameText = new rune.text.BitmapField("NAMN " + this.playerName);
    nameText.autoSize = true;
    nameText.center = this.application.screen.center;
    nameText.y -= 50;
    nameText.scale = 0.75;
    this.stage.addChild(nameText);

    earned = new rune.text.BitmapField(
        "TIDSPOANG +" + this.earnedScore
    );
    earned.autoSize = true;
    earned.center = this.application.screen.center;
    earned.y -= 25;
    earned.scale = 0.8;
    this.stage.addChild(earned);

    total = new rune.text.BitmapField(
        "TOTAL POANG " + this.totalScore
    );
    total.autoSize = true;
    total.center = this.application.screen.center;
    total.y -= 5;
    total.scale = 0.8;
    this.stage.addChild(total);

    if (this.saveHighscore() >= 0) {
        savedText = new rune.text.BitmapField("HIGHSCORE SPARAD");
    } else {
        savedText = new rune.text.BitmapField("HIGHSCORE OFORANDRAD");
    }

    savedText.autoSize = true;
    savedText.center = this.application.screen.center;
    savedText.y += 18;
    savedText.scale = 0.7;
    this.stage.addChild(savedText);

    this.createMenu();
    this.updateMenu();
};

//------------------------------------------------------------------------------
// HIGHSCORE
//------------------------------------------------------------------------------

/**
 * Sparar totalpoängen när spelaren klarat en level.
 *
 * @return {number}
 */
runmysteriet.scene.LevelComplete.prototype.saveHighscore = function() {

    var entry = null;
    var manager = null;

    if (this.m_hasSavedHighscore === true) {
        return -1;
    }

    this.m_hasSavedHighscore = true;

    entry = new runmysteriet.logic.HighscoreEntry(
        this.playerName,
        this.totalScore
    );

    manager = new runmysteriet.logic.HighscoreManager(this.application);

    return manager.save(entry);
};

//------------------------------------------------------------------------------
// MENU
//------------------------------------------------------------------------------

/**
 * Creates menu items.
 *
 * @return {void}
 */
runmysteriet.scene.LevelComplete.prototype.createMenu = function() {

    var labels = [];
    var item = null;
    var i = 0;

    if (this.levelNumber < this.maxLevel) {
        labels = ["NASTA LEVEL", "TILLBAKA TILL STARTMENY"];
    } else {
        labels = ["TILLBAKA TILL STARTMENY"];
    }

    for (i = 0; i < labels.length; i++) {

        item = new rune.text.BitmapField(labels[i]);
        item.autoSize = true;
        item.center = this.application.screen.center;
        item.y += 50 + i * 20;
        item.scale = 0.8;

        this.stage.addChild(item);
        this.menuItems.push(item);
    }
};

/**
 * Updates menu selection visuals.
 *
 * @return {void}
 */
runmysteriet.scene.LevelComplete.prototype.updateMenu = function() {

    var item = null;
    var text = "";
    var i = 0;

    for (i = 0; i < this.menuItems.length; i++) {

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

/**
 * Updates scene logic.
 *
 * @param {number} step Fixed time step.
 * @return {void}
 */
runmysteriet.scene.LevelComplete.prototype.update = function(step) {

    rune.scene.Scene.prototype.update.call(this, step);

    var gamepad = null;
    var startIsPressed = false;
    var downIsPressed = false;
    var upIsPressed = false;

    if (this.application &&
        this.application.inputs &&
        this.application.inputs.gamepads) {

        gamepad = this.application.inputs.gamepads.get(0);
    }

    if (gamepad && typeof gamepad.justPressed === "function") {

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

    if (this.keyboard.justPressed("DOWN") || downIsPressed) {

        if (this.menuSound) this.menuSound.play();

        this.selectedIndex++;

        if (this.selectedIndex >= this.menuItems.length) {
            this.selectedIndex = 0;
        }

        this.updateMenu();
    }

    if (this.keyboard.justPressed("UP") || upIsPressed) {

        if (this.menuSound) this.menuSound.play();

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

//------------------------------------------------------------------------------
// CHOOSE
//------------------------------------------------------------------------------

/**
 * Handles selection.
 *
 * @return {void}
 */
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

/**
 * Cleans up scene.
 *
 * @return {void}
 */
runmysteriet.scene.LevelComplete.prototype.dispose = function() {

    rune.scene.Scene.prototype.dispose.call(this);
};