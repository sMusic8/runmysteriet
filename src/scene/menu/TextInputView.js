//------------------------------------------------------------------------------
// TEXT INPUT VIEW
//------------------------------------------------------------------------------

/**
 * Scene där två spelare skriver varsitt namn.
 *
 * Spelare 1: 4 bokstäver
 * Spelare 2: 4 bokstäver
 *
 * UP/DOWN = byt bokstav
 * ENTER/SPACE/X = lägg till bokstav / starta när båda är klara
 * BACK/ESC = ta bort bokstav
 *
 * @constructor
 * @extends rune.scene.Scene
 * @param {Function=} getHelpText
 */
runmysteriet.scene.TextInputView = function(getHelpText) {

    rune.scene.Scene.call(this);

    /** @type {Function} */
    this.getHelpText = getHelpText || function() {
        return "UP/DOWN = BOKSTAV  ENTER/X = VALJ  BACK/ESC = TA BORT";
    };

    /** @type {?runmysteriet.input.GameInput} */
    this.m_gameInput = null;

    /** @type {!Array<!runmysteriet.logic.NameInput>} */
    this.m_nameInputs = [];

    /** @type {number} */
    this.m_currentPlayer = 0;

    /** @type {?rune.text.BitmapField} */
    this.m_helpText = null;

    /** @type {?rune.text.BitmapField} */
    this.m_titleText = null;

    /** @type {?rune.text.BitmapField} */
    this.m_player1Text = null;

    /** @type {?rune.text.BitmapField} */
    this.m_player2Text = null;

    /** @type {?rune.text.BitmapField} */
    this.m_letterText = null;

    /** @type {?rune.text.BitmapField} */
    this.m_startText = null;
};

//------------------------------------------------------------------------------
// INHERITANCE
//------------------------------------------------------------------------------

runmysteriet.scene.TextInputView.prototype =
    Object.create(rune.scene.Scene.prototype);

runmysteriet.scene.TextInputView.prototype.constructor =
    runmysteriet.scene.TextInputView;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.scene.TextInputView.prototype.init = function() {

    rune.scene.Scene.prototype.init.call(this);
     this.backgroundMusic = this.application.sounds.sound.get("sound_musicMenu");
  this.menuSound = this.application.sounds.sound.get("sound_menu");
  if (this.backgroundMusic) {
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.5;
    this.backgroundMusic.play();
  }

  //If gamepad eller kaybord justpresst ändra nummret på volume med ett steg i en loop

    this.m_gameInput = new runmysteriet.input.GameInput(this.application);

    this.m_nameInputs = [
        new runmysteriet.logic.NameInput(4),
        new runmysteriet.logic.NameInput(4)
    ];

    this.m_currentPlayer = 0;

    this.createText();
    this.updateText();
};

//------------------------------------------------------------------------------
// CREATE TEXT
//------------------------------------------------------------------------------

