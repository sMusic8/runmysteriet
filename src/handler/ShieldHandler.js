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
runmysteriet.handler.ShieldHandler = function(stage, application, levelWidth, levelNumber, runeSpawns) {

    /** @type {!rune.display.Stage} */
    this.m_stage = stage;

    /** @type {!Object} */
    this.application = application;

    /** @type {number} */
    this.m_levelWidth = levelWidth;

    /** @type {number} */
    this.m_levelNumber = levelNumber || 1;

    /** @type {Array} */
    this.m_runeSpawns = runeSpawns || [];

    /** @type {Array<!Object>} */
    this.m_shields = [];

    /** @type {Array<!Object>} */
    this.m_collected = [];

    /** @type {string} */
    this.m_word = "";

    /** @type {?Object} */
    this.m_wordData = null;

    /** @type {Array<string>} */
    this.m_hints = [];

    /** @type {Array<boolean>} */
    this.m_collectedMap = [];

    /** @type {number} */
    this.m_hiddenIndex = -1;

    /** @type {?Object} */
    this.catchSound = this.application.sounds.sound.get("sound_catch");

    /** @type {?Object} */
    this.box = null;

    /** @type {?Function} */
    this.onCollectedChanged = null;
};

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

/**
 * Initierar shields och genererar ordet som ska samlas.
 */
runmysteriet.handler.ShieldHandler.prototype.init = function() {

    var wordData = null;
    var word = "";
    var i = 0;
    var shield = null;
    var spawn = null;

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

        shield.__collected = false;
        shield.active = true;
        shield.wordIndex = i;

        shield.setRune(word.charAt(i));

        this.m_shields.push(shield);
        this.m_stage.addChild(shield);
    }
};

/**
 * Sätter ett fallback-ord om resurser saknas.
 */
runmysteriet.handler.ShieldHandler.prototype.setFallbackWord = function() {

    if (this.m_levelNumber >= 11) {
        this.m_wordData = { word: "warrior", Subword: ["fighter", "battle"] };
    } else if (this.m_levelNumber >= 6) {
        this.m_wordData = { word: "shield", Subword: ["protection", "battle"] };
    } else {
        this.m_wordData = { word: "raven", Subword: ["black bird", "viking sign"] };
    }

    this.m_word = String(this.m_wordData.word || "").toUpperCase();
    this.m_hints = this.m_wordData.Subword || [];
};

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
            return { x: spawn.x, y: spawn.y };
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
runmysteriet.handler.ShieldHandler.prototype.getFallbackRuneSpawn = function(index) {

    var startX = 150;
    var endX = this.m_levelWidth - 150;
    var count = this.m_word ? this.m_word.length : 5;
    var spacing = 0;

    spacing = (count > 1) ? (endX - startX) / (count - 1) : 0;

    return {
        x: startX + index * spacing,
        y: 150
    };
};

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
        } catch (e) {
            return null;
        }
    }

    if (!data || !data.length) {
        return null;
    }

    index = Math.floor(Math.random() * data.length);

    return data[index];
};

/**
 * Uppdaterar alla shields och kontrollerar om någon spelare samlar upp dem.
 *
 * @this {runmysteriet.handler.ShieldHandler}
 * @param {Array<runmysteriet.entity.Player>} players Lista av spelare att testa mot
 * @return {void}
 */
runmysteriet.handler.ShieldHandler.prototype.update = function(players) {

    /** @type {number} */
    var i = 0;

    /** @type {number} */
    var j = 0;

    /** @type {?runmysteriet.entity.Shield} */
    var shield = null;

    /** @type {?runmysteriet.entity.Player} */
    var player = null;

    if (!players) return;

    for (i = 0; i < this.m_shields.length; i++) {

        shield = this.m_shields[i];

        if (!shield) continue;
        if (shield.isCollected === true) continue;
        if (shield.visible === false) continue;

        for (j = 0; j < players.length; j++) {

            player = players[j];

            if (!player) continue;
            if (player.isDead === true) continue;
            if (player.visible === false) continue;
            if (player.active === false) continue;

            if (shield.hitTestObject(player)) {
                this.collectShield(shield);
                break;
            }
        }
    }
};
/**
 * Hanterar insamling av en shield (pickup) och uppdaterar spelets state.
 *
 * @this {runmysteriet.handler.ShieldHandler}
 * @param {runmysteriet.entity.Shield} shield Shield som ska samlas in
 * @return {void}
 */
