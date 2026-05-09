//------------------------------------------------------------------------------
// SHIELD HANDLER
//------------------------------------------------------------------------------

runmysteriet.handler.ShieldHandler = function (stage, application, levelWidth, levelNumber) {

  this.m_stage = stage;
  this.application = application;
  this.m_levelWidth = levelWidth;
  this.m_levelNumber = levelNumber || 1;

  this.m_shields = [];
  this.m_collected = [];
  this.m_word = "";

  this.m_wordData = null;
  this.m_hints = [];

  this.catchSound = this.application.sounds.sound.get("sound_catch");

  this.box = null;

  // callback till UI
  this.onCollectedChanged = null;

};


//------------------------------------------------------------------------------
// GET WORD DATA FOR LEVEL
//------------------------------------------------------------------------------

runmysteriet.handler.ShieldHandler.prototype.getWordDataForLevel = function() {

    var resource = null;
    var data = null;
    var index = 0;

    if (!this.application || !this.application.resources) {
        console.log("No application resources found.");
        return null;
    }

    resource = this.application.resources.get("words5");

    if (!resource) {
        console.log("Could not find resource: words5");
        return null;
    }

    data = resource.data;

    if (typeof data === "string") {
        try {
            data = JSON.parse(data);
        } catch (error) {
            console.log("Could not parse words5 JSON:", error);
            return null;
        }
    }

    if (!data || !data.length) {
        console.log("words5 JSON is empty or wrong format.");
        return null;
    }

    /*
     * Level 1 tar första ordet.
     * Level 2 tar andra ordet.
     * Level 3 tar tredje ordet.
     */
    index = (this.m_levelNumber - 1) % data.length;

    console.log("LEVEL:", this.m_levelNumber);
    console.log("WORD INDEX:", index);
    console.log("WORD DATA:", data[index]);

    return data[index];
};


//-------------------------
// INIT
//-------------------------

runmysteriet.handler.ShieldHandler.prototype.init = function () {

var wordData = this.getWordDataForLevel();
    var word = "";
    var startX = 150; // starta en bit in i banan, inte direkt vid början
    var endX = this.m_levelWidth - 150; //
    var spacing = 0;
    var i = 0;
    var shield = null;

    if (wordData) {
        word = String(wordData.word || "").toLowerCase();

        this.m_wordData = wordData;
        this.m_word = word;
        this.m_hints = wordData.Subword || [];
    } else {
        word = "button";

        this.m_wordData = {
            word: "Button",
            Subword: ["Start", "Needle"]
        };

        this.m_word = word;
        this.m_hints = this.m_wordData.Subword;
    }

    spacing = (word.length > 1)
        ? (endX - startX) / (word.length - 1)
        : 0;

    console.log("WORD:", word);
    console.log("WORD DATA:", this.m_wordData);
    console.log("HINTS:", this.m_hints);

    for (i = 0; i < word.length; i++) {

        shield = new runmysteriet.ui.Shield();

        shield.x = startX + i * spacing;
        shield.y = 140;

        shield.__collected = false;
        shield.active = true;

        shield.setRune(word[i]);

        this.m_shields.push(shield);
        this.m_stage.addChild(shield);
    }
};

//------------------------------------------------------------------------------
// GET RANDOM WORD DATA
//------------------------------------------------------------------------------

runmysteriet.handler.ShieldHandler.prototype.getRandomWordData = function() {

    var resource = null;
    var data = null;
    var index = 0;

    if (!this.application || !this.application.resources) {
        console.log("No application resources found.");
        return null;
    }

    /*
     * OBS: "words5" måste vara samma namn som du har i Requests.js.
     */
    resource = this.application.resources.get("words5", "word6");

    if (!resource) {
        console.log("Could not find resource: words5");
        return null;
    }

    data = resource.data;

    /*
     * om JSON kommer som text, gör om den till riktig array.
     */
    if (typeof data === "string") {
        try {
            data = JSON.parse(data);
        } catch (error) {
            console.log("Could not parse words5 JSON:", error);
            return null;
        }
    }

    if (!data || !data.length) {
        console.log("words5 JSON is empty or wrong format.");
        return null;
    }

    index = (this.m_levelNumber - 1) % data.length;

    console.log("LEVEL:", this.m_levelNumber);
    console.log("WORD INDEX:", index);
    console.log("WORD DATA:", data[index]);

    return data[index];
};

//-------------------------
// UPDATE
//-------------------------

runmysteriet.handler.ShieldHandler.prototype.update = function (players) {

  for (var i = this.m_shields.length - 1; i >= 0; i--) {

    var shield = this.m_shields[i];

    if (!shield.active) continue;

    for (var j = 0; j < players.length; j++) {

      var player = players[j];

      if (shield.hitTestObject(player)) {
        this.collectShield(shield);
        break;
      }
    }

    shield.update();
  }
};

//-------------------------
// COLLECT
//-------------------------

runmysteriet.handler.ShieldHandler.prototype.collectShield = function (shield) {

  if (!shield || shield.__collected) return;

  shield.__collected = true;
  shield.active = false;

  this.catchSound.play(true);

  this.m_stage.removeChild(shield);

  var index = this.m_shields.indexOf(shield);
  if (index !== -1) this.m_shields.splice(index, 1);

  this.m_collected.push(shield);

  console.log("Collected:", shield.rune);

  // 🔥 UPDATE UI
  if (this.onCollectedChanged) {
    this.onCollectedChanged(this.getRuneString());
  }
};

//-------------------------
// STRING BUILDER (FIXAD)
//-------------------------

runmysteriet.handler.ShieldHandler.prototype.getRuneString = function () {

  var result = "";

  for (var i = 0; i < this.m_collected.length; i++) {
    result += this.m_collected[i].rune;
  }

  return result;
};

//-------------------------
// GETTERS
//-------------------------

runmysteriet.handler.ShieldHandler.prototype.getWord = function() {
    return this.m_word;
};

runmysteriet.handler.ShieldHandler.prototype.getHints = function() {
    return this.m_hints;
};

runmysteriet.handler.ShieldHandler.prototype.getCollected = function () {
  return this.m_collected;
};

runmysteriet.handler.ShieldHandler.prototype.allRunesColected = function () {
  return this.m_word.length > 0 &&
         this.m_collected.length >= this.m_word.length;
};

runmysteriet.handler.ShieldHandler.prototype.getWordData = function() {
    return this.m_wordData;
};

//-------------------------
// DISPLAY
//-------------------------

runmysteriet.handler.ShieldHandler.prototype.display = function () {

  this.box = new rune.display.Graphic(10, 10, 100, 100);
  this.box.backgroundColor = "#ffffff";
};