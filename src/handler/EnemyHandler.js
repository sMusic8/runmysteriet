//------------------------------------------------------------------------------
// ENEMY HANDLER
//------------------------------------------------------------------------------

/**
 * Handles all enemies in the game world.
 *
 * @constructor
 * @param {!rune.display.Stage} stage
 */
runmysteriet.handler.EnemyHandler = function(stage) {

    /** @type {!rune.display.Stage} */
    this.stage = stage;

    /** @type {!Array<!runmysteriet.entity.Kristen>} */
    this.enemies = [];
};

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

/**
 * Initializes enemies for the level.
 *
 * @param {!runmysteriet.config.LevelConfig} levelConfig
 * @param {!Array<!Object>} enemySpawns
 * @return {void}
 */
runmysteriet.handler.EnemyHandler.prototype.init = function(levelConfig, enemySpawns) {

    this.clear();

    if (!levelConfig || !enemySpawns) {
        return;
    }

    var kristenCount = levelConfig.getKristenCount();
    var created = 0;

    for (var i = 0; i < enemySpawns.length; i++) {

        if (created >= kristenCount) {
            break;
        }

        if (enemySpawns[i].type === "kristen") {
            this.createKristen(enemySpawns[i]);
            created++;
        }
    }
};

//------------------------------------------------------------------------------
// CREATE ENEMY
//------------------------------------------------------------------------------

/**
 * Creates a Kristen enemy.
 *
 * @param {{x: number, y: number, type: string}} spawn
 * @return {!runmysteriet.entity.Kristen}
 */
runmysteriet.handler.EnemyHandler.prototype.createKristen = function(spawn) {

    var kristen = new runmysteriet.entity.Kristen(
        "spritesheet_kristen",
        spawn.x,
        spawn.y
    );

    this.enemies.push(kristen);
    this.stage.addChild(kristen);

    return kristen;
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

/**
 * Updates all enemies.
 *
 * @param {!Array<!runmysteriet.entity.Player>} players
 * @return {void}
 */
runmysteriet.handler.EnemyHandler.prototype.update = function(players) {

    for (var i = 0; i < this.enemies.length; i++) {

        var enemy = this.enemies[i];

        if (!enemy || enemy.isDead === true) continue;

        if (typeof enemy.checkPlayerCollisions === "function") {
            enemy.checkPlayerCollisions(players);
        }
    }
};

//------------------------------------------------------------------------------
// CLEAR
//------------------------------------------------------------------------------

/**
 * Removes all enemies from stage.
 *
 * @return {void}
 */
runmysteriet.handler.EnemyHandler.prototype.clear = function() {

    for (var i = 0; i < this.enemies.length; i++) {

        var enemy = this.enemies[i];

        if (enemy && enemy.stage) {
            enemy.stage.removeChild(enemy);
        }
    }

    this.enemies = [];
};