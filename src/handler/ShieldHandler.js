//------------------------------------------------------------------------------
// SHIELD HANDLER
//------------------------------------------------------------------------------

/**
 * Hanterar runor/shields som bygger upp ett ord i spelet.
 *
 * @constructor
 * @param {!rune.display.Stage} stage
 * @param {!Object} application
 * @param {number} levelWidth
 * @param {number} levelNumber
 * @param {Array=} runeSpawns
 */
runmysteriet.handler.ShieldHandler = function(
    stage,
    application,
    levelWidth,
    levelNumber,
    runeSpawns
) {

    /** @type {!rune.display.Stage} */
    this.m_stage = stage;

    /** @type {!Object} */
    this.application = application;

    /** @type {number} */
    this.m_levelWidth = levelWidth || 0;

    /** @type {number} */
    this.m_levelNumber = levelNumber || 1;

    /** @type {!Array} */
    this.m_runeSpawns = runeSpawns || [];

    /** @type {!Array<!Object>} */
    this.m_shields = [];

    /** @type {!Array<!Object>} */
    this.m_collected = [];

    /**
     * Alla visuella rune-sprites som ligger på shields.
     *
     * @type {!Array<!Object>}
     */
    this.m_runeGraphics = [];

    /**
     * Skapar rune-sprites från Rune.js.
     *
     * @type {?runmysteriet.ui.Rune}
     */
    this.m_runeFactory = null;

    /** @type {string} */
    this.m_word = "";

    /** @type {?Object} */
    this.m_wordData = null;

    /** @type {!Array<string>} */
    this.m_hints = [];

    /** @type {!Array<boolean>} */
    this.m_collectedMap = [];

    /** @type {number} */
    this.m_hiddenIndex = -1;

    /** @type {?Object} */
    this.catchSound = null;

    /** @type {?Function} */
    this.onCollectedChanged = null;

    if (
        this.application &&
        this.application.sounds &&
        this.application.sounds.sound
    ) {
        this.catchSound = this.application.sounds.sound.get("sound_catch");
    }
};

//------------------------------------------------------------------------------
// WORD RESOURCE
//------------------------------------------------------------------------------

/**
 * Returnerar namn på ordresurs beroende på nivå.
 *
 * @return {string}
 */
runmysteriet.handler.ShieldHandler.prototype.getWordResourceName = function() {

    if (this.m_levelNumber >= 11) {
        return "words7";
    }

    if (this.m_levelNumber >= 6) {
        return "words6";
    }

    return "words5";
};

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

/**
 * Initierar shields och genererar ordet som ska samlas.
 *
 * @return {void}
 */
runmysteriet.handler.ShieldHandler.prototype.init = function() {

    var wordData = null;
    var word = "";
    var i = 0;
    var shield = null;
    var spawn = null;
    var runeGraphic = null;

    /*
     * Rensa skapade shields och rune-grafik.
     * Viktigt: m_runeSpawns ska inte tömmas.
     */
    this.clear();

    /*
     * Skapa ny rune-factory för denna omgång.
     */
    this.m_runeFactory = new runmysteriet.ui.Rune();
    this.m_runeFactory.makeAllRunes();

    wordData = this.getRandomWordData();

    if (wordData && wordData.word) {
        word = String(wordData.word || "").toUpperCase();

        this.m_wordData = wordData;
        this.m_word = word;
        this.m_hints = wordData.Subword || [];
    } else {
        this.setFallbackWord();
        word = this.m_word;
    }

    if (!word || word.length <= 0) {
        this.setFallbackWord();
        word = this.m_word;
    }

    this.m_hiddenIndex = Math.floor(Math.random() * word.length);
    this.m_collectedMap = [];

    for (i = 0; i < word.length; i++) {
        this.m_collectedMap.push(false);
    }

    for (i = 0; i < word.length; i++) {
        if (i === this.m_hiddenIndex) {
            continue;
        }

        spawn = this.getRuneSpawn(i);

        shield = new runmysteriet.ui.Shield();
        shield.x = spawn.x;
        shield.y = spawn.y;

        shield.isCollected = false;
        shield.active = true;
        shield.wordIndex = i;

        /*
         * Denna bokstav används av logiken.
         */
        shield.setRune(word.charAt(i));

        /*
         * Denna sprite är det som syns visuellt på shielden.
         */
        runeGraphic = this.createRuneGraphicForShield(shield);

        this.m_shields.push(shield);

        /*
         * Viktigt:
         * Lägg shield först och rune efter.
         * Annars kan shielden ritas ovanpå runan.
         */
        this.m_stage.addChild(shield);

        if (runeGraphic) {
            this.m_stage.addChild(runeGraphic);
        }
    }
};

