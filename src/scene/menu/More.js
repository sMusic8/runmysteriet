/**
 * Scen som visar "More"-informationen i spelet.
 *
 * @constructor
 * @extends {rune.scene.Scene}
 */
runmysteriet.scene.More = function() {

    rune.scene.Scene.call(this);

    /**
     * Knapp för att gå tillbaka från scenen.
     * @type {?Object}
     */
    this.m_backButton = null;

    /**
     * Textobjekt som visar information i scenen.
     * @type {?Object}
     */
    this.m_text = null;

    /**
     * Bakgrundsobjekt för scenen.
     * @type {?Object}
     */
    this.m_background = null;

    /**
     * Box/container som innehåller UI-element.
     * @type {?Object}
     */
    this.m_box = null;

    /**
     * Bakgrundsmusik för scenen.
     * @type {?Object}
     */
    this.backgroundMusic = null;

    /**
     * Ljud som spelas vid menyinteraktion.
     * @type {?Object}
     */
    this.menuSound = null;

    /**
     * Inputhantering för spelet i denna scen.
     * @type {?Object}
     */
    this.m_gameInput = null;

    /**
     * HUD för volymkontroll.
     * @type {?Object}
     */
    this.m_volumeHud = null;
};

runmysteriet.scene.More.prototype = Object.create(rune.scene.Scene.prototype);
runmysteriet.scene.More.prototype.constructor = runmysteriet.scene.More;
/**
 * Initierar scenen och skapar alla visuella och ljudmässiga komponenter.
 *
 * @return {void}
 */
runmysteriet.scene.More.prototype.init = function() {

    rune.scene.Scene.prototype.init.call(this);

    /**
     * Inputhantering för spelet.
     * @type {runmysteriet.input.GameInput}
     */
    this.m_gameInput = new runmysteriet.input.GameInput(this.application);

    /**
     * Bakgrundsmusik för menyn.
     * @type {Object}
     */
    this.backgroundMusic = this.application.sounds.sound.get("sound_musicMenu");

    /**
     * Ljud som används vid menyinteraktion.
     * @type {Object}
     */
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
    this.createVolumeHud();
};

/**
 * Skapar och lägger till bakgrundsbilden för scenen.
 *
 * @return {void}
 */
runmysteriet.scene.More.prototype.createBackground = function() {

    /**
     * Bakgrundsbild för menyn.
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
/**
 * Skapar en vit informationsruta och placerar den centralt på skärmen.
 *
 * @return {void}
 */
runmysteriet.scene.More.prototype.createBox = function() {

    /**
     * Bredd på informationsrutan.
     * @type {number}
     */
    var boxWidth = 520;

    /**
     * Höjd på informationsrutan.
     * @type {number}
     */
    var boxHeight = 300;

    /**
     * Grafiskt box-objekt som fungerar som container för innehåll.
     * @type {rune.display.Graphic}
     */
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
 * Skapar och placerar informations-texten i scenen.
 *
 * @return {void}
 */
runmysteriet.scene.More.prototype.createText = function() {

    /**
     * Textfält som visar instruktioner och information till spelaren.
     * @type {rune.text.BitmapField}
     */
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
 * Skapar en tillbaka-knapp (BACK) och placerar den under informationsrutan.
 *
 * @return {void}
 */
runmysteriet.scene.More.prototype.createBackButton = function() {

    /**
     * Textfält som fungerar som tillbaka-knapp i scenen.
     * @type {rune.text.BitmapField}
     */
    this.m_backButton = new rune.text.BitmapField("BACK");
    this.m_backButton.autoSize = true;

    this.stage.addChild(this.m_backButton);

    this.m_backButton.x =
        this.application.screen.center.x - this.m_backButton.width / 2;

    this.m_backButton.y =
        this.m_box.y + this.m_box.height + 15;
};

/**
 * Skapar och lägger till volym-HUD som visar och hanterar ljudnivå.
 *
 * @return {void}
 */
runmysteriet.scene.More.prototype.createVolumeHud = function() {

    /**
     * HUD-komponent för volymkontroll kopplad till bakgrundsmusik.
     * @type {runmysteriet.ui.graphic.VolumeHud}
     */
    this.m_volumeHud = new runmysteriet.ui.graphic.VolumeHud(
        this.application,
        this.backgroundMusic
    );

    this.stage.addChild(this.m_volumeHud);
};

/**
 * Uppdaterar scenen varje frame.
 * Anropar basklassens update och hanterar inmatning.
 *
 * @param {number} step Tidssteg (delta time) för uppdateringen.
 * @return {void}
 */
runmysteriet.scene.More.prototype.update = function(step) {

    rune.scene.Scene.prototype.update.call(this, step);

    this.handleInput();
};

/**
 * Hanterar all input i scenen.
 * Läser tangentbordsinput och skickar vidare till specifika hanterare.
 *
 * @return {void}
 */
runmysteriet.scene.More.prototype.handleInput = function() {

    /**
     * Inläst input från spelaren.
     * @type {?Object}
     */
    var input = null;

    if (!this.m_gameInput) {
        return;
    }

    input = this.m_gameInput.read(this.keyboard);

    this.handleVolumeInput(input);
    this.handleBackInput(input);
};

/**
 * Hanterar input för att gå tillbaka till meny.
 *
 * @param {?Object} input Inläst spelarinput.
 * @return {void}
 */
runmysteriet.scene.More.prototype.handleBackInput = function(input) {

    if (!input) {
        return;
    }

    if (input.choose || input.back) {
        this.playMenuSound();
        this.goToMenu();
    }
};/**
 * Hanterar input för att justera volymen på bakgrundsmusiken.
 * Ökar eller minskar volymen och uppdaterar HUD:en.
 *
 * @param {?Object} input Inläst spelarinput.
 * @return {void}
 */
runmysteriet.scene.More.prototype.handleVolumeInput = function(input) {

    /**
     * Stegstorlek för volymändring.
     * @type {number}
     */
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
/**
 * Uppdaterar volym-HUD om den finns tillgänglig.
 * Anropar HUD:ens textuppdatering.
 *
 * @return {void}
 */
runmysteriet.scene.More.prototype.updateVolumeHud = function() {

    if (this.m_volumeHud &&
        typeof this.m_volumeHud.updateText === "function") {

        this.m_volumeHud.updateText();
    }
};

/**
 * Spelar upp meny-ljudet om det finns tillgängligt.
 *
 * @return {void}
 */
runmysteriet.scene.More.prototype.playMenuSound = function() {

    if (this.menuSound && typeof this.menuSound.play === "function") {
        this.menuSound.play();
    }
};/**
 * Stoppar bakgrundsmusiken genom att pausa dess ljudkälla.
 *
 * @return {void}
 */
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
 * Byter scen till huvudmenyn och stoppar bakgrundsmusiken.
 *
 * @return {void}
 */
runmysteriet.scene.More.prototype.goToMenu = function() {

    this.stopBackgroundMusic();

    this.application.scenes.load([
        new runmysteriet.scene.Menu()
    ]);
};

/**
 * Tar bort ett objekt frÃ¥n stage.
 *
 * @param {?Object} object
 * @return {void}
 */
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
 * Rensar upp scenen och frigör alla resurser innan den förstörs.
 * Stoppar ljud, tar bort displayobjekt och nollställer referenser.
 *
 * @return {void}
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