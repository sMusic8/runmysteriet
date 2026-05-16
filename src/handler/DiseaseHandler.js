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
    this.addDisease("gray", 450, 170);
    this.addDisease("brown", 750, 170);
    this.addDisease("red", 1050, 170);
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

runmysteriet.handler.DiseaseHandler.prototype.update = function(players) {

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
            disease.update();
        }

        for (j = 0; j < players.length; j++) {

            player = players[j];

            if (!player || player.isDead === true) {
                continue;
            }

            if (player.hitTestObject(disease)) {

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