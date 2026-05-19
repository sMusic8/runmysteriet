/**
 * Kristen entity.
 *
 * @constructor
 * @extends {rune.display.Sprite}
 */
runmysteriet.entity.Kristen = function (texture, x, y) {
  rune.display.Sprite.call(this, x || 0, y || 0, 32, 40, texture);
this.speed = 0.5;
this.direction = 1; // 1 = höger, -1 = vänster

this.startX = x || 0;
this.patrolDistance = 60; // hur långt hon går
  this.hp = 100;
  this.maxHp = 100;
  this.hitCooldown = 0;
  this.hpBar = null;
  this.isDead = false;

  /** @type {string} */
  this.currentHpTexture = "hpbar1";

  if (rune.physics && rune.physics.Space) {
    this.allowCollisions = rune.physics.Space.ANY;
  }

  this.immovable = true;
};

runmysteriet.entity.Kristen.prototype = Object.create(
  rune.display.Sprite.prototype
);
runmysteriet.entity.Kristen.prototype.constructor =
  runmysteriet.entity.Kristen;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.entity.Kristen.prototype.init = function () {
  rune.display.Sprite.prototype.init.call(this);

  this.animation.create("start", [0, 1, 2], 3, true);
  this.animation.gotoAndPlay("start");

  this.hpBar = new rune.display.Graphic(0, 0, 32, 4, "hpbar1");
  this.hpBar.anchorX = 0;
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

runmysteriet.entity.Kristen.prototype.update = function (step) {
  if (this.isDead) return;

  rune.display.Sprite.prototype.update.call(this, step);

  if (this.hitCooldown > 0) {
    this.hitCooldown--;
  }

  // Lägg till hpBar EN gång
  if (this.hpBar && this.stage && !this.hpBar.stage) {
    this.stage.addChild(this.hpBar);
  }

  if (this.hpBar) {
    this.hpBar.x = this.x;
    this.hpBar.y = this.y - 8;

    // skala hp
    var p = this.hp / this.maxHp;
    if (p < 0) p = 0;
    this.hpBar.scaleX = p;

    // 🔥 BESTÄM RÄTT TEXTUR
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

    // 🔥 BYT ENDAST OM DEN ÄNDRAS
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
runmysteriet.entity.Kristen.prototype.handleCollision = function (player) {
  if (!player || player.isDead === true) return;

  if (typeof player.hitTestAndSeparate !== "function") return;

  var hit = player.hitTestAndSeparate(this);
  if (!hit) return;

  if (this.hitCooldown > 0) return;

  this.hitCooldown = 20;
  this.takeDamage(10);
};
runmysteriet.entity.Kristen.prototype.takeDamage = function (damage) {
  if (this.isDead) return;

  this.hp -= damage;

  console.log("Kristen tog skada:", damage, "HP kvar:", this.hp);

  // 🔊 HIT LJUD (fix: stop så det alltid spelas)
  if (!this.hitsound) {
    this.hitsound = this.application.sounds.sound.get("sound_hit_flesh");
  }

  if (this.hitsound) {
    this.hitsound.stop();
    this.hitsound.play();
  }

  if (this.hp <= 0) {
    if (!this.deadSound) {
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

runmysteriet.entity.Kristen.prototype.die = function () {
  if (this.isDead) return;

  this.isDead = true;

  console.log("Kristen död");

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

    /*
     * Om spelaren är till vänster om Kristen ska Kristen titta vänster.
     */
    if (playerCenterX < kristenCenterX) {
        this.flippedX = true;
    } else {
        this.flippedX = false;
    }
};

//------------------------------------------------------------------------------
// PLAYER COLLISION LOOP
//------------------------------------------------------------------------------

runmysteriet.entity.Kristen.prototype.checkPlayerCollisions = function (players) {
  if (!players) return;

  for (var i = 0; i < players.length; i++) {
    this.handleCollision(players[i]);
  }
};