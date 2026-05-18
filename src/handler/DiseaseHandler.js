//------------------------------------------------------------------------------
// DISEASE HANDLER
//------------------------------------------------------------------------------

/**
 * Hanterar alla sjukdomar i spelet.
 *
 * @constructor
 * @param {!rune.display.Stage} stage
 * @param {Object=} application
 */
runmysteriet.handler.DiseaseHandler = function (stage, application) {

  this.stage = stage;
  this.application = application || null;

  this.diseases = [];
};

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.handler.DiseaseHandler.prototype.init = function (
  levelNumber,
  diseaseSpawns
) {

  this.clear();

  if (!diseaseSpawns || diseaseSpawns.length === 0) {
    return;
  }

  for (var i = 0; i < diseaseSpawns.length; i++) {
    this.addDisease(
      diseaseSpawns[i].type,
      diseaseSpawns[i].x,
      diseaseSpawns[i].y
    );
  }
};

//------------------------------------------------------------------------------
// ADD DISEASE
//------------------------------------------------------------------------------

runmysteriet.handler.DiseaseHandler.prototype.addDisease = function (
  type,
  x,
  y
) {

  var disease = new runmysteriet.entity.Disease(x, y, type);

  this.diseases.push(disease);
  this.stage.addChild(disease);

  return disease;
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

runmysteriet.handler.DiseaseHandler.prototype.update = function (
  players,
  step
) {

  var i = 0;
  var j = 0;
  var disease = null;
  var player = null;

  if (!players) {
    return;
  }

  for (i = this.diseases.length - 1; i >= 0; i--) {

    disease = this.diseases[i];

    if (!disease || disease.isActive !== true) {
      this.diseases.splice(i, 1);
      continue;
    }

    if (typeof disease.update === "function") {
      disease.update(step);
    }

    for (j = 0; j < players.length; j++) {

      player = players[j];

      if (!player || player.isDead === true) {
        continue;
      }

      if (this.hitTestPlayerDisease(player, disease)) {

        // -------------------------------------------------
        // DAMAGE
        // -------------------------------------------------
        player.hp -= disease.damage;

        if (player.hp < 0) {
          player.hp = 0;
        }

        // -------------------------------------------------
        // SOUND (SAFE FIX)
        // -------------------------------------------------
        if (this.application &&
            this.application.sounds &&
            this.application.sounds.sound) {

          this.snezSound =
            this.application.sounds.sound.get("sound_snez");

          if (this.snezSound) {
            this.snezSound.play();
          }
        }

        // -------------------------------------------------
        // REMOVE DISEASE
        // -------------------------------------------------
        disease.remove();
        this.diseases.splice(i, 1);

        break;
      }
    }
  }
};

//------------------------------------------------------------------------------
// CLEAR
//------------------------------------------------------------------------------

runmysteriet.handler.DiseaseHandler.prototype.clear = function () {

  var i = 0;
  var disease = null;

  for (i = 0; i < this.diseases.length; i++) {

    disease = this.diseases[i];

    if (disease && disease.parent) {
      disease.parent.removeChild(disease);
    }
  }

  this.diseases = [];
};

//------------------------------------------------------------------------------
// COLLISION
//------------------------------------------------------------------------------

runmysteriet.handler.DiseaseHandler.prototype.hitTestPlayerDisease =
function (player, disease) {

  var playerLeft = 0;
  var playerRight = 0;
  var playerTop = 0;
  var playerBottom = 0;

  var diseaseLeft = 0;
  var diseaseRight = 0;
  var diseaseTop = 0;
  var diseaseBottom = 0;

  var playerHitboxHeight = 0;

  var playerPaddingX = 8;
  var diseasePaddingX = 2;
  var diseasePaddingTop = 2;
  var diseasePaddingBottom = 4;

  if (!player || !disease) {
    return false;
  }

  playerLeft = player.x + playerPaddingX;
  playerRight = player.x + player.width - playerPaddingX;

  playerBottom = player.y + player.height / 2;

  if (player.isCrouching === true) {
    playerHitboxHeight = 10;
  } else {
    playerHitboxHeight = player.height - 6;
  }

  playerTop = playerBottom - playerHitboxHeight;

  diseaseLeft = disease.x + diseasePaddingX;
  diseaseRight = disease.x + disease.width - diseasePaddingX;

  diseaseTop = disease.y + diseasePaddingTop;
  diseaseBottom = disease.y + disease.height - diseasePaddingBottom;

  return (
    playerRight > diseaseLeft &&
    playerLeft < diseaseRight &&
    playerBottom > diseaseTop &&
    playerTop < diseaseBottom
  );
};