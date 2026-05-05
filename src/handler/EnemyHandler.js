runmysteriet.handler.EnemyHandler = function(stage) {
    this.stage = stage;
    this.enemies = [];
};

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

runmysteriet.handler.EnemyHandler.prototype.createKristen = function(spawn) {

    var kristen = new runmysteriet.entity.Kristen(
        "kristen",
        spawn.x,
        spawn.y
    );

    this.enemies.push(kristen);
    this.stage.addChild(kristen);

    return kristen;
};

runmysteriet.handler.EnemyHandler.prototype.update = function(players) {

    for (var i = 0; i < this.enemies.length; i++) {

        var enemy = this.enemies[i];

        if (!enemy || enemy.isDead === true) {
            continue;
        }

        if (typeof enemy.checkPlayerCollisions === "function") {
            enemy.checkPlayerCollisions(players);
        }
    }
};

runmysteriet.handler.EnemyHandler.prototype.clear = function() {

    for (var i = 0; i < this.enemies.length; i++) {

        var enemy = this.enemies[i];

        if (enemy && enemy.stage) {
            enemy.stage.removeChild(enemy);
        }
    }

    this.enemies = [];
};