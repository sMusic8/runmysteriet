//------------------------------------------------------------------------------
// DISEASE
//------------------------------------------------------------------------------

/**
 * Representerar en skadlig "disease" (t.ex. gift/moln) som skadar spelaren.
 *
 * @constructor
 * @extends {rune.display.Sprite}
 * @param {number=} x - Startposition X
 * @param {number=} y - Startposition Y
 * @param {string=} type - Typ av disease ("red", "brown", etc)
 */
runmysteriet.entity.Disease = function (x, y, type) {

  /**
   * Hämta data baserat på typ.
   * @type {{texture: string, damage: number}}
   */
  var data = runmysteriet.entity.Disease.getData(type);

  //Anropa basklass (Sprite)
  rune.display.Sprite.call(this, x || 0, y || 0, 15, 15, data.texture);

  /** @type {string} */
  this.type = type;

  /**
   * Skada som appliceras på spelaren vid kontakt.
   * @type {number}
   */
  this.damage = data.damage;

  /**
   * Flagga för att identifiera disease-objekt.
   * @type {boolean}
   */
  this.isDisease = true;

  /**
   * Om objektet är aktivt.
   * @type {boolean}
   */
  this.isActive = true;

  /**
   * Ursprunglig Y-position (för svävande effekt).
   * @type {number}
   */
  this.baseY = this.y;

  /**
   * Intern timer för sinus-rörelse.
   * @type {number}
   */
  this.m_floatTime = Math.random() * 100;

  //Varje disease-spritesheet har 4 frames.

  this.animation.create("idle", [0, 1, 2, 3], 10, true);
  this.animation.gotoAndPlay("idle");
};

runmysteriet.entity.Disease.prototype = Object.create(
  rune.display.Sprite.prototype
);

/** @override */
runmysteriet.entity.Disease.prototype.constructor =
  runmysteriet.entity.Disease;

/**
 * Returnerar data för en viss disease-typ.
 *
 * @param {string=} type
 * @return {{texture: string, damage: number}}
 */
runmysteriet.entity.Disease.getData = function (type) {

  if (type === "red") {
    return {
      texture: "sick2",
      damage: 50
    };
  }

  if (type === "brown") {
    return {
      texture: "sick1",
      damage: 30
    };
  }

  // Default
  return {
    texture: "sick3",
    damage: 10
  };
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

/**
 * Uppdaterar disease varje frame.
 *
 * Spelar animation
 * Skapar en svävande effekt med sinus
 *
 * @param {number} step
 * @return {void}
 */
runmysteriet.entity.Disease.prototype.update = function (step) {

  rune.display.Sprite.prototype.update.call(this, step);

  this.m_floatTime += 0.08;

  /**
   * Svävande rörelse:
   * Rör sig upp/ner kring baseY
   */
  this.y = this.baseY + Math.sin(this.m_floatTime) * 2;
};

/**
 * Tar bort disease från spelet.
 *
 * @return {void}
 */
runmysteriet.entity.Disease.prototype.remove = function () {

  this.isActive = false;

  if (this.stage) {
    this.stage.removeChild(this);
  }
};