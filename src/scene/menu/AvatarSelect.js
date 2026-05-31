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
     * @type {?runmysteriet.input.GameInput}
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
    this.m_background = null;

    /** @type {?rune.display.Graphic} */
    this.m_titleBox = null;

    /** @type {?rune.display.Graphic} */
    this.m_player1LabelBox = null;

    /** @type {?rune.display.Graphic} */
    this.m_player2LabelBox = null;

    /** @type {?rune.display.Graphic} */
    this.m_player1ReadyBox = null;

    /** @type {?rune.display.Graphic} */
    this.m_player2ReadyBox = null;

    /** @type {?rune.display.Graphic} */
    this.m_helpBox = null;

    /** @type {?rune.display.Graphic} */
    this.m_backBox = null;

    /** @type {?rune.text.BitmapField} */
    this.m_titleText = null;

    /** @type {?rune.text.BitmapField} */
    this.m_helpText = null;

    /** @type {?rune.text.BitmapField} */
    this.m_backText = null;

    /** @type {?rune.text.BitmapField} */
    this.m_player1Label = null;

    /** @type {?rune.text.BitmapField} */
    this.m_player2Label = null;

    /** @type {?rune.text.BitmapField} */
    this.m_player1ReadyText = null;

    /** @type {?rune.text.BitmapField} */
    this.m_player2ReadyText = null;

    /** @type {?rune.text.BitmapField} */
    this.m_player1Marker = null;

    /** @type {?rune.text.BitmapField} */
    this.m_player2Marker = null;

    /**
     * Sprites för player 1 avatar-val.
     * @type {!Array<!rune.display.Sprite>}
     */
    this.m_player1Sprites = [];

    /**
     * Sprites för player 2 avatar-val.
     * @type {!Array<!rune.display.Sprite>}
     */
    this.m_player2Sprites = [];

    /**
     * Namn-labels för player 1.
     * @type {!Array<!rune.text.BitmapField>}
     */
    this.m_player1Names = [];

    /**
     * Namn-labels för player 2.
     * @type {!Array<!rune.text.BitmapField>}
     */
    this.m_player2Names = [];

    /**
     * Boxar bakom player 1 avatar-namn.
     * @type {!Array<!rune.display.Graphic>}
     */
    this.m_player1NameBoxes = [];

    /**
     * Boxar bakom player 2 avatar-namn.
     * @type {!Array<!rune.display.Graphic>}
     */
    this.m_player2NameBoxes = [];

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

    /** @type {?runmysteriet.logic.SceneDelay} */
    this.m_sceneDelay = null;
};

runmysteriet.scene.AvatarSelect.prototype = Object.create(rune.scene.Scene.prototype);

runmysteriet.scene.AvatarSelect.prototype.constructor = runmysteriet.scene.AvatarSelect;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

/**
 * Initierar AvatarSelect-scenen.
 *
 * @this {runmysteriet.scene.AvatarSelect}
 * @return {void}
 */
runmysteriet.scene.AvatarSelect.prototype.init = function() {

    rune.scene.Scene.prototype.init.call(this);

    this.m_gameInput = new runmysteriet.input.GameInput(this.application);
    this.menuSound = this.application.sounds.sound.get("sound_menu");
    this.createSceneDelay();
    this.createBackground();
    this.createText();
    this.createAvatarChoices();

    this.updateView();
};

//------------------------------------------------------------------------------
// CREATE BACKGROUND / BOXES
//------------------------------------------------------------------------------

/**
 * Skapar svart färgbakgrund.
 *
 * @return {void}
 */
runmysteriet.scene.AvatarSelect.prototype.createBackground = function() {

    this.m_background = new rune.display.Graphic(
        0,
        0,
        this.application.screen.width,
        this.application.screen.height
    );

    this.m_background.backgroundColor = "#000000";
    this.m_background.alpha = 1;

    this.stage.addChild(this.m_background);
};

/**
 * Skapar en mörk transparent UI-box.
 *
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @param {number=} alpha
 * @return {!rune.display.Graphic}
 */
