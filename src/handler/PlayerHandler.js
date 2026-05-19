//------------------------------------------------------------------------------
// PLAYER HANDLER
//------------------------------------------------------------------------------

//Klassen där alla spelare i spelet hanteras.

/**
 * Handles all players in the game.
 *
 * @constructor
 * @param {!rune.display.Stage} stage
 * @param {!Object} platformHandler
 * @param {!Object} application
 */
runmysteriet.handler.PlayerHandler = function(stage, platformHandler, application, input,keyboard) {

    /** @type {!rune.display.Stage} */
    this.stage = stage;

    /** @type {!Object} */
    this.platformHandler = platformHandler;

    /** @type {!Array<!Object>} */
    this.platforms = platformHandler.platforms;

    /** @type {!Object} */
    this.application = application;

    /** @type {!Array<!runmysteriet.entity.Player>} */
    this.players = [];

    /** @type {number} */
    this.m_avatarPlatformOffsetY = 14;

    ///** @type {number} */
    this.m_raftPlatformOffsetY = 0;

    /** @type {!runmysteriet.input.GameInput} */
    this.input = input;

    /** @type {!Object} */
    this.keyboard = keyboard;

    /** @type {?Object} */
    this.jumpSound = this.application.sounds.sound.get("sound_jump");
    /** @type {?runmysteriet.handler.EnemyHandler} */
    this.enemyHandler = null;

    /** @type {!Array<!Object>} */
    this.attacks = [];

    /// Kameran behöver referens till spelare för att kunna följa dem.
    /** @type {?rune.camera.Camera} */
    this.camera = null;

    
    this.deathEffects = [];
};

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.handler.PlayerHandler.prototype.init = function() {

    var player1 = new runmysteriet.entity.Player(
        { left: "LEFT", right: "RIGHT", jump: "UP", down: "DOWN" },
        {
            texture: "spritesheet_freya_all",
            start: "idle"
        }
);

    var player2 = new runmysteriet.entity.Player(
        { left: "A", right: "D", jump: "W", down: "S" },
        {
            texture: "spritesheet_thor_all",
            start: "idle"
        }
);

    player1.direction = 1;
    player1.flippedX = false;

    player2.direction = 1;
    player2.flippedX = false;

    this.placePlayerOnStartPlatform(player1, 0);
    this.placePlayerOnStartPlatform(player2, 1);

    player1.hp = 100;
    player1.maxHp = 100;

    player2.hp = 100;
    player2.maxHp = 100;

    player1.previousY = player1.y;
    player2.previousY = player2.y;

    player1.velocityY = 0;
    player2.velocityY = 0;

    player1.gravity = 0.5;
    player2.gravity = 0.5;

    player1.isOnGround = false;
    player2.isOnGround = false;

    this.players.push(player1);
    this.players.push(player2);

    player1.hpBar = this.createHpBar();
    player2.hpBar = this.createHpBar();

    this.stage.addChild(player1.hpBar);
    this.stage.addChild(player2.hpBar);

    for (var i = 0; i < this.players.length; i++) {
        this.stage.addChild(this.players[i]);
    }
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

runmysteriet.handler.PlayerHandler.prototype.update = function() {

    this.updateInput();
    this.updateMovement();
    this.updateCollisions();
    this.keepPlayersInsideLevel();
    this.updateAttacks();
    this.updateDeathEffects();

    for (var i = 0; i < this.players.length; i++) {

        var p = this.players[i];

        if (!p) continue;

        if (typeof p.updateAttackCooldown === "function") {
            p.updateAttackCooldown();
        }

        // ---------------------------
        // HP BAR POSITION + SCALE
        // ---------------------------
        if (p.hpBar) {

            p.hpBar.x = p.x;
            p.hpBar.y = p.y - 12;

            var hpPercent = p.hp / p.maxHp;
            if (hpPercent < 0) hpPercent = 0;

            p.hpBar.scaleX = hpPercent;
        }

        // ---------------------------
        //  HP BAR TEXTURE SYSTEM
        // ---------------------------
        var newTexture;

        if (p.hp > 80) {
            newTexture = "hpbar1";
        } else if (p.hp > 50) {
            newTexture = "hpbar2";
        } else if (p.hp > 30) {
            newTexture = "hpbar3";
        } else {
            newTexture = "hpbar4";
        }

        if (p.hpBar && newTexture !== p.hpBar.currentHpTexture) {

            p.hpBar.currentHpTexture = newTexture;

            if (p.hpBar.stage) {
                p.hpBar.stage.removeChild(p.hpBar);
            }

            p.hpBar = new rune.display.Graphic(0, 0, 32, 4, newTexture);
            p.hpBar.anchorX = 0;
            p.hpBar.anchorY = 0;
            p.hpBar.currentHpTexture = newTexture;

            this.stage.addChild(p.hpBar);
        }

        // ---------------------------
        // DEATH
        // ---------------------------
        if (p.hp <= 0 && p.isDead !== true) {
            this.killPlayer(p, i);
            continue;
        }

        p.updateAnimation();
    }
};
//------------------------------------------------------------------------------
// INPUT
//------------------------------------------------------------------------------

runmysteriet.handler.PlayerHandler.prototype.updateInput = function() {


    
    for (var i = 0; i < this.players.length; i++) {

        var player = this.players[i];

        if (!player || player.isDead === true) {
            continue;
        }

        player.previousY = player.y;
        player.isMoving = false;

        this.handleInput(player, i);
    }
};

//------------------------------------------------------------------------------
// MOVEMENT
//------------------------------------------------------------------------------

runmysteriet.handler.PlayerHandler.prototype.updateMovement = function() {

    for (var i = 0; i < this.players.length; i++) {

        var player = this.players[i];

        if (!player || player.isDead === true) {
            continue;
        }

        player.velocityY += player.gravity;
        player.y += player.velocityY;

        player.isOnGround = false;
    }
};

//------------------------------------------------------------------------------
// LEVEL BOUNDS
//------------------------------------------------------------------------------

runmysteriet.handler.PlayerHandler.prototype.keepPlayersInsideLevel = function() {

    var i = 0;
    var player = null;
    var maxX = 0;

    if (!this.platformHandler || !this.platformHandler.levelWidth) {
        return;
    }

    for (i = 0; i < this.players.length; i++) {

        player = this.players[i];

        if (!player || player.isDead === true) {
            continue;
        }

        /*
         * Stoppa spelaren från att gå utanför vänster sida.
         */
        if (player.x < 0) {
            player.x = 0;
        }

        /*
         * Stoppa spelaren från att gå utanför höger sida av leveln.
         */
        maxX = this.platformHandler.levelWidth - player.width;

        if (player.x > maxX) {
            player.x = maxX;
        }
    }
};

//------------------------------------------------------------------------------
// COLLISIONS
//------------------------------------------------------------------------------

runmysteriet.handler.PlayerHandler.prototype.updateCollisions = function() {

    for (var i = 0; i < this.players.length; i++) {

        var player = this.players[i];

        if (!player || player.isDead === true) {
            continue;
        }

        player.currentPlatform = null;

        for (var j = 0; j < this.platforms.length; j++) {

            var platform = this.platforms[j];

            if (!platform) {
                continue;
            }

            if (Math.abs(platform.x - player.x) > 350) {
                continue;
            }

            this.checkPlatform(player, platform);
        }

        for (var k = 0; k < this.players.length; k++) {

            var other = this.players[k];

            if (!other || player === other || other.isDead === true) {
                continue;
            }

            this.checkPlayerPlatform(player, other);
        }

        this.checkCaveBlockers(player);
        this.checkWaterDeath(player, i);
        this.checkBoatDeath(player, i);
    }
};
//------------------------------------------------------------------------------
// ALL PLAYERS ON PLATFORM
//------------------------------------------------------------------------------    

runmysteriet.handler.PlayerHandler.prototype.areAllActivePlayersOnPlatform = function(platform) {
    var player = null;
    var i = 0;

    for (i = 0; i < this.players.length; i++) {
        player = this.players[i];

        /*
         * hoppa över spelare som inte finns eller är döda
         */
        if (!player || player.isDead === true) {
            continue;
        }

        /*
         * om levande spelare INTE står på plattform,
         * då ska flotten inte starta
         */
        if (player.currentPlatform !== platform) {
            return false;
        }
    }

    return true;
};

//------------------------------------------------------------------------------
// PLATFORM COLLISION
//------------------------------------------------------------------------------

runmysteriet.handler.PlayerHandler.prototype.checkPlatform = function(player, platform) {

    var offsetY = 0;

    var playerFootY = 0;
    var playerPreviousFootY = 0;
    var platformTop = 0;

    var playerLeft = 0;
    var playerRight = 0;
    var platformLeft = 0;
    var platformRight = 0;

    var playerPaddingX = 6;
    var platformPaddingX = 2;
    var toleranceY = 2;

    var isFalling = false;
    var wasAbove = false;
    var hasReachedPlatform = false;
    var overlapsX = false;

    if (!player || !platform) {
        return false;
    }

    if (platform.isRaft === true) {
        playerPaddingX = 3;
        platformPaddingX = 0;
        toleranceY = 10;
    }

    offsetY = this.getPlatformOffsetY(platform);

    playerFootY = player.y + player.height / 2 + offsetY;
    playerPreviousFootY = player.previousY + player.height / 2 + offsetY;

    if (typeof platform.getCollisionTop === "function") {
        platformTop = platform.getCollisionTop();
    } else {
        platformTop = platform.y;
    }

    isFalling = player.velocityY >= 0;

    if (isFalling !== true) {
        return false;
    }

    wasAbove = playerPreviousFootY <= platformTop + toleranceY;
    hasReachedPlatform = playerFootY >= platformTop - toleranceY;

    playerLeft = player.x + playerPaddingX;
    playerRight = player.x + player.width - playerPaddingX;

    if (typeof platform.getCollisionLeft === "function") {
        platformLeft = platform.getCollisionLeft();
    } else {
        platformLeft = platform.x + platformPaddingX;
    }

    if (typeof platform.getCollisionRight === "function") {
        platformRight = platform.getCollisionRight();
    } else {
        platformRight = platform.x + platform.width - platformPaddingX;
    }

    overlapsX =
        playerRight > platformLeft &&
        playerLeft < platformRight;

    if (wasAbove && hasReachedPlatform && overlapsX) {

        player.y = this.getStandingY(player, platform);
        player.velocityY = 0;
        player.isOnGround = true;
        player.currentPlatform = platform;

        if (platform.isRaft === true) {

            if (this.areAllActivePlayersOnPlatform(platform)) {
                if (typeof platform.start === "function") {
                    platform.start();
                }
            }

            player.x += platform.deltaX || 0;
        }

        return true;
    }

    return false;
};

//------------------------------------------------------------------------------
// PLAYER HITBOX HELPERS
//------------------------------------------------------------------------------

runmysteriet.handler.PlayerHandler.prototype.getPlayerFootY = function(player) {

    if (!player) {
        return 0;
    }

    /*
     * Samma fotpunktstänk som används i checkPlatform:
     * player.y + player.height / 2
     */
    return player.y + player.height / 2;
};

runmysteriet.handler.PlayerHandler.prototype.getPlayerPreviousFootY = function(player) {

    if (!player) {
        return 0;
    }

    if (typeof player.previousY !== "number") {
        return this.getPlayerFootY(player);
    }

    return player.previousY + player.height / 2;
};

runmysteriet.handler.PlayerHandler.prototype.getPlayerHeadY = function(player) {

    if (!player) {
        return 0;
    }

    /*
     * Spelarens övre kollisionspunkt.
     */
    return player.y - player.height / 2;
};
//------------------------------------------------------------------------------
// PLAYER ON PLAYER
//------------------------------------------------------------------------------

runmysteriet.handler.PlayerHandler.prototype.checkPlayerPlatform = function(player, other) {

    var playerFootY = 0;
    var playerPreviousFootY = 0;
    var otherHeadY = 0;

    var playerLeft = 0;
    var playerRight = 0;
    var otherLeft = 0;
    var otherRight = 0;

    var hitboxPaddingX = 8;
    var toleranceY = 3;

    var isFalling = false;
    var wasAbove = false;
    var hasReachedOther = false;
    var isOverOther = false;

    if (!player || !other) {
        return false;
    }

    if (player === other) {
        return false;
    }

    if (player.isDead === true || other.isDead === true) {
        return false;
    }

    /*
     * Spelaren måste falla nedåt.
     */
    isFalling = player.velocityY >= 0;

    if (isFalling !== true) {
        return false;
    }

    /*
     * räknar spelarens fotpunkt på samma sätt som i checkPlatform
     */
    playerFootY = this.getPlayerFootY(player);
    playerPreviousFootY = this.getPlayerPreviousFootY(player);

    /*
     * räkna den andra spelarens huvud/överkant
     */
    otherHeadY = this.getPlayerHeadY(other);

    /*
     * spelaren måste ha varit ovanför i förra framen
     * detta hindrar också att spelaren snappas upp från sidan eller underifrån
     */
    wasAbove = playerPreviousFootY <= otherHeadY + toleranceY;

    /*
     * spelaren måste faktiskt ha nått ner till den andra spelaren
     */
    hasReachedOther = playerFootY >= otherHeadY - toleranceY;

    /*
     * Horisontell kollisionsyta.
     * och krymper hitboxen lite så spelaren inte fastnar på ytterkanter
     */
    playerLeft = player.x + hitboxPaddingX;
    playerRight = player.x + player.width - hitboxPaddingX;

    otherLeft = other.x + hitboxPaddingX;
    otherRight = other.x + other.width - hitboxPaddingX;

    isOverOther =
        playerRight >= otherLeft &&
        playerLeft <= otherRight;

    if (wasAbove && hasReachedOther && isOverOther) {

        /*
         * placerar spelarens fot exakt på den andra spelarens huvud
         * placerar utifrån den andra spelarens huvud för att undvika att spelaren fastnar i huvudet
         */
        player.y = otherHeadY - player.height / 2;

        player.velocityY = 0;
        player.isOnGround = true;

        return true;
    }

    return false;
};

//------------------------------------------------------------------------------
// INPUT HANDLER
//------------------------------------------------------------------------------

runmysteriet.handler.PlayerHandler.prototype.handleInput = function(player, index) {

    var input = this.input.readPlayer(this.keyboard, index);
    var moveSpeed = player.speed;

    player.wantsToCrouch = input.down === true;
    player.isCrouching = input.down === true;

    if (player.isCrouching === true) {
        moveSpeed = player.speed * 0.4;
    }

    if (input.left) {
        player.x -= moveSpeed;
        player.isMoving = true;
        player.direction = -1;
        player.flippedX = true;
    }

    if (input.right) {
        player.x += moveSpeed;
        player.isMoving = true;
        player.direction = 1;
        player.flippedX = false;
    }

    if (input.jump && player.isOnGround === true && player.isCrouching !== true) {
        player.velocityY = player.jumpPower;
        player.isOnGround = false;

        if (this.jumpSound) {
            this.jumpSound.play();
        }
    }

    if (input.attack && player.canAttack()) {
    player.isAttacking = true;
    player.attackAnimationTimer = 12;
    player.currentAnimation = "";

    this.createAttack(player);
    player.resetAttackCooldown();
}
};
//------------------------------------------------------------------------------
// HP BAR
//------------------------------------------------------------------------------

runmysteriet.handler.PlayerHandler.prototype.createHpBar = function() {

    var bar = new rune.display.Graphic(0, 0, 32, 4, "hpbar1");

    // Förankring
    bar.anchorX = 0;
    bar.anchorY = 0;

    // 🔥 Spara nuvarande texture (viktigt för att undvika konstant recreation)
    bar.currentHpTexture = "hpbar1";

    // Default scale
    bar.scaleX = 1;
    bar.scaleY = 1;

    bar.visible = true;

    return bar;
};

//------------------------------------------------------------------------------
// PLACEMENT
//------------------------------------------------------------------------------

runmysteriet.handler.PlayerHandler.prototype.placePlayerOnPlatform = function(player, platform, offsetX) {

    if (!player || !platform) {
        return;
    }

    player.x = platform.x + (offsetX || 0);
    player.y = this.getStandingY(player, platform);
};

runmysteriet.handler.PlayerHandler.prototype.placePlayerOnStartPlatform = function(player, index) {

    var startPlatform = null;
    var offsetX = 0;

    if (!player) return;

    if (!this.platforms || this.platforms.length === 0) {
        player.x = index * 100;
        player.y = 188 - this.m_avatarPlatformOffsetY;
        return;
    }

    startPlatform = this.platforms[0];
    offsetX = 40 + index * 60;

    this.placePlayerOnPlatform(player, startPlatform, offsetX);
};

runmysteriet.handler.PlayerHandler.prototype.getStandingY = function(player, platform) {

    var offsetY = 0;

    if (!player || !platform) {
        return 0;
    }
    if (platform.isRaft === true) {
        offsetY = this.m_raftPlatformOffsetY;
    }
    offsetY = this.getPlatformOffsetY(platform);

    return platform.y - player.height / 2 - offsetY;
};


runmysteriet.handler.PlayerHandler.prototype.getPlatformOffsetY = function(platform) {
    if (platform && platform.isRaft === true) {
        return this.m_raftPlatformOffsetY;
    }

    return this.m_avatarPlatformOffsetY;
};
//------------------------------------------------------------------------------
// DEATH CHECKS
//------------------------------------------------------------------------------

runmysteriet.handler.PlayerHandler.prototype.checkWaterDeath = function(player, index) {

    var water = null;

    if (!player || player.isDead === true) {
        return;
    }

    /*
     * Om spelaren är på flotten ska vatten inte kunna döda.
     */
    if (player.currentPlatform && player.currentPlatform.isRaft === true) {
        return;
    }

    if (!this.platformHandler || !this.platformHandler.waterAreas) {
        return;
    }

    for (var i = 0; i < this.platformHandler.waterAreas.length; i++) {

        water = this.platformHandler.waterAreas[i];

        if (water && water.isTouchingPlayer(player)) {
            this.killPlayer(player, index);
            return;
        }
    }
};

//------------------------------------------------------------------------------
// BOAT DEATH
//------------------------------------------------------------------------------

runmysteriet.handler.PlayerHandler.prototype.checkBoatDeath = function(player, index) {

    var boat = null;
    var raft = null;
    var i = 0;

    var playerLeft = 0;
    var playerRight = 0;
    var playerTop = 0;
    var playerFoot = 0;

    var boatLeft = 0;
    var boatRight = 0;
    var boatTop = 0;
    var boatBottom = 0;

    var overlapsX = false;
    var boatIsAbovePlayer = false;
    var boatTouchesPlayerY = false;

    var paddingX = 6;

    if (!player || player.isDead === true) {
        return;
    }

    /*
     * Viktigt:
     * Båten ska bara kunna döda om spelaren står på flotten.
     */
    if (!player.currentPlatform || player.currentPlatform.isRaft !== true) {
        return;
    }

    raft = player.currentPlatform;

    if (!this.platformHandler || !this.platformHandler.boats) {
        return;
    }

    playerLeft = player.x + paddingX;
    playerRight = player.x + player.width - paddingX;

    playerTop = this.getPlayerHeadY(player);
    playerFoot = this.getPlayerFootY(player);

    for (i = 0; i < this.platformHandler.boats.length; i++) {

        boat = this.platformHandler.boats[i];

        if (!boat) {
            continue;
        }

        boatLeft = boat.x + paddingX;
        boatRight = boat.x + boat.width - paddingX;

        boatTop = boat.y;
        boatBottom = boat.y + boat.height;

        /*
         * Båten måste vara över spelaren i X-led.
         */
        overlapsX =
            playerRight > boatLeft &&
            playerLeft < boatRight;

        /*
         * Eftersom Y ökar nedåt:
         * boatTop < playerFoot betyder att båten ligger ovanför/nära spelarens kropp.
         */
        boatIsAbovePlayer = boatTop < playerFoot;

        /*
         * Båten måste också nå spelarens kropp i Y-led.
         * Annars skulle spelaren dö bara för att båten är högt ovanför.
         */
        boatTouchesPlayerY =
            boatBottom > playerTop &&
            boatTop < playerFoot;

        /*
         * Extra säkerhet:
         * Båten ska vara ovanför flotten, inte under den.
         */
        if (boat.y > raft.y) {
            continue;
        }

        if (overlapsX && boatIsAbovePlayer && boatTouchesPlayerY) {
            this.killPlayer(player, index);
            return;
        }
    }
};

//------------------------------------------------------------------------------
// KILL PLAYER
//------------------------------------------------------------------------------

runmysteriet.handler.PlayerHandler.prototype.killPlayer = function(player, index) {

    if (!player) {
        return;
    }

    /*
     * Om spelaren redan är död ska vi inte skapa flera dödsbilder.
     */
    if (player.isDead === true) {
        return;
    }

    /*
     * Visa dödsbilden där spelaren dog.
     */
    this.createDeathEffect(player);

    player.isDead = true;
    player.visible = false;
    player.active = false;
    player.velocityY = 0;
    player.hp = 0;

    if (player.hpBar) {
        player.hpBar.visible = false;
    }

    console.log("Spelaren " + index + " dog");
};

/**
 * Skapar en attack framför spelaren.
 *
 * @param {!runmysteriet.entity.Player} player
 * @return {undefined}
 */

//------------------------------------------------------------------------------
// DEATH EFFECT
//------------------------------------------------------------------------------

runmysteriet.handler.PlayerHandler.prototype.createDeathEffect = function(player) {

    var effect = null;

    if (!player) {
        return;
    }

    effect = new rune.display.Graphic(
        player.x - 16,
        player.y - 16,
        64,
        64,
        "death_effect"
    );

    /*
     * 30 fps * 2 sekunder = 60 frames.
     */
    effect.life = 60;
    effect.maxLife = 60;

    /*
     * Rörelse uppåt.
     * Negativ y = uppåt.
     */
    effect.velocityY = -1.2;

    /*
     * Skala upp bilden.
     */
    effect.scaleX = 1.5;
    effect.scaleY = 1.5;

    /*
     * Hur snabbt den växer lite extra.
     */
    effect.scaleSpeed = 0.01;

    this.deathEffects.push(effect);
    this.stage.addChild(effect);
};
runmysteriet.handler.PlayerHandler.prototype.createAttack = function(player) {
       
    console.log("Attack skapas");

    var attack = new runmysteriet.attack.Attack(player);

    this.stage.addChild(attack);
    this.attacks.push(attack);
};

/**
 * Uppdaterar attacker och kollar om de träffar fiender.
 *
 * @return {void}
 */
runmysteriet.handler.PlayerHandler.prototype.updateAttacks = function() {

    var i = 0;
    var j = 0;
    var attack = null;
    var enemy = null;
    var enemies = [];

    if (!this.attacks) {
        this.attacks = [];
    }

    if (this.enemyHandler && this.enemyHandler.enemies) {
        enemies = this.enemyHandler.enemies;
    }

    for (i = this.attacks.length - 1; i >= 0; i--) {

        attack = this.attacks[i];

        if (!attack) {
            this.attacks.splice(i, 1);
            continue;
        }

        /*
         * Kolla träff mot alla fiender.
         */
        for (j = enemies.length - 1; j >= 0; j--) {

            enemy = enemies[j];

            if (!enemy || enemy.isDead === true) {
                continue;
            }

            if (attack.hitTestObject(enemy)) {
                this.createAttackEmitter(enemy.x, enemy.y);

                console.log("Attack träffade Kristen");

                if (typeof enemy.takeDamage === "function") {
                    enemy.takeDamage(attack.damage);
                }

                attack.hasHit = true;

                if (typeof attack.remove === "function") {
                    attack.remove();
                }

                this.attacks.splice(i, 1);
                break;
            }
        }

        /*
         * Ta bort gamla attacker.
         */
        if (attack && (attack.life <= 0 || !attack.parent)) {
            this.attacks.splice(i, 1);
        }
    }
};
/**
 * kopplar enemy handler till player handler.
 *
 * @param {!runmysteriet.handler.EnemyHandler} enemyHandler
 * @return {void}
 */
runmysteriet.handler.PlayerHandler.prototype.setEnemyHandler = function(enemyHandler) {

    this.enemyHandler = enemyHandler;
};

//------------------------------------------------------------------------------
// CAMERA
//------------------------------------------------------------------------------

/**
 * Kopplar kameran till PlayerHandler.
 *
 * @param {!rune.camera.Camera} camera
 * @return {void}
 */
runmysteriet.handler.PlayerHandler.prototype.setCamera = function(camera) {

    this.camera = camera;
};

/**
 * Hindrar levande spelare från att lämna kamerans synliga område.
 * Detta gör att spelarna inte kan gå ifrån varandra.
 *
 * @return {void}
 */
runmysteriet.handler.PlayerHandler.prototype.keepPlayersInsideCamera = function() {

    var i = 0;
    var player = null;
    var leftLimit = 0;
    var rightLimit = 0;
    var playerWidth = 32;
    var margin = 8;

    if (!this.camera || !this.camera.viewport) {
        return;
    }

    leftLimit = Math.round(this.camera.viewport.x) + margin;

    for (i = 0; i < this.players.length; i++) {

        player = this.players[i];

        if (!player || player.isDead === true) {
            continue;
        }

        playerWidth = player.width || 32;

        rightLimit =
            Math.round(this.camera.viewport.x) +
            this.camera.viewport.width -
            margin -
            playerWidth;

        if (rightLimit < leftLimit) {
            rightLimit = leftLimit;
        }

        /*
         * Stoppa spelaren från att lämna kamerans vänstra sida.
         */
        if (player.x < leftLimit) {
            player.x = leftLimit;
        }

        /*
         * Stoppa spelaren från att lämna kamerans högra sida.
         */
        if (player.x > rightLimit) {
            player.x = rightLimit;
        }
    }
};

// ATTACK EMITTER
//------------------------------------------------------------------------------    
runmysteriet.handler.PlayerHandler.prototype.createAttackEmitter = function(x, y) {

    var emitter = new rune.particle.Emitter(
        x,
        y,
        20,
        20,
        {
            capacity: 12,

            minVelocityX: -2,
            maxVelocityX: 2,

            minVelocityY: -2,
            maxVelocityY: 1,

            accelerationY: 0.1,

            minLifespan: 200,
            maxLifespan: 500,

            minRotation: -0.2,
            maxRotation: 0.2,

            particles: [
                runmysteriet.particle.AttackParticle
            ]
        }
    );

    this.stage.addChild(emitter);

    emitter.emit(10);
};

//------------------------------------------------------------------------------
// CAVE BLOCKERS
//------------------------------------------------------------------------------

/**
 * Hindrar spelaren från att hoppa över grottan.
 * Spelaren får bara passera genom den lägre öppningen där Kristen står.
 *
 * @param {!runmysteriet.entity.Player} player
 * @return {void}
 */
runmysteriet.handler.PlayerHandler.prototype.checkCaveBlockers = function(player) {

    var blockers = null;
    var blocker = null;
    var i = 0;

    var playerLeft = 0;
    var playerRight = 0;
    var playerFootY = 0;

    var blockerLeft = 0;
    var blockerRight = 0;

    var overlapsX = false;
    var isTooHigh = false;

    if (!player || player.isDead === true) {
        return;
    }

    if (!this.enemyHandler || !this.enemyHandler.caveBlockers) {
        return;
    }

    blockers = this.enemyHandler.caveBlockers;

    playerLeft = player.x;
    playerRight = player.x + player.width;
    playerFootY = this.getPlayerFootY(player);

    for (i = 0; i < blockers.length; i++) {

        blocker = blockers[i];
        

        if (!blocker) {
            continue;
        }
        if (blocker.enemy && blocker.enemy.isDead === true) {
            continue;
        }

        blockerLeft = blocker.x;
        blockerRight = blocker.x + blocker.width;

        overlapsX =
            playerRight > blockerLeft &&
            playerLeft < blockerRight;

        /*
         * Om spelarens fötter är ovanför öppningen,
         * försöker spelaren passera för högt.
         */
        isTooHigh = playerFootY < blocker.openingY;

        if (overlapsX && isTooHigh) {

            /*
             * Flytta tillbaka spelaren till positionen innan sidledsrörelsen.
             * Detta stoppar hopp över grottan men tillåter gång genom öppningen.
             */
            if (typeof player.previousX === "number") {
                player.x = player.previousX;
            } else {
                player.x = blockerLeft - player.width;
            }

            /*
             * Om spelaren är på väg uppåt, stoppa upphoppet lite.
             */
            if (player.velocityY < 0) {
                player.velocityY = 0;
            }

            return;
        }
    }
};


runmysteriet.handler.PlayerHandler.prototype.updateDeathEffects = function() {

    var i = 0;
    var effect = null;

    for (i = this.deathEffects.length - 1; i >= 0; i--) {

        effect = this.deathEffects[i];

        if (!effect) {
            this.deathEffects.splice(i, 1);
            continue;
        }

        effect.life--;

        /*
         * Flyg uppåt.
         */
        effect.y += effect.velocityY;

        /*
         * Väx lite medan den flyger.
         */
        effect.scaleX += effect.scaleSpeed;
        effect.scaleY += effect.scaleSpeed;

        /*
         * Fade-out sista delen.
         */
        if (effect.life < 30) {
            effect.alpha = effect.life / 30;
        }

        if (effect.life <= 0) {

            if (effect.stage) {
                effect.stage.removeChild(effect);
            }

            this.deathEffects.splice(i, 1);
        }
    }
};