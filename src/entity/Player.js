// Skapar konstruktorfunktion för Player-klassen
runmysteriet.entity.Player = function() {

    // Variabel för vertikal hastighet (Y-led)
    this.m_velocityY = 0;

    // Gravitationsvärde som påverkar fallhastighet
    this.m_gravity = 0.5;

    // Startvärde för hopp (negativt = uppåt i skärmkoordinater)
    this.m_jumping = -5;

    // Sparar marknivå i Y-led
    this.m_groundY = 0;

    // Boolean som anger om spelaren är på marken
    this.m_onground = false;

    // Anropar basklassen Graphic med position, storlek och bild
    rune.display.Graphic.call(this,
        0,
        0,
        32,
        32,
        "start"
    );
};

// Skapar arv så Player ärver från Graphic
runmysteriet.entity.Player.prototype = Object.create(rune.display.Graphic.prototype);

// Sätter korrekt constructor tillbaka till Player
runmysteriet.entity.Player.prototype.constructor = runmysteriet.entity.Player;

// Init-metod som körs vid start
runmysteriet.entity.Player.prototype.init = function() {

    // Anropar basklassens init-metod
    rune.display.Graphic.prototype.init.call(this);

    // Sätter marknivå till spelarens startposition
    this.m_groundY = this.y;

    // Sätter spelaren som på marken vid start
    this.m_onground = true;
};

// Uppdateringsmetod som körs varje frame/steg
runmysteriet.entity.Player.prototype.update = function(step) {

    // Anropar basklassens update-metod
    rune.display.Graphic.prototype.update.call(this, step);

    // Om högerpil är nedtryckt flyttas spelaren åt höger
    if (this.keyboard.pressed("RIGHT")) {
        this.x += 4;
    }

    // Om vänsterpil är nedtryckt flyttas spelaren åt vänster
    if (this.keyboard.pressed("LEFT")) {
        this.x -= 3;
    }

    // Hopp-logik

    // Om upp-pil trycks och spelaren är på marken
    if (this.keyboard.pressed("UP") && this.m_onground) {

        // Sätter vertikal hastighet till hoppvärde
        this.m_velocityY = this.m_jumping;

        // Sätter att spelaren inte längre är på marken
        this.m_onground = false;
    }

    // Gravitation läggs till på vertikal hastighet
    this.m_velocityY += this.m_gravity;

    // Y-position uppdateras med hastigheten
    this.y += this.m_velocityY;

    // Kontroll av markkontakt

    // Om spelaren har nått eller passerat marknivå
    if (this.y >= this.m_groundY) {

        // Sätter spelarens position exakt på marknivå
        this.y = this.m_groundY;

        // Nollställer vertikal hastighet
        this.m_velocityY = 0;

        // Markerar att spelaren står på marken
        this.m_onground = true;
    }
};