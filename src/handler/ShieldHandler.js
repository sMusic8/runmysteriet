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
  this.m_collectedMap = [];
  this.m_hiddenIndex = -1;

  this.catchSound = this.application.sounds.sound.get("sound_catch");

  this.box = null;

  // callback till UI
  this.onCollectedChanged = null;

};
//-------------------------
// INIT
//-------------------------

runmysteriet.handler.ShieldHandler.prototype.init = function () {

    var wordData = null;
    var word = "";
    var startX = 150; 
    var endX = this.m_levelWidth - 150;
    var spacing = 0;
    var i = 0;
    var shield = null;

    /*
     * Hämtar ett slumpat ord från words5.json.
     */
    wordData = this.getRandomWordData();

    if (wordData && wordData.word) {

        word = String(wordData.word || "").toUpperCase();

        this.m_wordData = wordData;
        this.m_word = word;
        this.m_hints = wordData.Subword || [];

    } else {

        /*
         * Fallback om JSON inte kan laddas.
         */
        word = "button";

        this.m_wordData = {
            word: "Button",
            Subword: ["Start", "Needle"]
        };

        this.m_word = word;
        this.m_hints = this.m_wordData.Subword;
    }

    /*
     * En bokstav göms och ska gissas senare i GuessWord.
     */
    this.m_hiddenIndex = Math.floor(Math.random() * word.length);

    this.m_collectedMap = [];

    for (i = 0; i < word.length; i++) {
        this.m_collectedMap.push(false);
    }

    spacing = (word.length > 1)
        ? (endX - startX) / (word.length - 1)
        : 0;

    for (i = 0; i < word.length; i++) {

        /*
         * En bokstav ska inte placeras ut.
         * Den blir en tom box i GuessWord.
         */
        if (i === this.m_hiddenIndex) {
            continue;
        }

        shield = new runmysteriet.ui.Shield();
        shield.x = startX + i * spacing;
        shield.y = 150; //

        shield.__collected = false;
        shield.active = true;
        shield.wordIndex = i;

        shield.setRune(word.charAt(i));

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
     * Namnet måste matcha Requests.js:
     * this.add("words5", "...")
     */
    resource = this.application.resources.get("words5");

    if (!resource) {
        console.log("Could not find resource: words5");
        return null;
    }

    data = resource.data;

    /*
     * Om JSON kommer som text gör vi om den till array.
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

    /*
     * Här sker slumpen.
     */
    index = Math.floor(Math.random() * data.length);

    console.log("RANDOM WORD INDEX:", index);
    console.log("RANDOM WORD DATA:", data[index]);

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

if (this.catchSound) {
    this.catchSound.play(true);
}
  this.m_stage.removeChild(shield);

  var index = this.m_shields.indexOf(shield);
  if (index !== -1) this.m_shields.splice(index, 1);

  this.m_collected.push(shield);
  if (shield.wordIndex !== undefined && shield.wordIndex !== null) {
    this.m_collectedMap[shield.wordIndex] = true;
}

  console.log("Collected:", shield.rune);

  //  UPDATE UI
  if (this.onCollectedChanged) {
    this.onCollectedChanged(this.getRuneString());
  }
};

//-------------------------
// STRING BUILDER (för UI)
//-------------------------

runmysteriet.handler.ShieldHandler.prototype.getRuneString = function () {

  var result = "";

  for (var i = 0; i < this.m_collected.length; i++) {
    result += this.m_collected[i].rune;
  }

  return result;
};

runmysteriet.handler.ShieldHandler.prototype.allRunesColected = function () {
    var placedRuneCount = 0;

    if (!this.m_word || this.m_word.length <= 0) {
        return false;
    }

    placedRuneCount = this.m_word.length;

    /*
     * En bokstav placeras inte ut.
     * Därför kan spelaren bara samla word.length - 1 runor.
     */
    if (this.m_hiddenIndex >= 0) {
        placedRuneCount--;
    }

    return this.m_collected.length >= placedRuneCount;
};
//-------------------------
// GETTERS
//-------------------------


runmysteriet.handler.ShieldHandler.prototype.getGuessData = function() {
    return {
        word: this.m_word,
        Subword: this.m_hints,
        collectedMap: this.m_collectedMap,
        hiddenIndex: this.m_hiddenIndex
    };
};
