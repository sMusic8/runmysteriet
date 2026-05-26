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
    this.m_background = null;
    this.m_highscoreHud = null;

    this.backgroundMusic = null;
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

    /**
     * Undertitel/beskrivning i menyn.
     * @type {rune.text.BitmapField}
     */
    var text2 = new rune.text.BitmapField(
        "From battle to brain, earn the final word!"
    );

    text2.autoSize = true;
    text2.center = this.application.screen.center;
    text2.y -= 45;
    text2.x -= 10;
    text2.flicker.start(750, 0.5);
    this.stage.addChild(text2);

    /**
     * HUD som visar highscores.
     * @type {runmysteriet.ui.graphic.HighscoreHud}
     */
    this.m_highscoreHud = new runmysteriet.ui.graphic.HighscoreHud(
        this.application,
        5
    );

    this.m_highscoreHud.x = 15;
    this.m_highscoreHud.y = 150;

    this.stage.addChild(this.m_highscoreHud);

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
    }

    // Navigera uppåt i menyn
    if (input.up) {
        this.playMenuSound();
        this.menuList.movePrevious();
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

/**
 * Spelar upp meny-ljudet vid klick om det finns tillgänligt.
 * 
 * @method
 * @memberof runmysteriet.scene.Menu
 * 
 * @returns {void}
 */
runmysteriet.scene.Menu.prototype.playMenuSound = function() {
    if (this.menuSound) {
        this.menuSound.play();
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

    if (this.menuList) {
        this.menuList.clear();
        this.menuList = null;
    }

    this.m_highscoreHud = null;
    this.m_background = null;
    this.m_gameInput = null;

    rune.scene.Scene.prototype.dispose.call(this);
};