runmysteriet.scene.AvatarSelect.prototype.createTextBox = function(
    x,
    y,
    width,
    height,
    alpha
) {

    /** @type {!rune.display.Graphic} */
    var box = new rune.display.Graphic(
        x,
        y,
        width,
        height
    );

    box.backgroundColor = "#222222";
    box.alpha = alpha || 0.75;

    this.stage.addChild(box);

    return box;
};

//------------------------------------------------------------------------------
// CREATE TEXT
//------------------------------------------------------------------------------

/**
 * Skapar all text/UI för avatarselect-scenen.
 *
 * @this {runmysteriet.scene.AvatarSelect}
 * @return {void}
 */
runmysteriet.scene.AvatarSelect.prototype.createText = function() {

    this.m_titleBox = this.createTextBox(120, 13, 165, 18, 0.75);

    this.m_player1LabelBox = this.createTextBox(75, 46, 75, 14, 0.65);
    this.m_player2LabelBox = this.createTextBox(263, 46, 75, 14, 0.65);

    this.m_player1ReadyBox = this.createTextBox(50, 168, 95, 16, 0.65);
    this.m_player2ReadyBox = this.createTextBox(235, 168, 95, 16, 0.65);

    this.m_helpBox = this.createTextBox(60, 191, 300, 14, 0.55);
    this.m_backBox = this.createTextBox(60, 206, 300, 14, 0.55);

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

    this.m_helpText = new rune.text.BitmapField(
        "LEFT/RIGHT = SELECT   CROSS/A = READY"
    );
    this.m_helpText.autoSize = true;
    this.m_helpText.x = 65;
    this.m_helpText.y = 195;
    this.stage.addChild(this.m_helpText);

    this.m_backText = new rune.text.BitmapField(
        "CIRCLE/B/ESC = BACK OR UNREADY"
    );
    this.m_backText.autoSize = true;
    this.m_backText.x = 65;
    this.m_backText.y = 210;
    this.stage.addChild(this.m_backText);

    this.m_player1Marker = new rune.text.BitmapField("v");
    this.m_player1Marker.autoSize = true;
    this.stage.addChild(this.m_player1Marker);

    this.m_player2Marker = new rune.text.BitmapField("v");
    this.m_player2Marker.autoSize = true;
    this.stage.addChild(this.m_player2Marker);
};

//------------------------------------------------------------------------------
// CREATE AVATARS
//------------------------------------------------------------------------------

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
 * @param {number} playerIndex Index för spelaren.
 * @return {void}
 */
runmysteriet.scene.AvatarSelect.prototype.createPlayerAvatarChoices = function(playerIndex) {

    /** @type {number} */
    var i = 0;

    /** @type {?Object} */
    var avatar = null;

    /** @type {?rune.display.Sprite} */
    var sprite = null;

    /** @type {?rune.text.BitmapField} */
    var nameText = null;

    /** @type {?rune.display.Graphic} */
    var nameBox = null;

    /** @type {number} */
    var baseX = 0;

    /** @type {number} */
    var y = 0;

    /** @type {number} */
    var spacing = 65;

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

        nameBox = this.createTextBox(
            baseX + i * spacing - 8,
            y + 65,
            55,
            14,
            0.55
        );

        nameText = new rune.text.BitmapField(avatar.name);
        nameText.autoSize = true;
        nameText.x = baseX + i * spacing - 2;
        nameText.y = y + 68;

        this.stage.addChild(nameText);

        if (playerIndex === 0) {
            this.m_player1Sprites.push(sprite);
            this.m_player1Names.push(nameText);
            this.m_player1NameBoxes.push(nameBox);
        } else {
            this.m_player2Sprites.push(sprite);
            this.m_player2Names.push(nameText);
            this.m_player2NameBoxes.push(nameBox);
        }
    }
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

/**
 * Uppdateringsloop för AvatarSelect-scenen.
 *
 * @this {runmysteriet.scene.AvatarSelect}
 * @param {number} step Tidssteg från game loop.
 * @return {void}
 */
