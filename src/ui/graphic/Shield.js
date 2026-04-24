//------------------------------------------------------------------------------
// SHIELD
//------------------------------------------------------------------------------

runmysteriet.ui = runmysteriet.ui || {}; // säkerställ namespace

runmysteriet.ui.Shield = function() {

    console.log("GRIS");

    rune.display.Graphic.call(this,
        0,
        0,
        20,
        20,
        "shield" // 🔥 MÅSTE finnas i assets (se nedan)
    );
};

// Inheritance
runmysteriet.ui.Shield.prototype = Object.create(rune.display.Graphic.prototype);
runmysteriet.ui.Shield.prototype.constructor = runmysteriet.ui.Shield;