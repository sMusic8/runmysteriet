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

/**
 * Initierar DiseaseHandler genom att rensa tidigare diseases och skapa nya från spawn-data.
 *
 * @param {number} levelNumber - Aktuellt levelnummer (används för framtida scaling/logic).
 * @param {!Array<!Object>} diseaseSpawns - Lista med spawnpunkter för diseases.
 *        
 * @return {void}
 */
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
/**
 * Skapar en ny Disease och lägger till den i scenen och registrerar den i handlern.
 *
 * @param {string} type - Typ av disease (bestämmer texture och damage).
 * @param {number} x - Position X i världen.
 * @param {number} y - Position Y i världen.
 * @return {!runmysteriet.entity.Disease} Den skapade disease-instansen.
 */
runmysteriet.handler.DiseaseHandler.prototype.addDisease = function (
  type,
  x,
  y
) {
  var disease = new runmysteriet.entity.Disease(x, y, type);

  this.diseases.push(disease);
  this.stage.addChild(disease);

  disease.m_baseScale = 1.5;
  disease.m_pulseSpeed = 0.006;
  disease.m_pulseValue = Math.random() * Math.PI * 2;


  var originalUpdate = disease.update;

  disease.update = function (step) {

    if (typeof originalUpdate === "function") {
      originalUpdate.call(this, step);
    }

    this.m_pulseValue += this.m_pulseSpeed;

    var scale = this.m_baseScale + Math.sin(this.m_pulseValue) * 0.22;

    this.scaleX = scale;
    this.scaleY = scale;
  };

  return disease;
};

/**
 * Uppdaterar alla diseases, hanterar animation och collision mot spelare.
 *
 * @param {!Array<!runmysteriet.entity.Player>} players - Lista med aktiva spelare.
 * @param {number} step - Game step / delta time.
 * @return {void}
 */
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

        player.hp -= disease.damage;

        if (player.hp < 0) {
          player.hp = 0;
        }

        if (this.application &&
            this.application.sounds &&
            this.application.sounds.sound) {

          var snezSound =
            this.application.sounds.sound.get("sound_snez");

          if (snezSound) {
            snezSound.play();
          }
        }

        disease.remove();
        this.diseases.splice(i, 1);

        break;
      }
    }
  }
};
/**
 * Tar bort alla diseases från scenen och rensar interna listan.
 *
 * @return {void}
 */
runmysteriet.handler.DiseaseHandler.prototype.clear = function () {

  for (var i = 0; i < this.diseases.length; i++) {

    var disease = this.diseases[i];

    if (disease && disease.parent) {
      disease.parent.removeChild(disease);
    }
  }

  this.diseases = [];
};
/**
 * Kontrollerar kollision mellan player och disease.
 *
 * @param {!runmysteriet.entity.Player} player - Spelaren som testas.
 * @param {!runmysteriet.entity.Disease} disease - Disease som testas.
 * @return {boolean} True om collision sker, annars false.
 */
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