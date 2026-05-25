/**
 * Credits scene.
 *
 * @constructor
 * @extends rune.scene.Scene
 */
runmysteriet.scene.Credits = function () {
  rune.scene.Scene.call(this);

  this.m_background = null;
  this.m_title = null;
  this.m_back = null;
  this.m_subText = null;
  this.m_backText = null;

  this.backgroundMusic = null;
  this.menuSound = null;
};


runmysteriet.scene.Credits.prototype = Object.create(
  rune.scene.Scene.prototype
);
runmysteriet.scene.Credits.prototype.constructor = runmysteriet.scene.Credits;
/**
 * Initierar Credits-scenen.
 * Sätter upp bakgrundsmusik, volymhantering och UI-element som bakgrund och titel.
 */
runmysteriet.scene.Credits.prototype.init = function () {
  // Anropa parent-scenen för att säkerställa korrekt initialisering
  rune.scene.Scene.prototype.init.call(this);

  // Hämta ljudresurser från applikationen
  this.backgroundMusic = this.application.sounds.sound.get("sound_musicMenu");
  this.menuSound = this.application.sounds.sound.get("sound_menu");

  // Skapa och koppla en volymhanterare till bakgrundsmusiken
  this.m_volumeHandler = new runmysteriet.handler.VolumeHandler(null);
  this.m_volumeHandler.setAudio(this.backgroundMusic);

  // Om bakgrundsmusik finns, konfigurera och spela upp den
  if (this.backgroundMusic) {
    this.backgroundMusic.loop = true;   // Loopa musiken
    this.backgroundMusic.volume = 0.5;   // Sätt volymnivå
    this.backgroundMusic.play();         // Starta uppspelning
  }

  // Initiera visuella komponenter i scenen
  this.m_initBackground();
  this.m_initTitle();
};

/**
 * Uppdaterar Credits-scenen varje frame.
 *
 * Hanterar volymkontroll via VolumeHandler och lyssnar efter input
 * för att gå tillbaka till menyn.
 *
 * @param {number} step - Tidssteg för uppdateringen (delta time).
 */
runmysteriet.scene.Credits.prototype.update = function (step) {

  // Kör parent-scenens update-logik
  rune.scene.Scene.prototype.update.call(this, step);

  // Hämta input-enheter
  var gamepad = this.gamepads.get(0);
  var keyboard = this.keyboard;

  // Uppdatera volymhanteraren om den finns
  if (this.m_volumeHandler) {
    this.m_volumeHandler.update(null, gamepad, keyboard);
  }

  // Kontrollera om användaren vill lämna credits-scenen
  if (
    (keyboard && keyboard.justPressed("ENTER")) ||
    (keyboard && keyboard.justPressed("SPACE")) ||
    (keyboard && keyboard.justPressed("ESCAPE")) ||
    (gamepad && (gamepad.justPressed(9) || gamepad.justPressed(0)))
  ) {
    // Ladda menyn-scenen
    this.application.scenes.load([
      new runmysteriet.scene.Menu()
    ]);
  }
};
/**
 * Stänger ner Credits-scenen och rensar referenser.
 * Säkerställer att minne frigörs och att parent dispose körs.
 */
runmysteriet.scene.Credits.prototype.dispose = function () {

  // Nollställ grafiska och textrelaterade objekt för att frigöra referenser
  this.m_background = null;
  this.m_title = null;
  this.m_back = null;
  this.m_subText = null;
  this.m_backText = null;

  // Kör parent-scenens cleanup-logik
  rune.scene.Scene.prototype.dispose.call(this);
};

/**
 * Initierar bakgrunden i Credits-scenen.
 * Skapar en grafisk sprite som täcker hela skärmen och lägger till den i scenen.
 */
runmysteriet.scene.Credits.prototype.m_initBackground = function () {

  // Skapa bakgrundsgrafik som fyller hela skärmen
  this.m_background = new rune.display.Graphic(
    0,
    0,
    this.application.screen.width,
    this.application.screen.height,
    "background_menu"
  );

  // Lägg till bakgrunden i scenens display-lista
  this.stage.addChild(this.m_background);
};
/**
 * Initierar titel- och textinnehåll i Credits-scenen.
 */
runmysteriet.scene.Credits.prototype.m_initTitle = function () {

  // Hämta skärmens centrum för att centrera texten
  var center = this.application.screen.center;

  // Skapa huvudtiteltexten i credits
  this.m_title = new rune.text.BitmapField(
    "This game was created by\n" +
      "Frida Bergstrom and Sabina Music\n" +
      "as part of Project Course 2\n" +
      "in media technology."
  );

  // Anpassa storlek automatiskt efter innehåll
  this.m_title.autoSize = true;

  // Lägg till i scenen
  this.stage.addChild(this.m_title);

  // Centrera titeln horisontellt och placera den något ovanför mitten
  this.m_title.x = center.x - this.m_title.width / 2;
  this.m_title.y = center.y - this.m_title.height / 2 - 40;

  // Skapa text med instruktioner för att gå tillbaka
  this.m_back = new rune.text.BitmapField(
    "< BACK\nPress ENTER / SPACE / ESC\nGamepad: START or X"
  );

  // Anpassa storlek automatiskt
  this.m_back.autoSize = true;

  // Lägg till instruktionstext i scenen
  this.stage.addChild(this.m_back);

  // Centrera instruktionstexten horisontellt och placera den under titeln
  this.m_back.x = center.x - this.m_back.width / 2;
  this.m_back.y = center.y + 60;
};