runmysteriet.scene.AvatarSelect.prototype.update = function(step) {

    /** @type {?Object} */
    var input = null;

    rune.scene.Scene.prototype.update.call(this, step);

    if (this.m_sceneDelay && this.m_sceneDelay.isActive()) {
    this.m_sceneDelay.update();
    this.updateHelpSignal();
    return;
}

    if (this.m_hasStarted === true) {
        return;
    }

    if (!this.m_gameInput) {
        return;
    }

    input = this.m_gameInput.read(this.keyboard);

    if (input && input.back === true) {
        if (this.m_player1Ready === true || this.m_player2Ready === true) {
            this.m_player1Ready = false;
            this.m_player2Ready = false;

            this.playMenuSound();
            this.updateView();
            return;
        }

        this.goBackToMenu();
        return;
    }

    if (this.m_inputCooldown1 > 0) {
        this.m_inputCooldown1--;
    }

    if (this.m_inputCooldown2 > 0) {
        this.m_inputCooldown2--;
    }

    this.updatePlayerSelection(0);
    this.updatePlayerSelection(1);

    if (this.m_player1Ready === true && this.m_player2Ready === true) {
        this.startGame();
    }
};

/**
 * Uppdaterar avatarval för en specifik spelare.
 *
 * @this {runmysteriet.scene.AvatarSelect}
 * @param {number} playerIndex Index för spelaren.
 * @return {void}
 */
runmysteriet.scene.AvatarSelect.prototype.updatePlayerSelection = function(playerIndex) {

    /** @type {?Object} */
    var input = null;

    if (!this.m_gameInput) {
        return;
    }

    input = this.m_gameInput.readPlayer(this.keyboard, playerIndex);

    if (playerIndex === 0) {
        this.updatePlayer1Selection(input);
        return;
    }

    if (playerIndex === 1) {
        this.updatePlayer2Selection(input);
    }
};

/**
 * Hanterar input för spelare 1.
 *
 * @this {runmysteriet.scene.AvatarSelect}
 * @param {?Object} input Spelarens inputdata.
 * @return {void}
 */
runmysteriet.scene.AvatarSelect.prototype.updatePlayer1Selection = function(input) {

    if (!input) {
        return;
    }

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

    if (this.m_player1Ready !== true && this.m_inputCooldown1 <= 0) {
        if (input.left || input.right) {
            this.m_player1Index =
                this.getNextAvatarIndex(this.m_player1Index);

            this.m_inputCooldown1 = this.m_inputDelay;

            this.playMenuSound();
            this.updateView();
        }
    }

    if (input.choose || input.jump) {
        this.m_player1Ready = true;

        this.playMenuSound();
        this.updateView();
    }
};

/**
 * Hanterar input för spelare 2.
 *
 * @this {runmysteriet.scene.AvatarSelect}
 * @param {?Object} input Spelarens inputdata.
 * @return {void}
 */
runmysteriet.scene.AvatarSelect.prototype.updatePlayer2Selection = function(input) {

    if (!input) {
        return;
    }

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

    if (this.m_player2Ready !== true && this.m_inputCooldown2 <= 0) {
        if (input.left || input.right) {
            this.m_player2Index =
                this.getNextAvatarIndex(this.m_player2Index);

            this.m_inputCooldown2 = this.m_inputDelay;

            this.playMenuSound();
            this.updateView();
        }
    }

    if (input.choose || input.jump) {
        this.m_player2Ready = true;

        this.playMenuSound();
        this.updateView();
    }
};

/**
 * Returnerar nästa avatar-index.
 *
 * @this {runmysteriet.scene.AvatarSelect}
 * @param {number} index Nuvarande index.
 * @return {number} Nästa index.
 */
runmysteriet.scene.AvatarSelect.prototype.getNextAvatarIndex = function(index) {

    index++;

    if (index >= this.m_avatars.length) {
        index = 0;
    }

    return index;
};

