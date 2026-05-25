//------------------------------------------------------------------------------
// AVATAR SELECT SCENE
//------------------------------------------------------------------------------

/**
 * Scene där spelare väljer avatar innan spelet startar.
 *
 * @constructor
 * @extends {rune.scene.Scene}
 */
runmysteriet.scene.AvatarSelect = function() {

    rune.scene.Scene.call(this);

    /**
     * Inputhantering för scenen.
     * @type {?Object}
     */
    this.m_gameInput = null;

    /**
     * Lista över tillgängliga avatars.
     * @type {!Array<{name: string, texture: string}>}
     */
    this.m_avatars = [
        {
            name: "FREYA",
            texture: "spritesheet_freya_all"
        },
        {
            name: "THOR",
            texture: "spritesheet_thor_all"
        }
    ];

    /** @type {number} */
    this.m_player1Index = 0;

    /** @type {number} */
    this.m_player2Index = 1;

    /** @type {boolean} */
    this.m_player1Ready = false;

    /** @type {boolean} */
    this.m_player2Ready = false;

    /** @type {boolean} */
    this.m_hasStarted = false;

    /** @type {?rune.display.Graphic} */
    this.m_titleText = null;

    /** @type {?rune.display.Graphic} */
    this.m_helpText = null;

    /** @type {?rune.display.Graphic} */
    this.m_backText = null;

    /** @type {?rune.display.Graphic} */
    this.m_player1Label = null;

    /** @type {?rune.display.Graphic} */
    this.m_player2Label = null;

    /** @type {?rune.display.Graphic} */
    this.m_player1ReadyText = null;

    /** @type {?rune.display.Graphic} */
    this.m_player2ReadyText = null;

    /** @type {?rune.display.Graphic} */
    this.m_player1Marker = null;

    /** @type {?rune.display.Graphic} */
    this.m_player2Marker = null;

    /**
     * Sprites för player 1 avatar-val.
     * @type {!Array<!rune.display.Graphic>}
     */
    this.m_player1Sprites = [];

    /**
     * Sprites för player 2 avatar-val.
     * @type {!Array<!rune.display.Graphic>}
     */
    this.m_player2Sprites = [];

    /**
     * Namn-labels för player 1.
     * @type {!Array<!rune.display.Graphic>}
     */
    this.m_player1Names = [];

    /**
     * Namn-labels för player 2.
     * @type {!Array<!rune.display.Graphic>}
     */
    this.m_player2Names = [];

    /** @type {number} */
    this.m_inputCooldown1 = 0;

    /** @type {number} */
    this.m_inputCooldown2 = 0;

    /** @type {number} */
    this.m_inputDelay = 10;

    /**
     * Ljud som spelas i menyn.
     * @type {?Object}
     */
    this.menuSound = null;
};

runmysteriet.scene.AvatarSelect.prototype =
    Object.create(rune.scene.Scene.prototype);

runmysteriet.scene.AvatarSelect.prototype.constructor =
    runmysteriet.scene.AvatarSelect;

/**
 * Initierar AvatarSelect-scenen.
 * Sätter upp input, ljud och UI-element.
 *
 * @this {runmysteriet.scene.AvatarSelect}
 * @return {void}
 */
runmysteriet.scene.AvatarSelect.prototype.init = function() {

    // Initiera parent scene
    rune.scene.Scene.prototype.init.call(this);

    // Skapa input-hantering
    this.m_gameInput = new runmysteriet.input.GameInput(this.application);

    // Hämta meny-ljud från sound manager
    this.menuSound = this.application.sounds.sound.get("sound_menu");

    // Bygg UI
    this.createText();
    this.createAvatarChoices();

    // Uppdatera visning initialt
    this.updateView();
};

/**
 * Skapar all text/UI för avatarselect-scenen.
 *
 * @this {runmysteriet.scene.AvatarSelect}
 * @return {void}
 */
