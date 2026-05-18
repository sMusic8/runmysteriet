//------------------------------------------------------------------------------
// SHIELD HANDLER
//------------------------------------------------------------------------------

runmysteriet.handler.ShieldHandler = function(stage, application, levelWidth, levelNumber, runeSpawns) {

    this.m_stage = stage;
    this.application = application;
    this.m_levelWidth = levelWidth;
    this.m_levelNumber = levelNumber || 1;
    this.m_runeSpawns = runeSpawns || [];

    this.m_shields = [];
    this.m_collected = [];
    this.m_word = "";

    this.m_wordData = null;
    this.m_hints = [];
    this.m_collectedMap = [];
    this.m_hiddenIndex = -1;

    this.catchSound = this.application.sounds.sound.get("sound_catch");

    this.box = null;
    this.onCollectedChanged = null;
};

//------------------------------------------------------------------------------
// WORD RESOURCE
//------------------------------------------------------------------------------

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

//------------------------------------------------------------------------------
// FALLBACK WORD
//------------------------------------------------------------------------------

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
// RUNE SPAWNS
//------------------------------------------------------------------------------

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

runmysteriet.handler.ShieldHandler.prototype.getFallbackRuneSpawn = function(index) {
    var startX = 150;
    var endX = this.m_levelWidth - 150;
    var count = 5;
    var spacing = 0;

    if (this.m_word && this.m_word.length > 1) {
        count = this.m_word.length;
    }

    spacing = (count > 1)
        ? (endX - startX) / (count - 1)
        : 0;

    return {
        x: startX + index * spacing,
        y: 150
    };
};

//------------------------------------------------------------------------------
// GET RANDOM WORD DATA
//------------------------------------------------------------------------------

runmysteriet.handler.ShieldHandler.prototype.getRandomWordData = function() {
    var resourceName = "";
    var resource = null;
    var data = null;
    var index = 0;

    if (!this.application || !this.application.resources) {
        console.log("No application resources found.");
        return null;
    }

    resourceName = this.getWordResourceName();
    resource = this.application.resources.get(resourceName);

    if (!resource) {
        console.log("Could not find resource:", resourceName);
        console.log("Falling back to words5.");

        resourceName = "words5";
        resource = this.application.resources.get(resourceName);
    }

    if (!resource) {
        console.log("Could not find fallback resource: words5");
        return null;
    }

    data = resource.data;

    if (typeof data === "string") {
        try {
            data = JSON.parse(data);
        } catch (error) {
            console.log("Could not parse " + resourceName + " JSON:", error);
            return null;
        }
    }

    if (!data || !data.length) {
        console.log(resourceName + " JSON is empty or wrong format.");
        return null;
    }

    index = Math.floor(Math.random() * data.length);

    console.log("WORD RESOURCE:", resourceName);
    console.log("RANDOM WORD INDEX:", index);
    console.log("RANDOM WORD DATA:", data[index]);

    return data[index];
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

runmysteriet.handler.ShieldHandler.prototype.update = function(players) {
    var i = 0;
    var j = 0;
    var shield = null;
    var player = null;

    if (!players) {
        return;
    }

    for (i = 0; i < this.m_shields.length; i++) {
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

        for (j = 0; j < players.length; j++) {
            player = players[j];

            if (!player) {
                continue;
            }

            if (player.isDead === true) {
                continue;
            }

            if (player.visible === false) {
                continue;
            }

            if (player.active === false) {
                continue;
            }

            if (shield.hitTestObject(player)) {
                this.collectShield(shield);
                break;
            }
        }
    }
};

//------------------------------------------------------------------------------
// COLLECT
//------------------------------------------------------------------------------

runmysteriet.handler.ShieldHandler.prototype.collectShield = function(shield) {
    var index = 0;

    if (!shield || shield.__collected) {
        return;
    }

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

    console.log("Collected:", shield.rune);

    if (this.onCollectedChanged) {
        this.onCollectedChanged(this.getRuneString());
    }
};

//------------------------------------------------------------------------------
// STRING BUILDER
//------------------------------------------------------------------------------

runmysteriet.handler.ShieldHandler.prototype.getRuneString = function() {
    var result = "";
    var i = 0;

    for (i = 0; i < this.m_collected.length; i++) {
        result += this.m_collected[i].rune;
    }

    return result;
};

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

//------------------------------------------------------------------------------
// GETTERS
//------------------------------------------------------------------------------

runmysteriet.handler.ShieldHandler.prototype.getGuessData = function() {
    return {
        word: this.m_word,
        Subword: this.m_hints,
        collectedMap: this.m_collectedMap,
        hiddenIndex: this.m_hiddenIndex
    };
};