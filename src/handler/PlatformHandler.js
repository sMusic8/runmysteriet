//------------------------------------------------------------------------------
// PLATFORM HANDLER
//------------------------------------------------------------------------------

/**
 * Hanterar generering och lagring av alla plattformsrelaterade element i en bana.
 *
 * @constructor
 * @param {!rune.display.Stage} stage
 * @param {number} screenWidth
 */
runmysteriet.handler.PlatformHandler = function (stage, application, screenWidth) {
  /** @type {!rune.display.Stage} */
  this.stage = stage;

  /** @type {number} */
  this.screenWidth = screenWidth;
  this.application = application;

  /** @type {!Array} */
  this.platforms = [];

  /** @type {!Array} */
  this.holes = [];

  /** @type {!Array} */
  this.enemySpawns = [];

  /** @type {!Array} */
  this.waterAreas = [];

  /** @type {!Array} */
  this.boats = [];

  /** @type {!Array} */
  this.endZones = [];

  /** @type {!Array} */
  this.diseaseSpawns = [];

  /** @type {!Array} */
  this.runeSpawns = [];

  /** @type {!Array} */
  this.armorSpawns = [];

  /** @type {number} */
  this.levelWidth = 0;

  /** @type {number} */
  this.levelNumber = 1;

  /**@type {object} */
  this.m_extra = null;
};

/**
 * Initierar levelgenerering och bygger hela banan.
 *
 * @param {number=} levelNumber
 * @return {void}
 */
runmysteriet.handler.PlatformHandler.prototype.init = function (levelNumber) {
  var x = 0;
  var i = 0;
  var segment = null;
  var result = null;
  var SegmentClass = null;

  var pool = null;
  var beforeWaterCount = 0;
  var afterWaterCount = 0;
  var totalRandomCount = 0;
  var chosenSegments = null;

  //Om PlatformHandler återanvänds ska gamla objekt bort först.
   
  this.clear();

  this.levelNumber = levelNumber || 1;

  pool = this.getSegmentPool();

  beforeWaterCount = this.getSegmentsBeforeWaterCount();
  afterWaterCount = this.getSegmentsAfterWaterCount();
  totalRandomCount = beforeWaterCount + afterWaterCount;

  chosenSegments = this.getRandomSegments(pool, totalRandomCount);

  segment = new runmysteriet.segments.Segment_Start();
  result = segment.ground(this.stage, x, this.levelNumber);

  this.addSegmentResult(result);
  x = result.endX;

  for (i = 0; i < beforeWaterCount; i++) {
    SegmentClass = chosenSegments[i];

    if (!SegmentClass) {
      continue;
    }

    segment = new SegmentClass();
    result = segment.ground(this.stage, x, this.levelNumber);

    this.addSegmentResult(result);
    x = result.endX;
  }

  segment = new runmysteriet.segments.Segment_Water();
  result = segment.ground(this.stage, x, this.levelNumber);

  this.addSegmentResult(result);
  x = result.endX;

  for (i = 0; i < afterWaterCount; i++) {
    SegmentClass = chosenSegments[beforeWaterCount + i];

    if (!SegmentClass) {
      continue;
    }

    segment = new SegmentClass();
    result = segment.ground(this.stage, x, this.levelNumber);

    this.addSegmentResult(result);
    x = result.endX;
  }
  segment = new runmysteriet.segments.Segment_End();
  result = segment.ground(this.stage, x, this.levelNumber); //m_extra blasndannat

  this.addSegmentResult(result);
  x = result.endX;

  this.levelWidth = x;
};

/**
 * Lägger till allt som ett segment skapat.
 *
 * @param {?Object} result
 * @return {void}
 */
runmysteriet.handler.PlatformHandler.prototype.addSegmentResult = function (
  result
) {
  if (!result) {
    return;
  }

  this.addPlatforms(result.platforms || []);
  this.addHoles(result.holes || []);
  this.addEnemySpawns(result.enemySpawns || []);
  this.addWaterAreas(result.waterAreas || []);
  this.addBoats(result.boats || []);
  this.addEndZones(result.endZones || []);
  this.addDiseaseSpawns(result.diseaseSpawns || []);
  this.addRuneSpawns(result.runeSpawns || []);
  this.addArmorSpawns(result.armorSpawns || []);
  this.m_extra = result.m_extra || null;

  if (this.m_extra) {
      this.setupExtraPulse(this.m_extra);
  }
};

