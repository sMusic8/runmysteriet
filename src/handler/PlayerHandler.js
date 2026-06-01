//------------------------------------------------------------------------------
// PLAYER HANDLER
//------------------------------------------------------------------------------

/**
 * Handles all players in the game.
 *
 * @constructor
 * @param {!rune.display.Stage} stage
 * @param {!Object} platformHandler
 * @param {!Object} application
 */
runmysteriet.handler.PlayerHandler = function(stage, platformHandler, application, input, keyboard, avatarData) {
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

    // Kamerans referens till spelare för att kunna följa dem.
    /** @type {?rune.camera.Camera} */
    this.camera = null;

    
    this.deathEffects = [];
    this.attackEmitters = [];

    this.cameraHandler = null;
    this.deathSound = this.application.sounds.sound.get("lose_");

    this.avatarData = avatarData || null;
};

/**
 * Initierar spelarna och placerar dem på startplattformar.
 *
 * Skapar två spelare, sätter kontroller, HP, fysikvärden och HUD (HP-bars) samt lägger till dem i scenen.
 *
 * @return {void}
 */
runmysteriet.handler.PlayerHandler.prototype.init = function() {

    /** @type {string} */
    var player1Texture = "spritesheet_freya_all";

    /** @type {string} */
    var player2Texture = "spritesheet_thor_all";

    if (
        this.avatarData &&
        this.avatarData.player1 &&
        this.avatarData.player1.texture
    ) {
        player1Texture = this.avatarData.player1.texture;
    }

    if (
        this.avatarData &&
        this.avatarData.player2 &&
        this.avatarData.player2.texture
    ) {
        player2Texture = this.avatarData.player2.texture;
    }

    /** @type {runmysteriet.entity.Player} */
    var player1 = new runmysteriet.entity.Player(
        { left: "LEFT", right: "RIGHT", jump: "UP", down: "DOWN" },
        { texture: player1Texture, start: "idle" }
    );

    /** @type {runmysteriet.entity.Player} */
    var player2 = new runmysteriet.entity.Player(
        { left: "A", right: "D", jump: "W", down: "S" },
        { texture: player2Texture, start: "idle" }
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
/**
 * Uppdaterar alla spelare varje frame.
 * Kör hela spel-loopens player-logik i rätt ordning
 *
 * @return {void}
 */
runmysteriet.handler.PlayerHandler.prototype.update = function() {

    this.updateInput();
    this.updateMovement();
    this.updateBoatDangerState();
    this.updateCollisions();
    this.keepPlayersInsideLevel();
    this.updateAttacks();
    this.updateDeathEffects();
    this.updateAttackEmitters();

    for (var i = 0; i < this.players.length; i++) {

        /** @type {runmysteriet.entity.Player} */
        var p = this.players[i];

        if (!p) {
            continue;
        }

        /**
         * Uppdaterar attack cooldown om metoden finns.
         * @type {Function|undefined}
         */
        if (typeof p.updateAttackCooldown === "function") {
            p.updateAttackCooldown();
        }

        if (p.hpBar) {

            p.hpBar.x = p.x;
            p.hpBar.y = p.y - 12;

            var hpPercent = p.hp / p.maxHp;
            if (hpPercent < 0) {
                hpPercent = 0;
            }

            p.hpBar.scaleX = hpPercent;
        }

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


        if (p.hp <= 0 && p.isDead !== true) {
            this.killPlayer(p, i);
            continue;
        }

        p.updateAnimation();
    }
};

/**
 * Uppdaterar input för alla aktiva spelare.
 * @return {void}
 */
runmysteriet.handler.PlayerHandler.prototype.updateInput = function() {
    
    for (var i = 0; i < this.players.length; i++) {

        /** @type {runmysteriet.entity.Player} */
        var player = this.players[i];

        if (!player || player.isDead === true) {
            continue;
        }

        player.previousX = player.x;
        player.previousY = player.y;

        /**
         * Reset rörelsestatus innan input.
         * @type {boolean}
         */
        player.isMoving = false;

        /**
         * Hanterar faktisk input-logik för spelaren.
         * @type {Function}
         */
        this.handleInput(player, i);
    }
};

/**
 * Uppdaterar spelarnas rörelse.
 *
 * @return {void}
 */
runmysteriet.handler.PlayerHandler.prototype.updateMovement = function() {

    for (var i = 0; i < this.players.length; i++) {

        /** @type {runmysteriet.entity.Player} */
        var player = this.players[i];

        if (!player || player.isDead === true) {
            continue;
        }

        /**
         * Gravitation påverkar vertikal hastighet.
         * @type {number}
         */
        player.velocityY += player.gravity;

        /**
         * Applicera vertikal rörelse.
         * @type {number}
         */
        player.y += player.velocityY;

        /**
         * Nollställ ground-state innan collision checks.
         * @type {boolean}
         */
        player.isOnGround = false;
    }
};
/**
 * Håller alla aktiva spelare inom levelns horisontella gränser.
 * Spelare som är null eller döda (isDead === true) ignoreras.
 *
 * @this {runmysteriet.handler.PlayerHandler}
 * @return {void}
 */
runmysteriet.handler.PlayerHandler.prototype.keepPlayersInsideLevel = function() {

    /** @type {number} */
    var i = 0;

    /** @type {?runmysteriet.entity.Player} */
    var player = null;

    /** @type {number} */
    var maxX = 0;

    if (!this.platformHandler || !this.platformHandler.levelWidth) {
        return;
    }

    for (i = 0; i < this.players.length; i++) {

        player = this.players[i];

        if (!player || player.isDead === true) {
            continue;
        }

        //Stoppa spelaren från att gå utanför vänster sida.
        if (player.x < 0) {
            player.x = 0;
        }

        //Stoppa spelaren från att gå utanför höger sida av leveln.
        maxX = this.platformHandler.levelWidth - player.width;

        if (player.x > maxX) {
            player.x = maxX;
        }
    }
};

/**
 * Uppdaterar alla kollisioner för samtliga spelare.
 *
 * @this {runmysteriet.handler.PlayerHandler}
 * @return {void}
 */
runmysteriet.handler.PlayerHandler.prototype.updateCollisions = function() {

    for (var i = 0; i < this.players.length; i++) {

        /** @type {?runmysteriet.entity.Player} */
        var player = this.players[i];

        if (!player || player.isDead === true) {
            continue;
        }

        player.currentPlatform = null;

        for (var j = 0; j < this.platforms.length; j++) {

            /** @type {?runmysteriet.entity.Platform} */
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

            /** @type {?runmysteriet.entity.Player} */
            var other = this.players[k];

            if (!other || player === other || other.isDead === true) {
                continue;
            }

            this.checkPlayerPlatform(player, other);
        }

        this.checkEnemyBlockers(player);
        this.checkWaterDeath(player, i);
        this.checkBoatDeath(player, i);
        this.checkFallDeath(player, i);
    }
};
/**
 * Kontrollerar om alla levande spelare står på en specifik plattform.
 *
 * @this {runmysteriet.handler.PlayerHandler}
 * @param {runmysteriet.entity.Platform} platform Plattformen som ska kontrolleras
 * @return {boolean} True om alla aktiva spelare står på plattformen, annars false
 */
runmysteriet.handler.PlayerHandler.prototype.areAllActivePlayersOnPlatform = function(platform) {
    /** @type {?runmysteriet.entity.Player} */
    var player = null;

    /** @type {number} */
    var i = 0;

    for (i = 0; i < this.players.length; i++) {

        player = this.players[i];

        //hoppa över spelare som inte finns eller är döda
         
        if (!player || player.isDead === true) {
            continue;
        }

        //Om levande spelare INTE står på plattform ska flotten inte starta
        
        if (player.currentPlatform !== platform) {
            return false;
        }
    }

    return true;
};
/**
 * Kontrollerar och hanterar kollision mellan en spelare och en plattform.
 *
 * @this {runmysteriet.handler.PlayerHandler}
 * @param {runmysteriet.entity.Player} player Spelaren som kontrolleras
 * @param {runmysteriet.entity.Platform} platform Plattformen som testas mot
 * @return {boolean} True om kollision (landning) inträffade, annars false
 */
runmysteriet.handler.PlayerHandler.prototype.checkPlatform = function(player, platform) {

    /** @type {number} */
    var offsetY = 0;

    /** @type {number} */
    var playerFootY = 0;

    /** @type {number} */
    var playerPreviousFootY = 0;

    /** @type {number} */
    var platformTop = 0;

    /** @type {number} */
    var playerLeft = 0;

    /** @type {number} */
    var playerRight = 0;

    /** @type {number} */
    var platformLeft = 0;

    /** @type {number} */
    var platformRight = 0;

    /** @type {number} */
    var playerPaddingX = 6;

    /** @type {number} */
    var platformPaddingX = 2;

    /** @type {number} */
    var toleranceY = 2;

    /** @type {boolean} */
    var isFalling = false;

    /** @type {boolean} */
    var wasAbove = false;

    /** @type {boolean} */
    var hasReachedPlatform = false;

    /** @type {boolean} */
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
/**
 * Returnerar spelarens position.
 * @this {runmysteriet.handler.PlayerHandler}
 * @param {runmysteriet.entity.Player} player Spelaren vars fotposition ska beräknas
 * @return {number} Fotens Y-position, eller 0 om spelaren saknas
 */
runmysteriet.handler.PlayerHandler.prototype.getPlayerFootY = function(player) {

    if (!player) {
        return 0;
    }
    return player.y + player.height / 2;
};


/**
 * Returnerar spelarens tidigare Y-position för kollisionsdetektering.
 *
 * @this {runmysteriet.handler.PlayerHandler}
 * @param {runmysteriet.entity.Player} player Spelaren vars tidigare fotposition ska beräknas
 * @return {number} Tidigare fot-Y-position, eller aktuell fot-Y om previousY saknas
 */
runmysteriet.handler.PlayerHandler.prototype.getPlayerPreviousFootY = function(player) {

    if (!player) {
        return 0;
    }

    if (typeof player.previousY !== "number") {
        return this.getPlayerFootY(player);
    }

    return player.previousY + player.height / 2;
};

/**
 * Returnerar spelarens "head Y"-position (övre kollisionspunkt).
 *
 * @this {runmysteriet.handler.PlayerHandler}
 * @param {runmysteriet.entity.Player} player Spelaren vars huvudposition ska beräknas
 * @return {number} Head Y-position, eller 0 om spelaren saknas
 */
runmysteriet.handler.PlayerHandler.prototype.getPlayerHeadY = function(player) {

    if (!player) {
        return 0;
    }
    return player.y - player.height / 2;
};
/**
 * Kontrollerar och hanterar kollision mellan två spelare där en spelare kan stå ovanpå en annan spelare.
 *
 * @this {runmysteriet.handler.PlayerHandler}
 * @param {runmysteriet.entity.Player} player Spelaren som faller
 * @param {runmysteriet.entity.Player} other Spelaren som kan fungera som plattform
 * @return {boolean} True om player landar på other, annars false
 */
runmysteriet.handler.PlayerHandler.prototype.checkPlayerPlatform = function(player, other) {

    /** @type {number} */
    var playerFootY = 0;

    /** @type {number} */
    var playerPreviousFootY = 0;

    /** @type {number} */
    var otherHeadY = 0;

    /** @type {number} */
    var playerLeft = 0;

    /** @type {number} */
    var playerRight = 0;

    /** @type {number} */
    var otherLeft = 0;

    /** @type {number} */
    var otherRight = 0;

    /** @type {number} */
    var hitboxPaddingX = 8;

    /** @type {number} */
    var toleranceY = 3;

    /** @type {boolean} */
    var isFalling = false;

    /** @type {boolean} */
    var wasAbove = false;

    /** @type {boolean} */
    var hasReachedOther = false;

    /** @type {boolean} */
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

    //Spelaren måste falla nedåt.
     
    isFalling = player.velocityY >= 0;

    if (isFalling !== true) {
        return false;
    }

    //Räknar spelarens fotpunkt på samma sätt som i checkPlatform
     
    playerFootY = this.getPlayerFootY(player);
    playerPreviousFootY = this.getPlayerPreviousFootY(player);

    //Räkna den andra spelarens huvud/överkant
     
    otherHeadY = this.getPlayerHeadY(other);

    /*
     * spelaren måste ha varit ovanför i förra framen, detta hindrar också att spelaren snappas upp från sidan eller underifrån
     */
    wasAbove = playerPreviousFootY <= otherHeadY + toleranceY;

    //Spelaren måste faktiskt ha nått ner till den andra spelaren
     
    hasReachedOther = playerFootY >= otherHeadY - toleranceY;

    //Horisontell kollisionsyta.
     
    playerLeft = player.x + hitboxPaddingX;
    playerRight = player.x + player.width - hitboxPaddingX;

    otherLeft = other.x + hitboxPaddingX;
    otherRight = other.x + other.width - hitboxPaddingX;

    isOverOther =
        playerRight >= otherLeft &&
        playerLeft <= otherRight;

    if (wasAbove && hasReachedOther && isOverOther) {

        //Placerar utifrån den andra spelarens huvud för att undvika att spelaren fastnar i huvudet
         
        player.y = otherHeadY - player.height / 2;

        player.velocityY = 0;
        player.isOnGround = true;

        return true;
    }

    return false;
};
/**
 * Hanterar spelarinmatning och uppdaterar spelarens rörelse.
 *
 * @this {runmysteriet.handler.PlayerHandler}
 * @param {runmysteriet.entity.Player} player Spelaren som ska uppdateras
 * @param {number} index Index för spelaren (används för input-mappning)
 * @return {void}
 */
runmysteriet.handler.PlayerHandler.prototype.handleInput = function(player, index) {

    /** @type {?runmysteriet.input.PlayerInput} */
    var input = this.input.readPlayer(this.keyboard, index);

    /** @type {number} */
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
/**
 * Skapar och returnerar en ny HP-bar (livsindikator) som grafiskt displayobjekt.
 *
 * @this {runmysteriet.handler.PlayerHandler}
 * @return {rune.display.Graphic} Den skapade HP-baren
 */
runmysteriet.handler.PlayerHandler.prototype.createHpBar = function() {

    /** @type {rune.display.Graphic} */
    var bar = new rune.display.Graphic(0, 0, 32, 4, "hpbar1");

    // Förankring
    bar.anchorX = 0;
    bar.anchorY = 0;

    // Spara nuvarande texture
    bar.currentHpTexture = "hpbar1";

    // Default scale
    bar.scaleX = 1;
    bar.scaleY = 1;

    bar.visible = true;

    return bar;
};
/**
 * Placerar en spelare exakt ovanpå en plattform.
 * 
 * @this {runmysteriet.handler.PlayerHandler}
 * @param {runmysteriet.entity.Player} player Spelaren som ska placeras
 * @param {runmysteriet.entity.Platform} platform Plattformen spelaren ska placeras på
 * @param {number=} offsetX Valfritt X-offset relativt plattformens startposition
 * @return {void}
 */
runmysteriet.handler.PlayerHandler.prototype.placePlayerOnPlatform = function(player, platform, offsetX) {

    if (!player || !platform) {
        return;
    }

    player.x = platform.x + (offsetX || 0);
    player.y = this.getStandingY(player, platform);
};


/**
 * Placerar en spelare på startplattformen vid spawn.
 *
 * @this {runmysteriet.handler.PlayerHandler}
 * @param {runmysteriet.entity.Player} player Spelaren som ska spawnas
 * @param {number} index Spelarens index (används för positionering i spawnrad)
 * @return {void}
 */
runmysteriet.handler.PlayerHandler.prototype.placePlayerOnStartPlatform = function(player, index) {

    /** @type {?runmysteriet.entity.Platform} */
    var startPlatform = null;

    /** @type {number} */
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
/**
 * Beräknar exakt Y-position där en spelare ska stå ovanpå en plattform.
 *
 * @this {runmysteriet.handler.PlayerHandler}
 * @param {runmysteriet.entity.Player} player Spelaren som ska placeras
 * @param {runmysteriet.entity.Platform} platform Plattformen spelaren står på
 * @return {number} Beräknad Y-position för stående spelare
 */
runmysteriet.handler.PlayerHandler.prototype.getStandingY = function(player, platform) {

    /** @type {number} */
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


/**
 * Returnerar vertikalt offset som används vid placering av spelare på plattformar.
 *
 * @this {runmysteriet.handler.PlayerHandler}
 * @param {runmysteriet.entity.Platform} platform Plattformen som ska analyseras
 * @return {number} Y-offset för placering av spelare
 */
runmysteriet.handler.PlayerHandler.prototype.getPlatformOffsetY = function(platform) {

    if (platform && platform.isRaft === true) {
        return this.m_raftPlatformOffsetY;
    }

    return this.m_avatarPlatformOffsetY;
};

/**
 * Kontrollerar om spelaren har fallit utanför spelvärlden och ska dö.
 *
 * @this {runmysteriet.handler.PlayerHandler}
 * @param {runmysteriet.entity.Player} player Spelaren som ska kontrolleras
 * @param {number} index Spelarens index (används vid killPlayer)
 * @return {void}
 */
runmysteriet.handler.PlayerHandler.prototype.checkFallDeath = function(player, index) {

    /** @type {number} */
    var fallLimitY = 360;

    if (!player || player.isDead === true) {
        return;
    }

    //När spelaren faller i tomma hål så dör den 
     
    if (player.y + player.height > fallLimitY) {
        this.killPlayer(player, index);
    }
};


/**
 * Kontrollerar om spelaren kommer i kontakt med vatten och ska dö.
 *
 * @this {runmysteriet.handler.PlayerHandler}
 * @param {runmysteriet.entity.Player} player Spelaren som ska kontrolleras
 * @param {number} index Spelarens index (används vid killPlayer)
 * @return {void}
 */
runmysteriet.handler.PlayerHandler.prototype.checkWaterDeath = function(player, index) {

    /** @type {?runmysteriet.entity.WaterArea} */
    var water = null;

    if (!player || player.isDead === true) {
        return;
    }

    //Om spelaren är på flotten ska vatten inte kunna döda.
     
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
/**
 * Kontrollerar om en spelare dör vid kontakt med farliga båten.
 *
 * @this {runmysteriet.handler.PlayerHandler}
 * @param {runmysteriet.entity.Player} player Spelaren som ska kontrolleras
 * @param {number} index Spelarens index (används vid killPlayer)
 * @return {void}
 */
runmysteriet.handler.PlayerHandler.prototype.checkBoatDeath = function(player, index) {

    /** @type {?runmysteriet.entity.Boat} */
    var boat = null;

    /** @type {number} */
    var i = 0;

    if (!player || player.isDead === true) {
        return;
    }

    if (!player.currentPlatform || player.currentPlatform.isRaft !== true) {
        return;
    }

    if (!this.platformHandler || !this.platformHandler.boats) {
        return;
    }

    for (i = 0; i < this.platformHandler.boats.length; i++) {

        boat = this.platformHandler.boats[i];

        if (!boat) {
            continue;
        }

        if (boat.isDangerous !== true) {
            continue;
        }

        if (
            typeof boat.isTouchingPlayer === "function" &&
            boat.isTouchingPlayer(player)
        ) {
            this.killPlayer(player, index);
            return;
        }
    }
};


/**
 * Uppdaterar om båten är farlig och om flotten ska visa varning.
 *
 * @return {void}
 */
runmysteriet.handler.PlayerHandler.prototype.updateBoatDangerState = function() {

    var boats = null;
    var boat = null;
    var platform = null;

    var i = 0;
    var j = 0;
    var isDangerous = false;

    if (!this.platformHandler || !this.platformHandler.boats) {
        return;
    }

    boats = this.platformHandler.boats;

    /*
     * Nollställ först alla raft-varningar.
     * Då försvinner DANGER direkt när båten inte längre är på höger sida.
     */
    for (j = 0; j < this.platforms.length; j++) {
        platform = this.platforms[j];

        if (
            platform &&
            platform.isRaft === true &&
            typeof platform.setWarning === "function"
        ) {
            platform.setWarning(false);
        }
    }

    for (i = 0; i < boats.length; i++) {
        boat = boats[i];

        if (!boat) {
            continue;
        }

        isDangerous = false;

        for (j = 0; j < this.platforms.length; j++) {
            platform = this.platforms[j];

            if (!platform || platform.isRaft !== true) {
                continue;
            }

            /*
             * Båtens farliga läge fungerar som innan.
             */
            if (
                typeof boat.isAboveRaft === "function" &&
                boat.isAboveRaft(platform)
            ) {
                isDangerous = true;
            }

            /*
             * DANGER visas bara på flotten när båten är på höger sida
             * och ovanför flotten.
             */
            if (
                typeof boat.isWarningAboveRaft === "function" &&
                boat.isWarningAboveRaft(platform) &&
                typeof platform.setWarning === "function"
            ) {
                platform.setWarning(true);
            }
        }

        if (typeof boat.setDangerous === "function") {
            boat.setDangerous(isDangerous);
        }
    }
};
/**
 * Dödar en spelare och hanterar alla tillhörande effekter och state-uppdateringar.
 *
 * @this {runmysteriet.handler.PlayerHandler}
 * @param {runmysteriet.entity.Player} player Spelaren som ska dödas
 * @param {number=} index Spelarens index (valfritt, används av vissa death systems)
 * @return {void}
 */
runmysteriet.handler.PlayerHandler.prototype.killPlayer = function(player, index) {

    if (!player) {
        return;
    }

    //Om spelaren redan e död ska inte flera dödsbilder skapas.
     
    if (player.isDead === true) {
        return;
    }

    //Visa dödsbilden där spelaren dog.
     
    this.createDeathEffect(player);

    if (this.deathSound) {
        this.deathSound.play();
    }

    if (this.cameraHandler &&
        typeof this.cameraHandler.startDeathSlowMotion === "function"
    ) {
        this.cameraHandler.startDeathSlowMotion();
    }

    player.isDead = true;
    player.visible = false;
    player.active = false;
    player.velocityY = 0;
    player.hp = 0;

    if (player.hpBar) {
        player.hpBar.visible = false;
    }
};

/**
 * Skapar en attack-efekt framför spelaren.
 *
 * @param {!runmysteriet.entity.Player} player
 * @return {undefined}
 */
runmysteriet.handler.PlayerHandler.prototype.createDeathEffect = function(player) {

    var effect = null;
    var effectX = 0;
    var effectY = 0;
    var cameraY = 0;
    var screenH = 225;

    if (!player) {
        return;
    }

    effectX = player.x - 24;
    effectY = player.y - 32;

    //Om spelaren dör långt ner, håll effekten synlig på skärmen.
     
    if (this.camera && this.camera.viewport) {
        cameraY = this.camera.viewport.y;

        if (this.application && this.application.screen) {
            screenH = this.application.screen.height;
        }

        if (effectY > cameraY + screenH - 90) {
            effectY = cameraY + screenH - 90;
        }

        if (effectY < cameraY + 20) {
            effectY = cameraY + 20;
        }
    }

    effect = new rune.display.Graphic(
        effectX,
        effectY,
        96,
        96,
        "death_effect"
    );

    //30 fps * 3 sekunder = 90 frames.
    effect.life = 90;
    effect.maxLife = 90;

    /*
     * Rörelse:
     * X positivt = åt höger.
     * Y negativt = uppåt.
     */
    effect.velocityX = 2.3;
    effect.velocityY = -1.3;

    //Liten acceleration uppåt som att den lyfter mer.
     
    effect.accelerationY = -0.015;

    //Liten drift åt höger.
     
    effect.accelerationX = 0.005;

    //Storlek och växning.
     
    effect.scaleX = 1;
    effect.scaleY = 1;
    effect.scaleSpeed = 0.01;

    effect.alpha = 1;

    this.deathEffects.push(effect);
    this.stage.addChild(effect);
};
/**
 * Kontrollerar enemy blockers för alla levande spelare.
 *
 * @return {void}
 */
runmysteriet.handler.PlayerHandler.prototype.checkAllEnemyBlockers = function() {

    var i = 0;
    var player = null;

    if (!this.players) {
        return;
    }

    for (i = 0; i < this.players.length; i++) {
        player = this.players[i];

        if (!player || player.isDead === true) {
            continue;
        }

        this.checkEnemyBlockers(player);
    }
};
//------------------------------------------------------------------------------
// SOUND
//------------------------------------------------------------------------------

/**
 * Spelar ljud vid attack
 *
 * @param {?Object} sound
 * @return {void}
 */
runmysteriet.handler.PlayerHandler.prototype.playSound = function(sound) {

    var mediaElement = null;

    if (!sound) {
        return;
    }

    if (
        sound.m_source &&
        sound.m_source.mediaElement
    ) {
        mediaElement = sound.m_source.mediaElement;

        try {
            mediaElement.currentTime = 0;
        } catch (error) {
        }
    }

    if (typeof sound.play === "function") {
        sound.play();
    }
};

runmysteriet.handler.PlayerHandler.prototype.createAttack = function(player) { 

    var attack = null;

    if (!player) {
        return;
    }

    if (!this.attackSound && this.application) {
        this.attackSound = this.application.sounds.sound.get("sword_slash");
    }

    this.playSound(this.attackSound);

    attack = new runmysteriet.attack.Attack(player);

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

        //Kolla träff mot alla fiender.
         
        for (j = enemies.length - 1; j >= 0; j--) {

            enemy = enemies[j];

            if (!enemy || enemy.isDead === true) {
                continue;
            }

            if (attack.hitTestObject(enemy)) {
                this.createAttackEmitter(enemy.x, enemy.y);

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

        //Ta bort gamla attacker.
         
        if (attack && (attack.life <= 0 || !attack.parent)) {
            this.attacks.splice(i, 1);
        }
    }
};
/**
 * Kopplar enemy handler till player handler.
 *
 * @param {!runmysteriet.handler.EnemyHandler} enemyHandler
 * @return {void}
 */
runmysteriet.handler.PlayerHandler.prototype.setEnemyHandler = function(enemyHandler) {

    this.enemyHandler = enemyHandler;
};

/**
 * Håller spelarna inom kamerans synliga område vid autoscroll.
 * Spelare stoppas vid vänster och höger kamerakant.
 *
 * @return {void}
 */
runmysteriet.handler.PlayerHandler.prototype.handleAutoScrollCameraBounds = function() {

    var i = 0;
    var player = null;

    var cameraX = 0;
    var cameraWidth = 0;

    var leftLimit = 0;
    var rightLimit = 0;

    var marginLeft = 4;
    var marginRight = 8;
    var playerWidth = 32;

    if (!this.camera || !this.camera.viewport) {
        return;
    }

    cameraX = Math.round(this.camera.viewport.x);
    cameraWidth = this.camera.viewport.width || 0;

    if (cameraWidth <= 0) {
        return;
    }

    leftLimit = cameraX + marginLeft;

    for (i = 0; i < this.players.length; i++) {

        player = this.players[i];

        if (!player || player.isDead === true) {
            continue;
        }

        playerWidth = player.width || 32;

        rightLimit =
            cameraX +
            cameraWidth -
            marginRight -
            playerWidth;

    
        if (rightLimit < leftLimit) {
            rightLimit = leftLimit;
        }


        if (player.x < leftLimit) {

    if (this.isCrushedByEnemyBlocker(player, leftLimit) === true) {
        this.killPlayer(player, i);
        continue;
    }

    player.x = leftLimit;
}

        //Stoppa spelaren vid kamerans högerkant.
         
        if (player.x > rightLimit) {
            player.x = rightLimit;
        }
    }
};
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

        //Stoppa spelaren från att lämna kamerans vänstra sida.
         
        if (player.x < leftLimit) {
            player.x = leftLimit;
        }

        //Stoppa spelaren från att lämna kamerans högra sida.
         
        if (player.x > rightLimit) {
            player.x = rightLimit;
        }
    }
};

 /**
 * Skapar en particle emitter för attack-effekter vid en given position.
 *
 * @this {runmysteriet.handler.PlayerHandler}
 * @param {number} x X-position för emittern
 * @param {number} y Y-position för emittern
 * @return {void}
 */
runmysteriet.handler.PlayerHandler.prototype.createAttackEmitter = function(x, y) {

    /** @type {rune.particle.Emitter} */
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
    this.attackEmitters.push(emitter);

    emitter.emit(20);
    emitter.life = 20;
};
/**
 * Uppdaterar och tar bort gamla attack-emitters.
 *
 * @return {void}
 */
runmysteriet.handler.PlayerHandler.prototype.updateAttackEmitters = function() {

    var i = 0;
    var emitter = null;

    if (!this.attackEmitters) {
        this.attackEmitters = [];
        return;
    }

    for (i = this.attackEmitters.length - 1; i >= 0; i--) {
        emitter = this.attackEmitters[i];

        if (!emitter) {
            this.attackEmitters.splice(i, 1);
            continue;
        }

        emitter.life--;

        if (emitter.life <= 0) {
            this.removeDisplayObject(emitter);
            this.attackEmitters.splice(i, 1);
        }
    }
}; 


//------------------------------------------------------------------------------
// ENEMY BLOCKERS
//------------------------------------------------------------------------------

/**
 * Stoppar spelaren från att gå vidare tills kopplad Kristen är död.
 *
 * @param {!runmysteriet.entity.Player} player
 * @return {void}
 */
runmysteriet.handler.PlayerHandler.prototype.checkEnemyBlockers = function(player) {

    var blockers = null;
    var blocker = null;
    var enemy = null;
    var i = 0;

    var playerLeft = 0;
    var playerRight = 0;
    var playerTop = 0;
    var playerBottom = 0;

    var previousLeft = 0;
    var previousRight = 0;

    var blockerLeft = 0;
    var blockerRight = 0;
    var blockerTop = 0;
    var blockerBottom = 0;

    var overlapsX = false;
    var overlapsY = false;
    var crossedFromLeft = false;
    var crossedFromRight = false;

    if (!player || player.isDead === true) {
        return;
    }

    if (!this.enemyHandler || !this.enemyHandler.enemyBlockers) {
        return;
    }

    blockers = this.enemyHandler.enemyBlockers;

    playerLeft = player.x;
    playerRight = player.x + player.width;
    playerTop = player.y;
    playerBottom = player.y + player.height;

    previousLeft = typeof player.previousX === "number"
        ? player.previousX
        : player.x;

    previousRight = previousLeft + player.width;

    for (i = 0; i < blockers.length; i++) {
        blocker = blockers[i];

        if (!blocker) {
            continue;
        }

        enemy = blocker.enemy;

        /*
         * Om Kristen är död ska spärren inte stoppa spelaren.
         */
        if (enemy && enemy.isDead === true) {
            continue;
        }

        blockerLeft = blocker.x;
        blockerRight = blocker.x + blocker.width;
        blockerTop = blocker.y;
        blockerBottom = blocker.y + blocker.height;

        overlapsX =
            playerRight > blockerLeft &&
            playerLeft < blockerRight;

        overlapsY =
            playerBottom > blockerTop &&
            playerTop < blockerBottom;

        /*
         * Fångar fall där spelaren rör sig snabbt och passerar
         * från ena sidan till andra sidan mellan två frames.
         */
        crossedFromLeft =
            previousRight <= blockerLeft &&
            playerRight >= blockerLeft;

        crossedFromRight =
            previousLeft >= blockerRight &&
            playerLeft <= blockerRight;

        if ((overlapsX && overlapsY) || crossedFromLeft || crossedFromRight) {

            if (crossedFromRight) {
                player.x = blockerRight;
            } else {
                player.x = blockerLeft - player.width;
            }

            if (typeof player.velocityX === "number") {
                player.velocityX = 0;
            }

            return;
        }
    }
};

/**
 * Kontrollerar om kamerans vänsterkant skulle trycka spelaren in i en enemy-blocker.
 *
 * @param {!runmysteriet.entity.Player} player
 * @param {number} targetX
 * @return {boolean}
 */
runmysteriet.handler.PlayerHandler.prototype.isCrushedByEnemyBlocker = function(
    player,
    targetX
) {

    var blockers = null;
    var blocker = null;
    var enemy = null;
    var i = 0;

    var playerLeft = targetX;
    var playerRight = targetX + player.width;
    var playerTop = player.y;
    var playerBottom = player.y + player.height;

    var blockerLeft = 0;
    var blockerRight = 0;
    var blockerTop = 0;
    var blockerBottom = 0;

    var overlapsX = false;
    var overlapsY = false;

    if (!player || player.isDead === true) {
        return false;
    }

    if (!this.enemyHandler || !this.enemyHandler.enemyBlockers) {
        return false;
    }

    blockers = this.enemyHandler.enemyBlockers;

    for (i = 0; i < blockers.length; i++) {
        blocker = blockers[i];

        if (!blocker) {
            continue;
        }

        enemy = blocker.enemy;

        if (enemy && enemy.isDead === true) {
            continue;
        }

        blockerLeft = blocker.x;
        blockerRight = blocker.x + blocker.width;
        blockerTop = blocker.y;
        blockerBottom = blocker.y + blocker.height;

        overlapsX =
            playerRight > blockerLeft &&
            playerLeft < blockerRight;

        overlapsY =
            playerBottom > blockerTop &&
            playerTop < blockerBottom;

        if (overlapsX && overlapsY) {
            return true;
        }
    }

    return false;
};
/**
 * Uppdaterar alla aktiva dödseffekter (death effects) per frame.
 *
 * @this {runmysteriet.handler.PlayerHandler}
 * @return {void}
 */
runmysteriet.handler.PlayerHandler.prototype.updateDeathEffects = function() {

    /** @type {number} */
    var i = 0;

    /** @type {?runmysteriet.entity.DeathEffect} */
    var effect = null;

    for (i = this.deathEffects.length - 1; i >= 0; i--) {

        effect = this.deathEffects[i];

        if (!effect) {
            this.deathEffects.splice(i, 1);
            continue;
        }

        effect.life--;

        //Rörelse mot höger och uppåt.
         
        effect.velocityX += effect.accelerationX;
        effect.velocityY += effect.accelerationY;

        effect.x += effect.velocityX;
        effect.y += effect.velocityY;

        //Väx lite medan den flyger.
         
        effect.scaleX += effect.scaleSpeed;
        effect.scaleY += effect.scaleSpeed;

        //Fade-out sista delen.
         
        if (effect.life < 40) {
            effect.alpha = effect.life / 40;
        }

        if (effect.life <= 0) {

            if (effect.stage) {
                effect.stage.removeChild(effect);
            }

            this.deathEffects.splice(i, 1);
        }
    }
};

/**
 * Sätter camera handler som används för t.ex. slow motion vid död.
 *
 * @this {runmysteriet.handler.PlayerHandler}
 * @param {runmysteriet.handler.CameraHandler} cameraHandler Kamera-logic som ska kopplas in
 * @return {void}
 */
runmysteriet.handler.PlayerHandler.prototype.setCameraHandler = function(cameraHandler) {
    this.cameraHandler = cameraHandler;
};

//------------------------------------------------------------------------------
// REMOVE DISPLAY OBJECT
//------------------------------------------------------------------------------

/**
 * Tar bort display object från stage.
 *
 * @param {?Object} object
 * @return {void}
 */
runmysteriet.handler.PlayerHandler.prototype.removeDisplayObject = function(object) {

    if (!object) {
        return;
    }

    if (typeof object.dispose === "function") {
        object.dispose();
        return;
    }

    if (typeof object.remove === "function") {
        object.remove();
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
// CLEAR
//------------------------------------------------------------------------------

/**
 * Tar bort spelare, hp-bars, attacker, dödseffekter och emitters från stage.
 *
 * @return {void}
 */
runmysteriet.handler.PlayerHandler.prototype.clear = function() {

    var i = 0;
    var player = null;
    var attack = null;
    var effect = null;
    var emitter = null;

    /*
     * Spelare och hp-bars.
     */
    if (this.players) {
        for (i = 0; i < this.players.length; i++) {
            player = this.players[i];

            if (!player) {
                continue;
            }

            if (player.hpBar) {
                this.removeDisplayObject(player.hpBar);
                player.hpBar = null;
            }

            this.removeDisplayObject(player);
        }
    }

    /*
     * Attacker.
     */
    if (this.attacks) {
        for (i = 0; i < this.attacks.length; i++) {
            attack = this.attacks[i];

            this.removeDisplayObject(attack);
        }
    }

    /*
     * Döds-effekter.
     */
    if (this.deathEffects) {
        for (i = 0; i < this.deathEffects.length; i++) {
            effect = this.deathEffects[i];

            this.removeDisplayObject(effect);
        }
    }

    /*
     * Attack particle emitters.
     */
    if (this.attackEmitters) {
        for (i = 0; i < this.attackEmitters.length; i++) {
            emitter = this.attackEmitters[i];

            this.removeDisplayObject(emitter);
        }
    }

    this.players = [];
    this.attacks = [];
    this.deathEffects = [];
    this.attackEmitters = [];
};

//------------------------------------------------------------------------------
// DISPOSE
//------------------------------------------------------------------------------

/**
 * Rensar PlayerHandler helt.
 *
 * @return {void}
 */
runmysteriet.handler.PlayerHandler.prototype.dispose = function() {

    this.clear();

    this.stage = null;

    this.platformHandler = null;
    this.platforms = null;

    this.application = null;

    this.input = null;
    this.keyboard = null;

    this.enemyHandler = null;

    this.camera = null;
    this.cameraHandler = null;

    this.jumpSound = null;
    this.deathSound = null;
    this.attackSound = null;

    this.avatarData = null;

    this.m_avatarPlatformOffsetY = 0;
    this.m_raftPlatformOffsetY = 0;
};