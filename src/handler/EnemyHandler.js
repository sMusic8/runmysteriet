//------------------------------------------------------------------------------
// ENEMY HANDLER
//------------------------------------------------------------------------------

/**
 * Hanterar alla kristna i världen.
 *
 * @constructor
 * @param {!rune.display.Stage} stage
 * @param {!Object} application
 */
runmysteriet.handler.EnemyHandler = function(stage, application) {

    /** @type {!rune.display.Stage} */
    this.stage = stage;

    /** @type {?Object} */
    this.application = application || null;

    /** @type {!Array<!runmysteriet.entity.Kristen>} */
    this.enemies = [];

    /**
     * Osynliga spärrar som hindrar spelaren från att gå vidare tills kopplad Kristen är död.
     * @type {!Array<!Object>}
     */
    this.enemyBlockers = [];

    /** @type {?Object} */
    this.fightSound = null;

    /** @type {boolean} */
    this.fightSoundPlaying = false;
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

    kristen.application = this.application;

    /*
     * Skapa spärr efter Kristen.
     * Spärren är osynlig och stoppar spelaren tills Kristen dör.
     */
    blocker = this.createKristenBlocker(spawn, kristen);

    kristen.enemyBlocker = blocker;
    blocker.enemy = kristen;

    return kristen;
};

/**
 * Skapar en osynlig spärr som går hela vägen uppifrån och ner
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
    var blockerWidth = 10;
    var blockerHeight = 2000;

    blockerX = enemy.x + enemy.width - 5;
    blockerY = -500;

    blocker = new rune.display.Graphic(
        blockerX,
        blockerY,
        blockerWidth,
        blockerHeight
    );

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
 * @param {boolean=} isPaused
 * @return {void}
 */
runmysteriet.handler.EnemyHandler.prototype.update = function(players, isPaused) {

    var i = 0;
    var enemy = null;

    if (isPaused === true) {
        this.stopFightSound();
        return;
    }

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
    this.updateFightSound(players);
};

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

/**
 * Uppdaterar fight-ljudet.
 * Ljudet spelas när minst en levande spelare är nära en levande Kristen.
 *
 * @param {!Array<!runmysteriet.entity.Player>} players
 * @return {void}
 */
runmysteriet.handler.EnemyHandler.prototype.updateFightSound = function(players) {

    var i = 0;
    var j = 0;
    var enemy = null;
    var player = null;

    var enemyCenterX = 0;
    var playerCenterX = 0;
    var distance = 0;

    var fightDistance = 400;
    var shouldPlayFightSound = false;

    if (!players) {
        this.stopFightSound();
        return;
    }

    for (i = 0; i < this.enemies.length; i++) {
        enemy = this.enemies[i];

        if (!enemy || enemy.isDead === true) {
            continue;
        }

        enemyCenterX = enemy.x + enemy.width / 2;

        for (j = 0; j < players.length; j++) {
            player = players[j];

            if (!player || player.isDead === true) {
                continue;
            }

            playerCenterX = player.x + player.width / 2;
            distance = Math.abs(playerCenterX - enemyCenterX);

            if (distance <= fightDistance) {
                shouldPlayFightSound = true;
                break;
            }
        }

        if (shouldPlayFightSound === true) {
            break;
        }
    }

    if (shouldPlayFightSound === true) {
        this.startFightSound();
    } else {
        this.stopFightSound();
    }
};

/**
 * Startar fight-ljudet.
 *
 * @return {void}
 */
runmysteriet.handler.EnemyHandler.prototype.startFightSound = function() {

    var mediaElement = null;

    if (this.fightSoundPlaying === true) {
        return;
    }

    if (!this.application) {
        return;
    }

    if (!this.fightSound) {
        this.fightSound = this.application.sounds.sound.get("figth");
    }

    if (!this.fightSound) {
        return;
    }

    //Styrs via mediaElement
     
     
    if (
        this.fightSound.m_source &&
        this.fightSound.m_source.mediaElement
    ) {
        mediaElement = this.fightSound.m_source.mediaElement;

        mediaElement.loop = true;
        mediaElement.volume = 0.5;

        try {
            mediaElement.currentTime = 0;
        } catch (error) {
        }

        mediaElement.play();

        this.fightSoundPlaying = true;
        return;
    }

    //Fallback om mediaElement inte finns.
     
    this.fightSound.loop = true;
    this.fightSound.volume = 0.5;
    this.fightSound.play();

    this.fightSoundPlaying = true;
};
/**
 * Stoppar fight-ljudet säkert.
 *
 * @return {void}
 */
runmysteriet.handler.EnemyHandler.prototype.stopFightSound = function() {

    var mediaElement = null;
    if (!this.fightSound) {
        this.fightSoundPlaying = false;
        return;
    }

    if (!this.fightSound.m_source) {
        this.fightSoundPlaying = false;
        return;
    }

    if (!this.fightSound.m_source.mediaElement) {
        this.fightSoundPlaying = false;
        return;
    }

    mediaElement = this.fightSound.m_source.mediaElement;

    if (typeof mediaElement.pause === "function") {
        mediaElement.pause();
    }

    mediaElement.loop = false;

    try {
        mediaElement.currentTime = 0;
    } catch (error) {
    }

    this.fightSoundPlaying = false;
};

/**
 * Kontrollerar om autoscroll ska pausas för att en levande Kristen
 * Blockerar spelaren i kamerans fight-zon.
 *
 * @param {?rune.camera.Camera} camera
 * @return {boolean}
 */
runmysteriet.handler.EnemyHandler.prototype.shouldPauseAutoScroll = function(
    camera
) {

    var i = 0;
    var enemy = null;

    var cameraX = 0;
    var cameraWidth = 0;
    var triggerLeft = 0;
    var triggerRight = 0;
    var enemyCenterX = 0;

    if (!camera || !camera.viewport) {
        return false;
    }

    cameraX = Math.round(camera.viewport.x);
    cameraWidth = camera.viewport.width || 0;

    if (cameraWidth <= 0) {
        return false;
    }

    /*
     * Fight-zon
     * justera triggerRight- 0.65 om kameran ska stanna tidigare/senare
     */
    triggerLeft = cameraX;
    triggerRight = cameraX + cameraWidth * 0.65;

    for (i = 0; i < this.enemies.length; i++) {
        enemy = this.enemies[i];

        if (!enemy || enemy.isDead === true) {
            continue;
        }

        enemyCenterX = enemy.x + enemy.width / 2;

        if (
            enemyCenterX >= triggerLeft &&
            enemyCenterX <= triggerRight
        ) {
            return true;
        }
    }

    return false;
};

/**
 * Tar bort alla kristna och spärrar från stage och tömmer listorna
 *
 * @return {void}
 */
runmysteriet.handler.EnemyHandler.prototype.clear = function() {

    var i = 0;
    var enemy = null;

    this.stopFightSound();

    //Fiender.
     
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

    //Spärrar.
     
    this.clearDisplayList(this.enemyBlockers);

    this.enemies = [];
    this.enemyBlockers = [];
};

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

/**
 * Rensar EnemyHandler helt.
 *
 * @return {void}
 */
runmysteriet.handler.EnemyHandler.prototype.dispose = function() {
    this.clear();

    this.fightSound = null;
    this.application = null;

    this.stage = null;
};