/**
 * Uppdaterar hela avatar-vyn.
 *
 * @this {runmysteriet.scene.AvatarSelect}
 * @return {void}
 */
runmysteriet.scene.AvatarSelect.prototype.updateView = function() {

    this.updateMarkers();
    this.updateReadyText();
    this.updateAvatarAlpha();
    this.updateHelpSignal();
};

/**
 * Uppdaterar markörernas position.
 *
 * @this {runmysteriet.scene.AvatarSelect}
 * @return {void}
 */
runmysteriet.scene.AvatarSelect.prototype.updateMarkers = function() {

    /** @type {?rune.display.Sprite} */
    var p1Sprite = this.m_player1Sprites[this.m_player1Index];

    /** @type {?rune.display.Sprite} */
    var p2Sprite = this.m_player2Sprites[this.m_player2Index];

    if (this.m_player1Marker && p1Sprite) {
        this.m_player1Marker.x = p1Sprite.x + 22;
        this.m_player1Marker.y = p1Sprite.y - 18;
    }

    if (this.m_player2Marker && p2Sprite) {
        this.m_player2Marker.x = p2Sprite.x + 22;
        this.m_player2Marker.y = p2Sprite.y - 18;
    }
};

/**
 * Uppdaterar READY/NOT READY-text och signalboxar.
 *
 * @this {runmysteriet.scene.AvatarSelect}
 * @return {void}
 */
runmysteriet.scene.AvatarSelect.prototype.updateReadyText = function() {

    if (this.m_player1ReadyText) {
        this.m_player1ReadyText.text =
            this.m_player1Ready === true ? "READY" : "NOT READY";

        this.m_player1ReadyText.alpha =
            this.m_player1Ready === true ? 1 : 0.75;

        this.m_player1ReadyText.x =
            this.m_player1Ready === true ? 72 : 55;
    }

    if (this.m_player2ReadyText) {
        this.m_player2ReadyText.text =
            this.m_player2Ready === true ? "READY" : "NOT READY";

        this.m_player2ReadyText.alpha =
            this.m_player2Ready === true ? 1 : 0.75;

        this.m_player2ReadyText.x =
            this.m_player2Ready === true ? 257 : 240;
    }

    if (this.m_player1ReadyBox) {
        this.m_player1ReadyBox.x =
            this.m_player1Ready === true ? 65 : 50;

        this.m_player1ReadyBox.width =
            this.m_player1Ready === true ? 65 : 95;

        this.m_player1ReadyBox.alpha =
            this.m_player1Ready === true ? 1 : 0.65;

        this.m_player1ReadyBox.backgroundColor =
            this.m_player1Ready === true ? "#444444" : "#222222";
    }

    if (this.m_player2ReadyBox) {
        this.m_player2ReadyBox.x =
            this.m_player2Ready === true ? 250 : 235;

        this.m_player2ReadyBox.width =
            this.m_player2Ready === true ? 65 : 95;

        this.m_player2ReadyBox.alpha =
            this.m_player2Ready === true ? 1 : 0.65;

        this.m_player2ReadyBox.backgroundColor =
            this.m_player2Ready === true ? "#444444" : "#222222";
    }
};

/**
 * Uppdaterar instruktionsrutan beroende på spelarstatus.
 *
 * @this {runmysteriet.scene.AvatarSelect}
 * @return {void}
 */
