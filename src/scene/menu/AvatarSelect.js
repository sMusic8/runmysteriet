//------------------------------------------------------------------------------
// AVATAR SELECT SCENE
//------------------------------------------------------------------------------

/**
 * Scene där spelarna väljer avatar innan spelet startar.
 *
 * @constructor
 * @extends {rune.scene.Scene}
 */
runmysteriet.scene.AvatarSelect = function() {

    rune.scene.Scene.call(this);

    this.m_gameInput = null;

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

    this.m_player1Index = 0;
    this.m_player2Index = 1;

    this.m_player1Ready = false;
    this.m_player2Ready = false;

    this.m_hasStarted = false;

    this.m_titleText = null;
    this.m_helpText = null;
    this.m_backText = null;

    this.m_player1Label = null;
    this.m_player2Label = null;

    this.m_player1ReadyText = null;
    this.m_player2ReadyText = null;

    this.m_player1Marker = null;
    this.m_player2Marker = null;

    this.m_player1Sprites = [];
    this.m_player2Sprites = [];

    this.m_player1Names = [];
    this.m_player2Names = [];

    this.m_inputCooldown1 = 0;
    this.m_inputCooldown2 = 0;
    this.m_inputDelay = 10;

    this.menuSound = null;
};

runmysteriet.scene.AvatarSelect.prototype =
    Object.create(rune.scene.Scene.prototype);

runmysteriet.scene.AvatarSelect.prototype.constructor =
    runmysteriet.scene.AvatarSelect;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.scene.AvatarSelect.prototype.init = function() {

    rune.scene.Scene.prototype.init.call(this);

    this.m_gameInput = new runmysteriet.input.GameInput(this.application);
    this.menuSound = this.application.sounds.sound.get("sound_menu");

    this.createText();
    this.createAvatarChoices();
    this.updateView();
};

//------------------------------------------------------------------------------
// CREATE
//------------------------------------------------------------------------------

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
    this.m_helpText.scaleX = 0.9;
    this.m_helpText.scaleY = 0.9;
    this.m_helpText.x = 65;
    this.m_helpText.y = 195;
    this.stage.addChild(this.m_helpText);

    this.m_backText = new rune.text.BitmapField("CIRCLE/B/ESC = BACK OR UNREADY");
    this.m_backText.autoSize = true;
    this.m_backText.scaleX = 0.9;
    this.m_backText.scaleY = 0.9;
    this.m_backText.x = 65;
    this.m_backText.y = 210;
    this.stage.addChild(this.m_backText);

    /*
     * Markörer som flyttas ovanför vald avatar.
     */
    this.m_player1Marker = new rune.text.BitmapField("v");
    this.m_player1Marker.autoSize = true;
    this.stage.addChild(this.m_player1Marker);

    this.m_player2Marker = new rune.text.BitmapField("v");
    this.m_player2Marker.autoSize = true;
    this.stage.addChild(this.m_player2Marker);
};

runmysteriet.scene.AvatarSelect.prototype.createAvatarChoices = function() {

    this.createPlayerAvatarChoices(0);
    this.createPlayerAvatarChoices(1);
};

runmysteriet.scene.AvatarSelect.prototype.createPlayerAvatarChoices = function(playerIndex) {

    var i = 0;
    var avatar = null;
    var sprite = null;
    var nameText = null;
    var baseX = 0;
    var y = 0;
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

        nameText = new rune.text.BitmapField(avatar.name);
        nameText.autoSize = true;
        nameText.scaleX = 0.7;
        nameText.scaleY = 0.7;
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

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

runmysteriet.scene.AvatarSelect.prototype.update = function(step) {

    rune.scene.Scene.prototype.update.call(this, step);

    if (this.m_hasStarted === true) {
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

//------------------------------------------------------------------------------
// INPUT
//------------------------------------------------------------------------------

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
            this.m_player1Index = this.getNextAvatarIndex(this.m_player1Index);
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
            this.m_player2Index = this.getNextAvatarIndex(this.m_player2Index);
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

//------------------------------------------------------------------------------
// SELECTION
//------------------------------------------------------------------------------

runmysteriet.scene.AvatarSelect.prototype.getNextAvatarIndex = function(index) {

    index++;

    if (index >= this.m_avatars.length) {
        index = 0;
    }

    return index;
};

//------------------------------------------------------------------------------
// VIEW
//------------------------------------------------------------------------------

runmysteriet.scene.AvatarSelect.prototype.updateView = function() {

    this.updateMarkers();
    this.updateReadyText();
    this.updateAvatarAlpha();
};

runmysteriet.scene.AvatarSelect.prototype.updateMarkers = function() {

    var p1Sprite = this.m_player1Sprites[this.m_player1Index];
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

runmysteriet.scene.AvatarSelect.prototype.updateAvatarAlpha = function() {

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
    }
};

//------------------------------------------------------------------------------
// BACK
//------------------------------------------------------------------------------

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

//------------------------------------------------------------------------------
// START GAME
//------------------------------------------------------------------------------

runmysteriet.scene.AvatarSelect.prototype.startGame = function() {

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

runmysteriet.scene.AvatarSelect.prototype.playMenuSound = function() {

    if (this.menuSound) {
        this.menuSound.play();
    }
};

//------------------------------------------------------------------------------
// DISPOSE
//------------------------------------------------------------------------------

runmysteriet.scene.AvatarSelect.prototype.dispose = function() {

    this.m_gameInput = null;

    this.m_avatars = [];

    this.m_player1Sprites = [];
    this.m_player2Sprites = [];

    this.m_player1Names = [];
    this.m_player2Names = [];

    this.m_titleText = null;
    this.m_helpText = null;
    this.m_backText = null;

    this.m_player1Label = null;
    this.m_player2Label = null;

    this.m_player1ReadyText = null;
    this.m_player2ReadyText = null;

    this.m_player1Marker = null;
    this.m_player2Marker = null;

    this.menuSound = null;

    rune.scene.Scene.prototype.dispose.call(this);
};