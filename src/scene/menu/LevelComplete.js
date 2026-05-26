//------------------------------------------------------------------------------
// LEVEL COMPLETE SCENE
//------------------------------------------------------------------------------

/**
 * Scene som visas efter att en level är klar.
 *
 * @constructor
 * @extends {rune.scene.Scene}
 * @param {number=} levelNumber
 * @param {number=} totalScore
 * @param {number=} earnedScore
 * @param {?Object=} avatarData
 * @param {?Object=} oldAvatarData
 */
runmysteriet.scene.LevelComplete = function(
    levelNumber,
    totalScore,
    earnedScore,
    avatarData,
    oldAvatarData
) {

    rune.scene.Scene.call(this);

    this.levelNumber = levelNumber || 1;
    this.totalScore = totalScore || 0;
    this.earnedScore = earnedScore || 0;

    if (avatarData && typeof avatarData === "object") {
        this.m_avatarData = avatarData;
    } else if (oldAvatarData && typeof oldAvatarData === "object") {
        this.m_avatarData = oldAvatarData;
    } else {
        this.m_avatarData = null;
    }

    this.levelConfig = new runmysteriet.config.LevelConfig(this.levelNumber);
    this.maxLevel = this.levelConfig.getMaxLevel();

    this.menuItems = [];
    this.selectedIndex = 0;

    this.menuSound = null;
    this.backgroundMusic = null;
    this.m_gameInput = null;

    this.m_titleText = null;
    this.m_earnedText = null;
    this.m_totalText = null;
};

runmysteriet.scene.LevelComplete.prototype =
    Object.create(rune.scene.Scene.prototype);

runmysteriet.scene.LevelComplete.prototype.constructor =
    runmysteriet.scene.LevelComplete;

/**
 * Initierar LevelComplete-scenen och sätter upp input, ljud och UI.
 *
 * @return {void}
 */
runmysteriet.scene.LevelComplete.prototype.init = function() {

    rune.scene.Scene.prototype.init.call(this);

    /**
     * Inputhantering för scenen.
     * @type {runmysteriet.input.GameInput}
     */
    this.m_gameInput = new runmysteriet.input.GameInput(this.application);

    /**
     * Ljud för menyinteraktion.
     * @type {?Object}
     */
    this.menuSound = this.application.sounds.sound.get("sound_menu");

    /**
     * Bakgrundsmusik för scenen.
     * @type {?Object}
     */
    this.backgroundMusic = this.application.sounds.sound.get("sound_musicMenu");

    if (this.backgroundMusic) {
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.5;
        this.backgroundMusic.play();
    }

    this.createTexts();
    this.createMenu();
    this.updateMenu();
};
/**
 * Skapar textobjekt för LevelComplete-scenen.
 * Visar nivåstatus samt poänginformation.
 *
 * @return {void}
 */
runmysteriet.scene.LevelComplete.prototype.createTexts = function() {

    /**
     * Titeltext som varierar beroende på nivåstatus.
     * @type {string}
     */
    var titleText = "";

    titleText = (this.levelNumber >= this.maxLevel)
        ? "YOU WON THE WHOLE GAME"
        : "LEVEL " + this.levelNumber + " COMPLETE";

    /**
     * Titeltext för scenen.
     * @type {rune.text.BitmapField}
     */
    this.m_titleText = new rune.text.BitmapField(titleText);
    this.m_titleText.autoSize = true;
    this.m_titleText.center = this.application.screen.center;
    this.m_titleText.y -= 75;

    this.stage.addChild(this.m_titleText);

    /**
     * Text som visar poäng som tjänats i nivån.
     * @type {rune.text.BitmapField}
     */
    this.m_earnedText = new rune.text.BitmapField(
        "EARNED SCORE +" + this.earnedScore
    );

    this.m_earnedText.autoSize = true;
    this.m_earnedText.center = this.application.screen.center;
    this.m_earnedText.y -= 35;

    this.stage.addChild(this.m_earnedText);

    /**
     * Text som visar totalpoäng.
     * @type {rune.text.BitmapField}
     */
    this.m_totalText = new rune.text.BitmapField(
        "TOTAL SCORE " + this.totalScore
    );

    this.m_totalText.autoSize = true;
    this.m_totalText.center = this.application.screen.center;
    this.m_totalText.y -= 10;

    this.stage.addChild(this.m_totalText);
};

/**
 * Uppdaterar LevelComplete-scenen varje frame.
 * Hanterar input, volym och meny-navigering.
 *
 * @param {number} step Tidssteg (delta time) för uppdatering.
 * @return {void}
 */
runmysteriet.scene.LevelComplete.prototype.update = function(step) {

    /**
     * Inläst spelarinput.
     * @type {?Object}
     */
    var input = null;

    rune.scene.Scene.prototype.update.call(this, step);

    if (!this.m_gameInput) {
        return;
    }

    input = this.m_gameInput.read(this.keyboard);

    this.updateVolumeInput(input);

    if (input.down) {
        this.playMenuSound();
        this.selectedIndex++;

        if (this.selectedIndex >= this.menuItems.length) {
            this.selectedIndex = 0;
        }

        this.updateMenu();
        return;
    }

    if (input.up) {
        this.playMenuSound();
        this.selectedIndex--;

        if (this.selectedIndex < 0) {
            this.selectedIndex = this.menuItems.length - 1;
        }

        this.updateMenu();
        return;
    }

    if (input.choose) {
        this.chooseSelected();
        return;
    }

    if (input.back) {
        this.goToMenu();
    }
};
/**
 * Hanterar volyminmatning i LevelComplete-scenen.
 * Justerar bakgrundsmusikens volym baserat på input.
 *
 * @param {?Object} input Inläst spelarinput.
 * @return {void}
 */
