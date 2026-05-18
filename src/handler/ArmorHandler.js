//------------------------------------------------------------------------------
// ARMOR HANDLER
//------------------------------------------------------------------------------

runmysteriet.handler.ArmorHandler = function(stage, application, levelNumber, armorSpawns) {

    this.m_stage = stage;
    this.application = application;
    this.m_levelNumber = levelNumber || 1;
    this.m_armorSpawns = armorSpawns || [];

    this.m_armors = [];
    this.onArmorCollected = null;
};

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.handler.ArmorHandler.prototype.init = function() {
    var selectedSpawns = this.getSelectedArmorSpawns();
    var i = 0;

    for (i = 0; i < selectedSpawns.length; i++) {
        this.addArmor(
            selectedSpawns[i].x,
            selectedSpawns[i].y
        );
    }
};

//------------------------------------------------------------------------------
// ARMOR COUNT
//------------------------------------------------------------------------------

runmysteriet.handler.ArmorHandler.prototype.getArmorCount = function() {
    if (this.m_levelNumber >= 11) {
        return 4;
    }

    if (this.m_levelNumber >= 6) {
        return 3;
    }

    return 2;
};

//------------------------------------------------------------------------------
// SPAWNS
//------------------------------------------------------------------------------

runmysteriet.handler.ArmorHandler.prototype.getSelectedArmorSpawns = function() {
    var copy = this.m_armorSpawns.slice();
    var result = [];
    var maxCount = this.getArmorCount();
    var index = 0;

    while (result.length < maxCount && copy.length > 0) {
        index = Math.floor(Math.random() * copy.length);
        result.push(copy[index]);
        copy.splice(index, 1);
    }

    return result;
};

//------------------------------------------------------------------------------
// CREATE
//------------------------------------------------------------------------------

runmysteriet.handler.ArmorHandler.prototype.addArmor = function(x, y) {
    var armor = new rune.display.Graphic(
        x,
        y,
        17,
        32,
        "armor"
    );

    armor.active = true;
    armor.__collected = false;

    this.m_armors.push(armor);
    this.m_stage.addChild(armor);
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

runmysteriet.handler.ArmorHandler.prototype.update = function(players) {
    var i = 0;
    var j = 0;
    var armor = null;
    var player = null;

    if (!players) {
        return;
    }

    for (i = 0; i < this.m_armors.length; i++) {
        armor = this.m_armors[i];

        if (!armor || armor.__collected === true) {
            continue;
        }

        if (armor.visible === false) {
            continue;
        }

        for (j = 0; j < players.length; j++) {
            player = players[j];

            if (!player) {
                continue;
            }

            if (player.isDead === true) {
                continue;
            }

            if (player.visible === false) {
                continue;
            }

            if (player.active === false) {
                continue;
            }

            if (armor.hitTestObject(player)) {
                this.collectArmor(armor, player);
                break;
            }
        }
    }
};

//------------------------------------------------------------------------------
// COLLECT
//------------------------------------------------------------------------------

runmysteriet.handler.ArmorHandler.prototype.collectArmor = function(armor, player) {
    var index = 0;

    if (!armor || armor.__collected === true) {
        return;
    }

    armor.__collected = true;
    armor.active = false;
    armor.visible = false;

    if (armor.parent) {
        armor.parent.removeChild(armor);
    }

    index = this.m_armors.indexOf(armor);

    if (index !== -1) {
        this.m_armors.splice(index, 1);
    }

    if (this.onArmorCollected) {
        this.onArmorCollected(player, armor);
    }
};

//------------------------------------------------------------------------------
// CLEAR
//------------------------------------------------------------------------------

runmysteriet.handler.ArmorHandler.prototype.clear = function() {
    var i = 0;
    var armor = null;

    for (i = 0; i < this.m_armors.length; i++) {
        armor = this.m_armors[i];

        if (armor && armor.parent) {
            armor.parent.removeChild(armor);
        }
    }

    this.m_armors = [];
};