runmysteriet.ui.MenuList = function(stage, application, labels, yOffset, spacing, scale) {
    this.stage = stage;
    this.application = application;
    this.labels = labels || [];
    this.yOffset = yOffset || 0;
    this.spacing = spacing || 20;
    this.scale = scale || 0.8;

    this.items = [];
    this.selectedIndex = 0;
    this.visible = true;

    this.create();
    this.updateSelection();
};

//------------------------------------------------------------------------------
// CREATE
//------------------------------------------------------------------------------

runmysteriet.ui.MenuList.prototype.create = function() {
    var item = null;
    var i = 0;

    this.clear();

    for (i = 0; i < this.labels.length; i++) {
        item = new rune.text.BitmapField(this.labels[i]);
        item.autoSize = true;
        item.center = this.application.screen.center;
        item.y += this.yOffset + i * this.spacing;
        item.scale = this.scale;

        this.stage.addChild(item);
        this.items.push(item);
    }
};

//------------------------------------------------------------------------------
// SELECTION
//------------------------------------------------------------------------------

runmysteriet.ui.MenuList.prototype.moveNext = function() {
    if (this.items.length <= 0) {
        return;
    }

    this.selectedIndex++;

    if (this.selectedIndex >= this.items.length) {
        this.selectedIndex = 0;
    }

    this.updateSelection();
};

runmysteriet.ui.MenuList.prototype.movePrevious = function() {
    if (this.items.length <= 0) {
        return;
    }

    this.selectedIndex--;

    if (this.selectedIndex < 0) {
        this.selectedIndex = this.items.length - 1;
    }

    this.updateSelection();
};

runmysteriet.ui.MenuList.prototype.updateSelection = function() {
    var item = null;
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

runmysteriet.ui.MenuList.prototype.getSelectedIndex = function() {
    return this.selectedIndex;
};

//------------------------------------------------------------------------------
// VISIBILITY / POSITION
//------------------------------------------------------------------------------

runmysteriet.ui.MenuList.prototype.setVisible = function(value) {
    var i = 0;

    this.visible = value;

    for (i = 0; i < this.items.length; i++) {
        this.items[i].visible = value;
    }
};

runmysteriet.ui.MenuList.prototype.setCameraPosition = function(camera, x, y) {
    var item = null;
    var i = 0;

    if (!camera) {
        return;
    }

    for (i = 0; i < this.items.length; i++) {
        item = this.items[i];
        item.x = camera.viewport.x + x;
        item.y = camera.viewport.y + y + i * this.spacing;
    }
};

//------------------------------------------------------------------------------
// CLEAR
//------------------------------------------------------------------------------

runmysteriet.ui.MenuList.prototype.clear = function() {
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

runmysteriet.ui.MenuList.prototype.readInput = function(keyboard) {
    var gamepad = null;
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
        input.choose = input.choose || keyboard.justPressed("SPACE") || keyboard.justPressed("ENTER");
    }

    return input;
};
