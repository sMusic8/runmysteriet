/**
 * Menylistans ui.
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

        item = new rune.text.BitmapField(String(this.labels[i] || ""));        item.autoSize = true;

        item.scaleX = this.scale;
        item.scaleY = this.scale;

        //Centrera efter skalning
        item.center = this.application.screen.center;
        item.y += this.yOffset + i * this.spacing;

        this.stage.addChild(item);
        this.items.push(item);
    }
};

/**
 * Flytta ner section.
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
 * Flytta markören uppåt
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

    var item = null;
    var label = "";
    var i = 0;

    for (i = 0; i < this.items.length; i++) {

        item = this.items[i];

        if (!item) {
            continue;
        }

        label = String(this.labels[i] || "");

        if (i === this.selectedIndex) {
            item.text = "> " + label;
        } else {
            item.text = "  " + label;
        }
    }
};
/**
 * Returnerar index för det nuvarande valda menyobjektet.
 *
 * @this {runmysteriet.ui.graphic.MenuList}
 * @return {number} Det valda indexet i listan.
 */
runmysteriet.ui.graphic.MenuList.prototype.getSelectedIndex = function() {
    return this.selectedIndex;
};
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

/**
 * Tar bort alla menyval från scenen och tömmer items-arrayen
 * @return {void}
 */
runmysteriet.ui.graphic.MenuList.prototype.clear = function() {

    var item = null;
    var i = 0;

    for (i = 0; i < this.items.length; i++) {
        item = this.items[i];

        if (item && item.stage) {
            item.stage.removeChild(item);
        }
    }

    this.items = [];
};

/**
 * Rensar menylistan och släpper referenser.
 *
 * @return {void}
 */
runmysteriet.ui.graphic.MenuList.prototype.dispose = function() {

    this.clear();

    this.stage = null;
    this.application = null;
    this.labels = [];
    this.items = [];
};
