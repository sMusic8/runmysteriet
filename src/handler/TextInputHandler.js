runmysteriet.ui.TextInputHandler = function(application) {

    this.input = new runmysteriet.ui.TextInput(application);

    this.words = ["", ""];
    this.currentIndex = 0;
};

runmysteriet.ui.TextInputHandler.prototype.update = function(keyboard) {

    var data = this.input.update(keyboard);

    if (!data) return data;

    // ➡️ SPACE = byt till ord 2
    if (data.space) {
        this.currentIndex = 1;
        console.log("➡️ byter till WORD2");
        return data;
    }

    // ➕ välj bokstav
    if (data.choose) {
        this.words[this.currentIndex] += data.letter;

        console.log("WORD1:", this.words[0], "WORD2:", this.words[1]);
    }

    // ➖ backspace
    if (data.back) {
        this.words[this.currentIndex] =
            this.words[this.currentIndex].slice(0, -1);
    }

    return data;
};

runmysteriet.ui.TextInputHandler.prototype.getWord = function() {
    return this.words.join(" ");
};

runmysteriet.ui.TextInputHandler.prototype.getWords = function() {
    return this.words;
};