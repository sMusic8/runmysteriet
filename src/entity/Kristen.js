//------------------------------------------------------------------------------
// KRISTEN ENTITY
//------------------------------------------------------------------------------

/**
 * Fiende-enhet (Kristen).
 *
 * Funktioner:
 * - Patrullerar fram och tillbaka
 * - Har HP + HP-bar
 * - Kan ta skada och dö
 * - Skadar spelare vid kollision
 * - Kan vända sig mot närmaste spelare
 *
 * @constructor
 * @extends {rune.display.Sprite}
 * @param {string} texture - Sprite-textur
 * @param {number=} x - Startposition X
 * @param {number=} y - Startposition Y
 */
runmysteriet.entity.Kristen = function (texture, x, y) {

  rune.display.Sprite.call(this, x || 0, y || 0, 32, 40, texture);

  /** @type {number} */
  this.speed = 0.5;

  /** @type {number} */
  this.direction = 1;

  /** @type {number} */
  this.startX = x || 0;

  /**
   * Hur långt fienden rör sig från startpunkt.
   * @type {number}
   */
  this.patrolDistance = 60;

  /** @type {number} */
  this.hp = 100;

  /** @type {number} */
  this.maxHp = 100;

  /**
   * Cooldown mellan träffar.
   * @type {number}
   */
  this.hitCooldown = 0;

  /**
   * HP-bar grafik.
   * @type {?rune.display.Graphic}
   */
  this.hpBar = null;

  /** @type {boolean} */
  this.isDead = false;

  /**
   * Nuvarande HP-bar textur.
   * @type {string}
   */
  this.currentHpTexture = "hpbar1";

  /**
   * Ljud (lazy init).
   * @type {?Object}
   */
  this.hitsound = null;

  /** @type {?Object} */
  this.deadSound = null;

  /**
   * Referens till application (kan sättas externt).
   * @type {?Object}
   */
  this.application = null;

  // Physics stöd
  if (rune.physics && rune.physics.Space) {
    this.allowCollisions = rune.physics.Space.ANY;
  }

  /** @type {boolean} */
  this.immovable = true;
};

//------------------------------------------------------------------------------
// INHERITANCE
//------------------------------------------------------------------------------

runmysteriet.entity.Kristen.prototype = Object.create(
  rune.display.Sprite.prototype
);

/** @override */
runmysteriet.entity.Kristen.prototype.constructor =
  runmysteriet.entity.Kristen;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

/**
 * Initierar animationer och HP-bar.
 * @return {void}
 */