runmysteriet.scene.AvatarSelect.prototype.createText = function() {

    this.m_titleText = new rune.text.BitmapField("SELECT AVATAR");
    this.m_titleText.autoSize = true;
    this.m_titleText.center = this.application.screen.center;
    this.m_titleText.y = 18;
    this.stage.addChild(this.m_titleText);

    this.m_player1Label = new rune.text.BitmapField("PLAYER 1");
    this.m_player1Label.autoSize = true;
    this.m_player1Label.x = 82;
    this.m_player1Label.y = 50;
    this.stage.addChild(this.m_player1Label);

    this.m_player2Label = new rune.text.BitmapField("PLAYER 2");
    this.m_player2Label.autoSize = true;
    this.m_player2Label.x = 270;
    this.m_player2Label.y = 50;
    this.stage.addChild(this.m_player2Label);

    this.m_player1ReadyText = new rune.text.BitmapField("NOT READY");
    this.m_player1ReadyText.autoSize = true;
    this.m_player1ReadyText.x = 55;
    this.m_player1ReadyText.y = 172;
    this.stage.addChild(this.m_player1ReadyText);

    this.m_player2ReadyText = new rune.text.BitmapField("NOT READY");
    this.m_player2ReadyText.autoSize = true;
    this.m_player2ReadyText.x = 240;
    this.m_player2ReadyText.y = 172;
    this.stage.addChild(this.m_player2ReadyText);

    this.m_helpText = new rune.text.BitmapField("LEFT/RIGHT = SELECT   CROSS/A = READY");
    this.m_helpText.autoSize = true;
    this.m_helpText.scaleX = 1;
    this.m_helpText.scaleY = 1;
    this.m_helpText.x = 65;
    this.m_helpText.y = 195;
    this.stage.addChild(this.m_helpText);

    this.m_backText = new rune.text.BitmapField("CIRCLE/B/ESC = BACK OR UNREADY");
    this.m_backText.autoSize = true;
    this.m_backText.scaleX = 1;
    this.m_backText.scaleY = 1;
    this.m_backText.x = 65;
    this.m_backText.y = 210;
    this.stage.addChild(this.m_backText);

    // Markörer som visar vald avatar för respektive spelare
    this.m_player1Marker = new rune.text.BitmapField("v");
    this.m_player1Marker.autoSize = true;
    this.stage.addChild(this.m_player1Marker);

    this.m_player2Marker = new rune.text.BitmapField("v");
    this.m_player2Marker.autoSize = true;
    this.stage.addChild(this.m_player2Marker);
};

/**
 * Skapar avatarval för båda spelarna.
 *
 * @this {runmysteriet.scene.AvatarSelect}
 * @return {void}
 */
runmysteriet.scene.AvatarSelect.prototype.createAvatarChoices = function() {

    this.createPlayerAvatarChoices(0);
    this.createPlayerAvatarChoices(1);
};

/**
 * Skapar avatarval för en specifik spelare.
 *
 * @this {runmysteriet.scene.AvatarSelect}
 * @param {number} playerIndex Index för spelaren (0 eller 1).
 * @return {void}
 */
runmysteriet.scene.AvatarSelect.prototype.createPlayerAvatarChoices = function(playerIndex) {

    var i = 0;
    var avatar = null;
    var sprite = null;
    var nameText = null;
    var baseX = 0;
    var y = 0;
    var spacing = 65;

    // Placering beroende på spelare
    if (playerIndex === 0) {
        baseX = 45;
        y = 85;
    } else {
        baseX = 230;
        y = 85;
    }

    for (i = 0; i < this.m_avatars.length; i++) {

        avatar = this.m_avatars[i];

        sprite = new rune.display.Sprite(
            baseX + i * spacing,
            y,
            32,
            32,
            avatar.texture
        );

        sprite.scaleX = 2;
        sprite.scaleY = 2;

        sprite.animation.create("idle", [0], 1, true);
        sprite.animation.gotoAndPlay("idle");

        this.stage.addChild(sprite);

        nameText = new rune.text.BitmapField(avatar.name);
        nameText.autoSize = true;
        nameText.scaleX = 1;
        nameText.scaleY = 1;
        nameText.x = baseX + i * spacing - 2;
        nameText.y = y + 68;

        this.stage.addChild(nameText);

        if (playerIndex === 0) {
            this.m_player1Sprites.push(sprite);
            this.m_player1Names.push(nameText);
        } else {
            this.m_player2Sprites.push(sprite);
            this.m_player2Names.push(nameText);
        }
    }
};

/**
 * Uppdateringsloop för AvatarSelect-scenen.
 * Hanterar input, cooldowns och startvillkor.
 *
 * @this {runmysteriet.scene.AvatarSelect}
 * @param {number} step Tidssteg från game loop.
 * @return {void}
 */
runmysteriet.scene.AvatarSelect.prototype.update = function(step) {

    // Kör parent update
    rune.scene.Scene.prototype.update.call(this, step);

    // Avsluta om spelet redan har startat
    if (this.m_hasStarted === true) {
        return;
    }

    // Hantera cooldown för player 1
    if (this.m_inputCooldown1 > 0) {
        this.m_inputCooldown1--;
    }

    // Hantera cooldown för player 2
    if (this.m_inputCooldown2 > 0) {
        this.m_inputCooldown2--;
    }

    // Uppdatera val för båda spelare
    this.updatePlayerSelection(0);
    this.updatePlayerSelection(1);

    // Starta spelet om båda är redo
    if (this.m_player1Ready === true && this.m_player2Ready === true) {
        this.startGame();
    }
};
/**
 * Uppdaterar avatarval för en specifik spelare.
 *
 * @this {runmysteriet.scene.AvatarSelect}
 * @param {number} playerIndex Index för spelaren (0 eller 1).
 * @return {void}
 */
