/**
 * "More"-scenen (information/mer info-skärm).
 * 
 * Visar extra information om spelet samt hanterar UI-element,
 * bakgrund, ljud och input för att kunna navigera tillbaka till menyn.
 * 
 * @constructor
 * @extends {rune.scene.Scene}
 * 
 * @property {?Object} m_backButton - Knapp för att gå tillbaka till menyn.
 * @property {?Object} m_text - Textinnehåll som visas i scenen.
 * @property {?Object} m_background - Bakgrundsbild för scenen.
 * @property {?Object} m_box - Visuell ruta/container för innehåll.
 * @property {?Object} backgroundMusic - Bakgrundsmusik för scenen.
 * @property {?Object} menuSound - Ljud vid interaktion i menyn.
 * @property {?Object} m_gameInput - Hanterar input från spelaren.
 * @property {?Object} m_volumeHud - UI för volymkontroll.
 */
runmysteriet.scene.More = function() {

    rune.scene.Scene.call(this);

    this.m_backButton = null;
    this.m_text = null;
    this.m_background = null;
    this.m_box = null;

    this.backgroundMusic = null;
    this.menuSound = null;

    this.m_gameInput = null;
    this.m_volumeHud = null;
};

runmysteriet.scene.More.prototype = Object.create(rune.scene.Scene.prototype);
runmysteriet.scene.More.prototype.constructor = runmysteriet.scene.More;

/**
 * Initierar "More"-scenen.
 * 
 * Sätter upp input, ljud, UI och alla visuella element i scenen.
 * Skapar bakgrund, informationsruta, text, tillbaka-knapp samt volym-HUD.
 * 
 * @method
 * @memberof runmysteriet.scene.More
 * 
 * @returns {void}
 */
runmysteriet.scene.More.prototype.init = function() {

    rune.scene.Scene.prototype.init.call(this);

    this.m_gameInput = new runmysteriet.input.GameInput(this.application);

    this.backgroundMusic = this.application.sounds.sound.get("sound_musicMenu");
    this.menuSound = this.application.sounds.sound.get("sound_menu");

    if (this.backgroundMusic) {
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.5;
        this.backgroundMusic.play();
    }

    this.createBackground();
    this.createBox();
    this.createText();
    this.createBackButton();

    /*
     * VolumeHud ska skapas sist så den hamnar över bakgrund/box/text.
     */
    this.createVolumeHud();
};
//------------------------------------------------------------------------------
// CREATE
//------------------------------------------------------------------------------

