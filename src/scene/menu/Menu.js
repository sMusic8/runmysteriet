/**
 * Representerar huvudmenyn i spelet.
 * 
 * @class
 * @extends rune.scene.Scene
 * 
 * @constructor
 * Initierar menyscenen och dess grundläggande egenskaper såsom UI-element,
 * ljud och inmatningshantering.
 * 
 * @property {?Object} menuList - Lista eller container som innehåller menyalternativ (t.ex. knappar).
 * @property {?Object} menuSound - Ljudeffekt som används vid menyinteraktioner.
 * @property {?Object} m_background - Bakgrundselement eller sprite för menyn.
 * @property {?Object} m_highscoreHud - HUD-element som visar highscore.
 * @property {?Object} backgroundMusic - Bakgrundsmusik som spelas i menyn.
 * @property {?Object} m_gameInput - Hanterar inmatning för menynavigering.
 */
gcc.verbose.runmysteriet.scene.Menu = function() {
    rune.scene.Scene.call(this);

    this.menuList = null;

    this.menuSound = null;
    this.backgroundMusic = null;

    this.m_background = null;
    this.m_controller = null;
    this.m_titleText = null;
    this.m_subtitleText = null;
    this.m_highscoreHud = null;
    this.m_volumeHud = null;

    this.m_gameInput = null;
};

runmysteriet.scene.Menu.prototype = Object.create(rune.scene.Scene.prototype);
runmysteriet.scene.Menu.prototype.constructor = runmysteriet.scene.Menu;
/**
 * Initierar menyscenen.
 * Anropas när scenen startas.
 * @method
 * @memberof runmysteriet.scene.Menu
 * 
 * @returns {void}
 */
runmysteriet.scene.Menu.prototype.init = function() {

    rune.scene.Scene.prototype.init.call(this);


    /**
     * Hanterar spelarens inmatning i menyn.
     * @type {runmysteriet.input.GameInput}
     */
    this.m_gameInput = new runmysteriet.input.GameInput(this.application);

    /**
     * Ljudeffekt för menyinteraktioner.
     * @type {?Object}
     */
    this.menuSound = this.application.sounds.sound.get("sound_menu");

    /**
     * Bakgrundsmusik för menyn.
     * @type {?Object}
     */
    this.backgroundMusic = this.application.sounds.sound.get("sound_musicMenu");

    
    if (this.backgroundMusic) {
            this.backgroundMusic.loop = true;
            this.backgroundMusic.volume = 0.5;
            this.backgroundMusic.play();
        }

    this.createBackground();
    this.createControllerImage();
    this.createTitle();
    this.createHighscoreHud();
    this.createMenuList();
    this.createVolumeHud();
};

//------------------------------------------------------------------------------
// CREATE
//------------------------------------------------------------------------------

runmysteriet.scene.Menu.prototype.createBackground = function() {

    /**
     * Hanterar volym för bakgrundsmusiken.
     * @type {runmysteriet.handler.VolumeHandler}
     */
    this.m_volumeHandler = new runmysteriet.handler.VolumeHandler(null);
    this.m_volumeHandler.setAudio(this.backgroundMusic);

    /**
     * Bakgrundsgrafik för menyn.
     * @type {rune.display.Graphic}
     */
    this.m_background = new rune.display.Graphic(
        0,
        0,
        this.application.screen.width,
        this.application.screen.height,
        "background_menu"
    );

    this.stage.addChild(this.m_background);
};

runmysteriet.scene.Menu.prototype.createControllerImage = function() {

    /**
     * Bild som visar en kontroll (t.ex. handkontroll).
     * @type {rune.display.Graphic}
     */
    this.m_controller = new rune.display.Graphic(
        250,
        110,
        140,
        100,
        "testing"
    );

    this.stage.addChild(this.m_controller);

    /**
     * Huvudtitel i menyn.
     * @type {rune.text.BitmapField}
     */
    var text = new rune.text.BitmapField("Welcome to the Rune Mystery");
    text.autoSize = true;
    text.center = this.application.screen.center;
    text.y -= 70;
    text.x -= 80;
    text.scaleX = 2;
    text.scaleY = 2;
    text.flicker.start(750, 0.5);
    this.stage.addChild(text);
};