runmysteriet.scene.AvatarSelect.prototype.updatePlayerSelection = function(playerIndex) {

    var input = null;

    if (!this.m_gameInput) {
        return;
    }

    input = this.m_gameInput.readPlayer(this.keyboard, playerIndex);

    if (playerIndex === 0) {
        this.updatePlayer1Selection(input);
    } else if (playerIndex === 1) {
        this.updatePlayer2Selection(input);
    }
};

/**
 * Hanterar input för spelare 1 i avatarselect.
 *
 * @this {runmysteriet.scene.AvatarSelect}
 * @param {?Object} input Spelarens inputdata.
 * @return {void}
 */
runmysteriet.scene.AvatarSelect.prototype.updatePlayer1Selection = function(input) {

    if (!input) {
        return;
    }

    // BACK: avmarkera eller gå tillbaka till meny
    if (input.back) {

        if (this.m_player1Ready === true) {
            this.m_player1Ready = false;
            this.playMenuSound();
            this.updateView();
            return;
        }

        this.goBackToMenu();
        return;
    }

    // Vänster/höger: byt avatar
    if (this.m_player1Ready !== true && this.m_inputCooldown1 <= 0) {

        if (input.left || input.right) {
            this.m_player1Index = this.getNextAvatarIndex(this.m_player1Index);
            this.m_inputCooldown1 = this.m_inputDelay;
            this.playMenuSound();
            this.updateView();
        }
    }

    // Välj/confirm
    if (input.choose || input.jump) {
        this.m_player1Ready = true;
        this.playMenuSound();
        this.updateView();
    }
};
/**
 * Hanterar input för spelare 2 i avatarselect.
 *
 * @this {runmysteriet.scene.AvatarSelect}
 * @param {?Object} input Spelarens inputdata.
 * @return {void}
 */
runmysteriet.scene.AvatarSelect.prototype.updatePlayer2Selection = function(input) {

    if (!input) {
        return;
    }

    // BACK: avmarkera eller gå tillbaka till meny
    if (input.back) {

        if (this.m_player2Ready === true) {
            this.m_player2Ready = false;
            this.playMenuSound();
            this.updateView();
            return;
        }

        this.goBackToMenu();
        return;
    }

    // Vänster/höger
    if (this.m_player2Ready !== true && this.m_inputCooldown2 <= 0) {

        if (input.left || input.right) {
            this.m_player2Index = this.getNextAvatarIndex(this.m_player2Index);
            this.m_inputCooldown2 = this.m_inputDelay;
            this.playMenuSound();
            this.updateView();
        }
    }

    // Välj/confirm
    if (input.choose || input.jump) {
        this.m_player2Ready = true;
        this.playMenuSound();
        this.updateView();
    }
};

/**
 * Returnerar nästa avatar-index (loopar tillbaka till 0 vid slutet).
 *
 * @this {runmysteriet.scene.AvatarSelect}
 * @param {number} index Nuvarande index.
 * @return {number} Nästa index i avatarlistan.
 */
runmysteriet.scene.AvatarSelect.prototype.getNextAvatarIndex = function(index) {

    index++;

    if (index >= this.m_avatars.length) {
        index = 0;
    }

    return index;
};

/**
 * Uppdaterar hela avatar-vyn (markers, text och alpha).
 *
 * @this {runmysteriet.scene.AvatarSelect}
 * @return {void}
 */
runmysteriet.scene.AvatarSelect.prototype.updateView = function() {

    this.updateMarkers();
    this.updateReadyText();
    this.updateAvatarAlpha();
};

/**
 * Uppdaterar markörernas position ovanför vald avatar.
 *
 * @this {runmysteriet.scene.AvatarSelect}
 * @return {void}
 */
runmysteriet.scene.AvatarSelect.prototype.updateMarkers = function() {

    var p1Sprite = this.m_player1Sprites[this.m_player1Index];
    var p2Sprite = this.m_player2Sprites[this.m_player2Index];

    // Player 1 marker
    if (this.m_player1Marker && p1Sprite) {
        this.m_player1Marker.x = p1Sprite.x + 22;
        this.m_player1Marker.y = p1Sprite.y - 18;
    }

    // Player 2 marker
    if (this.m_player2Marker && p2Sprite) {
        this.m_player2Marker.x = p2Sprite.x + 22;
        this.m_player2Marker.y = p2Sprite.y - 18;
    }
};
/**
 * Uppdaterar text som visar om spelarna är redo eller inte.
 *
 * @this {runmysteriet.scene.AvatarSelect}
 * @return {void}
 */