runmysteriet.scene.LevelComplete.prototype.updateVolumeInput = function(input) {

    /**
     * Stegstorlek för volymjustering.
     * @type {number}
     */
    var stepVol = 0.1;

    if (!input || !this.backgroundMusic) {
        return;
    }

    if (input.volumeUp === true) {
        this.backgroundMusic.volume += stepVol;

        if (this.backgroundMusic.volume > 1) {
            this.backgroundMusic.volume = 0;
        }

        return;
    }

    if (input.volumeDown === true) {
        this.backgroundMusic.volume -= stepVol;

        if (this.backgroundMusic.volume < 0) {
            this.backgroundMusic.volume = 1;
        }
    }
};
/**
 * Skapar menyalternativ för LevelComplete-scenen.
 * Anpassar valen beroende på om sista nivån är klar.
 *
 * @return {void}
 */
runmysteriet.scene.LevelComplete.prototype.createMenu = function() {

    /**
     * Lista med textetiketter för menyn.
     * @type {Array.<string>}
     */
    var labels = null;

    /**
     * Loopräknare.
     * @type {number}
     */
    var i = 0;

    /**
     * Tillfälligt menyobjekt (textfält).
     * @type {?rune.text.BitmapField}
     */
    var item = null;

    labels = (this.levelNumber < this.maxLevel)
        ? ["NEXT LEVEL", "BACK TO MAIN MENU"]
        : ["BACK TO MAIN MENU"];

    for (i = 0; i < labels.length; i++) {
        item = new rune.text.BitmapField(labels[i]);
        item.autoSize = true;
        item.center = this.application.screen.center;
        item.y += 45 + i * 22;
        item.scale = 0.8;

        this.stage.addChild(item);
        this.menuItems.push(item);
    }
};/**
 * Uppdaterar menyn i LevelComplete-scenen.
 * Markerar valt alternativ med en indikator.
 *
 * @return {void}
 */
runmysteriet.scene.LevelComplete.prototype.updateMenu = function() {

    /**
     * Loopräknare.
     * @type {number}
     */
    var i = 0;

    /**
     * Referens till aktuellt menyobjekt.
     * @type {?rune.text.BitmapField}
     */
    var item = null;

    /**
     * Rensad text utan markör.
     * @type {string}
     */
    var text = "";

    for (i = 0; i < this.menuItems.length; i++) {
        item = this.menuItems[i];

        if (!item) {
            continue;
        }

        text = item.text.replace(" > ", "");

        item.text = (i === this.selectedIndex)
            ? " > " + text
            : text;
    }
};

/**
 * Utför vald menyhandling i LevelComplete-scenen.
 * Startar nästa nivå eller går tillbaka till huvudmenyn.
 *
 * @return {void}
 */
runmysteriet.scene.LevelComplete.prototype.chooseSelected = function() {

    if (this.levelNumber < this.maxLevel && this.selectedIndex === 0) {
        this.stopBackgroundMusic();

        this.application.scenes.load([
            new runmysteriet.scene.Game(
                this.levelNumber + 1,
                this.totalScore,
                this.m_avatarData
            )
        ]);

        return;
    }

    this.goToMenu();
};
/**
 * Byter till huvudmenyn och stoppar bakgrundsmusiken.
 *
 * @return {void}
 */
runmysteriet.scene.LevelComplete.prototype.goToMenu = function() {

    this.stopBackgroundMusic();

    this.application.scenes.load([
        new runmysteriet.scene.Menu()
    ]);
};
/**
 * Spelar upp meny-ljud om det finns tillgängligt.
 *
 * @return {void}
 */
runmysteriet.scene.LevelComplete.prototype.playMenuSound = function() {

    if (this.menuSound && typeof this.menuSound.play === "function") {
        this.menuSound.play();
    }
};
/**
 * Stoppar bakgrundsmusiken i scenen genom att pausa dess mediaelement.
 *
 * @return {void}
 */
runmysteriet.scene.LevelComplete.prototype.stopBackgroundMusic = function() {

    if (
        this.backgroundMusic &&
        this.backgroundMusic.m_source &&
        this.backgroundMusic.m_source.mediaElement
    ) {
        this.backgroundMusic.m_source.mediaElement.pause();
    }
};

/**
 * Tar bort objekt från stage.
 *
 * @param {?Object} object
 * @return {void}
 */
runmysteriet.scene.LevelComplete.prototype.removeDisplayObject = function(object) {

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
 * Rensar upp LevelComplete-scenen och frigör alla resurser.
 * Stoppar ljud, tar bort UI-element och nollställer intern data.
 *
 * @return {void}
 */
runmysteriet.scene.LevelComplete.prototype.dispose = function() {

    /**
     * Loopräknare för menyobjekt.
     * @type {number}
     */
    var i = 0;

    this.stopBackgroundMusic();

    this.removeDisplayObject(this.m_titleText);
    this.removeDisplayObject(this.m_earnedText);
    this.removeDisplayObject(this.m_totalText);

    if (this.menuItems) {
        for (i = 0; i < this.menuItems.length; i++) {
            this.removeDisplayObject(this.menuItems[i]);
        }
    }

    this.m_titleText = null;
    this.m_earnedText = null;
    this.m_totalText = null;

    this.menuItems = [];
    this.selectedIndex = 0;

    this.menuSound = null;
    this.backgroundMusic = null;
    this.m_gameInput = null;

    this.levelConfig = null;
    this.maxLevel = 0;

    this.m_avatarData = null;

    rune.scene.Scene.prototype.dispose.call(this);
};