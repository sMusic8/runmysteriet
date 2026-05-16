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

    /*
     * Titel.
     */
    this.m_title = new rune.text.BitmapField(this.m_reason);
    this.m_title.autoSize = true;
    this.m_title.center = this.application.screen.center;
    this.m_title.y = 45;

    this.stage.addChild(this.m_title);

    /*
     * Spelarens score.
     */
    this.m_scoreText = new rune.text.BitmapField(
        "SCORE: " + this.m_score
    );

    this.m_scoreText.autoSize = true;
    this.m_scoreText.center = this.application.screen.center;
    this.m_scoreText.y = 75;

    this.stage.addChild(this.m_scoreText);

    /*
     * Top 5 highscore.
     */
    this.m_highscoreHud = new runmysteriet.ui.graphic.HighscoreHud(
        this.application,
        5
    );

    this.m_highscoreHud.x = 15;
    this.m_highscoreHud.y = 105;

    this.stage.addChild(this.m_highscoreHud);

    /*
     * Meny.
     */
    this.m_menu = new runmysteriet.ui.graphic.MenuList(
        this.stage,
        this.application,
        ["START NEW GAME", "MAIN MENU"],
        135,
        22,
        1
    );
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

runmysteriet.scene.GameOver.prototype.update = function(step) {

    rune.scene.Scene.prototype.update.call(this, step);

    this.handleInput();
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