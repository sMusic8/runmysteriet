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

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

/**
 * Initierar revealedMap och missingIndexes.
 *
 * @return {void}
 */
runmysteriet.logic.GuessWordPuzzle.prototype.init = function() {

    var i = 0;

    this.m_revealedMap = [];

    for (i = 0; i < this.m_word.length; i++) {
        this.m_revealedMap[i] = this.m_collectedMap[i] === true;
    }

    this.findMissingIndexes();
};

//------------------------------------------------------------------------------
// MISSING LETTERS
//------------------------------------------------------------------------------

/**
 * Hittar vilka bokstäver som saknas.
 *
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

    this.m_currentMissingPointer = 0;
};

/**
 * Hämtar index för aktuell saknad bokstav.
 *
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

//------------------------------------------------------------------------------
// GETTERS
//------------------------------------------------------------------------------

/**
 * Hämtar ordet.
 *
 * @return {string}
 */
runmysteriet.logic.GuessWordPuzzle.prototype.getWord = function() {

    return this.m_word;
};

/**
 * Hämtar revealed map.
 *
 * @return {!Array<boolean>}
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

//------------------------------------------------------------------------------
// CHECK LETTER
//------------------------------------------------------------------------------

/**
 * Kontrollerar om vald bokstav är rätt.
 *
 * @param {string} letter
 * @return {boolean}
 */
runmysteriet.logic.GuessWordPuzzle.prototype.checkLetter = function(letter) {

    var index = 0;
    var correctLetter = "";

    index = this.getCurrentMissingIndex();

    if (index === -1) {
        return false;
    }

    letter = String(letter || "").toLowerCase();
    correctLetter = this.m_word.charAt(index).toLowerCase();

    if (letter === correctLetter) {
        this.m_revealedMap[index] = true;
        this.m_currentMissingPointer++;

        return true;
    }

    return false;
};

//------------------------------------------------------------------------------
// COMPLETE
//------------------------------------------------------------------------------

/**
 * Kollar om hela ordet är klart.
 *
 * @return {boolean}
 */
runmysteriet.logic.GuessWordPuzzle.prototype.isComplete = function() {

    if (!this.m_missingIndexes) {
        return true;
    }

    return this.m_currentMissingPointer >= this.m_missingIndexes.length;
};

//------------------------------------------------------------------------------
// DISPOSE
//------------------------------------------------------------------------------

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