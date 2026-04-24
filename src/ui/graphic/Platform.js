//------------------------------------------------------------------------------
// PLATFORM
//------------------------------------------------------------------------------

runmysteriet.ui.Platform = function() {

    rune.display.Graphic.call(this,
        225,
        225,
        50,
        50,
        "rand"
    );
};

// Inheritance
runmysteriet.ui.Platform.prototype = Object.create(rune.display.Graphic.prototype);
runmysteriet.ui.Platform.prototype.constructor = runmysteriet.ui.Platform;

// INIT
runmysteriet.ui.Platform.prototype.init = function() {

    rune.display.Graphic.prototype.init.call(this);
};
