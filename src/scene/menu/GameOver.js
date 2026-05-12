//------------------------------------------------------------------------------
// GAME OVER
//------------------------------------------------------------------------------

/**
 * Game over scene.
 *
 * @constructor
 * @extends rune.scene.Scene
 * @param {string=} playerName
 * @param {number=} score
 */
runmysteriet.scene.GameOver = function(playerName, score) {

    rune.scene.Scene.call(this);

    this.m_playerName = playerName || "PLAYER";
    this.m_score = score || 0;

    this.m_gameInput = null;
    this.m_menuItems = [];
    this.m_selectedIndex = 0;
};

runmysteriet.scene.GameOver.prototype = Object.create(rune.scene.Scene.prototype);
runmysteriet.scene.GameOver.prototype.constructor = runmysteriet.scene.GameOver;

runmysteriet.scene.GameOver.prototype.init = function() {

    rune.scene.Scene.prototype.init.call(this);

    this.m_gameInput = new runmysteriet.input.GameInput(this.application);

    this.createText();
    this.createMenu();
    this.updateMenu();
};

runmysteriet.scene.GameOver.prototype.createText = function() {

    var title = new rune.text.BitmapField("GAME OVER");
    title.autoSize = true;
    title.center = this.application.screen.center;
    title.y -= 70;
    this.stage.addChild(title);

    var scoreText = new rune.text.BitmapField(
        this.m_playerName + " SCORE " + this.m_score
    );
    scoreText.autoSize = true;
    scoreText.center = this.application.screen.center;
    scoreText.y -= 35;
    scoreText.scale = 0.8;
    this.stage.addChild(scoreText);
};

runmysteriet.scene.GameOver.prototype.createMenu = function() {

    var labels = ["STARTA OM", "TILL STARTMENY"];
    var item = null;
    var i = 0;

    for (i = 0; i < labels.length; i++) {
        item = new rune.text.BitmapField(labels[i]);
        item.autoSize = true;
        item.center = this.application.screen.center;
        item.y += 25 + i * 25;
        item.scale = 0.8;

        this.stage.addChild(item);
        this.m_menuItems.push(item);
    }
};

runmysteriet.scene.GameOver.prototype.update = function(step) {

    var input = null;

    rune.scene.Scene.prototype.update.call(this, step);

    input = this.m_gameInput.read(this.keyboard);

    if (input.down) {
        this.m_selectedIndex++;

        if (this.m_selectedIndex >= this.m_menuItems.length) {
            this.m_selectedIndex = 0;
        }

        this.updateMenu();
    }

    if (input.up) {
        this.m_selectedIndex--;

        if (this.m_selectedIndex < 0) {
            this.m_selectedIndex = this.m_menuItems.length - 1;
        }

        this.updateMenu();
    }

    if (input.choose) {
        this.chooseSelected();
    }
};

runmysteriet.scene.GameOver.prototype.updateMenu = function() {

    var item = null;
    var text = "";
    var i = 0;

    for (i = 0; i < this.m_menuItems.length; i++) {
        item = this.m_menuItems[i];
        text = item.text.replace("> ", "");

        if (i === this.m_selectedIndex) {
            item.text = "> " + text;
        } else {
            item.text = text;
        }
    }
};

runmysteriet.scene.GameOver.prototype.chooseSelected = function() {

    if (this.m_selectedIndex === 0) {
        this.application.scenes.load([
            new runmysteriet.scene.Game(
                1,
                0,
                this.m_playerName
            )
        ]);
        return;
    }

    this.application.scenes.load([
        new runmysteriet.scene.Menu()
    ]);
};