/**
 * Returnerar referensen till "extra"-objektet i PlatformHandler.
 * 
 * @return {*} m_extra Det sparade extra-objektet, eller undefined om det inte finns.
 */
runmysteriet.handler.PlatformHandler.prototype.getExtra = function () {
    return this.m_extra;
};

/**
 * Tar bort och nollställer "extra"-objektet i PlatformHandler.
 *
 * @return {void}
 */
runmysteriet.handler.PlatformHandler.prototype.clearExtra = function () {
  
    this.removeDisplayObject(this.m_extra);
    this.m_extra = null;
};

/**
 * Förbereder extra-poäng-bilden för pulserande effekt.
 *
 * @param {?Object} extra
 * @return {void}
 */
runmysteriet.handler.PlatformHandler.prototype.setupExtraPulse = function(
    extra
) {

    if (!extra) {
        return;
    }

    extra.pulseTimer = 0;
    extra.pulseSpeed = 0.18;
    extra.pulseAmount = 0.18;

    extra.baseScaleX = 1;
    extra.baseScaleY = 1;

    extra.scaleX = 1;
    extra.scaleY = 1;
};

/**
 * Uppdaterar pulserande effekt för extra-poäng-bilden.
 *
 * @return {void}
 */
runmysteriet.handler.PlatformHandler.prototype.updateExtraPulse = function() {

    var pulse = 0;

    if (!this.m_extra) {
        return;
    }

    if (this.m_extra.visible === false) {
        return;
    }

    this.m_extra.pulseTimer += this.m_extra.pulseSpeed || 0.12;

    pulse =
        1 +
        Math.sin(this.m_extra.pulseTimer) *
        (this.m_extra.pulseAmount || 0.12);

    this.m_extra.scaleX = pulse;
    this.m_extra.scaleY = pulse;
};

/**
 * Lägger till plattformar.
 *
 * @param {?Array} platforms
 * @return {void}
 */
runmysteriet.handler.PlatformHandler.prototype.addPlatforms = function (
  platforms
) {
  var i = 0;

  if (!platforms) {
    return;
  }

  for (i = 0; i < platforms.length; i++) {
    this.platforms.push(platforms[i]);
  }
};

/**
 * Lägger till hål.
 *
 * @param {?Array} holes
 * @return {void}
 */
runmysteriet.handler.PlatformHandler.prototype.addHoles = function (holes) {
  var i = 0;

  if (!holes) {
    return;
  }

  for (i = 0; i < holes.length; i++) {
    this.holes.push(holes[i]);
  }
};

/**
 * Lägger till enemy spawn points.
 *
 * @param {?Array} enemySpawns
 * @return {void}
 */
runmysteriet.handler.PlatformHandler.prototype.addEnemySpawns = function (
  enemySpawns
) {
  var i = 0;

  if (!enemySpawns) {
    return;
  }

  for (i = 0; i < enemySpawns.length; i++) {
    this.enemySpawns.push(enemySpawns[i]);
  }
};

/**
 * Lägger till vattenytor.
 *
 * @param {?Array} waterAreas
 * @return {void}
 */
runmysteriet.handler.PlatformHandler.prototype.addWaterAreas = function (
  waterAreas
) {
  var i = 0;

  if (!waterAreas) {
    return;
  }

  for (i = 0; i < waterAreas.length; i++) {
    this.waterAreas.push(waterAreas[i]);
  }
};

/**
 * Lägger till båtar.
 *
 * @param {?Array} boats
 * @return {void}
 */
runmysteriet.handler.PlatformHandler.prototype.addBoats = function (boats) {
  var i = 0;

  if (!boats) {
    return;
  }

  for (i = 0; i < boats.length; i++) {
    this.boats.push(boats[i]);
  }
};

/**
 * Lägger till end zones.
 *
 * @param {?Array} endZones
 * @return {void}
 */
runmysteriet.handler.PlatformHandler.prototype.addEndZones = function (
  endZones
) {
  var i = 0;

  if (!endZones) {
    return;
  }

  for (i = 0; i < endZones.length; i++) {
    this.endZones.push(endZones[i]);
  }
};

/**
 * Lägger till disease spawns.
 *
 * @param {?Array} diseaseSpawns
 * @return {void}
 */