runmysteriet.scene.Menu.prototype.createTitle = function() {

    this.m_titleText = new rune.text.BitmapField(
        "Welcome to the Rune Mystery"
    );

    this.m_titleText.autoSize = true;
    this.m_titleText.center = this.application.screen.center;
    this.m_titleText.y -= 70;
    this.m_titleText.x -= 80;
    this.m_titleText.scaleX = 2;
    this.m_titleText.scaleY = 2;
    this.m_titleText.flicker.start(750, 0.5);

    this.stage.addChild(this.m_titleText);

    /**
     * Undertitel/beskrivning i menyn.
     * @type {rune.text.BitmapField}
     */
    this.m_subtitleText = new rune.text.BitmapField(
        "From battle to brain, earn the final word!"
    );

    this.m_subtitleText.autoSize = true;
    this.m_subtitleText.center = this.application.screen.center;
    this.m_subtitleText.y -= 45;
    this.m_subtitleText.x -= 10;
    this.m_subtitleText.flicker.start(750, 0.5);

    this.stage.addChild(this.m_subtitleText);
};

runmysteriet.scene.Menu.prototype.createHighscoreHud = function() {

    this.m_highscoreHud = new runmysteriet.ui.graphic.HighscoreHud(
        this.application,
        5
    );

    this.m_highscoreHud.x = 15;
    this.m_highscoreHud.y = 150;

    this.stage.addChild(this.m_highscoreHud);
};

runmysteriet.scene.Menu.prototype.createMenuList = function() {

    /**
     * Menylista med valbara alternativ.
     * @type {runmysteriet.ui.graphic.MenuList}
     */
    this.menuList = new runmysteriet.ui.graphic.MenuList(
        this.stage,
        this.application,
        ["Play game", "Read more", "Credits"],
        45,
        25,
        1
    );
};

runmysteriet.scene.Menu.prototype.createVolumeHud = function() {

    this.m_volumeHud = new runmysteriet.ui.graphic.VolumeHud(
        this.application,
        this.backgroundMusic
    );

    this.stage.addChild(this.m_volumeHud);
};

runmysteriet.scene.Menu.prototype.createVolumeHud = function() {

    this.m_volumeHud = new runmysteriet.ui.graphic.VolumeHud(
        this.application,
        this.backgroundMusic
    );

    this.stage.addChild(this.m_volumeHud);
};

/**
 * Uppdaterar menyscenen varje frame.
 * 
 * @method
 * @memberof runmysteriet.scene.Menu
 * 
 * @param {number} step - Tidssteg sedan senaste uppdatering.
 * @returns {void}
 */
runmysteriet.scene.Menu.prototype.update = function(step) {

    // Direktstart av spel med F4
    if (this.keyboard && this.keyboard.justPressed("F4")) {

        //Stoppar bakgrundsmusiken om möjligt.
         
        if (this.backgroundMusic && typeof this.backgroundMusic.stop === "function") {
            this.backgroundMusic.stop();
        }

        //Laddar spel-scenen.
         
        this.application.scenes.load([
            new runmysteriet.scene.Game(2)
        ]);

        return;
    }

    // Uppdatera basklass
    rune.scene.Scene.prototype.update.call(this, step);

    /**
     * Referens till tangentbord.
     * @type {?Object}
     */
    var keyboard = this.keyboard;

    /**
     * Första anslutna gamepad.
     * @type {?Object}
     */
    var gamepad = this.gamepads.get(0);

    //Uppdaterar volym baserat på spelarens input.
    if (this.m_volumeHandler) {
        this.m_volumeHandler.update(
            this.m_gameInput.read(this.keyboard),
            this.gamepads.get(0),
            this.keyboard
        );
    }

    //Säkerställer att meny och input finns innan hantering.
     
    if (!this.menuList || !this.m_gameInput) {
        return;
    }

    /**
     * Läser spelarens input (t.ex. upp/ner/välj).
     * @type {{up: boolean, down: boolean, choose: boolean}}
     */
    var input = this.m_gameInput.read(this.keyboard);

    // Navigera nedåt i menyn
    if (input.down) {
        this.playMenuSound();
        this.menuList.moveNext();
        return;
    }

    // Navigera uppåt i menyn
    if (input.up) {
        this.playMenuSound();
        this.menuList.movePrevious();
        return;
    }

    // Välj aktuellt alternativ
    if (input.choose) {
        this.chooseSelected();
    }
};
/**
 * Hanterar val av markerat menyobjekt.
 * 
 * @method
 * @memberof runmysteriet.scene.Menu
 * 
 * @returns {void}
 */

