//------------------------------------------------------------------------------
// GUESS WORD PUZZLE
//------------------------------------------------------------------------------
/**
 * Hanterar ordlogiken i GuessWord.
 *
 * @constructor
 * @param {?Object} guessData
 */
runmysteriet.logic.GuessWordPuzzle = function(guessData) {

    this.m_guessData = guessData || {
        word: "button",
        Subword: ["Start", "Needle"],
        collectedMap: [],
        hiddenIndex: -1
    };

    this.m_word = String(this.m_guessData.word || "button").toLowerCase();
    this.m_collectedMap = this.m_guessData.collectedMap || [];

    this.m_revealedMap = [];
    this.m_missingIndexes = [];
    this.m_currentMissingPointer = 0;

    this.init();
};
/**
 * Initierar och bygger upp vilka bokstäver som är synliga.
 *
 * @this {runmysteriet.logic.GuessWordPuzzle}
 * @return {void}
 */
runmysteriet.logic.GuessWordPuzzle.prototype.init = function() {
    var i = 0;

    // Sätt vilka positioner som är avslöjade baserat på insamlade bokstäver
    for (i = 0; i < this.m_word.length; i++) {
        this.m_revealedMap[i] = this.m_collectedMap[i] === true;
    }

    // Bygg lista över saknade index
    this.findMissingIndexes();
};

/**
 * Hittar alla index i ordet som ännu inte är avslöjade.
 * Sparar dem i en lista för enkel navigering.
 *
 * @this {runmysteriet.logic.GuessWordPuzzle}
 * @return {void}
 */
runmysteriet.logic.GuessWordPuzzle.prototype.findMissingIndexes = function() {
    var i = 0;

    this.m_missingIndexes = [];

    for (i = 0; i < this.m_word.length; i++) {
        if (this.m_revealedMap[i] !== true) {
            this.m_missingIndexes.push(i);
        }
    }

    // Reset av pekare till första saknade position
    this.m_currentMissingPointer = 0;
};
/**
 * Returnerar hela ordet.
 *
 * @this {runmysteriet.logic.GuessWordPuzzle}
 * @return {string} Ordet.
 */
runmysteriet.logic.GuessWordPuzzle.prototype.getWord = function() {
    return this.m_word;
};

/**
 * Returnerar och visar vilka bokstäver som är avslöjade.
 *
 * @this {runmysteriet.logic.GuessWordPuzzle}
 * @return {!Array<boolean>} Lista med avslöjade positioner.
 */
runmysteriet.logic.GuessWordPuzzle.prototype.getRevealedMap = function() {
    return this.m_revealedMap;
};

/**
 * Returnerar aktuellt index i ordet som saknar bokstav.
 * Om inga fler saknas returneras -1.
 *
 * @this {runmysteriet.logic.GuessWordPuzzle}
 * @return {number} Index för saknad bokstav, eller -1 om inga finns kvar.
 */
runmysteriet.logic.GuessWordPuzzle.prototype.getCurrentMissingIndex = function() {

    // Kontrollera om vi gått utanför listan med saknade index
    if (this.m_currentMissingPointer >= this.m_missingIndexes.length) {
        return -1;
    }

    return this.m_missingIndexes[this.m_currentMissingPointer];
};
/**
 * Kontrollerar om en given bokstav matchar nästa saknade position i ordet.
 * Om korrekt bokstav anges markeras positionen som avslöjad och pekaren flyttas framåt.
 *
 * @this {runmysteriet.logic.GuessWordPuzzle}
 * @param {string} letter Bokstaven som ska kontrolleras.
 * @return {boolean} true om bokstaven är korrekt, annars false.
 */
runmysteriet.logic.GuessWordPuzzle.prototype.checkLetter = function(letter) {
    var index = this.getCurrentMissingIndex();
    var correctLetter = "";

    // Om inga fler saknade index finns
    if (index === -1) {
        return false;
    }

    // Säkerställ att vi alltid jämför lowercase-strängar
    letter = String(letter || "").toLowerCase();
    correctLetter = this.m_word.charAt(index).toLowerCase();

    // Kontrollera om bokstaven matchar rätt position
    if (letter === correctLetter) {
        this.m_revealedMap[index] = true;
        this.m_currentMissingPointer++;
        return true;
    }

    return false;
};

/**
 * Kontrollerar om hela ordet är färdiggissat.
 *
 * @this {runmysteriet.logic.GuessWordPuzzle}
 * @return {boolean} true om alla bokstäver är avslöjade, annars false.
 */
runmysteriet.logic.GuessWordPuzzle.prototype.isComplete = function() {
    return this.m_currentMissingPointer >= this.m_missingIndexes.length;
};