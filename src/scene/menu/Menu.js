runmysteriet.scene.Menu = function() {
    rune.scene.Scene.call(this);

    this.menuList = null;
    this.menuSound = null;
    this.m_background = null;
    this.m_highscoreHud = null;

    this.backgroundMusic = null;
    this.m_gameInput = null;
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
    this.m_gameInput = new runmysteriet.input.GameInput(this.application);

    this.menuSound = this.application.sounds.sound.get("sound_menu");
    this.backgroundMusic = this.application.sounds.sound.get("sound_musicMenu");
if (this.backgroundMusic) {
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.5;
    this.backgroundMusic.play();
}

// ✅ LÄGG IN HÄR
this.m_volumeHandler = new runmysteriet.handler.VolumeHandler(null);
this.m_volumeHandler.setAudio(this.backgroundMusic);

    // BACKGROUND
    this.m_background = new rune.display.Graphic(
        0,
        0,
        this.application.screen.width,
        this.application.screen.height,
        "background_menu"
    );

    this.stage.addChild(this.m_background);

    // CONTROLLER IMAGE
    this.m_controller = new rune.display.Graphic(
        250,
        110,
        140,
        100,
        "testing"
    );

    this.stage.addChild(this.m_controller);

    // TITLE TEXT
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

    // HIGHSCORE HUD
    this.m_highscoreHud = new runmysteriet.ui.graphic.HighscoreHud(
        this.application,
        5
    );

    this.m_highscoreHud.x = 15;
    this.m_highscoreHud.y = 150;

    this.stage.addChild(this.m_highscoreHud);

    // MENU LIST
    this.menuList = new runmysteriet.ui.graphic.MenuList(
        this.stage,
        this.application,
        ["Play game", "Read more", "Credits"],
        45,
        25,
        1
    );
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

runmysteriet.scene.Menu.prototype.update = function(step) {

if (this.keyboard && this.keyboard.justPressed("F4")) {

    if (this.backgroundMusic && typeof this.backgroundMusic.stop === "function") {
        this.backgroundMusic.stop();
    }

    this.application.scenes.load([
        new runmysteriet.scene.Game(2)
    ]);

    return;
}

    rune.scene.Scene.prototype.update.call(this, step);

    var keyboard = this.keyboard;
    var gamepad = this.gamepads.get(0);


if (this.m_volumeHandler) {

    this.m_volumeHandler.update(
        this.m_gameInput.read(this.keyboard),
        this.gamepads.get(0),
        this.keyboard
    );
}

    // ----------------------------
    // MENU INPUT
    // ----------------------------

    if (!this.menuList || !this.m_gameInput) {
        return;
    }

    var input = this.m_gameInput.read(this.keyboard);

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
            new runmysteriet.scene.AvatarSelect()
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
    this.m_gameInput = null;

    rune.scene.Scene.prototype.dispose.call(this);
};