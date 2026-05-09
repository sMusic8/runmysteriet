//------------------------------------------------------------------------------
// GUESS ALPHABET SELECTOR
//------------------------------------------------------------------------------
/**
 * Håller koll på vilken bokstav spelaren valt.
 *
 * @constructor
 */
runmysteriet.logic.GuessAlphabetSelector = function() {

    this.m_letters = [
        "a", "b", "c", "d", "e", "f", "g",
        "h", "i", "j", "k", "l", "m", "n",
        "o", "p", "q", "r", "s", "t",
        "u", "v", "w", "x", "y", "z"
    ];

    this.m_index = 0;
};

/**
 * @return {void}
 */
runmysteriet.logic.GuessAlphabetSelector.prototype.next = function() {

    this.m_index++;

    if (this.m_index >= this.m_letters.length) {
        this.m_index = 0;
    }
};

/**
 * @return {void}
 */
runmysteriet.logic.GuessAlphabetSelector.prototype.previous = function() {

    this.m_index--;

    if (this.m_index < 0) {
        this.m_index = this.m_letters.length - 1;
    }
};

/**
 * @return {string}
 */
runmysteriet.logic.GuessAlphabetSelector.prototype.getLetter = function() {
    return this.m_letters[this.m_index];
};

/**
 * @return {void}
 */
runmysteriet.logic.GuessAlphabetSelector.prototype.reset = function() {
    this.m_index = 0;
};