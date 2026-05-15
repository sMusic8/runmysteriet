var runmysteriet = runmysteriet || {};
runmysteriet.ui = runmysteriet.ui || {};

/**
 * Menu list UI component.
 * @constructor
 * @param {!Object} stage
 * @param {!Object} application
 * @param {Array<string>=} labels
 * @param {number=} yOffset
 * @param {number=} spacing
 * @param {number=} scale
 */
runmysteriet.ui.graphic.MenuList = function(stage, application, labels, yOffset, spacing, scale) {

    /** @type {!Object} */
    this.stage = stage;

    /** @type {!Object} */
    this.application = application;

    /** @type {!Array<string>} */
    this.labels = labels || [];

    /** @type {number} */
    this.yOffset = yOffset || 0;

    /** @type {number} */
    this.spacing = spacing || 20;

    /** @type {number} */
    this.scale = scale || 0.8;

    /** @type {!Array<!rune.text.BitmapField>} */
    this.items = [];

    /** @type {number} */
    this.selectedIndex = 0;

    /** @type {boolean} */
    this.visible = true;

    this.create();
    this.updateSelection();
};

//------------------------------------------------------------------------------
// CREATE
//------------------------------------------------------------------------------

/**
 * Creates menu items.
 * @return {void}
 */
runmysteriet.ui.graphic.MenuList.prototype.create = function() {
    /** @type {?rune.text.BitmapField} */
    var item = null;

    var i = 0;

    this.clear();

    for (i = 0; i < this.labels.length; i++) {

        item = new rune.text.BitmapField(this.labels[i]);
        item.autoSize = true;
/*
         * Rune använder scaleX och scaleY.
         * item.scale fungerar inte som riktig Rune-skalning.
         */
        item.scaleX = this.scale;
        item.scaleY = this.scale;

        /*
         * Centrera efter skalning, annars kan placeringen bli fel.
         */
        item.center = this.application.screen.center;
        item.y += this.yOffset + i * this.spacing;

        this.stage.addChild(item);
        this.items.push(item);
    }
};

//------------------------------------------------------------------------------
// SELECTION
//------------------------------------------------------------------------------

/**
 * Move selection down.
 * @return {void}
 */
runmysteriet.ui.graphic.MenuList.prototype.moveNext = function() {
    if (this.items.length <= 0) return;

    this.selectedIndex++;

    if (this.selectedIndex >= this.items.length) {
        this.selectedIndex = 0;
    }

    this.updateSelection();
};

/**
 * Move selection up.
 * @return {void}
 */
runmysteriet.ui.graphic.MenuList.prototype.movePrevious = function() {
    if (this.items.length <= 0) return;

    this.selectedIndex--;

    if (this.selectedIndex < 0) {
        this.selectedIndex = this.items.length - 1;
    }

    this.updateSelection();
};

/**
 * Updates visual selection.
 * @return {void}
 */
runmysteriet.ui.graphic.MenuList.prototype.updateSelection = function() {

    /** @type {?rune.text.BitmapField} */
    var item = null;

    /** @type {string} */
    var text = "";

    var i = 0;

    for (i = 0; i < this.items.length; i++) {
        item = this.items[i];
        text = item.text.replace("> ", "");

        if (i === this.selectedIndex) {
            item.text = "> " + text;
        } else {
            item.text = text;
        }
    }
};

/**
 * @return {number}
 */
runmysteriet.ui.graphic.MenuList.prototype.getSelectedIndex = function() {
    return this.selectedIndex;
};

//------------------------------------------------------------------------------
// VISIBILITY / POSITION
//------------------------------------------------------------------------------

/**
 * @param {boolean} value
 * @return {void}
 */
runmysteriet.ui.graphic.MenuList.prototype.setVisible = function(value) {

    var i = 0;

    this.visible = value;

    for (i = 0; i < this.items.length; i++) {
        this.items[i].visible = value;
    }
};



/**
 * Skalar alla menyval.
 *
 * @param {number} value
 * @return {void}
 */
runmysteriet.ui.graphic.MenuList.prototype.setScale = function(value) {

    var i = 0;
    var item = null;

    this.scale = value || 1;

    for (i = 0; i < this.items.length; i++) {

        item = this.items[i];

        if (!item) {
            continue;
        }

        item.scaleX = this.scale;
        item.scaleY = this.scale;
    }
};

/**
 * @param {?Object} camera
 * @param {number} x
 * @param {number} y
 * @return {void}
 */
runmysteriet.ui.graphic.MenuList.prototype.setCameraPosition = function(camera, x, y) {

    /** @type {?rune.text.BitmapField} */
    var item = null;

    var i = 0;

    if (!camera) return;

    for (i = 0; i < this.items.length; i++) {
        item = this.items[i];
        item.x = camera.viewport.x + x;
        item.y = camera.viewport.y + y + i * this.spacing;
    }
};

//------------------------------------------------------------------------------
// CLEAR
//------------------------------------------------------------------------------

/**
 * Removes all items.
 * @return {void}
 */
runmysteriet.ui.graphic.MenuList.prototype.clear = function() {

    /** @type {?rune.text.BitmapField} */
    var item = null;

    var i = 0;

    for (i = 0; i < this.items.length; i++) {
        item = this.items[i];

        if (item && item.parent) {
            item.parent.removeChild(item);
        }
    }

    this.items = [];
};

//------------------------------------------------------------------------------
// INPUT
//------------------------------------------------------------------------------

/**
 * Reads input from keyboard/gamepad.
 * @param {?Object} keyboard
 * @return {{up:boolean, down:boolean, choose:boolean}}
 */
runmysteriet.ui.graphic.MenuList.prototype.readInput = function(keyboard) {

    /** @type {?Object} */
    var gamepad = null;

    /** @type {{up:boolean, down:boolean, choose:boolean}} */
    var input = {
        up: false,
        down: false,
        choose: false
    };

    if (this.application && this.application.inputs && this.application.inputs.gamepads) {
        gamepad = this.application.inputs.gamepads.get(0);
    }

    if (gamepad !== null && gamepad !== undefined) {
        if (typeof gamepad.justPressed === "function") {

            input.choose =
                gamepad.justPressed("START") ||
                gamepad.justPressed(9) ||
                gamepad.justPressed(0);

            input.down =
                gamepad.justPressed("DOWN") ||
                gamepad.justPressed(13);

            input.up =
                gamepad.justPressed("UP") ||
                gamepad.justPressed(12);
        }
    }

    if (keyboard) {
        input.down = input.down || keyboard.justPressed("DOWN");
        input.up = input.up || keyboard.justPressed("UP");
        input.choose = input.choose ||
            keyboard.justPressed("SPACE") ||
            keyboard.justPressed("ENTER");
    }

    return input;
};