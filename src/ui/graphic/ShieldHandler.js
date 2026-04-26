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
    this.m_word = "";
};

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.handler.ShieldHandler.prototype.init = function() {

    var startX = 150;
    var spacing = 50;

    var words = ["apa", "fagel", "tiger", "lejon", "bjorn", "ratta", "varg", "orm", "hare", "uggla"];
    var word = words[Math.floor(Math.random() * words.length)];

    this.m_word = word;

    console.log("WORD:", word);

    // ⭐ FIX: skapa sköldar efter ordets längd
    for (var i = 0; i < word.length; i++) {

        var shield = new runmysteriet.ui.Shield();

        shield.x = startX + (i * spacing);
        shield.y = 140;

        shield.__collected = false;
        shield.active = true;

        var letter = word[i];
        shield.setRune(letter);

        this.m_shields.push(shield);
        this.m_stage.addChild(shield);
    }
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

runmysteriet.handler.ShieldHandler.prototype.update = function(players) {

    for (var i = this.m_shields.length - 1; i >= 0; i--) {

        var shield = this.m_shields[i];

        if (!shield.active) continue;

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
// COLLECT
//------------------------------------------------------------------------------

runmysteriet.handler.ShieldHandler.prototype.collectShield = function(shield) {

    if (!shield || shield.__collected) return;

    shield.__collected = true;
    shield.active = false;

    console.log("Letter on pickup:", shield.rune);

    this.m_stage.removeChild(shield);

    var index = this.m_shields.indexOf(shield);
    if (index !== -1) {
        this.m_shields.splice(index, 1);
    }

    this.m_collected.push(shield);

    console.log("Collected shield:", shield);
    console.log("Total collected:", this.m_collected.length);
};

//------------------------------------------------------------------------------
// GET COLLECTED
//------------------------------------------------------------------------------

runmysteriet.handler.ShieldHandler.prototype.getCollected = function() {
    return this.m_collected;
};