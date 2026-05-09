//------------------------------------------------------------------------------
// SHIELD HANDLER
//------------------------------------------------------------------------------

runmysteriet.handler.ShieldHandler = function (stage, application, levelWidth) {

  this.m_stage = stage;
  this.application = application;
  this.m_levelWidth = levelWidth;

  this.m_shields = [];
  this.m_collected = [];
  this.m_word = "";

  this.catchSound = this.application.sounds.sound.get("sound_catch");

  this.box = null;

  this.onCollectedChanged = null;
};

//-------------------------
// INIT
//-------------------------

runmysteriet.handler.ShieldHandler.prototype.init = function () {

  var words = [
    "apa", "fagel", "tiger", "lejon", "bjorn",
    "ratta", "varg", "orm", "hare", "uggla"
  ];

  var word = words[Math.floor(Math.random() * words.length)];
  this.m_word = word;

  var startX = 300;
  var endX = this.m_levelWidth - 300;

  var spacing = (word.length > 1)
    ? (endX - startX) / (word.length - 1)
    : 0;

  console.log("WORD:", word);

  for (var i = 0; i < word.length; i++) {

    var shield = new runmysteriet.ui.Shield();

    shield.x = startX + i * spacing;
    shield.y = 140;

    shield.__collected = false;
    shield.active = true;

    shield.setRune(word[i]);

    this.m_shields.push(shield);
    this.m_stage.addChild(shield);
  }
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

  if (this.onCollectedChanged) {
    this.onCollectedChanged(this.getRuneString());
  }
};

//-------------------------
// STRING (HELA ORDET)
//-------------------------

runmysteriet.handler.ShieldHandler.prototype.getRuneString = function () {

  var result = "";

  for (var i = 0; i < this.m_collected.length; i++) {
    if (this.m_collected[i] && this.m_collected[i].rune) {
      result += this.m_collected[i].rune;
    }
  }

  return result;
};

//-------------------------
// ARRAY (RUNOR)
//-------------------------

runmysteriet.handler.ShieldHandler.prototype.getCollectedRunes = function () {

  var result = [];

  for (var i = 0; i < this.m_collected.length; i++) {
    if (this.m_collected[i]) {
      result.push(this.m_collected[i].rune);
    }
  }

  return result;
};

//-------------------------
// RAW OBJECTS
//-------------------------

runmysteriet.handler.ShieldHandler.prototype.getCollected = function () {
  return this.m_collected || [];
};

//-------------------------
// RESULT
//-------------------------

runmysteriet.handler.ShieldHandler.prototype.getResult = function () {

  return {
    word: this.m_word,
    collected: this.getCollectedRunes()
  };
};

runmysteriet.handler.ShieldHandler.prototype.allRunesColected = function() {

  if (!this.m_word) {
    return false;
  }

  return this.m_collected.length >= this.m_word.length;
};
runmysteriet.handler.ShieldHandler.prototype.getWord = function () {
  return this.m_word;
};