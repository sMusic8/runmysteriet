//------------------------------------------------------------------------------
// PLATFORM
//------------------------------------------------------------------------------

runmysteriet.ui.Platform = function(x, y, width, height, texture) {

    rune.display.Graphic.call(this,
        x || 200,
        y || 200,
        width || 268,
        height || 32,
        texture || "bana-gras1"
    );
};
// Inheritance
runmysteriet.ui.Platform.prototype = Object.create(rune.display.Graphic.prototype);
runmysteriet.ui.Platform.prototype.constructor = runmysteriet.ui.Platform;

// INIT
runmysteriet.ui.Platform.prototype.init = function() {
    rune.display.Graphic.prototype.init.call(this);
};