runmysteriet.scene.More.prototype.createBackground = function() {

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
 * Skapar en informationsruta i "More"-scenen.
 * 
 * Ritar en vit rektangel centrerad på skärmen som används
 * som bakgrund för text och innehåll.
 * 
 * @method
 * @memberof runmysteriet.scene.More
 * 
 * @returns {void}
 */
runmysteriet.scene.More.prototype.createBox = function() {

    var boxWidth = 520;
    var boxHeight = 300;

    this.m_box = new rune.display.Graphic(
        0,
        0,
        boxWidth,
        boxHeight
    );

    this.m_box.fill = true;
    this.m_box.fillColor = "#ffffff";

    this.m_box.x = this.application.screen.center.x - boxWidth / 2;
    this.m_box.y = this.application.screen.center.y - boxHeight / 2;

    this.stage.addChild(this.m_box);
};
/**
 * Skapar och placerar informationstext i "More"-scenen.
 * 
 * Texten beskriver spelets mål och kontroller..
 * 
 * @method
 * @memberof runmysteriet.scene.More
 * 
 * @returns {void}
 */
runmysteriet.scene.More.prototype.createText = function() {

    this.m_text = new rune.text.BitmapField(
        "This is the game where you help the Vikings\n" +
        "reach their home ship while avoiding obstacles.\n\n" +
        "Jump across platforms, fight priests,\n" +
        "and avoid being captured.\n\n" +
        "To board the ship you must guess\n" +
        "the secret password.\n\n" +
        "Collect shields with runes along the way.\n\n" +
        "< BACK\n" +
        "Press A / ENTER / SPACE / ESC\n" +
        "E/Q = Volume"
    );

    this.m_text.autoSize = true;

    this.stage.addChild(this.m_text);

    this.m_text.x = this.m_box.x + (this.m_box.width - this.m_text.width) / 2;
    this.m_text.y = this.m_box.y + (this.m_box.height - this.m_text.height) / 2;
};
/**
 * Skapar och placerar tillbaka-knappen i "More"-scenen..
 * 
 * @method
 * @memberof runmysteriet.scene.More
 * 
 * @returns {void}
 */
runmysteriet.scene.More.prototype.createBackButton = function() {

    this.m_backButton = new rune.text.BitmapField("BACK");
    this.m_backButton.autoSize = true;

    this.stage.addChild(this.m_backButton);

    this.m_backButton.x =
        this.application.screen.center.x - this.m_backButton.width / 2;

    this.m_backButton.y =
        this.m_box.y + this.m_box.height + 15;
};

runmysteriet.scene.More.prototype.createVolumeHud = function() {

    this.m_volumeHud = new runmysteriet.ui.graphic.VolumeHud(
        this.application,
        this.backgroundMusic
    );

    this.stage.addChild(this.m_volumeHud);
};

/**
 * Uppdaterar "More"-scenen varje frame.
 * 
 * @method
 * @memberof runmysteriet.scene.More
 * 
 * @param {number} step - Tidssteg sedan senaste uppdatering.
 * @returns {void}
 */
runmysteriet.scene.More.prototype.update = function(step) {

    rune.scene.Scene.prototype.update.call(this, step);

    this.handleInput();
};

/**
 * Hanterar all input i "More"-scenen.
 * 
 * Läser spelarens input och skickar vidare till funktioner som hanterar volymkontroll.
 * 
 * @method
 * @memberof runmysteriet.scene.More
 * 
 * @returns {void}
 */
runmysteriet.scene.More.prototype.handleInput = function() {

    var input = null;

    if (!this.m_gameInput) {
        return;
    }

    input = this.m_gameInput.read(this.keyboard);

    this.handleVolumeInput(input);
    this.handleBackInput(input);
};
/**
 * Hanterar input för att gå tillbaka till menyn.
 * 
 * @method
 * @memberof runmysteriet.scene.More
 * 
 * @param {Object} input - Objekt som innehåller spelarinmatning.
 * @returns {void}
 */
runmysteriet.scene.More.prototype.handleBackInput = function(input) {

    if (!input) {
        return;
    }

    if (input.choose || input.back) {
        this.playMenuSound();
        this.goToMenu();
    }
};


/**
 * Hanterar volymstyrning via input.
 * 
 * Ökar eller minskar bakgrundsmusikens volym beroende på input.
 * Volymen loopar mellan 0 och 1.
 * 
 * @method
 * @memberof runmysteriet.scene.More
 * 
 * @param {Object} input - Objekt som innehåller spelarinmatning.
 * @returns {void}
 */
runmysteriet.scene.More.prototype.handleVolumeInput = function(input) {

    var stepVol = 0.1;

    if (!this.backgroundMusic || !input) {
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

runmysteriet.scene.More.prototype.updateVolumeHud = function() {

    if (this.m_volumeHud &&
        typeof this.m_volumeHud.updateText === "function") {

        this.m_volumeHud.updateText();
    }
};
//------------------------------------------------------------------------------
// SOUND
//------------------------------------------------------------------------------

runmysteriet.scene.More.prototype.playMenuSound = function() {

    if (this.menuSound && typeof this.menuSound.play === "function") {
        this.menuSound.play();
    }
};

runmysteriet.scene.More.prototype.stopBackgroundMusic = function() {

    if (
        this.backgroundMusic &&
        this.backgroundMusic.m_source &&
        this.backgroundMusic.m_source.mediaElement
    ) {
        this.backgroundMusic.m_source.mediaElement.pause();
    }
};


/**
 * Byter scen tillbaka till huvudmenyn.
 * 
 * Laddar om Menu-scenen och avslutar därmed "More"-scenen.
 * 
 * @method
 * @memberof runmysteriet.scene.More
 * 
 * @returns {void}
 */
runmysteriet.scene.More.prototype.goToMenu = function() {

    this.stopBackgroundMusic();

    this.application.scenes.load([
        new runmysteriet.scene.Menu()
    ]);
};
//------------------------------------------------------------------------------
// VOLUME HUD
//------------------------------------------------------------------------------

runmysteriet.scene.More.prototype.createVolumeHud = function() {

    this.m_volumeHud = new runmysteriet.ui.graphic.VolumeHud(
        this.application,
        this.backgroundMusic
    );

    this.stage.addChild(this.m_volumeHud);
};

//------------------------------------------------------------------------------
// REMOVE DISPLAY OBJECT
//------------------------------------------------------------------------------

runmysteriet.scene.More.prototype.removeDisplayObject = function(object) {

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
 * Rensar och frigör resurser för "More"-scenen.
 * 
 * Stoppar ljuduppspelning och tar bort alla grafiska objekt från scenen.
 * Nollställer referenser för att undvika minnesläckor.
 * 
 * @method
 * @memberof runmysteriet.scene.More
 * 
 * @returns {void}
 */
runmysteriet.scene.More.prototype.dispose = function() {

    this.stopBackgroundMusic();

    this.removeDisplayObject(this.m_volumeHud);
    this.removeDisplayObject(this.m_backButton);
    this.removeDisplayObject(this.m_text);
    this.removeDisplayObject(this.m_box);
    this.removeDisplayObject(this.m_background);

    this.m_volumeHud = null;
    this.m_backButton = null;
    this.m_text = null;
    this.m_box = null;
    this.m_background = null;

    this.backgroundMusic = null;
    this.menuSound = null;
    this.m_gameInput = null;

    rune.scene.Scene.prototype.dispose.call(this);
};