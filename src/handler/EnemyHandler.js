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

    /*
     * Grottbilder som skapas vid varje Kristen.
     */
    this.caves = [];

    /*
     * Osynliga blockeringar som hindrar spelaren från att hoppa över.
     */
    this.caveBlockers = [];
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

    var caveData = null;

    /*
     * Skapa grottan först så den hamnar bakom Kristen.
     */
    caveData = this.createKristenCave(spawn);

    var kristen = new runmysteriet.entity.Kristen(
        "spritesheet_kristen",
        spawn.x,
        spawn.y
    );

    /*
     * Koppla grotta och blocker till just denna Kristen.
     */
    kristen.cave = caveData.cave;
    kristen.caveBlocker = caveData.blocker;

    caveData.cave.enemy = kristen;
    caveData.blocker.enemy = kristen;

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

    var i = 0;
    var enemy = null;

    for (i = 0; i < this.enemies.length; i++) {

        enemy = this.enemies[i];

        if (!enemy) {
            continue;
        }

        /*
         * Kristen skapar hpBar separat och lägger den direkt på stage.
         * Därför måste hpBar tas bort separat innan fienden tas bort.
         */
        if (enemy.hpBar && enemy.hpBar.stage) {
            enemy.hpBar.stage.removeChild(enemy.hpBar);
            enemy.hpBar = null;
        }

        /*
         * Ta bort själva fienden från stage.
         */
        if (enemy.stage) {
            enemy.stage.removeChild(enemy);
        }
    }

    this.enemies = [];
};

runmysteriet.handler.EnemyHandler.prototype.createKristenCave = function(spawn) {

    var cave = null;
    var blocker = null;

    var caveWidth = 200;
    var caveHeight = 150;

    var caveX = spawn.x + 32;//// Justera så Kristen hamnar i mitten av grottan.
    var caveY = spawn.y - 68;// Justera så Kristen hamnar i mitten av grottan.

    cave = new rune.display.Graphic(
        caveX,
        caveY,
        caveWidth,
        caveHeight,
        "big_stone"
    );

    /*
     * Osynlig blocker-zon.
     * Den används inte som vanlig plattform, utan som logisk spärr.
     */
    blocker = new rune.display.Graphic(
        caveX,
        caveY,
        caveWidth,
        caveHeight
    );

    blocker.alpha = 0;

    /*
     * Spelaren får bara passera om fötterna är under denna gräns.
     * Är spelaren högre upp än detta, räknas det som att spelaren försöker hoppa över.
     *
     * Justera detta värde om öppningen känns för låg/hög.
     */
    blocker.openingY = spawn.y + 55;

    this.caves.push(cave);
    this.caveBlockers.push(blocker);

    this.stage.addChild(cave);
    this.stage.addChild(blocker);

    return {
        cave: cave,
        blocker: blocker
    };
};