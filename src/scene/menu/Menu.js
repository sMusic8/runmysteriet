//------------------------------------------------------------------------------
// MENU SCENE
//------------------------------------------------------------------------------

runmysteriet.scene.Menu = function() {

    rune.scene.Scene.call(this);

    this.menuList = null;
    this.menuSound = null;
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

    var text = new rune.text.BitmapField("Valkommen till runmysteriet!");
    text.autoSize = true;
    text.center = this.application.screen.center;
    text.y -= 40;
    text.flicker.start(750, 0.5);
    this.stage.addChild(text);

    var text2 = new rune.text.BitmapField(
        "From battle to brain, earn the final word!"
    );
    text2.autoSize = true;
    text2.center = this.application.screen.center;
    text2.y -= 20;
    text2.scale = 0.8;
    text2.flicker.start(750, 0.5);
    this.stage.addChild(text2);

    this.menuList = new runmysteriet.ui.graphic.MenuList(
        this.stage,
        this.application,
        ["Starta spelet", "Las mer", "Credits"],
        40,
        15,
        0.8
    );
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
        new runmysteriet.scene.TextInputView(function() {

            return "Anvand pilar for att valja bokstav. SPACE = lagg till";        })
    ]);

}
    else if (selectedIndex === 1) {

        this.application.scenes.load([
            new runmysteriet.scene.More()
        ]);
    }
    else if (selectedIndex === 2) {

        this.application.scenes.load([
            new runmysteriet.scene.Credits()
        ]);
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

    rune.scene.Scene.prototype.dispose.call(this);
};