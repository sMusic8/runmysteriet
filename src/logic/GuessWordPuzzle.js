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
 * @return {void}
 */
runmysteriet.logic.GuessWordPuzzle.prototype.init = function() {
    var i = 0;

    for (i = 0; i < this.m_word.length; i++) {
        this.m_revealedMap[i] = this.m_collectedMap[i] === true;
    }

    this.findMissingIndexes();
};

/**
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
 * @return {string}
 */
runmysteriet.logic.GuessWordPuzzle.prototype.getWord = function() {
    return this.m_word;
};

/**
 * @return {!Array<boolean>}
 */
runmysteriet.logic.GuessWordPuzzle.prototype.getRevealedMap = function() {
    return this.m_revealedMap;
};

/**
 * @return {number}
 */
runmysteriet.logic.GuessWordPuzzle.prototype.getCurrentMissingIndex = function() {

    if (this.m_currentMissingPointer >= this.m_missingIndexes.length) {
        return -1;
    }

    return this.m_missingIndexes[this.m_currentMissingPointer];
};

/**
 * @param {string} letter
 * @return {boolean}
 */
runmysteriet.logic.GuessWordPuzzle.prototype.checkLetter = function(letter) {
    var index = this.getCurrentMissingIndex();
    var correctLetter = "";

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

/**
 * @return {boolean}
 */
runmysteriet.logic.GuessWordPuzzle.prototype.isComplete = function() {
    return this.m_currentMissingPointer >= this.m_missingIndexes.length;
};