runmysteriet.scene.AvatarSelect.prototype.updateHelpSignal = function() {

    /** @type {number} */
    var seconds = 0;

    if (!this.m_helpText || !this.m_helpBox) {
        return;
    }

    if (this.m_sceneDelay && this.m_sceneDelay.isActive()) {
        seconds = this.m_sceneDelay.getRemainingSeconds(30);

        if (seconds < 1) {
            seconds = 1;
        }

        this.m_helpText.text = "STARTING IN " + seconds + "...";
        this.m_helpText.x = 135;

        this.m_helpBox.backgroundColor = "#555555";
        this.m_helpBox.alpha = 1;
        return;
    }

    if (this.m_player1Ready === true || this.m_player2Ready === true) {
        this.m_helpText.text = "WAITING FOR BOTH PLAYERS";
        this.m_helpText.x = 95;

        this.m_helpBox.backgroundColor = "#444444";
        this.m_helpBox.alpha = 0.9;
        return;
    }

    this.m_helpText.text = "LEFT/RIGHT = SELECT   CROSS/A = READY";
    this.m_helpText.x = 55;

    this.m_helpBox.backgroundColor = "#333333";
    this.m_helpBox.alpha = 0.75;
};
/**
 * Uppdaterar alpha på avatars och namn beroende på vald index.
 *
 * @this {runmysteriet.scene.AvatarSelect}
 * @return {void}
 */
runmysteriet.scene.AvatarSelect.prototype.updateAvatarAlpha = function() {

    /** @type {number} */
    var i = 0;

    for (i = 0; i < this.m_player1Sprites.length; i++) {
        if (this.m_player1Sprites[i]) {
            this.m_player1Sprites[i].alpha =
                i === this.m_player1Index ? 1.0 : 0.45;
        }

        if (this.m_player1Names[i]) {
            this.m_player1Names[i].alpha =
                i === this.m_player1Index ? 1.0 : 0.45;
        }

        if (this.m_player1NameBoxes[i]) {
            this.m_player1NameBoxes[i].alpha =
                i === this.m_player1Index ? 0.85 : 0.35;
        }
    }

    for (i = 0; i < this.m_player2Sprites.length; i++) {
        if (this.m_player2Sprites[i]) {
            this.m_player2Sprites[i].alpha =
                i === this.m_player2Index ? 1.0 : 0.45;
        }

        if (this.m_player2Names[i]) {
            this.m_player2Names[i].alpha =
                i === this.m_player2Index ? 1.0 : 0.45;
        }

        if (this.m_player2NameBoxes[i]) {
            this.m_player2NameBoxes[i].alpha =
                i === this.m_player2Index ? 0.85 : 0.35;
        }
    }
};

//------------------------------------------------------------------------------
// NAVIGATION
//------------------------------------------------------------------------------

/**
 * Går tillbaka till huvudmenyn.
 *
 * @this {runmysteriet.scene.AvatarSelect}
 * @return {void}
 */
runmysteriet.scene.AvatarSelect.prototype.goBackToMenu = function() {

    if (this.m_hasStarted === true) {
        return;
    }

    this.m_hasStarted = true;

    this.playMenuSound();

    this.application.scenes.load([
        new runmysteriet.scene.Menu()
    ]);
};

/**
 * Startar fördröjningen innan spelet laddas.
 *
 * @this {runmysteriet.scene.AvatarSelect}
 * @return {void}
 */
runmysteriet.scene.AvatarSelect.prototype.startGame = function() {

    if (this.m_hasStarted === true) {
        return;
    }

    if (this.m_sceneDelay && this.m_sceneDelay.isActive()) {
        return;
    }

    this.playMenuSound();

    if (this.m_sceneDelay) {
        this.m_sceneDelay.start(90);
    } else {
        this.loadGame();
    }

    this.updateView();
};

/**
 * Laddar Game-scenen med valda avatars.
 *
 * @this {runmysteriet.scene.AvatarSelect}
 * @return {void}
 */
runmysteriet.scene.AvatarSelect.prototype.loadGame = function() {

    /** @type {?Object} */
    var avatarData = null;

    if (this.m_hasStarted === true) {
        return;
    }

    this.m_hasStarted = true;

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

    this.application.scenes.load([
        new runmysteriet.scene.Game(1, 0, avatarData)
    ]);
};

//------------------------------------------------------------------------------
// SOUND
//------------------------------------------------------------------------------

/**
 * Spelar meny-ljud om det finns laddat.
 *
 * @this {runmysteriet.scene.AvatarSelect}
 * @return {void}
 */
runmysteriet.scene.AvatarSelect.prototype.playMenuSound = function() {

    if (this.menuSound && typeof this.menuSound.play === "function") {
        this.menuSound.play();
    }
};


