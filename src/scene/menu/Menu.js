//------------------------------------------------------------------------------
// MENU SCENE
//------------------------------------------------------------------------------

runmysteriet.scene.Menu = function() {
    rune.scene.Scene.call(this);

    this.menuList = null;
    this.menuSound = null;
    this.m_background = null;
    this.m_highscoreHud = null;
};

//------------------------------------------------------------------------------
// INHERITANCE
//------------------------------------------------------------------------------

runmysteriet.scene.Menu.prototype = Object.create(rune.scene.Scene.prototype);
runmysteriet.scene.Menu.prototype.constructor = runmysteriet.scene.Menu;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.scene.Menu.prototype.init = function() {
    rune.scene.Scene.prototype.init.call(this);

    this.menuSound = this.application.sounds.sound.get("sound_menu");

    this.m_background = new rune.display.Graphic(
        0,
        0,
        this.application.screen.width,
        this.application.screen.height,
        "background_menu"
    );

    this.stage.addChild(this.m_background);

 this.m_controller = new rune.display.Graphic(
        250,
        110,
        128,
        100,
        "testing"
    );
this.m_controller.rotation = 0;

    this.stage.addChild(this.m_controller);
   
    var text = new rune.text.BitmapField("Welcome to the Rune Mystery");
    text.autoSize = true;
    text.center = this.application.screen.center;
    text.y -= 70;
    text.x -= 80;
    text.scaleX = 2;
    text.scaleY = 2;
    text.flicker.start(750, 0.5);
    this.stage.addChild(text);

    var text2 = new rune.text.BitmapField(
        "From battle to brain, earn the final word!"
    );

    text2.autoSize = true;
    text2.center = this.application.screen.center;
    text2.y -= 45;
    text2.x -= 10;
    text2.flicker.start(750, 0.5);
    this.stage.addChild(text2);

    this.m_highscoreHud = new runmysteriet.ui.graphic.HighscoreHud(this.application);
    this.m_highscoreHud.center = this.application.screen.center;
    this.m_highscoreHud.y -= 18;
    this.m_highscoreHud.scale = 0.8;
    this.stage.addChild(this.m_highscoreHud);

    this.menuList = new runmysteriet.ui.graphic.MenuList(
        this.stage,
        this.application,
        ["Play game", "Read more", "Credits"],
        40,
        15,
        1
    );

    this.menuList.scaleX = 2.5;
    this.menuList.scaleY = 2.5;
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

runmysteriet.scene.Menu.prototype.update = function(step) {
    rune.scene.Scene.prototype.update.call(this, step);

    if (!this.menuList || typeof this.menuList.readInput !== "function") {
        return;
    }

    var input = this.menuList.readInput(this.keyboard);

    if (input.down) {
        this.playMenuSound();
        this.menuList.moveNext();
    }

    if (input.up) {
        this.playMenuSound();
        this.menuList.movePrevious();
    }

    if (input.choose) {
        this.chooseSelected();
    }
};

//------------------------------------------------------------------------------
// CHOOSE
//------------------------------------------------------------------------------

runmysteriet.scene.Menu.prototype.chooseSelected = function() {
    var selectedIndex = this.menuList.getSelectedIndex();

    if (selectedIndex === 0) {
        this.application.scenes.load([
            new runmysteriet.scene.TextInputView()
        ]);
    } else if (selectedIndex === 1) {
        this.application.scenes.load([new runmysteriet.scene.More()]);
    } else if (selectedIndex === 2) {
        this.application.scenes.load([new runmysteriet.scene.Credits()]);
    }
};

//------------------------------------------------------------------------------
// SOUND
//------------------------------------------------------------------------------

runmysteriet.scene.Menu.prototype.playMenuSound = function() {
    if (this.menuSound) {
        this.menuSound.play();
    }
};

//------------------------------------------------------------------------------
// DISPOSE
//------------------------------------------------------------------------------

runmysteriet.scene.Menu.prototype.dispose = function() {
    if (this.menuList) {
        this.menuList.clear();
        this.menuList = null;
    }

    this.m_highscoreHud = null;
    this.m_background = null;

    rune.scene.Scene.prototype.dispose.call(this);
};