//------------------------------------------------------------------------------
// FALLBACK WORD
//------------------------------------------------------------------------------

/**
 * Sätter ett fallback-ord om resurser saknas.
 *
 * @return {void}
 */
runmysteriet.handler.ShieldHandler.prototype.setFallbackWord = function() {

    if (this.m_levelNumber >= 11) {
        this.m_wordData = {
            word: "warrior",
            Subword: ["fighter", "battle"]
        };
    } else if (this.m_levelNumber >= 6) {
        this.m_wordData = {
            word: "shield",
            Subword: ["protection", "battle"]
        };
    } else {
        this.m_wordData = {
            word: "raven",
            Subword: ["black bird", "viking sign"]
        };
    }

    this.m_word = String(this.m_wordData.word || "").toUpperCase();
    this.m_hints = this.m_wordData.Subword || [];
};

//------------------------------------------------------------------------------
// RUNE GRAPHIC
//------------------------------------------------------------------------------

/**
 * Skapar en visuell rune-sprite och kopplar den till en shield.
 *
 * @param {?Object} shield
 * @return {?Object}
 */
runmysteriet.handler.ShieldHandler.prototype.createRuneGraphicForShield = function(
    shield
) {

    var runeGraphic = null;

    if (!shield) {
        return null;
    }

    if (!this.m_runeFactory) {
        return null;
    }

    runeGraphic = this.m_runeFactory.getOneRune();

    /*
     * Om listan av någon anledning är tom skapar vi nya runor.
     * Det skyddar mot ord som kräver fler synliga runor.
     */
    if (!runeGraphic) {
        this.m_runeFactory.makeAllRunes();
        runeGraphic = this.m_runeFactory.getOneRune();
    }

    if (!runeGraphic) {
        return null;
    }

    shield.m_runeGraphic = runeGraphic;

    this.positionRuneGraphic(shield);

    this.m_runeGraphics.push(runeGraphic);

    return runeGraphic;
};

/**
 * Placerar rune-spriten ovanpå sin shield.
 *
 * @param {?Object} shield
 * @return {void}
 */
runmysteriet.handler.ShieldHandler.prototype.positionRuneGraphic = function(
    shield
) {

    var runeGraphic = null;

    if (!shield) {
        return;
    }

    runeGraphic = shield.m_runeGraphic;

    if (!runeGraphic) {
        return;
    }

    runeGraphic.x = shield.x + Math.floor((shield.width - runeGraphic.width) / 2);
    runeGraphic.y = shield.y + Math.floor((shield.height - runeGraphic.height) / 2);
};

/**
 * Tar bort rune-grafiken som tillhör en shield.
 *
 * @param {?Object} shield
 * @return {void}
 */
runmysteriet.handler.ShieldHandler.prototype.removeRuneGraphicFromShield = function(
    shield
) {

    var runeGraphic = null;
    var index = -1;

    if (!shield) {
        return;
    }

    runeGraphic = shield.m_runeGraphic;

    if (!runeGraphic) {
        return;
    }

    this.removeDisplayOnly(runeGraphic);

    index = this.m_runeGraphics.indexOf(runeGraphic);

    if (index !== -1) {
        this.m_runeGraphics.splice(index, 1);
    }

    shield.m_runeGraphic = null;
};

//------------------------------------------------------------------------------
// RUNE SPAWN
//------------------------------------------------------------------------------

/**
 * Returnerar spawnpunkt för en rune.
 *
 * @param {number} index
 * @return {{x:number,y:number}}
 */
runmysteriet.handler.ShieldHandler.prototype.getRuneSpawn = function(index) {

    var spawn = null;

    if (this.m_runeSpawns && this.m_runeSpawns.length > 0) {
        spawn = this.m_runeSpawns[index % this.m_runeSpawns.length];

        if (spawn) {
            return {
                x: spawn.x,
                y: spawn.y
            };
        }
    }

    return this.getFallbackRuneSpawn(index);
};

/**
 * Fallback-positionering om inga spawns finns.
 *
 * @param {number} index
 * @return {{x:number,y:number}}
 */
runmysteriet.handler.ShieldHandler.prototype.getFallbackRuneSpawn = function(
    index
) {

    var startX = 150;
    var endX = this.m_levelWidth - 150;
    var count = this.m_word ? this.m_word.length : 5;
    var spacing = 0;

    spacing = count > 1 ? (endX - startX) / (count - 1) : 0;

    return {
        x: startX + index * spacing,
        y: 150
    };
};