runmysteriet.scene.Menu.prototype.handleVolumeInput = function(input) {

    var stepVol = 0.1;

    if (!input || !this.backgroundMusic) {
        return;
    }

    if (input.volumeUp) {
        this.backgroundMusic.volume += stepVol;

        if (this.backgroundMusic.volume > 1) {
            this.backgroundMusic.volume = 0;
        }

        this.updateVolumeHud();
        return;
    }

    if (input.volumeDown) {
        this.backgroundMusic.volume -= stepVol;

        if (this.backgroundMusic.volume < 0) {
            this.backgroundMusic.volume = 1;
        }

        this.updateVolumeHud();
    }
};

runmysteriet.scene.Menu.prototype.updateVolumeHud = function() {

    if (
        this.m_volumeHud &&
        typeof this.m_volumeHud.updateText === "function"
    ) {
        this.m_volumeHud.updateText();
    }
};

//------------------------------------------------------------------------------
// CHOOSE
//------------------------------------------------------------------------------

runmysteriet.scene.Menu.prototype.chooseSelected = function() {

    var selectedIndex = 0;

    if (!this.menuList) {
        return;
    }

    selectedIndex = this.menuList.getSelectedIndex();

    this.stopBackgroundMusic();

    if (selectedIndex === 0) {
        this.application.scenes.load([
            new runmysteriet.scene.AvatarSelect()
        ]);
        return;
    }

    if (selectedIndex === 1) {
        this.application.scenes.load([
            new runmysteriet.scene.More()
        ]);
        return;
    }

    if (selectedIndex === 2) {
        this.application.scenes.load([
            new runmysteriet.scene.Credits()
        ]);
    }
};

/**
 * Spelar upp meny-ljudet vid klick om det finns tillgänligt.
 * 
 * @method
 * @memberof runmysteriet.scene.Menu
 * 
 * @returns {void}
 */
runmysteriet.scene.Menu.prototype.playMenuSound = function() {

    if (this.menuSound && typeof this.menuSound.play === "function") {
        this.menuSound.play();
    }
};

runmysteriet.scene.Menu.prototype.stopBackgroundMusic = function() {

    if (
        this.backgroundMusic &&
        this.backgroundMusic.m_source &&
        this.backgroundMusic.m_source.mediaElement
    ) {
        this.backgroundMusic.m_source.mediaElement.pause();
    }
};

//------------------------------------------------------------------------------
// REMOVE DISPLAY OBJECT
//------------------------------------------------------------------------------

/**
 * Tar bort display object från stage.
 *
 * @param {?Object} object
 * @return {void}
 */
runmysteriet.scene.Menu.prototype.removeDisplayObject = function(object) {

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

/**
 * Rensar och frigör resurser för menyscenen.
 * 
 * Tar bort och nollställer objekt som används i menyn för att undvika minnesläckor.
 * 
 * @method
 * @memberof runmysteriet.scene.Menu
 * 
 * @returns {void}
 */
runmysteriet.scene.Menu.prototype.dispose = function() {

    this.stopBackgroundMusic();

    if (this.menuList) {
        if (typeof this.menuList.dispose === "function") {
            this.menuList.dispose();
        } else if (typeof this.menuList.clear === "function") {
            this.menuList.clear();
        }
    }

    this.removeDisplayObject(this.m_volumeHud);
    this.removeDisplayObject(this.m_highscoreHud);
    this.removeDisplayObject(this.m_subtitleText);
    this.removeDisplayObject(this.m_titleText);
    this.removeDisplayObject(this.m_controller);
    this.removeDisplayObject(this.m_background);

    this.menuList = null;

    this.m_volumeHud = null;
    this.m_highscoreHud = null;
    this.m_subtitleText = null;
    this.m_titleText = null;
    this.m_controller = null;
    this.m_background = null;

    this.menuSound = null;
    this.backgroundMusic = null;
    this.m_gameInput = null;

    rune.scene.Scene.prototype.dispose.call(this);
};