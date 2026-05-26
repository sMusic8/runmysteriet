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
     * Osynliga spärrar som hindrar spelaren från att gå vidare
     * tills kopplad Kristen är död.
     */
    this.enemyBlockers = [];
};

/**
 * Initsierar kristna för levlen.
 *
 * @param {!runmysteriet.config.LevelConfig} levelConfig
 * @param {!Array<!Object>} enemySpawns
 * @return {void}
 */
runmysteriet.handler.EnemyHandler.prototype.init = function(
    levelConfig,
    enemySpawns
) {

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

    this.enemies.push(kristen);
    this.stage.addChild(kristen);

    /*
     * Skapa spärr efter Kristen.
     * Spärren är osynlig och stoppar spelaren tills Kristen dör.
     */
    blocker = this.createKristenBlocker(spawn, kristen);

    kristen.enemyBlocker = blocker;
    blocker.enemy = kristen;

    return kristen;
};

//------------------------------------------------------------------------------
// CREATE BLOCKER
//------------------------------------------------------------------------------

/**
 * Skapar en osynlig spärr som går hela vägen uppifrån och ner.
 *
 * @param {!Object} spawn
 * @param {!runmysteriet.entity.Kristen} enemy
 * @return {!rune.display.Graphic}
 */
runmysteriet.handler.EnemyHandler.prototype.createKristenBlocker = function(
    spawn,
    enemy
) {

    var blocker = null;
    var blockerX = 0;
    var blockerY = 0;
    var blockerWidth = 48;
    var blockerHeight = 2000;

    blockerX = spawn.x + 70;
    blockerY = -1000;

    blocker = new rune.display.Graphic(
        blockerX,
        blockerY,
        blockerWidth,
        blockerHeight
    );

    blocker.alpha = 20;
    blocker.visible = false;
    blocker.isEnemyBlocker = true;
    blocker.enemy = enemy;

    this.enemyBlockers.push(blocker);
    this.stage.addChild(blocker);

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

        if (typeof enemy.faceNearestPlayer === "function") {
            enemy.faceNearestPlayer(players);
        }

        if (typeof enemy.checkPlayerCollisions === "function") {
            enemy.checkPlayerCollisions(players);
        }
    }

    this.updateEnemyBlockers();
};

//------------------------------------------------------------------------------
// ENEMY BLOCKERS
//------------------------------------------------------------------------------

/**
 * Tar bort spärrar vars Kristen är död.
 *
 * @return {void}
 */
runmysteriet.handler.EnemyHandler.prototype.updateEnemyBlockers = function() {

    var i = 0;
    var blocker = null;
    var enemy = null;

    for (i = this.enemyBlockers.length - 1; i >= 0; i--) {
        blocker = this.enemyBlockers[i];

        if (!blocker) {
            this.enemyBlockers.splice(i, 1);
            continue;
        }

        enemy = blocker.enemy;

        if (enemy && enemy.isDead === true) {
            this.removeDisplayObject(blocker);
            this.enemyBlockers.splice(i, 1);
        }
    }
};

//------------------------------------------------------------------------------
// CLEAR
//------------------------------------------------------------------------------

/**
 * Removes all enemies and enemy blockers from stage.
 *
 * @return {void}
 */
runmysteriet.handler.EnemyHandler.prototype.clear = function() {

    var i = 0;
    var enemy = null;

    /*
     * Fiender.
     */
    if (this.enemies) {
        for (i = 0; i < this.enemies.length; i++) {
            enemy = this.enemies[i];

            if (!enemy) {
                continue;
            }

            if (typeof enemy.dispose === "function") {
                enemy.dispose();
            } else {
                if (enemy.hpBar) {
                    this.removeDisplayObject(enemy.hpBar);
                    enemy.hpBar = null;
                }

                this.removeDisplayObject(enemy);
            }
        }
    }

    /*
     * Spärrar.
     */
    this.clearDisplayList(this.enemyBlockers);

    this.enemies = [];
    this.enemyBlockers = [];
};

//------------------------------------------------------------------------------
// CLEAR DISPLAY LIST
//------------------------------------------------------------------------------

/**
 * Tar bort alla display objects i en lista.
 *
 * @param {?Array} list
 * @return {void}
 */
runmysteriet.handler.EnemyHandler.prototype.clearDisplayList = function(list) {

    var i = 0;

    if (!list) {
        return;
    }

    for (i = 0; i < list.length; i++) {
        this.removeDisplayObject(list[i]);
    }
};

//------------------------------------------------------------------------------
// REMOVE DISPLAY OBJECT
//------------------------------------------------------------------------------

/**
 * Tar bort ett display object från stage.
 *
 * @param {?Object} object
 * @return {void}
 */
runmysteriet.handler.EnemyHandler.prototype.removeDisplayObject = function(object) {

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

//------------------------------------------------------------------------------
// DISPOSE
//------------------------------------------------------------------------------

/**
 * Rensar EnemyHandler helt.
 *
 * @return {void}
 */
runmysteriet.handler.EnemyHandler.prototype.dispose = function() {

    this.clear();

    this.stage = null;
};