runmysteriet.handler.PlatformHandler.prototype.addDiseaseSpawns = function (
  diseaseSpawns
) {
  var i = 0;

  if (!diseaseSpawns) {
    return;
  }

  for (i = 0; i < diseaseSpawns.length; i++) {
    this.diseaseSpawns.push(diseaseSpawns[i]);
  }
};

/**
 * Lägger till rune spawns.
 *
 * @param {?Array} runeSpawns
 * @return {void}
 */
runmysteriet.handler.PlatformHandler.prototype.addRuneSpawns = function (
  runeSpawns
) {
  var i = 0;

  if (!runeSpawns) {
    return;
  }

  for (i = 0; i < runeSpawns.length; i++) {
    this.runeSpawns.push(runeSpawns[i]);
  }
};

/**
 * Lägger till armor spawns.
 *
 * @param {?Array} armorSpawns
 * @return {void}
 */
runmysteriet.handler.PlatformHandler.prototype.addArmorSpawns = function (
  armorSpawns
) {
  var i = 0;

  if (!armorSpawns) {
    return;
  }

  for (i = 0; i < armorSpawns.length; i++) {
    this.armorSpawns.push(armorSpawns[i]);
  }
};

/**
 * @return {!Array}
 */
runmysteriet.handler.PlatformHandler.prototype.getEnemySpawns = function () {
  return this.enemySpawns;
};

/**
 * @return {!Array}
 */
runmysteriet.handler.PlatformHandler.prototype.getEndZones = function () {
  return this.endZones;
};
/**
 * @return {!Array}
 */
runmysteriet.handler.PlatformHandler.prototype.getDiseaseSpawns = function () {
  return this.diseaseSpawns;
};

/**
 * @return {!Array}
 */
runmysteriet.handler.PlatformHandler.prototype.getRuneSpawns = function () {
  return this.runeSpawns;
};

/**
 * @return {!Array}
 */
runmysteriet.handler.PlatformHandler.prototype.getArmorSpawns = function () {
  return this.armorSpawns;
};

/**
 * Uppdaterar hål och kontrollerar om spelare faller.
 *
 * @param {?Array.<Object>} players
 * @param {Function=} onPlayerDead
 * @return {void}
 */
runmysteriet.handler.PlatformHandler.prototype.updateHoles = function (
  players,
  onPlayerDead
) {
  var i = 0;
  var j = 0;
  var player = null;
  var hole = null;

  if (!players || !this.holes) {
    return;
  }

  for (i = 0; i < players.length; i++) {
    player = players[i];

    if (!player || player.isDead === true) {
      continue;
    }

    for (j = 0; j < this.holes.length; j++) {
      hole = this.holes[j];

      if (!hole || typeof hole.hasPlayerFallen !== "function") {
        continue;
      }

      if (hole.hasPlayerFallen(player)) {
        if (onPlayerDead) {
          onPlayerDead(player, i);
        }

        break;
      }
    }
  }
};

/**
 * Startar tween-animationer för alla registrerade båtar.
 *
 * Använder varje båts `startTween`-metod om den finns.
 *
 * @param {Object} tweens Tween-manager som hanterar animationer.
 * @return {void}
 */
runmysteriet.handler.PlatformHandler.prototype.startBoatTweens = function (
  tweens
) {
  /** @type {number} */
  var i = 0;

  /** @type {?Object} */
  var boat = null;

  if (!tweens || !this.boats) {
    return;
  }

  for (i = 0; i < this.boats.length; i++) {
    boat = this.boats[i];

    if (!boat) {
      continue;
    }

    if (typeof boat.startTween === "function") {
      boat.startTween(tweens, boat.minX, boat.maxX);
    }
  }
};

/**
 * Uppdaterar plattformsrelaterade objekt.
 *
 * @param {number=} step
 * @return {void}
 */
runmysteriet.handler.PlatformHandler.prototype.update = function (step) {
  /** @type {number} */
  var i = 0;

  /** @type {?Object} */
  var hole = null;

  /** @type {?Object} */
  var platform = null;

  if (this.holes) {
    for (i = 0; i < this.holes.length; i++) {
      hole = this.holes[i];

      if (hole && typeof hole.update === "function") {
        hole.update(step);
      }
    }
  }

      this.updateExtraPulse();
};

/**
 * Returnerar antal plattformssegment som ska placeras före vattenområdet.
 * Används för att variera level-design beroende på svårighetsgrad.
 *
 * @return {number}
 */
