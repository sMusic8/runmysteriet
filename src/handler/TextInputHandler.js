var runmysteriet = runmysteriet || {};
runmysteriet.ui = runmysteriet.ui || {};

runmysteriet.ui.TextInputHandler = function(application) {

    this.input = new runmysteriet.ui.TextInput(application);

    this.word = [];
};

runmysteriet.ui.TextInputHandler.prototype.update = function(keyboard) {

    var data = this.input.update(keyboard);

    if (!data) return data;

    // ➕ lägg till bokstav
    if (data.choose) {
        this.word.push(data.letter);
        console.log("WORD:", this.word.join(""));
    }

    // ➖ ta bort bokstav
    if (data.back) {
        this.word.pop();
        console.log("WORD:", this.word.join(""));
    }

    return data;
};

runmysteriet.ui.TextInputHandler.prototype.getWord = function() {
    return this.word.join("");
};