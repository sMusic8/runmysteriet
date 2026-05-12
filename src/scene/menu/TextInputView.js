//------------------------------------------------------------------------------
// TEXT INPUT VIEW
//------------------------------------------------------------------------------

/**
 * Scene där spelaren skriver sitt namn.
 *
 * @constructor
 * @extends rune.scene.Scene
 *
 * @param {Function=} getHelpText
 */
runmysteriet.scene.TextInputView = function(getHelpText) {

    rune.scene.Scene.call(this);

    /**
     * Text som visas som hjälp.
     *
     * @type {Function}
     */
    this.getHelpText = getHelpText || function() {
        return "UP/DOWN = BOKSTAV, ENTER/X = LAGG TILL, BACK = TA BORT";
    };

    /**
     * Gemensam input för tangentbord och gamepad.
     *
     * @type {?runmysteriet.input.GameInput}
     */
    this.m_gameInput = null;

    /**
     * Hanterar namnlogiken.
     *
     * @type {?runmysteriet.logic.NameInput}
     */
    this.m_nameInput = null;

    /**
     * Hjälptext.
     *
     * @type {?rune.text.BitmapField}
     */
    this.m_helpText = null;

    /**
     * Visar vald bokstav.
     *
     * @type {?rune.text.BitmapField}
     */
    this.m_letterText = null;

    /**
     * Visar spelarens namn.
     *
     * @type {?rune.text.BitmapField}
     */
    this.m_nameText = null;

    /**
     * Starta spelet-text.
     *
     * @type {?rune.text.BitmapField}
     */
    this.m_startText = null;

    /**
     * 0 = bokstav
     * 1 = starta spel
     *
     * @type {number}
     */
    this.m_focus = 0;
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

/**
 * Initierar scenen.
 *
 * @return {undefined}
 */
runmysteriet.scene.TextInputView.prototype.init = function() {

    rune.scene.Scene.prototype.init.call(this);
        console.log("NY TEXTINPUTVIEW KALLAD");

    this.m_gameInput = new runmysteriet.input.GameInput(this.application);
    this.m_nameInput = new runmysteriet.logic.NameInput();

    this.createText();
    this.updateText();
};

//------------------------------------------------------------------------------
// CREATE TEXT
//------------------------------------------------------------------------------

/**
 * Skapar all text på scenen.
 *
 * @return {undefined}
 */
runmysteriet.scene.TextInputView.prototype.createText = function() {

    this.m_helpText = new rune.text.BitmapField(String(this.getHelpText()));
    this.m_helpText.autoSize = true;
    this.m_helpText.x = 20;
    this.m_helpText.y = 30;
    this.stage.addChild(this.m_helpText);

    this.m_letterText = new rune.text.BitmapField("BOKSTAV: A");
    this.m_letterText.autoSize = true;
    this.m_letterText.x = 100;
    this.m_letterText.y = 120;
    this.stage.addChild(this.m_letterText);

    this.m_nameText = new rune.text.BitmapField("NAMN: ");
    this.m_nameText.autoSize = true;
    this.m_nameText.x = 100;
    this.m_nameText.y = 160;
    this.stage.addChild(this.m_nameText);

    this.m_startText = new rune.text.BitmapField("STARTA SPEL");
    this.m_startText.autoSize = true;
    this.m_startText.x = 100;
    this.m_startText.y = 210;
    this.stage.addChild(this.m_startText);
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

/**
 * Uppdaterar scenen.
 *
 * @param {number} step
 * @return {undefined}
 */
runmysteriet.scene.TextInputView.prototype.update = function(step) {

    var input = null;

    rune.scene.Scene.prototype.update.call(this, step);

    if (!this.m_gameInput || !this.m_nameInput) {
        return;
    }

    input = this.m_gameInput.read(this.keyboard);

    /*
     * Fokus på bokstavsval.
     */
    if (this.m_focus === 0) {

        if (input.up) {
            this.m_nameInput.previousLetter();
            this.updateText();
            return;
        }

        if (input.down) {
            this.m_nameInput.nextLetter();
            this.updateText();
            return;
        }

        if (input.choose) {
            this.m_nameInput.addSelectedLetter();
            this.updateText();
            return;
        }

        if (input.back) {
            this.m_nameInput.removeLastLetter();
            this.updateText();
            return;
        }

        if (input.right) {
            this.m_focus = 1;
            this.updateText();
            return;
        }
    }

    /*
     * Fokus på STARTA SPEL.
     */
    if (this.m_focus === 1) {

        if (input.left || input.back) {
            this.m_focus = 0;
            this.updateText();
            return;
        }

        if (input.choose) {
            this.startGame();
            return;
        }
    }
};

//------------------------------------------------------------------------------
// UPDATE TEXT
//------------------------------------------------------------------------------

/**
 * Uppdaterar texten på skärmen.
 *
 * @return {undefined}
 */
runmysteriet.scene.TextInputView.prototype.updateText = function() {

    var letter = " ";
    var name = " ";

    if (!this.m_nameInput) {
        return;
    }

    letter = this.m_nameInput.getSelectedLetter().toUpperCase();
    name = this.m_nameInput.getName();

    /*
     * Om namnet är tomt och getName() ger PLAYER,
     * visar vi ändå PLAYER som standardnamn.
     */
    if (this.m_letterText) {
        this.m_letterText.text = "BOKSTAV: " + letter;

        if (this.m_focus === 0) {
            this.m_letterText.scale = 1.5;
        } else {
            this.m_letterText.scale = 1.0;
        }
    }

    if (this.m_nameText) {
        this.m_nameText.text = "NAMN: " + name;
    }

    if (this.m_startText) {
        if (this.m_focus === 1) {
            this.m_startText.text = "> STARTA SPEL";
            this.m_startText.scale = 1.3;
        } else {
            this.m_startText.text = "STARTA SPEL";
            this.m_startText.scale = 1.0;
        }
    }
};

//------------------------------------------------------------------------------
// START GAME
//------------------------------------------------------------------------------

/**
 * Startar spelet med spelarens namn.
 *
 * @return {undefined}
 */
runmysteriet.scene.TextInputView.prototype.startGame = function() {

    this.application.scenes.load([
        new runmysteriet.scene.Game(
            1,
            0,
            this.m_nameInput.getName()
        )
    ]);
};

//------------------------------------------------------------------------------
// DISPOSE
//------------------------------------------------------------------------------

/**
 * Rensar scenen.
 *
 * @return {undefined}
 */
runmysteriet.scene.TextInputView.prototype.dispose = function() {

    this.m_gameInput = null;
    this.m_nameInput = null;

    this.m_helpText = null;
    this.m_letterText = null;
    this.m_nameText = null;
    this.m_startText = null;

    rune.scene.Scene.prototype.dispose.call(this);
};