runmysteriet.scene.TextInputView.prototype.createText = function() {

    this.m_titleText = new rune.text.BitmapField("SKRIV NAMN");
    this.m_titleText.autoSize = true;
    this.m_titleText.center = this.application.screen.center;
    this.m_titleText.y -= 80;
    this.stage.addChild(this.m_titleText);

    this.m_helpText = new rune.text.BitmapField(String(this.getHelpText()));
    this.m_helpText.autoSize = true;
    this.m_helpText.center = this.application.screen.center;
    this.m_helpText.y -= 55;
    this.m_helpText.scale = 0.65;
    this.stage.addChild(this.m_helpText);

    this.m_player1Text = new rune.text.BitmapField(" ");
    this.m_player1Text.autoSize = true;
    this.m_player1Text.center = this.application.screen.center;
    this.m_player1Text.y -= 15;
    this.m_player1Text.scale = 0.9;
    this.stage.addChild(this.m_player1Text);

    this.m_player2Text = new rune.text.BitmapField(" ");
    this.m_player2Text.autoSize = true;
    this.m_player2Text.center = this.application.screen.center;
    this.m_player2Text.y += 20;
    this.m_player2Text.scale = 0.9;
    this.stage.addChild(this.m_player2Text);

    this.m_letterText = new rune.text.BitmapField(" ");
    this.m_letterText.autoSize = true;
    this.m_letterText.center = this.application.screen.center;
    this.m_letterText.y += 60;
    this.m_letterText.scale = 0.8;
    this.stage.addChild(this.m_letterText);

    this.m_startText = new rune.text.BitmapField(" ");
    this.m_startText.autoSize = true;
    this.m_startText.center = this.application.screen.center;
    this.m_startText.y += 90;
    this.m_startText.scale = 0.8;
    this.stage.addChild(this.m_startText);
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

runmysteriet.scene.TextInputView.prototype.update = function(step) {

    var input = null;
    var currentInput = null;

    rune.scene.Scene.prototype.update.call(this, step);

    if (!this.m_gameInput || !this.m_nameInputs || this.m_nameInputs.length < 2) {
        return;
    }

    input = this.m_gameInput.read(this.keyboard);
    currentInput = this.m_nameInputs[this.m_currentPlayer];

    if (!currentInput) {
        return;
    }

    if (input.up) {
        currentInput.previousLetter();
        this.updateText();
        return;
    }

    if (input.down) {
        currentInput.nextLetter();
        this.updateText();
        return;
    }

    if (input.left && this.m_currentPlayer > 0) {
        this.m_currentPlayer = 0;
        this.updateText();
        return;
    }

    if (input.right && this.m_currentPlayer < 1 && currentInput.isComplete()) {
        this.m_currentPlayer = 1;
        this.updateText();
        return;
    }

    if (input.back) {
        if (currentInput.getLength() > 0) {
            currentInput.removeLastLetter();
        } else if (this.m_currentPlayer > 0) {
            this.m_currentPlayer = 0;
        }

        this.updateText();
        return;
    }

    if (input.choose) {
        if (this.areBothNamesComplete()) {
            this.startGame();
            return;
        }

        currentInput.addSelectedLetter();

        if (currentInput.isComplete() && this.m_currentPlayer < 1) {
            this.m_currentPlayer = 1;
        }

        this.updateText();
        return;
    }
};

//------------------------------------------------------------------------------
// UPDATE TEXT
//------------------------------------------------------------------------------

runmysteriet.scene.TextInputView.prototype.updateText = function() {

    if (!this.m_nameInputs || this.m_nameInputs.length < 2) {
        return;
    }

    if (this.m_player1Text) {
        this.m_player1Text.text = this.formatPlayerRow(0);
        this.m_player1Text.center = this.application.screen.center;
        this.m_player1Text.y -= 15;
    }

    if (this.m_player2Text) {
        this.m_player2Text.text = this.formatPlayerRow(1);
        this.m_player2Text.center = this.application.screen.center;
        this.m_player2Text.y += 20;
    }

    if (this.m_letterText) {
        this.m_letterText.text = "VALD BOKSTAV: " +
            this.m_nameInputs[this.m_currentPlayer].getSelectedLetter().toUpperCase();
        this.m_letterText.center = this.application.screen.center;
        this.m_letterText.y += 60;
    }

    if (this.m_startText) {
        if (this.areBothNamesComplete()) {
            this.m_startText.text = "TRYCK ENTER/X FOR ATT STARTA";
        } else if (this.m_currentPlayer === 0) {
            this.m_startText.text = "FYLL I SPELARE 1";
        } else {
            this.m_startText.text = "FYLL I SPELARE 2";
        }

        this.m_startText.center = this.application.screen.center;
        this.m_startText.y += 90;
    }
};

/**
 * Skapar text med fyra rutor för en spelare.
 *
 * @param {number} index
 * @return {string}
 */
runmysteriet.scene.TextInputView.prototype.formatPlayerRow = function(index) {

    var nameInput = this.m_nameInputs[index];
    var rawName = nameInput.getRawName();
    var selectedLetter = nameInput.getSelectedLetter().toUpperCase();
    var isActive = index === this.m_currentPlayer;
    var text = isActive ? "> " : "  ";
    var i = 0;
    var letter = " ";

    text += "SPELARE " + (index + 1) + ": ";

    for (i = 0; i < 4; i++) {
        letter = rawName.charAt(i);

        if (!letter && isActive && i === rawName.length && !nameInput.isComplete()) {
            letter = selectedLetter;
        }

        if (!letter) {
            letter = " ";
        }

        text += "[" + letter + "] ";
    }

    return text;
};

/**
 * @return {boolean}
 */
runmysteriet.scene.TextInputView.prototype.areBothNamesComplete = function() {
    return this.m_nameInputs[0].isComplete() && this.m_nameInputs[1].isComplete();
};

//------------------------------------------------------------------------------
// START GAME
//------------------------------------------------------------------------------

runmysteriet.scene.TextInputView.prototype.startGame = function() {

    var player1Name = this.m_nameInputs[0].getName();
    var player2Name = this.m_nameInputs[1].getName();
    var highscoreName = player1Name + "/" + player2Name;

    this.application.scenes.load([
        new runmysteriet.scene.Game(
            1,
            0,
            highscoreName
        )
    ]);
};

//------------------------------------------------------------------------------
// DISPOSE
//------------------------------------------------------------------------------

runmysteriet.scene.TextInputView.prototype.dispose = function() {

    this.m_gameInput = null;
    this.m_nameInputs = [];

    this.m_helpText = null;
    this.m_titleText = null;
    this.m_player1Text = null;
    this.m_player2Text = null;
    this.m_letterText = null;
    this.m_startText = null;

    rune.scene.Scene.prototype.dispose.call(this);
};
