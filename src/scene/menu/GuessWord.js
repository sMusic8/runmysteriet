var runmysteriet = runmysteriet || {};
runmysteriet.scene = runmysteriet.scene || {};

runmysteriet.scene.GuessWord = function(application, shieldHandler) {

    rune.scene.Scene.call(this);

    this.application = application;
    this.shieldHandler = shieldHandler;

    // Hämta data direkt från ShieldHandler
    this.m_word = shieldHandler.getWord(); // ← rätt ord direkt
    console.log("Kanelbullen", this.m_word)
    this.m_collected = shieldHandler ? shieldHandler.getCollectedRunes() : [];

    console.log("START WORD:", this.m_word);
    console.log("Collected array:", this.m_collected);

    this.textInput = new runmysteriet.ui.TextInput(application);
};

runmysteriet.scene.GuessWord.prototype = Object.create(rune.scene.Scene.prototype);
runmysteriet.scene.GuessWord.prototype.constructor = runmysteriet.scene.GuessWord;

//----------------------------------------------------
// INIT
//----------------------------------------------------

runmysteriet.scene.GuessWord.prototype.init = function() {

    console.log("GuessWord startad");

    if (!this.shieldHandler) {
        console.log("❌ Ingen shieldHandler");
        return;
    }

    this.m_word = this.shieldHandler.getRuneString();

    console.log("INIT WORD:", this.m_word);
    console.log("Collected runes:", this.shieldHandler.getCollectedRunes());
};

//----------------------------------------------------
// UPDATE
//----------------------------------------------------

runmysteriet.scene.GuessWord.prototype.update = function() {

    var keyboard = this.application.inputs.keyboard;
    var data = this.textInput.update(keyboard);

    // 🔄 Uppdatera om spelaren samlar fler runor (live sync)
    if (this.shieldHandler) {

        var current = this.shieldHandler.getRuneString();

        if (current !== this.m_word) {
            this.m_word = current;
            console.log("UPDATED WORD FROM GAME:", this.m_word);
        }
    }

    if (!data) return;

    // ➕ Lägg till bokstav
    if (data.choose) {
        this.m_word += data.letter;
        console.log("WORD:", this.m_word);
    }

    // ⬅️ Ta bort bokstav
    if (data.back) {
        this.m_word = this.m_word.slice(0, -1);
        console.log("WORD:", this.m_word);
    }

    // ✅ Bekräfta ord
    if (data.space) {
        console.log("FINAL WORD:", this.m_word);
    }
};