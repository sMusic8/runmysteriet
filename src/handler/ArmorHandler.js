//------------------------------------------------------------------------------
// ARMOR HANDLER
//------------------------------------------------------------------------------

/**
 * Ansvarar för att skapa, uppdatera och hantera armor objekt
 *
 * @constructor
 * @param {!rune.display.Stage} stage
 * @param {!Object} application
 * @param {number=} levelNumber
 * @param {Array=} armorSpawns
 */
runmysteriet.handler.ArmorHandler = function(stage, application, levelNumber, armorSpawns) {

    /** @type {!rune.display.Stage} */
    this.m_stage = stage;

    /** @type {!Object} */
    this.application = application;

    /** @type {number} */
    this.m_levelNumber = levelNumber || 1;

    /** @type {!Array} */
    this.m_armorSpawns = armorSpawns || [];

    /** @type {!Array.<rune.display.Graphic>} */
    this.m_armors = [];

    /**
     * Callback när armor samlas upp
     *
     * @type {?Function}
     */
    this.onArmorCollected = null;

    /** @type {?Object} */
    this.catchSound = null;
};

/**
 * Skapar armor-objekt baserat på utvalda spawnpunkter.
 * Funktionen itererar över de förvalda armor-spawns och skapar ett armor-objekt vid varje angiven position.
 *
 * @return {void}
 */
runmysteriet.handler.ArmorHandler.prototype.init = function() {

    var selectedSpawns = null;
    var i = 0;

    selectedSpawns = this.getSelectedArmorSpawns();

    for (i = 0; i < selectedSpawns.length; i++) {
        this.addArmor(
            selectedSpawns[i].x,
            selectedSpawns[i].y
        );
    }
};

/**
 * Returnerar antal armor som ska spawnas beroende på nivå
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

/**
 * Väljer slumpmässiga spawnpunkter för armor
 *
 * @return {!Array}
 */
runmysteriet.handler.ArmorHandler.prototype.getSelectedArmorSpawns = function() {

    var copy = [];
    var result = [];
    var maxCount = 0;
    var index = 0;

    if (!this.m_armorSpawns) {
        return result;
    }

    copy = this.m_armorSpawns.slice();
    maxCount = this.getArmorCount();

    while (result.length < maxCount && copy.length > 0) {
        index = Math.floor(Math.random() * copy.length);

        result.push(copy[index]);
        copy.splice(index, 1);
    }

    return result;
};

/**
 * Skapar ett armor-objekt och dess visuella box
 *
 * @param {number} x
 * @param {number} y
 * @return {void}
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

/**
 * Uppdaterar armor och hanterar kollision med spelare
 *
 * @param {?Array.<Object>} players
 * @return {void}
 */
runmysteriet.handler.ArmorHandler.prototype.update = function(players) {

    var i = 0;
    var j = 0;
    var armor = null;
    var player = null;

    if (!players || !this.m_armors) {
        return;
    }

    for (i = this.m_armors.length - 1; i >= 0; i--) {
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

            if (!this.isValidPlayer(player)) {
                continue;
            }

            if (armor.hitTestObject(player)) {
                this.collectArmor(armor, player);
                break;
            }
        }
    }
};

/**
 * Kontrollerar om spelaren kan samla armor
 *
 * @param {?Object} player
 * @return {boolean}
 */
runmysteriet.handler.ArmorHandler.prototype.isValidPlayer = function(player) {

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
 * Hanterar blink-effekt för armor
 *
 * @param {?rune.display.Graphic} armor
 * @return {void}
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

/**
 * Hanterar insamling av armor
 *
 * @param {?rune.display.Graphic} armor
 * @param {?Object} player
 * @return {void}
 */
runmysteriet.handler.ArmorHandler.prototype.collectArmor = function(armor, player) {

    var index = 0;

    if (!armor || armor.__collected === true) {
        return;
    }

    this.playCatchSound();

    armor.__collected = true;
    armor.active = false;
    armor.visible = false;

    this.removeArmor(armor);

    index = this.m_armors.indexOf(armor);

    if (index !== -1) {
        this.m_armors.splice(index, 1);
    }

    if (this.onArmorCollected) {
        this.onArmorCollected(player, armor);
    }
};

/**
 * Spelar ljud när armor samlas upp
 *
 * @return {void}
 */
runmysteriet.handler.ArmorHandler.prototype.playCatchSound = function() {

    if (!this.application ||
        !this.application.sounds ||
        !this.application.sounds.sound) {

        return;
    }

    this.catchSound = this.application.sounds.sound.get("sound_catch");

    if (this.catchSound && typeof this.catchSound.play === "function") {
        this.catchSound.play();
    }
};

/**
 * Tar bort armor och dess box från stage
 *
 * @param {?rune.display.Graphic} armor
 * @return {void}
 */
runmysteriet.handler.ArmorHandler.prototype.removeArmor = function(armor) {

    if (!armor) {
        return;
    }

    this.removeDisplayObject(armor.__box);
    this.removeDisplayObject(armor);

    armor.__box = null;
};

/**
 * Tar bort display object från stage
 *
 * @param {?Object} object
 * @return {void}
 */
runmysteriet.handler.ArmorHandler.prototype.removeDisplayObject = function(object) {

    if (!object) {
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
 * Tar bort alla armor-objekt från scenen och rensar interna listan.
 *
 * Funktionen itererar genom alla aktiva armor-objekt och tar bort själva armor-objektet och dess eventuella visuella komponenter.
 *
 * @return {void}
 */
runmysteriet.handler.ArmorHandler.prototype.clear = function() {

    var i = 0;
    var armor = null;

    if (!this.m_armors) {
        this.m_armors = [];
        return;
    }

    for (i = 0; i < this.m_armors.length; i++) {
        armor = this.m_armors[i];

        this.removeArmor(armor);
    }

    this.m_armors = [];
};

/**
 * Städar ArmorHandler helt
 *
 * @return {void}
 */
runmysteriet.handler.ArmorHandler.prototype.dispose = function() {

    this.clear();

    this.m_stage = null;
    this.application = null;

    this.m_levelNumber = 0;
    this.m_armorSpawns = [];

    this.onArmorCollected = null;
    this.catchSound = null;
};