runmysteriet.entity.Kristen.prototype.init = function () {

  rune.display.Sprite.prototype.init.call(this);

  // Animation
  this.animation.create("start", [0, 1, 2], 3, true);
  this.animation.gotoAndPlay("start");

  // HP bar
  this.hpBar = new rune.display.Graphic(0, 0, 32, 4, "hpbar1");
  this.hpBar.anchorX = 0;
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

/**
 * Uppdaterar fienden varje frame.
 *
 * - Hanterar HP-bar
 * - Cooldowns
 * - Rörelse (patrol)
 *
 * @param {number} step
 * @return {void}
 */
runmysteriet.entity.Kristen.prototype.update = function (step) {

  if (this.isDead) return;

  rune.display.Sprite.prototype.update.call(this, step);

  // Cooldown tick
  if (this.hitCooldown > 0) {
    this.hitCooldown--;
  }

  // Lägg till hpBar om den inte redan finns i stage
  if (this.hpBar && this.stage && !this.hpBar.stage) {
    this.stage.addChild(this.hpBar);
  }

  if (this.hpBar) {

    // Position
    this.hpBar.x = this.x;
    this.hpBar.y = this.y - 8;

    // Skala HP
    var p = this.hp / this.maxHp;
    if (p < 0) p = 0;

    this.hpBar.scaleX = p;

    // Texture baserat på HP
    var newTexture;

    if (this.hp > 80) {
      newTexture = "hpbar1";
    } else if (this.hp > 50) {
      newTexture = "hpbar2";
    } else if (this.hp > 30) {
      newTexture = "hpbar3";
    } else {
      newTexture = "hpbar4";
    }

    // Byt texture om behövs
    if (newTexture !== this.currentHpTexture) {

      this.currentHpTexture = newTexture;

      if (this.hpBar.stage) {
        this.hpBar.stage.removeChild(this.hpBar);
      }

      this.hpBar = new rune.display.Graphic(0, 0, 32, 4, newTexture);
      this.hpBar.anchorX = 0;

      if (this.stage) {
        this.stage.addChild(this.hpBar);
      }
    }
  }

  // Patrol rörelse
  this.x += this.speed * this.direction;

  if (this.x > this.startX + this.patrolDistance) {
    this.direction = -1;
  }

  if (this.x < this.startX - this.patrolDistance) {
    this.direction = 1;
  }
};

//------------------------------------------------------------------------------
// COLLISION
//------------------------------------------------------------------------------

/**
 * Hanterar kollision med spelare.
 *
 * @param {!Object} player
 * @return {void}
 */
runmysteriet.entity.Kristen.prototype.handleCollision = function(player) {

    var hit = false;

    if (!player || player.isDead === true) {
        return;
    }

    if (typeof player.hitTestAndSeparate !== "function") {
        return;
    }

    hit = player.hitTestAndSeparate(this);

    if (!hit) {
        return;
    }

    if (this.hitCooldown > 0) {
        return;
    }

    this.hitCooldown = 20;

    /*
     * Kristen ska inte ta skada av kroppskollision.
     * Skada på Kristen ska bara ske via spelarens attack.
     */
    if (player.hp !== undefined) {
        player.hp -= 10;

        if (player.hp < 0) {
            player.hp = 0;
        }
    }
};

//------------------------------------------------------------------------------
// DAMAGE
//------------------------------------------------------------------------------

/**
 * Applicerar skada på fienden.
 *
 * @param {number} damage
 * @return {void}
 */
runmysteriet.entity.Kristen.prototype.takeDamage = function (damage) {

  if (this.isDead) return;

  this.hp -= damage;

  // Lazy init ljud
  if (!this.hitsound && this.application) {
    this.hitsound = this.application.sounds.sound.get("sound_hit_flesh");
  }

  if (this.hitsound) {
    this.hitsound.stop();
    this.hitsound.play();
  }

  if (this.hp <= 0) {

    if (!this.deadSound && this.application) {
      this.deadSound = this.application.sounds.sound.get("sound_enemydead");
    }

    if (this.deadSound) {
      this.deadSound.play();
    }

    this.die();
  }
};

//------------------------------------------------------------------------------
// DIE
//------------------------------------------------------------------------------

/**
 * Dödar fienden och rensar grafik.
 * @return {void}
 */
runmysteriet.entity.Kristen.prototype.die = function () {

  if (this.isDead) return;

  this.isDead = true;

  this.visible = false;
  this.active = false;

  if (this.hpBar) {
    if (this.hpBar.stage) {
      this.hpBar.stage.removeChild(this.hpBar);
    }
    this.hpBar = null;
  }

  if (this.stage) {
    this.stage.removeChild(this);
  }
};

//------------------------------------------------------------------------------
// FACE PLAYER
//------------------------------------------------------------------------------

/**
 * Vänder Kristen mot närmaste levande spelare.
 *
 * @param {!Array<!runmysteriet.entity.Player>} players
 * @return {void}
 */
runmysteriet.entity.Kristen.prototype.faceNearestPlayer = function(players) {

    var nearestPlayer = null;
    var nearestDistance = Number.MAX_VALUE;
    var player = null;
    var distance = 0;
    var i = 0;

    var kristenCenterX = this.x + this.width / 2;
    var playerCenterX = 0;

    if (!players || this.isDead === true) {
        return;
    }

    for (i = 0; i < players.length; i++) {

        player = players[i];

        if (!player || player.isDead === true) {
            continue;
        }

        playerCenterX = player.x + player.width / 2;
        distance = Math.abs(playerCenterX - kristenCenterX);

        if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestPlayer = player;
        }
    }

    if (!nearestPlayer) {
        return;
    }

    playerCenterX = nearestPlayer.x + nearestPlayer.width / 2;

    if (playerCenterX < kristenCenterX) {
        this.flippedX = true;
    } else {
        this.flippedX = false;
    }
};

//------------------------------------------------------------------------------
// PLAYER COLLISION LOOP
//------------------------------------------------------------------------------

/**
 * Loopar igenom spelare och kollar kollision.
 *
 * @param {!Array<!Object>} players
 * @return {void}
 */
runmysteriet.entity.Kristen.prototype.checkPlayerCollisions = function (players) {

  if (!players) return;

  for (var i = 0; i < players.length; i++) {
    this.handleCollision(players[i]);
  }
};