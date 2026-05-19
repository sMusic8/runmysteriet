//------------------------------------------------------------------------------
// ARMOR HANDLER
//------------------------------------------------------------------------------

/**
 * Handler som ansvarar för att skapa, uppdatera och hantera armor-objekt i spelet.
 *
 * @constructor
 * @param {rune.scene.Scene} stage - Stage där armors renderas.
 * @param {Object} application - Spelapplikationen (för ljud m.m.).
 * @param {number=} levelNumber - Nivånummer som påverkar antal armors.
 * @param {Array=} armorSpawns - Lista över möjliga spawnpunkter.
 */
runmysteriet.handler.ArmorHandler = function(stage, application, levelNumber, armorSpawns) {

    /** @type {rune.scene.Scene} */
    this.m_stage = stage;

    /** @type {Object} */
    this.application = application;

    /** @type {number} */
    this.m_levelNumber = levelNumber || 1;

    /** @type {Array} */
    this.m_armorSpawns = armorSpawns || [];

    /** @type {Array.<rune.display.Graphic>} */
    this.m_armors = [];

    /**
     * Callback när armor samlas upp.
     * @type {Function|null}
     */
    this.onArmorCollected = null;
};

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

/**
 * Skapar armor baserat på valda spawnpunkter.
 */
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

/**
 * Returnerar antal armor som ska spawnas beroende på nivå.
 *
 * @return {number}
 */
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

/**
 * Väljer slumpmässiga spawnpunkter för armor.
 *
 * @return {Array}
 */
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

/**
 * Skapar ett armor-objekt och dess visuella box.
 *
 * @param {number} x - X-position.
 * @param {number} y - Y-position.
 */
runmysteriet.handler.ArmorHandler.prototype.addArmor = function(x, y) {
    var box = null;
    var armor = null;

    box = new rune.display.Graphic(
        x - 2,
        y - 2,
        21,
        36
    );

    box.alpha = 0.45;
    box.active = false;

    armor = new rune.display.Graphic(
        x,
        y,
        17,
        32,
        "armor"
    );

    armor.active = true;
    armor.__collected = false;
    armor.__box = box;
    armor.__blinkTimer = 0;
    armor.__blinkDirection = -1;
    armor.alpha = 1;

    this.m_stage.addChild(box);
    this.m_stage.addChild(armor);

    this.m_armors.push(armor);
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

/**
 * Uppdaterar armor och hanterar kollision med spelare.
 *
 * @param {Array.<Object>} players - Lista med spelare.
 */
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

        this.updateBlink(armor);

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
// BLINK
//------------------------------------------------------------------------------

/**
 * Hanterar blink-effekt för armor.
 *
 * @param {rune.display.Graphic} armor
 */
runmysteriet.handler.ArmorHandler.prototype.updateBlink = function(armor) {
    if (!armor) {
        return;
    }

    armor.__blinkTimer += 1;

    if (armor.__blinkTimer < 3) {
        return;
    }

    armor.__blinkTimer = 0;
    armor.alpha += 0.12 * armor.__blinkDirection;

    if (armor.alpha <= 0.35) {
        armor.alpha = 0.35;
        armor.__blinkDirection = 1;
    } else if (armor.alpha >= 1) {
        armor.alpha = 1;
        armor.__blinkDirection = -1;
    }
};

//------------------------------------------------------------------------------
// COLLECT
//------------------------------------------------------------------------------

/**
 * Hanterar insamling av armor.
 *
 * @param {rune.display.Graphic} armor
 * @param {Object} player
 */
runmysteriet.handler.ArmorHandler.prototype.collectArmor = function(armor, player) {
    var index = 0;

    if (!armor || armor.__collected === true) {
        return;
    }

    // Spela ljud vid insamling
    if (this.application &&
        this.application.sounds &&
        this.application.sounds.sound) {

        this.catchsound =
            this.application.sounds.sound.get("sound_catch");

        if (this.catchsound) {
            this.catchsound.play();
        }
    }

    armor.__collected = true;
    armor.active = false;
    armor.visible = false;

    if (armor.__box && armor.__box.parent) {
        armor.__box.parent.removeChild(armor.__box);
    }

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

/**
 * Tar bort alla armor från scenen och rensar listan.
 */
runmysteriet.handler.ArmorHandler.prototype.clear = function() {
    var i = 0;
    var armor = null;

    for (i = 0; i < this.m_armors.length; i++) {
        armor = this.m_armors[i];

        if (armor && armor.__box && armor.__box.parent) {
            armor.__box.parent.removeChild(armor.__box);
        }

        if (armor && armor.parent) {
            armor.parent.removeChild(armor);
        }
    }

    this.m_armors = [];
};