runmysteriet.scene.AvatarSelect.prototype.updateReadyText = function() {

    if (this.m_player1ReadyText) {
        this.m_player1ReadyText.text =
            this.m_player1Ready === true ? "READY" : "NOT READY";
    }

    if (this.m_player2ReadyText) {
        this.m_player2ReadyText.text =
            this.m_player2Ready === true ? "READY" : "NOT READY";
    }
};

/**
 * Uppdaterar alpha på avatars och namn beroende på vald index.
 *
 * @this {runmysteriet.scene.AvatarSelect}
 * @return {void}
 */
runmysteriet.scene.AvatarSelect.prototype.updateAvatarAlpha = function() {

    var i = 0;

    // Player 1 visuals
    for (i = 0; i < this.m_player1Sprites.length; i++) {

        if (this.m_player1Sprites[i]) {
            this.m_player1Sprites[i].alpha =
                i === this.m_player1Index ? 1.0 : 0.45;
        }

        if (this.m_player1Names[i]) {
            this.m_player1Names[i].alpha =
                i === this.m_player1Index ? 1.0 : 0.45;
        }
    }

    // Player 2 visuals
    for (i = 0; i < this.m_player2Sprites.length; i++) {

        if (this.m_player2Sprites[i]) {
            this.m_player2Sprites[i].alpha =
                i === this.m_player2Index ? 1.0 : 0.45;
        }

        if (this.m_player2Names[i]) {
            this.m_player2Names[i].alpha =
                i === this.m_player2Index ? 1.0 : 0.45;
        }
    }
};
/**
 * Går tillbaka till huvudmenyn från avatarselect.
 *
 * @this {runmysteriet.scene.AvatarSelect}
 * @return {void}
 */
runmysteriet.scene.AvatarSelect.prototype.goBackToMenu = function() {

    // Förhindra att scenen startas/byter state flera gånger
    if (this.m_hasStarted === true) {
        return;
    }

    this.m_hasStarted = true;

    // Spela meny-ljud vid navigering
    this.playMenuSound();

    // Ladda huvudmenyn
    this.application.scenes.load([
        new runmysteriet.scene.Menu()
    ]);
};
/**
 * Startar spelet med valda avatars för båda spelar
 *
 * @this {runmysteriet.scene.AvatarSelect}
 * @return {void}
 */
runmysteriet.scene.AvatarSelect.prototype.startGame = function() {

    var avatarData = null;

    // Förhindra dubbel start
    if (this.m_hasStarted === true) {
        return;
    }

    this.m_hasStarted = true;

    // Bygg data för båda spelare
    avatarData = {
        player1: {
            name: this.m_avatars[this.m_player1Index].name,
            texture: this.m_avatars[this.m_player1Index].texture
        },
        player2: {
            name: this.m_avatars[this.m_player2Index].name,
            texture: this.m_avatars[this.m_player2Index].texture
        }
    };

    // Ladda spel-scenen
    this.application.scenes.load([
        new runmysteriet.scene.Game(1, 0, avatarData)
    ]);
};


/**
 * Spelar meny-ljud om det finns laddat.
 *
 * @this {runmysteriet.scene.AvatarSelect}
 * @return {void}
 */
runmysteriet.scene.AvatarSelect.prototype.playMenuSound = function() {

    if (this.menuSound) {
        this.menuSound.play();
    }
};

/**
 * Rensar upp scenen och frigör referenser.
 *
 * @this {runmysteriet.scene.AvatarSelect}
 * @return {void}
 */
runmysteriet.scene.AvatarSelect.prototype.dispose = function() {

    // Input
    this.m_gameInput = null;

    // Data
    this.m_avatars = [];

    // Sprites
    this.m_player1Sprites = [];
    this.m_player2Sprites = [];

    // Namnlabels
    this.m_player1Names = [];
    this.m_player2Names = [];

    // UI text
    this.m_titleText = null;
    this.m_helpText = null;
    this.m_backText = null;

    this.m_player1Label = null;
    this.m_player2Label = null;

    this.m_player1ReadyText = null;
    this.m_player2ReadyText = null;

    this.m_player1Marker = null;
    this.m_player2Marker = null;

    // Ljud
    this.menuSound = null;

    // Parent cleanup
    rune.scene.Scene.prototype.dispose.call(this);
};