runmysteriet.handler.ShieldHandler.prototype.collectShield = function(shield) {

    /** @type {number} */
    var index = 0;

    if (!shield || shield.__collected) return;

    shield.__collected = true;
    shield.active = false;

    if (this.catchSound) {
        this.catchSound.play(true);
    }

    this.m_stage.removeChild(shield);

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
 * Genererar en sammansatt rune-sträng baserat på insamlade shields.
 * @this {runmysteriet.handler.ShieldHandler}
 * @return {string} Den sammansatta rune-strängen
 */
runmysteriet.handler.ShieldHandler.prototype.getRuneString = function() {

    /** @type {string} */
    var result = "";

    /** @type {number} */
    var i = 0;

    for (i = 0; i < this.m_collected.length; i++) {
        result += this.m_collected[i].rune;
    }

    return result;
};
/**
 * Kontrollerar om alla nödvändiga runor har samlats in.
 *
 * @this {runmysteriet.handler.ShieldHandler}
 * @return {boolean} True om alla nödvändiga runor är insamlade, annars false
 */
runmysteriet.handler.ShieldHandler.prototype.allRunesColected = function() {

    /** @type {number} */
    var placedRuneCount = 0;

    if (!this.m_word || this.m_word.length <= 0) return false;

    placedRuneCount = this.m_word.length;

    if (this.m_hiddenIndex >= 0) {
        placedRuneCount--;
    }

    return this.m_collected.length >= placedRuneCount;
};

/**
 * Returnerar aktuell state-data för rune-/word-guess-systemet.
 *
 * @this {runmysteriet.handler.ShieldHandler}
 * @return {{
 *   word: (string|Array<string>),
 *   Subword: (*),
 *   collectedMap: Object<string, boolean>,
 *   hiddenIndex: number
 * }} Objekt som beskriver aktuell guess-state
 */
runmysteriet.handler.ShieldHandler.prototype.getGuessData = function() {

    return {
        word: this.m_word,
        Subword: this.m_hints,
        collectedMap: this.m_collectedMap,
        hiddenIndex: this.m_hiddenIndex
    };
};

/**
 * Tar bort alla sköldar/runor från stage och rensar referenser.
 *
 * @return {void}
 */
runmysteriet.handler.ShieldHandler.prototype.clear = function() {

    var i = 0;
    var shield = null;

    if (this.m_shields) {
        for (i = 0; i < this.m_shields.length; i++) {
            shield = this.m_shields[i];

            if (!shield) {
                continue;
            }

            if (shield.parent) {
                shield.parent.removeChild(shield);
            } else if (shield.stage) {
                shield.stage.removeChild(shield);
            }
        }
    }

    if (this.m_collected) {
        for (i = 0; i < this.m_collected.length; i++) {
            shield = this.m_collected[i];

            if (!shield) {
                continue;
            }

            if (shield.parent) {
                shield.parent.removeChild(shield);
            } else if (shield.stage) {
                shield.stage.removeChild(shield);
            }
        }
    }

    this.m_shields = [];
    this.m_collected = [];
    this.m_collectedMap = [];
    this.m_runeSpawns = [];

    this.m_word = "";
    this.m_wordData = null;
    this.m_hints = [];
    this.m_hiddenIndex = -1;

    this.onCollectedChanged = null;
    this.catchSound = null;
    this.box = null;
    this.application = null;
    this.m_stage = null;
};