runmysteriet.handler.PlatformHandler.prototype.getSegmentsBeforeWaterCount =
  function () {
    if (this.levelNumber >= 11) {
      return 3;
    }

    return 2;
  };

/**
 * Returnerar antal plattformssegment som ska placeras efter vattenområdet.
 * Används för att balansera level-layout beroende på levelnummer.
 *
 * @return {number}
 */
runmysteriet.handler.PlatformHandler.prototype.getSegmentsAfterWaterCount =
  function () {
    if (this.levelNumber >= 6) {
      return 2;
    }

    return 1;
  };
/**
 * @return {!Array}
 */
runmysteriet.handler.PlatformHandler.prototype.getSegmentPool = function () {
  if (this.levelNumber >= 11) {
    return [
      runmysteriet.segments.Segment_1,
      runmysteriet.segments.Segment_2,
      runmysteriet.segments.Segment_3,
      runmysteriet.segments.Segment_4,
      runmysteriet.segments.Segment_5,
      runmysteriet.segments.Segment_6,
    ];
  }

  if (this.levelNumber >= 6) {
    return [
      runmysteriet.segments.Segment_1,
      runmysteriet.segments.Segment_2,
      runmysteriet.segments.Segment_3,
      runmysteriet.segments.Segment_4,
      runmysteriet.segments.Segment_5,
    ];
  }

  return [
    runmysteriet.segments.Segment_1,
    runmysteriet.segments.Segment_2,
    runmysteriet.segments.Segment_3,
    runmysteriet.segments.Segment_4,
  ];
};
/**
 * Hämtar slumpade segmentklasser.
 *
 * @param {?Array} pool
 * @param {number} count
 * @return {!Array}
 */
runmysteriet.handler.PlatformHandler.prototype.getRandomSegments = function (
  pool,
  count
) {
  var copy = [];
  var result = [];
  var index = 0;

  if (!pool) {
    return result;
  }

  copy = pool.slice();

  while (result.length < count && copy.length > 0) {
    index = Math.floor(Math.random() * copy.length);

    result.push(copy[index]);
    copy.splice(index, 1);
  }

  return result;
};

/**
 * Returnerar antal armor som kan spawnas beroende på nivå.
 * ArmorHandler har också egen count-logik, men metoden får ligga kvar
 * för bakåtkompatibilitet om någon annan kod anropar den.
 *
 * @return {number}
 */
runmysteriet.handler.PlatformHandler.prototype.getArmorCount = function () {
  if (this.levelNumber >= 11) {
    return 4;
  }

  if (this.levelNumber >= 6) {
    return 3;
  }

  return 2;
};

/**
 * Tar bort ett display object från stage.
 *
 * @param {?Object} object
 * @return {void}
 */
runmysteriet.handler.PlatformHandler.prototype.removeDisplayObject = function (
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

  if (object.parent) {
    object.parent.removeChild(object);
    return;
  }

  if (object.stage) {
    object.stage.removeChild(object);
  }
};

/**
 * Tar bort alla display objects i en lista.
 *
 * @param {?Array} list
 * @return {void}
 */
runmysteriet.handler.PlatformHandler.prototype.clearDisplayList = function (
  list
) {
  var i = 0;

  if (!list) {
    return;
  }

  for (i = 0; i < list.length; i++) {
    this.removeDisplayObject(list[i]);
  }
};

/**
 * Tar bort alla plattformsobjekt från stage och tömmer listor.
 *
 * @return {void}
 */
runmysteriet.handler.PlatformHandler.prototype.clear = function () {
  this.clearExtra();
  this.clearDisplayList(this.platforms);
  this.clearDisplayList(this.holes);
  this.clearDisplayList(this.waterAreas);
  this.clearDisplayList(this.boats);
  this.clearDisplayList(this.endZones);

  this.platforms = [];
  this.holes = [];
  this.enemySpawns = [];
  this.waterAreas = [];
  this.boats = [];
  this.endZones = [];
  this.diseaseSpawns = [];
  this.runeSpawns = [];
  this.armorSpawns = [];

  this.levelWidth = 0;
  this.levelNumber = 1;
};

/**
 * Rensar PlatformHandler helt.
 *
 * @return {void}
 */
runmysteriet.handler.PlatformHandler.prototype.dispose = function () {
  this.clear();

  this.stage = null;
  this.screenWidth = 0;
};
