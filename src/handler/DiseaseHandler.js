//------------------------------------------------------------------------------
// DISEASE HANDLER
//-----------------------------------------------------------------------

/**
 * Hanterar alla sjukdomar i spelet.
 *
 * @constructor
 * @param {!rune.display.Stage} stage
 */
runmysteriet.handler.DiseaseHandler = function(stage) {

    this.stage = stage;
    this.diseases = [];
};
//----------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.handler.DiseaseHandler.prototype.init = function(levelNumber) {

    this.clear();

    /*
     * Testplaceringar.
     * Justera x och y efter din bana.
     */
    this.addDisease("gray", 190, 155);
    this.addDisease("brown", 130, 155);
    this.addDisease("red", 160, 160);
};

//------------------------------------------------------------------------------
// ADD DISEASE
//------------------------------------------------------------------------------

runmysteriet.handler.DiseaseHandler.prototype.addDisease = function(type, x, y) {

    var disease = new runmysteriet.entity.Disease(x, y, type);

    this.diseases.push(disease);
    this.stage.addChild(disease);

    return disease;
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

runmysteriet.handler.DiseaseHandler.prototype.update = function(players, step) {

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
                /*
                 * Dra av HP.
                 */
                player.hp -= disease.damage;

                if (player.hp < 0) {
                    player.hp = 0;
                }

                /*
                 * Sjukdomen försvinner efter träff.
                 * Annars tar spelaren skada varje frame.
                 */
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

runmysteriet.handler.DiseaseHandler.prototype.clear = function() {

    var i = 0;
    var disease = null;

    for (i = 0; i < this.diseases.length; i++) {

        disease = this.diseases[i];

        if (disease && disease.stage) {
            disease.stage.removeChild(disease);
        }
    }

    this.diseases = [];
};

//------------------------------------------------------------------------------
// COLLISION
//------------------------------------------------------------------------------

runmysteriet.handler.DiseaseHandler.prototype.hitTestPlayerDisease = function(player, disease) {

    var playerLeft = 0;
    var playerRight = 0;
    var playerTop = 0;
    var playerBottom = 0;

    var diseaseLeft = 0;
    var diseaseRight = 0;
    var diseaseTop = 0;
    var diseaseBottom = 0;

    var playerHitboxHeight = 0;

    /*
     * Spelarens hitbox görs lite smalare.
     */
    var playerPaddingX = 8;

    /*
     * Sjukdomen är bara 15x15.
     * Därför ska padding vara små värden.
     */
    var diseasePaddingX = 2;
    var diseasePaddingTop = 2;
    var diseasePaddingBottom = 4;

    if (!player || !disease) {
        return false;
    }

    /*
     * Spelarens hitbox.
     */
    playerLeft = player.x + playerPaddingX;
    playerRight = player.x + player.width - playerPaddingX;

    playerBottom = player.y + player.height / 2;

    if (player.isCrouching === true) {
        /*
         * Lägre hitbox när spelaren kryper.
         */
        playerHitboxHeight = 10;
    } else {
        /*
         * Gör normal hitbox lite lägre än hela spriten.
         * Annars träffar osynliga pixlar för lätt.
         */
        playerHitboxHeight = player.height - 6;
    }

    playerTop = playerBottom - playerHitboxHeight;

    /*
     * Sjukdomens mindre hitbox.
     */
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