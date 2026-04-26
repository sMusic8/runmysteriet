//------------------------------------------------------------------------------
// NAMESPACE
//------------------------------------------------------------------------------
var runmysteriet = runmysteriet || {};
runmysteriet.handler = runmysteriet.handler || {};

//------------------------------------------------------------------------------
// SHIELD HANDLER
//------------------------------------------------------------------------------

runmysteriet.handler.ShieldHandler = function(stage) {

    this.m_stage = stage;
    this.m_shields = [];
    this.m_collected = [];
};

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.handler.ShieldHandler.prototype.init = function() {

    var startX = 150;
    var spacing = 50;

    for (var i = 0; i < 5; i++) {

        var shield = new runmysteriet.ui.Shield();

        shield.x = startX + (i * spacing);
        shield.y = 140;

        this.m_shields.push(shield);
        this.m_stage.addChild(shield);
    }
};

//------------------------------------------------------------------------------
// UPDATE (FIXAD: stabil collision-loop)
//------------------------------------------------------------------------------

runmysteriet.handler.ShieldHandler.prototype.update = function(players) {

    for (var i = 0; i < this.m_shields.length; i++) {

        var shield = this.m_shields[i];

        for (var j = 0; j < players.length; j++) {

            var player = players[j];

            if (shield.hitTestObject(player)) {
                this.collectShield(shield);
                break;
            }
        }
    }
};

//------------------------------------------------------------------------------
// COLLECT SHIELD (FIXAD)
//------------------------------------------------------------------------------

runmysteriet.handler.ShieldHandler.prototype.collectShield = function(shield) {

    if (!shield || shield.__collected) return;

    shield.__collected = true;

    // ta bort från scen
    this.m_stage.removeChild(shield);

    // ta bort från active array
    for (var i = 0; i < this.m_shields.length; i++) {
        if (this.m_shields[i] === shield) {
            this.m_shields.splice(i, 1);
            break;
        }
    }

    // lägg i collected-lista
    this.m_collected.push(shield);

    console.log("Collected shield object:", shield);
    console.log("Total collected:", this.m_collected.length);
};

//------------------------------------------------------------------------------
// GETTER
//------------------------------------------------------------------------------

runmysteriet.handler.ShieldHandler.prototype.getCollected = function() {
    return this.m_collected;
};