//------------------------------------------------------------------------------
// WORD DATA
//------------------------------------------------------------------------------

/**
 * Hämtar slumpmässigt ord från resource systemet.
 *
 * @return {?Object}
 */
runmysteriet.handler.ShieldHandler.prototype.getRandomWordData = function() {

    var resourceName = "";
    var resource = null;
    var data = null;
    var index = 0;

    if (!this.application || !this.application.resources) {
        return null;
    }

    resourceName = this.getWordResourceName();
    resource = this.application.resources.get(resourceName);

    if (!resource) {
        resourceName = "words5";
        resource = this.application.resources.get(resourceName);
    }

    if (!resource) {
        return null;
    }

    data = resource.data;

    if (typeof data === "string") {
        try {
            data = JSON.parse(data);
        } catch (error) {
            return null;
        }
    }

    if (!data || !data.length) {
        return null;
    }

    index = Math.floor(Math.random() * data.length);

    return data[index];
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

/**
 * Uppdaterar shields och kollar om spelare samlar dem.
 *
 * @param {?Array<!Object>} players
 * @return {void}
 */
runmysteriet.handler.ShieldHandler.prototype.update = function(players) {

    var i = 0;
    var j = 0;
    var shield = null;
    var player = null;

    if (!players || !this.m_shields) {
        return;
    }

    /*
     * Baklänges eftersom collectShield tar bort från m_shields.
     */
    for (i = this.m_shields.length - 1; i >= 0; i--) {
        shield = this.m_shields[i];

        if (!shield) {
            continue;
        }

        if (shield.isCollected === true) {
            continue;
        }

        if (shield.visible === false) {
            continue;
        }

        this.positionRuneGraphic(shield);

        for (j = 0; j < players.length; j++) {
            player = players[j];

            if (!this.isValidPlayer(player)) {
                continue;
            }

            if (shield.hitTestObject(player)) {
                this.collectShield(shield);
                break;
            }
        }
    }
};

/**
 * Kontrollerar om spelare kan samla shield.
 *
 * @param {?Object} player
 * @return {boolean}
 */
runmysteriet.handler.ShieldHandler.prototype.isValidPlayer = function(player) {

    if (!player) {
        return false;
    }

    if (player.isDead === true) {
        return false;
    }

    if (player.visible === false) {
        return false;
    }

    if (player.active === false) {
        return false;
    }

    return true;
};

//------------------------------------------------------------------------------
// COLLECT
//------------------------------------------------------------------------------

/**
 * Samlar upp en shield.
 *
 * @param {?runmysteriet.ui.Shield} shield
 * @return {void}
 */
runmysteriet.handler.ShieldHandler.prototype.collectShield = function(shield) {

    var index = 0;

    if (!shield || shield.isCollected === true) {
        return;
    }

    shield.isCollected = true;
    shield.active = false;
    shield.visible = false;

    this.playCatchSound();

    /*
     * Ta bort visuell rune-grafik från stage.
     * Shielden sparas fortfarande i m_collected för getRuneString().
     */
    this.removeRuneGraphicFromShield(shield);

    /*
     * Ta bara bort shield från stage.
     * Kör inte dispose här eftersom shield behövs i m_collected.
     */
    if (typeof shield.remove === "function") {
        shield.remove();
    } else {
        this.removeDisplayOnly(shield);
    }

    index = this.m_shields.indexOf(shield);

    if (index !== -1) {
        this.m_shields.splice(index, 1);
    }

    this.m_collected.push(shield);

    if (shield.wordIndex !== undefined && shield.wordIndex !== null) {
        this.m_collectedMap[shield.wordIndex] = true;
    }

    if (this.onCollectedChanged) {
        this.onCollectedChanged(this.getRuneString());
    }
};

/**
 * Spelar pickup-ljud.
 *
 * @return {void}
 */
runmysteriet.handler.ShieldHandler.prototype.playCatchSound = function() {

    if (this.catchSound && typeof this.catchSound.play === "function") {
        this.catchSound.play();
    }
};

//------------------------------------------------------------------------------
// STRING BUILDER
//------------------------------------------------------------------------------

/**
 * Returnerar insamlade runor som text.
 *
 * @return {string}
 */
runmysteriet.handler.ShieldHandler.prototype.getRuneString = function() {

    var result = "";
    var i = 0;
    var shield = null;

    if (!this.m_collected) {
        return result;
    }

    for (i = 0; i < this.m_collected.length; i++) {
        shield = this.m_collected[i];

        if (!shield) {
            continue;
        }

        if (typeof shield.getRune === "function") {
            result += shield.getRune();
        } else {
            result += shield.rune || "";
        }
    }

    return result;
};

/**
 * Kontrollerar om alla placerade runor är insamlade.
 *
 * @return {boolean} True om alla nödvändiga runor är insamlade, annars false
 */
runmysteriet.handler.ShieldHandler.prototype.allRunesColected = function() {

    var placedRuneCount = 0;

    if (!this.m_word || this.m_word.length <= 0) {
        return false;
    }

    placedRuneCount = this.m_word.length;

    if (this.m_hiddenIndex >= 0) {
        placedRuneCount--;
    }

    return this.m_collected.length >= placedRuneCount;
};

/**
 * Alias med rätt stavning.
 *
 * @return {boolean}
 */
runmysteriet.handler.ShieldHandler.prototype.allRunesCollected = function() {

    return this.allRunesColected();
};

//------------------------------------------------------------------------------
// GETTERS
//------------------------------------------------------------------------------

/**
 * Hämtar data till GuessWord.
 *
 * @return {!Object}
 */
runmysteriet.handler.ShieldHandler.prototype.getGuessData = function() {

    return {
        word: this.m_word,
        Subword: this.m_hints,
        collectedMap: this.m_collectedMap,
        hiddenIndex: this.m_hiddenIndex
    };
};

//------------------------------------------------------------------------------
// REMOVE DISPLAY OBJECT
//------------------------------------------------------------------------------

/**
 * Tar bara bort display object från stage.
 * Används när objektet fortfarande behövs som data.
 *
 * @param {?Object} object
 * @return {void}
 */
runmysteriet.handler.ShieldHandler.prototype.removeDisplayOnly = function(
    object
) {

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
 * Tar bort display object och kör dispose/remove om objektet har det.
 *
 * @param {?Object} object
 * @return {void}
 */
runmysteriet.handler.ShieldHandler.prototype.removeDisplayObject = function(
    object
) {

    if (!object) {
        return;
    }

    if (typeof object.dispose === "function") {
        object.dispose();
        return;
    }

    if (typeof object.remove === "function") {
        object.remove();
        return;
    }

    this.removeDisplayOnly(object);
};

//------------------------------------------------------------------------------
// CLEAR
//------------------------------------------------------------------------------

/**
 * Tar bort alla shields/runor från stage och tömmer listor.
 *
 * @return {void}
 */
runmysteriet.handler.ShieldHandler.prototype.clear = function() {

    var i = 0;
    var shield = null;
    var runeGraphic = null;

    if (this.m_shields) {
        for (i = 0; i < this.m_shields.length; i++) {
            shield = this.m_shields[i];

            if (!shield) {
                continue;
            }

            this.removeRuneGraphicFromShield(shield);
            this.removeDisplayObject(shield);
        }
    }

    if (this.m_collected) {
        for (i = 0; i < this.m_collected.length; i++) {
            shield = this.m_collected[i];

            if (!shield) {
                continue;
            }

            this.removeRuneGraphicFromShield(shield);
            this.removeDisplayObject(shield);
        }
    }

    /*
     * Säkerhetsrensning om någon runeSprite inte var kopplad till en shield.
     */
    if (this.m_runeGraphics) {
        for (i = 0; i < this.m_runeGraphics.length; i++) {
            runeGraphic = this.m_runeGraphics[i];

            this.removeDisplayOnly(runeGraphic);
        }
    }

    if (this.m_runeFactory) {
        this.m_runeFactory.dispose();
        this.m_runeFactory = null;
    }

    this.m_shields = [];
    this.m_collected = [];
    this.m_runeGraphics = [];
    this.m_collectedMap = [];

    this.m_word = "";
    this.m_wordData = null;
    this.m_hints = [];
    this.m_hiddenIndex = -1;
};

//------------------------------------------------------------------------------
// DISPOSE
//------------------------------------------------------------------------------

/**
 * Rensar ShieldHandler helt.
 *
 * @return {void}
 */
runmysteriet.handler.ShieldHandler.prototype.dispose = function() {

    this.clear();

    this.m_stage = null;
    this.application = null;

    this.m_levelWidth = 0;
    this.m_levelNumber = 0;

    this.m_runeSpawns = [];

    this.catchSound = null;
    this.onCollectedChanged = null;
};