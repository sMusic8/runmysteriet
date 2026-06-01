/**
 * Representerar huvudmenyn i spelet.
 * 
 * @class
 * @extends rune.scene.Scene
 * 
 * @constructor
 * 
 * @property {?Object} menuList - Hanterar menyalternativ och navigation i menyn.
 * @property {?Object} menuSound - Ljudeffekt som spelas vid menyinteraktioner.
 * @property {?Object} backgroundMusic - Bakgrundsmusik som spelas i menyn.
 * @property {?Object} m_background - Bakgrundsgrafik för menyn.
 * @property {?Object} m_controller - Grafisk indikator för kontroller/instruktioner.
 * @property {?Object} m_titleText - Huvudtitel i menyn.
 * @property {?Object} m_subtitleText - Undertitel eller beskrivningstext i menyn.
 * @property {?Object} m_highscoreHud - HUD som visar highscore.
 * @property {?Object} m_volumeHud - HUD för volymkontroll.
 * @property {?Object} m_gameInput - Hanterar input för meny-navigering.
 */
runmysteriet.scene.Menu = function() {

    rune.scene.Scene.call(this);

    this.menuList = null;
    this.m_highscoreBox = null;
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

    this.m_gameInput = new runmysteriet.input.GameInput(this.application);

    this.menuSound = this.application.sounds.sound.get("sound_menu");
    this.backgroundMusic = this.application.sounds.sound.get("sound_musicMenu");

    if (this.backgroundMusic) {
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.5;
        this.backgroundMusic.play();
    }

    this.createBackground();
    this.createControllerImage();
    this.createTitle();
    this.createHighscoreBox();
    this.createHighscoreHud();
    this.createMenuList();
    this.createVolumeHud();
};


/**
 * Skapar och lägger till bakgrunden för huvudmenyn.
 * 
 * @method
 * @memberof runmysteriet.scene.Menu
 * 
 * @returns {void}
 */
runmysteriet.scene.Menu.prototype.createBackground = function() {

    this.m_background = new rune.display.Graphic(
        0,
        0,
        this.application.screen.width,
        this.application.screen.height,
        "background_menu"
    );

    this.stage.addChild(this.m_background);
};

/**
 * Skapar och lägger till en grafisk bild för kontroller i menyn.
 * 
 * @method
 * @memberof runmysteriet.scene.Menu
 * 
 * @returns {void}
 */
runmysteriet.scene.Menu.prototype.createControllerImage = function() {

    this.m_controller = new rune.display.Graphic(
        250,
        110,
        140,
        100,
        "testing"
    );

    this.stage.addChild(this.m_controller);
};
/**
 * Skapar titel och undertitel i huvudmenyn.
 * 
 * @method
 * @memberof runmysteriet.scene.Menu
 * 
 * @returns {void}
 */
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
/**
 * Skapar en mörk transparent ruta bakom highscore-listan.
 *
 * @method
 * @memberof runmysteriet.scene.Menu
 *
 * @return {void}
 */
runmysteriet.scene.Menu.prototype.createHighscoreBox = function() {

    this.m_highscoreBox = new rune.display.Graphic(
        10,
        145,
        145,
        70
    );

    this.m_highscoreBox.backgroundColor = "#000000";
    this.m_highscoreBox.alpha = 0.5;

    this.stage.addChild(this.m_highscoreBox);
};

  /**
     * HUD som visar highscores.
     * @type {runmysteriet.ui.graphic.HighscoreHud}
     */
runmysteriet.scene.Menu.prototype.createHighscoreHud = function() {

    this.m_highscoreHud = new runmysteriet.ui.graphic.HighscoreHud(
        this.application,
        5
    );

    this.m_highscoreHud.x = 15;
    this.m_highscoreHud.y = 148;

    this.stage.addChild(this.m_highscoreHud);
};
 /**
     * Menylista med valbara alternativ.
     * @type {runmysteriet.ui.graphic.MenuList}
     */
runmysteriet.scene.Menu.prototype.createMenuList = function() {

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
 * Skapar och lägger till volym-HUD i huvudmenyn.
 * 
 * @method
 * @memberof runmysteriet.scene.Menu
 * 
 * @returns {void}
 */
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

    var input = null;

    rune.scene.Scene.prototype.update.call(this, step);

    if (!this.m_gameInput || !this.menuList) {
        return;
    }

    input = this.m_gameInput.read(this.keyboard);

    this.handleVolumeInput(input);
    this.handleMenuInput(input);
};

/**
 * Hanterar inmatning för menynavigering.
 * 
 * @method
 * @memberof runmysteriet.scene.Menu
 * 
 * @param {Object} input - Objekt som innehåller spelarens inmatning (upp, ner, välj).
 * @returns {void}
 */
runmysteriet.scene.Menu.prototype.handleMenuInput = function(input) {

    if (!input) {
        return;
    }

    if (input.down) {
        this.playMenuSound();
        this.menuList.moveNext();
        return;
    }

    if (input.up) {
        this.playMenuSound();
        this.menuList.movePrevious();
        return;
    }

    if (input.choose) {
        this.chooseSelected();
    }
};
/**
 * Hanterar volymkontroll via inmatning.
 * 
 * @method
 * @memberof runmysteriet.scene.Menu
 * 
 * @param {Object} input - Objekt som innehåller spelarens inmatning (volym upp/ner).
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

/**
 * Uppdaterar volym-HUD:ens text/visning.
 * 
 * Anropar HUD:ens `updateText`-funktion om den finns, för att
 * spegla aktuell volymnivå i UI:t.
 * 
 * @method
 * @memberof runmysteriet.scene.Menu
 * 
 * @returns {void}
 */
runmysteriet.scene.Menu.prototype.updateVolumeHud = function() {

    if (
        this.m_volumeHud &&
        typeof this.m_volumeHud.updateText === "function"
    ) {
        this.m_volumeHud.updateText();
    }
};

/**
 * Hanterar val av markerat menyval.
 * 
 * @method
 * @memberof runmysteriet.scene.Menu
 * 
 * @returns {void}
 */
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
 * Spelar upp meny-ljudet.
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

/**
 * Stoppar bakgrundsmusiken i huvudmenyn.
 * 
 * @method
 * @memberof runmysteriet.scene.Menu
 * 
 * @returns {void}
 */
runmysteriet.scene.Menu.prototype.stopBackgroundMusic = function() {

    if (
        this.backgroundMusic &&
        this.backgroundMusic.m_source &&
        this.backgroundMusic.m_source.mediaElement
    ) {
        this.backgroundMusic.m_source.mediaElement.pause();
    }
};

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
 * Rensar och frigör resurser för huvudmenyn.
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
    this.removeDisplayObject(this.m_highscoreBox);
    this.removeDisplayObject(this.m_subtitleText);
    this.removeDisplayObject(this.m_titleText);
    this.removeDisplayObject(this.m_controller);
    this.removeDisplayObject(this.m_background);

    this.menuList = null;

    this.m_volumeHud = null;
    this.m_highscoreHud = null;
    this.m_highscoreBox = null;
    this.m_subtitleText = null;
    this.m_titleText = null;
    this.m_controller = null;
    this.m_background = null;

    this.menuSound = null;
    this.backgroundMusic = null;
    this.m_gameInput = null;

    rune.scene.Scene.prototype.dispose.call(this);
};