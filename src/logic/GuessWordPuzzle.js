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

    this.m_revealedMap = [];

    // Sätt vilka positioner som är avslöjade baserat på insamlade bokstäver
    for (i = 0; i < this.m_word.length; i++) {
        this.m_revealedMap[i] = this.m_collectedMap[i] === true;
    }

    // Bygg lista över saknade index
    this.findMissingIndexes();
};

/**
 * Hittar vilka bokstäver som saknas.
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
 * Hämtar index för aktuell saknad bokstav.
 * @this {runmysteriet.logic.GuessWordPuzzle}
 * @return {number}
 */
runmysteriet.logic.GuessWordPuzzle.prototype.getCurrentMissingIndex = function() {

    if (!this.m_missingIndexes) {
        return -1;
    }

    if (this.m_currentMissingPointer >= this.m_missingIndexes.length) {
        return -1;
    }

    return this.m_missingIndexes[this.m_currentMissingPointer];
};

/**
 * Hämtar ordet.
 *
 * @return {string}
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
 * Hämtar collected map.
 *
 * @return {!Array<boolean>}
 */
runmysteriet.logic.GuessWordPuzzle.prototype.getCollectedMap = function() {

    return this.m_collectedMap;
};

/**
 * Hämtar alla saknade index.
 *
 * @return {!Array<number>}
 */
runmysteriet.logic.GuessWordPuzzle.prototype.getMissingIndexes = function() {

    return this.m_missingIndexes;
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

    var index = 0;
    var correctLetter = "";

    index = this.getCurrentMissingIndex();

    if (index === -1) {
        return false;
    }

    // Säkerställ alltid jämför lowercase-strängar
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

    if (!this.m_missingIndexes) {
        return true;
    }

    return this.m_currentMissingPointer >= this.m_missingIndexes.length;
};

/**
 * Rensar GuessWordPuzzle.
 *
 * @return {void}
 */
runmysteriet.logic.GuessWordPuzzle.prototype.dispose = function() {

    this.m_guessData = null;

    this.m_word = "";

    this.m_collectedMap = [];
    this.m_revealedMap = [];
    this.m_missingIndexes = [];

    this.m_currentMissingPointer = 0;
};