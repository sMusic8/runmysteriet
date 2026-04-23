/**
 * Klass för plattformar
 * Beskrivande kommentar för klassen Platform
 */
runmysteriet.ui.Platform = function() {

    // Anropar basklassen Graphic med angivna parametrar:
    // x = 225, y = 225, width = 50, height = 50, asset = "bana-gras"
    rune.display.Graphic.call(this,
        225,
        225,
        50,
        50,
        "bana-gras"
    );

    // Konstruktorfunktionens slut
};

// Skapar prototypkedja så Platform ärver från Graphic
runmysteriet.ui.Platform.prototype = Object.create(rune.display.Graphic.prototype);

// Sätter korrekt konstruktorreferens till Platform
runmysteriet.ui.Platform.prototype.constructor = runmysteriet.ui.Platform;

// Kommentar i kod (inte exekverande): konstruktor som pekar på sig själv
// (förtydligande av constructor-referens)

// Skriver ut texten "hejj" i konsolen
console.log("hejj");

// Skapar prototypkedja igen (duplicerad rad, samma som ovan)
runmysteriet.ui.Platform.prototype = Object.create(rune.display.Graphic.prototype);

// Sätter constructor igen (duplicerad rad, samma som tidigare)
runmysteriet.ui.Platform.prototype.constructor = runmysteriet.ui.Platform;

// Definierar init-funktion för Platform
runmysteriet.ui.Platform.prototype.init = function() {

    // Anropar basklassens init-metod (Graphic)
    rune.display.Graphic.prototype.init.call(this);
};