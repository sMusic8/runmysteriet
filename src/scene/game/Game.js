//------------------------------------------------------------------------------
// Constructor
//------------------------------------------------------------------------------

// Skapar en konstruktorfunktion för Game-scenen
runmysteriet.scene.Game = function() {

    // Anropar basklassens konstruktor (Scene)
    rune.scene.Scene.call(this);

    // Referens till spelaren, initialt null
    this.m_player = null;

    // Referenser till två plattformar, initialt null
    this.r_bana1 = null;
    this.r_bana2 = null;

    // Boolean som anger om spelaren står på marken
    this.m_isOnGround = false;
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

// Skapar prototypkedja så Game ärver från Scene
runmysteriet.scene.Game.prototype = Object.create(rune.scene.Scene.prototype);

// Sätter korrekt konstruktorreferens tillbaka till Game
runmysteriet.scene.Game.prototype.constructor = runmysteriet.scene.Game;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

// Init-funktion som körs när scenen startas
runmysteriet.scene.Game.prototype.init = function() {

    // Anropar basklassens init-metod
    rune.scene.Scene.prototype.init.call(this);

    // PLAYER

    // Skapar en ny Player-instans
    this.m_player = new runmysteriet.entity.Player();

    // Sätter spelarens x-position
    this.m_player.x = 0;

    // Sätter spelarens y-position
    this.m_player.y = 180;

    // PLATTFORM 1

    // Skapar första plattformen
    this.r_bana1 = new runmysteriet.ui.Platform();

    // Sätter plattformens x-position
    this.r_bana1.x = 200;

    // Sätter plattformens y-position
    this.r_bana1.y = 180;

    // PLATTFORM 2

    // Skapar andra plattformen
    this.r_bana2 = new runmysteriet.ui.Platform();

    // Sätter plattformens x-position
    this.r_bana2.x = 300;

    // Sätter plattformens y-position
    this.r_bana2.y = 180;

    // Lägger till plattform 2 i scenens display-lista
    this.stage.addChild(this.r_bana2);

    // Lägger till plattform 1 i scenens display-lista
    this.stage.addChild(this.r_bana1);

    // Lägger till spelaren i scenens display-lista
    this.stage.addChild(this.m_player);
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

// Uppdateringsfunktion som körs varje frame
runmysteriet.scene.Game.prototype.update = function(step) {

    // Anropar basklassens update-metod
    rune.scene.Scene.prototype.update.call(this, step);

    // Skapar lokal referens till spelaren
    var player = this.m_player;

    // gravitation

    // Om spelaren inte är på marken
    if (!this.m_isOnGround) {

        // Ökar spelarens y-position (rör sig nedåt)
        player.y += 2;
    }

    // reset varje frame

    // Återställer mark-status inför nya kollisionskontroller
    this.m_isOnGround = false;

    // check plattformar

    // Kontrollerar kollision med plattform 1
    this.checkPlatform(this.r_bana1);

    // Kontrollerar kollision med plattform 2
    this.checkPlatform(this.r_bana2);
};

//------------------------------------------------------------------------------
// PLATFORM COLLISION (STABIL VERSION)
//------------------------------------------------------------------------------

// Funktion för att kontrollera kollision mellan spelare och en plattform
runmysteriet.scene.Game.prototype.checkPlatform = function(platform) {

    // Skapar lokal referens till spelaren
    var player = this.m_player;

    // Om ingen kollision sker mellan spelare och plattform
    if (!player.hitTestObject(platform)) {

        // Avslutar funktionen direkt
        return;
    }

    // enkel och stabil landing:
    // spelaren måste vara ovanför plattformen

    // Kontrollerar om spelarens y-position är ovanför plattformens y-position
    if (player.y < platform.y) {

        // Placerar spelaren ovanpå plattformen
        player.y = platform.y - player.height;

        // Sätter att spelaren står på marken
        this.m_isOnGround = true;
    }
};

//------------------------------------------------------------------------------
// DISPOSE
//------------------------------------------------------------------------------

// Funktion som körs när scenen tas bort
runmysteriet.scene.Game.prototype.dispose = function() {

    // Anropar basklassens dispose-metod
    rune.scene.Scene.prototype.dispose.call(this);
};