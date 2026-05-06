//------------------------------------------------------------------------------
// NAMESPACE
//------------------------------------------------------------------------------

var runmysteriet = runmysteriet || {};
runmysteriet.handler = runmysteriet.handler || {};

//------------------------------------------------------------------------------
// SHIELD HANDLER
//------------------------------------------------------------------------------

/**
 * Handles shield word collection logic.
 *
 * @constructor
 * @param {!rune.display.Stage} stage
 * @param {!Object} application
 * @param {number} levelWidth
 */
runmysteriet.handler.ShieldHandler = function (stage, application, levelWidth) {

  /** @type {!rune.display.Stage} */
  this.m_stage = stage;

  /** @type {!Object} */
  this.application = application;

  /**
   * Banans totala bredd.
   * @type {number}
   */
  this.m_levelWidth = levelWidth;

  /** @type {!Array<!runmysteriet.ui.Shield>} */
  this.m_shields = [];

  /** @type {!Array<!runmysteriet.ui.Shield>} */
  this.m_collected = [];

  /** @type {string} */
  this.m_word = "";

  /** @type {?Object} */
  this.catchSound = this.application.sounds.sound.get("sound_catch");
};

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

/**
 * Initializes shields and generates word.
 *
 * @return {void}
 */
runmysteriet.handler.ShieldHandler.prototype.init = function () {

  var words = [
    "apa",
    "fagel",
    "tiger",
    "lejon",
    "bjorn",
    "ratta",
    "varg",
    "orm",
    "hare",
    "uggla",
  ];

  var word = words[Math.floor(Math.random() * words.length)];
  this.m_word = word;

  var startX = 300;
  var endX = this.m_levelWidth - 300;

  /** @type {number} */
  var spacing = 0;

  if (word.length > 1) {
    spacing = (endX - startX) / (word.length - 1);
  }

  console.log("WORD:", word);

  for (var i = 0; i < word.length; i++) {

    /** @type {!runmysteriet.ui.Shield} */
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

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

/**
 * Updates shield collisions.
 *
 * @param {!Array<!Object>} players
 * @return {void}
 */
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

//------------------------------------------------------------------------------
// COLLECT
//------------------------------------------------------------------------------

/**
 * Collects a shield.
 *
 * @param {!runmysteriet.ui.Shield} shield
 * @return {void}
 */
runmysteriet.handler.ShieldHandler.prototype.collectShield = function (shield) {

  if (!shield || shield.__collected) return;

  shield.__collected = true;
  shield.active = false;

  this.catchSound.play(true);

  console.log("Letter on pickup:", shield.rune);

  this.m_stage.removeChild(shield);

  var index = this.m_shields.indexOf(shield);

  if (index !== -1) {
    this.m_shields.splice(index, 1);
  }

  this.m_collected.push(shield);

  console.log("Collected shield:", shield);
  console.log("Total collected:", this.m_collected.length);
};

//------------------------------------------------------------------------------
// GETTERS
//------------------------------------------------------------------------------

/**
 * @return {!Array<!runmysteriet.ui.Shield>}
 */
runmysteriet.handler.ShieldHandler.prototype.getCollected = function () {
  return this.m_collected;
};

/**
 * Checks if all runes are collected.
 *
 * @return {boolean}
 */
runmysteriet.handler.ShieldHandler.prototype.allRunesColected = function () {
  return this.m_word.length > 0 &&
         this.m_collected.length >= this.m_word.length;
};