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

  // -------------------------------------------------
  // PULSE DATA (stör inte sprite animation)
  // -------------------------------------------------
  disease.m_baseScale = 1.5;
  disease.m_pulseSpeed = 0.006;
  disease.m_pulseValue = Math.random() * Math.PI * 2;

  // -------------------------------------------------
  // WRAP update istället för att ersätta den
  // -------------------------------------------------
  var originalUpdate = disease.update;

  disease.update = function (step) {

    // kör sprite animationen först (VIKTIGT)
    if (typeof originalUpdate === "function") {
      originalUpdate.call(this, step);
    }

    // sedan pulse
    this.m_pulseValue += this.m_pulseSpeed;

    var scale = this.m_baseScale + Math.sin(this.m_pulseValue) * 0.22;

    this.scaleX = scale;
    this.scaleY = scale;
  };

  return disease;
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

runmysteriet.handler.DiseaseHandler.prototype.update = function (
  players,
  step
) {

  if (!players) {
    return;
  }

  for (var i = this.diseases.length - 1; i >= 0; i--) {

    var disease = this.diseases[i];

    if (!disease || disease.isActive !== true) {
      this.diseases.splice(i, 1);
      continue;
    }

    if (typeof disease.update === "function") {
      disease.update(step);
    }

    for (var j = 0; j < players.length; j++) {

      var player = players[j];

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
        // SOUND (SAFE)
        // -------------------------------------------------
        if (this.application &&
            this.application.sounds &&
            this.application.sounds.sound) {

          var snezSound =
            this.application.sounds.sound.get("sound_snez");

          if (snezSound) {
            snezSound.play();
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

  for (var i = 0; i < this.diseases.length; i++) {

    var disease = this.diseases[i];

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

  if (!player || !disease) {
    return false;
  }

  var playerPaddingX = 8;
  var diseasePaddingX = 2;
  var diseasePaddingTop = 2;
  var diseasePaddingBottom = 4;

  var playerLeft = player.x + playerPaddingX;
  var playerRight = player.x + player.width - playerPaddingX;

  var playerBottom = player.y + player.height / 2;

  var playerHitboxHeight = player.isCrouching ? 10 : player.height - 6;
  var playerTop = playerBottom - playerHitboxHeight;

  var diseaseLeft = disease.x + diseasePaddingX;
  var diseaseRight = disease.x + disease.width - diseasePaddingX;

  var diseaseTop = disease.y + diseasePaddingTop;
  var diseaseBottom = disease.y + disease.height - diseasePaddingBottom;

  return (
    playerRight > diseaseLeft &&
    playerLeft < diseaseRight &&
    playerBottom > diseaseTop &&
    playerTop < diseaseBottom
  );
};