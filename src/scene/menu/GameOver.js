//------------------------------------------------------------------------------
// GAME OVER SCENE
//------------------------------------------------------------------------------

runmysteriet.scene.GameOver = function(playerName, score, reason) {

    rune.scene.Scene.call(this);

    this.m_playerName = playerName || "PLAYER";
    this.m_score = score || 0;
    this.m_reason = reason || "GAME OVER";

    this.m_title = null;
    this.m_scoreText = null;
    this.m_highscoreHud = null;
    this.m_menu = null;

    this.m_menuSound = null;

    // MUSIC (added for volume control)
    this.backgroundMusic = null;
};

//------------------------------------------------------------------------------
// INHERITANCE
//------------------------------------------------------------------------------

runmysteriet.scene.GameOver.prototype =
    Object.create(rune.scene.Scene.prototype);

runmysteriet.scene.GameOver.prototype.constructor =
    runmysteriet.scene.GameOver;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.scene.GameOver.prototype.init = function() {

    rune.scene.Scene.prototype.init.call(this);

    this.m_menuSound = this.application.sounds.sound.get("sound_menu");

    // MUSIC (same pattern as other scenes)
    this.backgroundMusic = this.application.sounds.sound.get("sound_musicMenu");

    if (this.backgroundMusic) {
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.3;
        this.backgroundMusic.play();
    }

    this.createTitle();
    this.createScoreText();
    this.createMenu();
    this.createHighscoreHud();
    this.positionMenu();
};

//------------------------------------------------------------------------------
// CREATE
//------------------------------------------------------------------------------

runmysteriet.scene.GameOver.prototype.createTitle = function() {

    this.m_title = new rune.text.BitmapField("GAME OVER");
    this.m_title.autoSize = true;
    this.m_title.scaleX = 1.5;
    this.m_title.scaleY = 1.5;
    this.m_title.center = this.application.screen.center;
    this.m_title.y = 35;

    this.stage.addChild(this.m_title);
};

runmysteriet.scene.GameOver.prototype.createScoreText = function() {

    this.m_scoreText = new rune.text.BitmapField(
        "SCORE: " + this.m_score
    );

    this.m_scoreText.autoSize = true;
    this.m_scoreText.center = this.application.screen.center;
    this.m_scoreText.y = 55; 

    this.stage.addChild(this.m_scoreText);
};

runmysteriet.scene.GameOver.prototype.createMenu = function() {

    this.m_menu = new runmysteriet.ui.graphic.MenuList(
        this.stage,
        this.application,
        ["START NEW GAME", "BACK TO MENU"],
        155,
        22,
        1
    );
};

runmysteriet.scene.GameOver.prototype.createHighscoreHud = function() {

    this.m_highscoreHud = new runmysteriet.ui.graphic.HighscoreHud(
        this.application,
        5
    );

    this.m_highscoreHud.x = 15;
    this.m_highscoreHud.y = 140;

    this.stage.addChild(this.m_highscoreHud);
};

runmysteriet.scene.GameOver.prototype.positionMenu = function() {

    var camera = this.cameras.getCameraAt(0);

    if (!this.m_menu) {
        return;
    }

    if (this.m_menu.setCameraPosition && camera) {
        this.m_menu.setCameraPosition(camera, 155, 95);
        return;
    }

    this.m_menu.x = 155;
    this.m_menu.y = 95;
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

runmysteriet.scene.GameOver.prototype.update = function(step) {

    rune.scene.Scene.prototype.update.call(this, step);

    this.handleInput();

    // -------------------------------------------------
    // VOLUME CONTROL (same as other scenes)
    // -------------------------------------------------
    if (this.backgroundMusic) {

        var keyboard = this.keyboard;
        var gamepad = this.application.inputs.gamepads.get(0);

        var stepVol = 0.1;

        if (keyboard.justPressed("E") || (gamepad && gamepad.justPressed(5))) {

            this.backgroundMusic.volume += stepVol;

            if (this.backgroundMusic.volume > 1) {
                this.backgroundMusic.volume = 0;
            }

            console.log("Volym:", this.backgroundMusic.volume.toFixed(2));
        }

        if (keyboard.justPressed("Q") || (gamepad && gamepad.justPressed(4))) {

            this.backgroundMusic.volume -= stepVol;

            if (this.backgroundMusic.volume < 0) {
                this.backgroundMusic.volume = 1;
            }

            console.log("Volym:", this.backgroundMusic.volume.toFixed(2));
        }
    }
};

//------------------------------------------------------------------------------
// INPUT
//------------------------------------------------------------------------------

runmysteriet.scene.GameOver.prototype.handleInput = function() {

    if (!this.m_menu) {
        return;
    }

    if (this.keyboard.justPressed("DOWN")) {
        this.playMenuSound();
        this.m_menu.moveNext();
    }

    if (this.keyboard.justPressed("UP")) {
        this.playMenuSound();
        this.m_menu.movePrevious();
    }

    if (this.keyboard.justPressed("ENTER") ||
        this.keyboard.justPressed("SPACE")) {

        this.chooseMenuItem();
    }
};

runmysteriet.scene.GameOver.prototype.chooseMenuItem = function() {

    var selectedIndex = 0;

    if (!this.m_menu) {
        return;
    }

    selectedIndex = this.m_menu.getSelectedIndex();

    if (selectedIndex === 0) {
        this.application.scenes.load([
            new runmysteriet.scene.Game(1, 0, this.m_playerName)
        ]);
    } else if (selectedIndex === 1) {
        this.application.scenes.load([
            new runmysteriet.scene.Menu()
        ]);
    }
};

runmysteriet.scene.GameOver.prototype.playMenuSound = function() {

    if (this.m_menuSound) {
        this.m_menuSound.play();
    }
};