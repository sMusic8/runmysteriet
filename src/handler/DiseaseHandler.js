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
runmysteriet.handler.DiseaseHandler = function(stage, application) {

    /** @type {!rune.display.Stage} */
    this.stage = stage;

    /** @type {?Object} */
    this.application = application || null;

    /** @type {!Array<!runmysteriet.entity.Disease>} */
    this.diseases = [];

    /** @type {?Object} */
    this.sneezeSound = null;

    if (
        this.application &&
        this.application.sounds &&
        this.application.sounds.sound
    ) {
        this.sneezeSound = this.application.sounds.sound.get("sound_snez");
    }
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

    var i = 0;
    var spawn = null;

    this.clear();

    if (!diseaseSpawns || diseaseSpawns.length === 0) {
        return;
    }

    for (i = 0; i < diseaseSpawns.length; i++) {
        spawn = diseaseSpawns[i];

        if (!spawn) {
            continue;
        }

        this.addDisease(
            spawn.type,
            spawn.x,
            spawn.y
        );
    }
};

/**
 * Skapar och lägger till en disease.
 *
 * @param {string=} type
 * @param {number=} x
 * @param {number=} y
 * @return {!runmysteriet.entity.Disease}
 */
runmysteriet.handler.DiseaseHandler.prototype.addDisease = function(type, x, y) {

    var disease = null;

    disease = new runmysteriet.entity.Disease(x, y, type);

    //Pulse data
    disease.m_baseScale = 1.5;
    disease.m_pulseSpeed = 0.006;
    disease.m_pulseValue = Math.random() * Math.PI * 2;

    this.diseases.push(disease);
    this.stage.addChild(disease);

    return disease;
};

/**
 * Uppdaterar sjukdomar och kollar kollision med spelare.
 *
 * @param {?Array<!Object>} players
 * @param {number=} step
 * @return {void}
 */
runmysteriet.handler.DiseaseHandler.prototype.update = function(players, step) {

    var i = 0;
    var j = 0;
    var disease = null;
    var player = null;

    if (!players || !this.diseases) {
        return;
    }

    for (i = this.diseases.length - 1; i >= 0; i--) {
        disease = this.diseases[i];

        if (!disease || disease.isActive !== true) {
            this.diseases.splice(i, 1);
            continue;
        }

        this.updateDisease(disease, step);

        for (j = 0; j < players.length; j++) {
            player = players[j];

            if (!this.isValidPlayer(player)) {
                continue;
            }

            if (this.hitTestPlayerDisease(player, disease)) {
                this.damagePlayer(player, disease);
                this.removeDiseaseAt(i);
                break;
            }
        }
    }
};

/**
 * Uppdaterar en disease visuellt.
 *
 * @param {!runmysteriet.entity.Disease} disease
 * @param {number=} step
 * @return {void}
 */
runmysteriet.handler.DiseaseHandler.prototype.updateDisease = function(disease, step) {

    var scale = 1;

    if (!disease) {
        return;
    }

    if (typeof disease.update === "function") {
        disease.update(step);
    }

    disease.m_pulseValue += disease.m_pulseSpeed;

    scale = disease.m_baseScale + Math.sin(disease.m_pulseValue) * 0.22;

    disease.scaleX = scale;
    disease.scaleY = scale;
};

/**
 * Kontrollerar om spelaren kan träffas av disease.
 *
 * @param {?Object} player
 * @return {boolean}
 */
runmysteriet.handler.DiseaseHandler.prototype.isValidPlayer = function(player) {

    if (!player) {
        return false;
    }

    if (player.isDead === true) {
        return false;
    }

    if (player.visible === false) {
        return false;
    }

    if (player.active === false) {
        return false;
    }

    return true;
};

/**
 * Skadar spelaren.
 *
 * @param {!Object} player
 * @param {!runmysteriet.entity.Disease} disease
 * @return {void}
 */
runmysteriet.handler.DiseaseHandler.prototype.damagePlayer = function(player, disease) {

    if (!player || !disease) {
        return;
    }

    player.hp -= disease.damage;

    if (player.hp < 0) {
        player.hp = 0;
    }

    this.playSneezeSound();
};

/**
 * Spelar sjukdomsljud.
 *
 * @return {void}
 */
runmysteriet.handler.DiseaseHandler.prototype.playSneezeSound = function() {

    if (this.sneezeSound && typeof this.sneezeSound.play === "function") {
        this.sneezeSound.play();
    }
};

/**
 * Tar bort disease på index.
 *
 * @param {number} index
 * @return {void}
 */
runmysteriet.handler.DiseaseHandler.prototype.removeDiseaseAt = function(index) {

    var disease = null;

    if (!this.diseases || index < 0 || index >= this.diseases.length) {
        return;
    }

    disease = this.diseases[index];

    this.removeDisplayObject(disease);
    this.diseases.splice(index, 1);
};

/**
 * Kollar collision mellan spelare och disease.
 *
 * @param {?Object} player
 * @param {?runmysteriet.entity.Disease} disease
 * @return {boolean}
 */
runmysteriet.handler.DiseaseHandler.prototype.hitTestPlayerDisease = function(
    player,
    disease
) {

    var playerPaddingX = 8;
    var diseasePaddingX = 2;
    var diseasePaddingTop = 2;
    var diseasePaddingBottom = 4;

    var playerLeft = 0;
    var playerRight = 0;
    var playerBottom = 0;
    var playerHitboxHeight = 0;
    var playerTop = 0;

    var diseaseLeft = 0;
    var diseaseRight = 0;
    var diseaseTop = 0;
    var diseaseBottom = 0;

    if (!player || !disease) {
        return false;
    }

    playerLeft = player.x + playerPaddingX;
    playerRight = player.x + player.width - playerPaddingX;

    playerBottom = player.y + player.height / 2;

    playerHitboxHeight = player.isCrouching ? 10 : player.height - 6;
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

/**
 * Tar bort display object från stage.
 *
 * @param {?Object} object
 * @return {void}
 */
runmysteriet.handler.DiseaseHandler.prototype.removeDisplayObject = function(object) {

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
 * Tar bort alla disease från scenen.
 *
 * @return {void}
 */
runmysteriet.handler.DiseaseHandler.prototype.clear = function() {

    var i = 0;
    var disease = null;

    if (!this.diseases) {
        this.diseases = [];
        return;
    }

    for (i = 0; i < this.diseases.length; i++) {
        disease = this.diseases[i];

        this.removeDisplayObject(disease);
    }

    this.diseases = [];
};

/**
 * Rensar DiseaseHandler helt.
 *
 * @return {void}
 */
runmysteriet.handler.DiseaseHandler.prototype.dispose = function() {

    this.clear();

    this.stage = null;
    this.application = null;
    this.sneezeSound = null;
};