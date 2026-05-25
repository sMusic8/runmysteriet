//------------------------------------------------------------------------------
// ENEMY HANDLER
//------------------------------------------------------------------------------

/**
 * Hanterar alla kristna i världen.
 *
 * @constructor
 * @param {!rune.display.Stage} stage
 */
runmysteriet.handler.EnemyHandler = function(stage) {

    /** @type {!rune.display.Stage} */
    this.stage = stage;

    /** @type {!Array<!runmysteriet.entity.Kristen>} */
    this.enemies = [];

    /*
     * Osynliga blockeringar ovanför Kristen så det inte går att hoppa över.
     */
    this.caveBlockers = [];
};

/**
 * Initsierar kristna för levlen.
 *
 * @param {!runmysteriet.config.LevelConfig} levelConfig
 * @param {!Array<!Object>} enemySpawns
 * @return {void}
 */
runmysteriet.handler.EnemyHandler.prototype.init = function(levelConfig, enemySpawns) {

    var kristenCount = 0;
    var created = 0;
    var i = 0;

    this.clear();

    if (!levelConfig || !enemySpawns) {
        return;
    }

    kristenCount = levelConfig.getKristenCount();

    for (i = 0; i < enemySpawns.length; i++) {
        if (created >= kristenCount) {
            break;
        }

        if (enemySpawns[i].type === "kristen") {
            this.createKristen(enemySpawns[i]);
            created++;
        }
    }
};

/**
 * Skapar en kristen.
 *
 * @param {{x: number, y: number, type: string}} spawn
 * @return {!runmysteriet.entity.Kristen}
 */
runmysteriet.handler.EnemyHandler.prototype.createKristen = function(spawn) {

    var kristen = null;
    var blocker = null;

    kristen = new runmysteriet.entity.Kristen(
        "spritesheet_kristen",
        spawn.x,
        spawn.y
    );

    // Skapa osynlig blocker ovanför Kristen och kopplar den till rätt
    kristen.cave = null;
    kristen.caveBlocker = blocker;

    blocker.enemy = kristen;

    this.caveBlockers.push(blocker);
    this.enemies.push(kristen);

    //Blocker läggs till före Kristen.
     
    this.stage.addChild(blocker);
    this.stage.addChild(kristen);

    return kristen;
};

/**
 * Skapar osynlig blocker ovanför Kristen.
 *
 * @param {!runmysteriet.entity.Kristen} kristen
 * @return {!rune.display.Graphic}
 */
runmysteriet.handler.EnemyHandler.prototype.createKristenBlocker = function(kristen) {

    var blocker = null;

    blocker = new rune.display.Graphic(
        kristen.x - 20,
        kristen.y - 120,
        kristen.width + 40, 
        120
    );

    blocker.alpha = 0;
    blocker.immovable = true;
    blocker.isKristenBlocker = true;

    if (rune.physics && rune.physics.Space) {
        blocker.allowCollisions = rune.physics.Space.ANY;
    }

    return blocker;
};

/**
 * Uppdaterar alla kristna.
 *
 * @param {!Array<!runmysteriet.entity.Player>} players
 * @return {void}
 */
runmysteriet.handler.EnemyHandler.prototype.update = function(players) {

    var i = 0;
    var enemy = null;

    for (i = 0; i < this.enemies.length; i++) {
        enemy = this.enemies[i];

        if (!enemy || enemy.isDead === true) {
            continue;
        }

        this.updateKristenBlocker(enemy);

        if (typeof enemy.faceNearestPlayer === "function") {
            enemy.faceNearestPlayer(players);
        }

        if (typeof enemy.checkPlayerCollisions === "function") {
            enemy.checkPlayerCollisions(players);
        }

        this.checkBlockerCollisions(enemy, players);
    }
};

/**
 * Flyttar blockern så den följer Kristen när han patrullerar.
 *
 * @param {!runmysteriet.entity.Kristen} kristen
 * @return {void}
 */
runmysteriet.handler.EnemyHandler.prototype.updateKristenBlocker = function(kristen) {

    var blocker = null;

    if (!kristen) {
        return;
    }

    blocker = kristen.caveBlocker;

    if (!blocker) {
        return;
    }

    blocker.x = kristen.x - 20;
    blocker.y = kristen.y - 120;
};

/**
 * Stoppar spelaren om han försöker hoppa över Kristen.
 *
 * @param {!runmysteriet.entity.Kristen} kristen
 * @param {!Array<!Object>} players
 * @return {void}
 */
runmysteriet.handler.EnemyHandler.prototype.checkBlockerCollisions = function(kristen, players) {

    var blocker = null;
    var player = null;
    var i = 0;

    if (!kristen || !players) {
        return;
    }

    blocker = kristen.caveBlocker;

    if (!blocker) {
        return;
    }

    for (i = 0; i < players.length; i++) {
        player = players[i];

        if (!player || player.isDead === true) {
            continue;
        }

        if (typeof player.hitTestAndSeparate === "function") {
            player.hitTestAndSeparate(blocker);
        }
    }
};

/**
 * Tar bort alla kristna från scenen.
 *
 * @return {void}
 */
runmysteriet.handler.EnemyHandler.prototype.clear = function() {

    var i = 0;
    var enemy = null;
    var blocker = null;

    for (i = 0; i < this.enemies.length; i++) {
        enemy = this.enemies[i];

        if (!enemy) {
            continue;
        }

        //Kristen skapar hpBar separat och lägger den direkt på stage så därför måste hpBar tas bort separat innan fienden tas bort.
        if (enemy.hpBar && enemy.hpBar.stage) {
            enemy.hpBar.stage.removeChild(enemy.hpBar);
            enemy.hpBar = null;
        }

        //Ta bort själva fienden från stage.
        if (enemy.stage) {
            enemy.stage.removeChild(enemy);
        }

        enemy.cave = null;
        enemy.caveBlocker = null;
    }

    for (i = 0; i < this.caveBlockers.length; i++) {
        blocker = this.caveBlockers[i];

        if (!blocker) {
            continue;
        }

        if (blocker.parent) {
            blocker.parent.removeChild(blocker);
        } else if (blocker.stage) {
            blocker.stage.removeChild(blocker);
        }
    }

    this.enemies = [];
    this.caveBlockers = [];
};