/**
 * Skapar scenfördröjning innan spelet startar.
 *
 * @return {void}
 */
runmysteriet.scene.AvatarSelect.prototype.createSceneDelay = function() {

    /** @type {runmysteriet.scene.AvatarSelect} */
    var self = this;

    this.m_sceneDelay = new runmysteriet.logic.SceneDelay(
        90,
        function() {
            self.loadGame();
        }
    );
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
runmysteriet.scene.AvatarSelect.prototype.removeDisplayObject = function(object) {

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
 * Tar bort alla objekt i en array från stage.
 *
 * @param {?Array} list
 * @return {void}
 */
runmysteriet.scene.AvatarSelect.prototype.clearDisplayList = function(list) {

    /** @type {number} */
    var i = 0;

    if (!list) {
        return;
    }

    for (i = 0; i < list.length; i++) {
        this.removeDisplayObject(list[i]);
    }
};

//------------------------------------------------------------------------------
// DISPOSE
//------------------------------------------------------------------------------

/**
 * Rensar AvatarSelect-scenen.
 *
 * @return {void}
 */
runmysteriet.scene.AvatarSelect.prototype.dispose = function() {

        if (this.m_sceneDelay) {
        this.m_sceneDelay.dispose();
    }
    
    this.clearDisplayList(this.m_player1Sprites);
    this.clearDisplayList(this.m_player2Sprites);
    this.clearDisplayList(this.m_player1Names);
    this.clearDisplayList(this.m_player2Names);
    this.clearDisplayList(this.m_player1NameBoxes);
    this.clearDisplayList(this.m_player2NameBoxes);

    this.removeDisplayObject(this.m_titleText);
    this.removeDisplayObject(this.m_helpText);
    this.removeDisplayObject(this.m_backText);

    this.removeDisplayObject(this.m_player1Label);
    this.removeDisplayObject(this.m_player2Label);

    this.removeDisplayObject(this.m_player1ReadyText);
    this.removeDisplayObject(this.m_player2ReadyText);

    this.removeDisplayObject(this.m_player1Marker);
    this.removeDisplayObject(this.m_player2Marker);

    this.removeDisplayObject(this.m_titleBox);
    this.removeDisplayObject(this.m_player1LabelBox);
    this.removeDisplayObject(this.m_player2LabelBox);
    this.removeDisplayObject(this.m_player1ReadyBox);
    this.removeDisplayObject(this.m_player2ReadyBox);
    this.removeDisplayObject(this.m_helpBox);
    this.removeDisplayObject(this.m_backBox);
    this.removeDisplayObject(this.m_background);

    this.m_avatars = [];

    this.m_player1Sprites = [];
    this.m_player2Sprites = [];

    this.m_player1Names = [];
    this.m_player2Names = [];

    this.m_player1NameBoxes = [];
    this.m_player2NameBoxes = [];

    this.m_titleText = null;
    this.m_helpText = null;
    this.m_backText = null;

    this.m_player1Label = null;
    this.m_player2Label = null;

    this.m_player1ReadyText = null;
    this.m_player2ReadyText = null;

    this.m_player1Marker = null;
    this.m_player2Marker = null;

    this.m_titleBox = null;
    this.m_player1LabelBox = null;
    this.m_player2LabelBox = null;
    this.m_player1ReadyBox = null;
    this.m_player2ReadyBox = null;
    this.m_helpBox = null;
    this.m_backBox = null;
    this.m_background = null;

    this.m_gameInput = null;
    this.m_sceneDelay = null;

    this.m_player1Index = 0;
    this.m_player2Index = 1;

    this.m_player1Ready = false;
    this.m_player2Ready = false;

    this.m_hasStarted = false;

    this.m_inputCooldown1 = 0;
    this.m_inputCooldown2 = 0;
    this.m_inputDelay = 0;

    this.menuSound = null;

    rune.scene.Scene.prototype.dispose.call(this);
};