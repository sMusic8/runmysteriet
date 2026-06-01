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
runmysteriet.ui.graphic.MenuList = function(
    stage,
    application,
    labels,
    yOffset,
    spacing,
    scale
) {

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

    /** @type {!Array<!rune.display.Graphic>} */
    this.boxes = [];

    /** @type {number} */
    this.boxWidth = 80;

    /** @type {number} */
    this.boxHeight = 16;

    /** @type {number} */
    this.boxAlpha = 0.5;

    /** @type {number} */
    this.selectedIndex = 0;

    /** @type {boolean} */
    this.visible = true;

    this.create();
    this.updateSelection();
};

/**
 * Skapar en mörk transparent bakgrundsruta bakom ett menyval.
 *
 * @param {!rune.text.BitmapField} item Menytexten som rutan ska ligga bakom.
 * @return {!rune.display.Graphic} Den skapade bakgrundsrutan.
 */
runmysteriet.ui.graphic.MenuList.prototype.createItemBox = function(item) {


    /** @type {number} */
    var cutLeftPosition = 5;


    /** @type {!rune.display.Graphic} */
    var box = new rune.display.Graphic(
        0,
        0,
        this.boxWidth,
        this.boxHeight
    );

    box.backgroundColor = "#000000";
    box.alpha = this.boxAlpha;

    box.x = this.application.screen.center.x - this.boxWidth / 2 + cutLeftPosition;
    box.y = item.y - 3;

    return box;
};

/**
 * Skapar menyval och bakgrundsrutor.
 *
 * @return {void}
 */
runmysteriet.ui.graphic.MenuList.prototype.create = function() {

    /** @type {?rune.text.BitmapField} */
    var item = null;

    /** @type {?rune.display.Graphic} */
    var box = null;

    /** @type {number} */
    var i = 0;

    this.clear();

    for (i = 0; i < this.labels.length; i++) {
        item = new rune.text.BitmapField(
            String(this.labels[i] || "")
        );

        item.autoSize = true;

        item.scaleX = this.scale;
        item.scaleY = this.scale;

        item.center = this.application.screen.center;
        item.y += this.yOffset + i * this.spacing;

        item.visible = this.visible;

        box = this.createItemBox(item);
        box.visible = this.visible;

        this.stage.addChild(box);
        this.stage.addChild(item);

        this.boxes.push(box);
        this.items.push(item);
    }
};

/**
 * Flyttar markeringen nedåt.
 *
 * @return {void}
 */
runmysteriet.ui.graphic.MenuList.prototype.moveNext = function() {

    if (!this.items || this.items.length <= 0) {
        return;
    }

    this.selectedIndex++;

    if (this.selectedIndex >= this.items.length) {
        this.selectedIndex = 0;
    }

    this.updateSelection();
};

/**
 * Flyttar markeringen uppåt.
 *
 * @return {void}
 */
runmysteriet.ui.graphic.MenuList.prototype.movePrevious = function() {

    if (!this.items || this.items.length <= 0) {
        return;
    }

    this.selectedIndex--;

    if (this.selectedIndex < 0) {
        this.selectedIndex = this.items.length - 1;
    }

    this.updateSelection();
};

/**
 *
 * @return {void}
 */
runmysteriet.ui.graphic.MenuList.prototype.updateSelection = function() {

    var item = null;
    var label = "";
    var i = 0;

    if (!this.items) {
        return;
    }

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
 * Visar eller döljer menylistan.
 *
 * @param {boolean} value
 * @return {void}
 */
runmysteriet.ui.graphic.MenuList.prototype.setVisible = function(value) {

    /** @type {number} */
    var i = 0;

    /** @type {?rune.text.BitmapField} */
    var item = null;

    /** @type {?rune.display.Graphic} */
    var box = null;

    this.visible = value;

    for (i = 0; i < this.items.length; i++) {
        item = this.items[i];

        if (item) {
            item.visible = value;
        }
    }

    for (i = 0; i < this.boxes.length; i++) {
        box = this.boxes[i];

        if (box) {
            box.visible = value;
        }
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

    if (!this.items) {
        return;
    }

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
 * Placerar menylistan relativt kameran.
 *
 * @param {?Object} camera
 * @param {number} x
 * @param {number} y
 * @return {void}
 */
runmysteriet.ui.graphic.MenuList.prototype.setCameraPosition = function(
    camera,
    x,
    y
) {

    var item = null;
    var i = 0;

    if (!camera || !camera.viewport || !this.items) {
        return;
    }

    for (i = 0; i < this.items.length; i++) {
        item = this.items[i];

        if (!item) {
            continue;
        }

        item.x = camera.viewport.x + x;
        item.y = camera.viewport.y + y + i * this.spacing;
    }
};

/**
 * Tar bort display object från stage.
 *
 * @param {?Object} object
 * @return {void}
 */
runmysteriet.ui.graphic.MenuList.prototype.removeDisplayObject = function(
    object
) {

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
 * Tar bort alla menyval och bakgrundsrutor från scenen.
 *
 * @return {void}
 */
runmysteriet.ui.graphic.MenuList.prototype.clear = function() {

    /** @type {number} */
    var i = 0;

    /** @type {?rune.text.BitmapField} */
    var item = null;

    /** @type {?rune.display.Graphic} */
    var box = null;

    if (this.items) {
        for (i = 0; i < this.items.length; i++) {
            item = this.items[i];
            this.removeDisplayObject(item);
        }
    }

    if (this.boxes) {
        for (i = 0; i < this.boxes.length; i++) {
            box = this.boxes[i];
            this.removeDisplayObject(box);
        }
    }

    this.items = [];
    this.boxes = [];
};

/**
 * Rensar menylistan och släpper referenser.
 *
 * @return {void}
 */
runmysteriet.ui.graphic.MenuList.prototype.dispose = function() {

    this.clear();

    this.boxes = [];
    this.boxWidth = 0;
    this.boxHeight = 0;
    this.boxAlpha = 0; 

    this.stage = null;
    this.application = null;

    this.labels = [];
    this.items = [];

    this.yOffset = 0;
    this.spacing = 0;
    this.scale = 0;

    this.selectedIndex = 0;
    this.visible = false;
};