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

//------------------------------------------------------------------------------
// PUBLIC METHODS
//------------------------------------------------------------------------------

/**
 * Går till nästa bokstav.
 *
 * @return {void}
 */
runmysteriet.logic.GuessAlphabetSelector.prototype.next = function() {

    this.m_index++;

    if (this.m_index >= this.m_letters.length) {
        this.m_index = 0;
    }
};

/**
 * Går till föregående bokstav.
 *
 * @return {void}
 */
runmysteriet.logic.GuessAlphabetSelector.prototype.previous = function() {

    this.m_index--;

    if (this.m_index < 0) {
        this.m_index = this.m_letters.length - 1;
    }
};

/**
 * Hämtar aktuell bokstav.
 *
 * @return {string}
 */
runmysteriet.logic.GuessAlphabetSelector.prototype.getLetter = function() {

    if (!this.m_letters || this.m_letters.length === 0) {
        return "";
    }

    return this.m_letters[this.m_index];
};

/**
 * Återställer valet till första bokstaven.
 *
 * @return {void}
 */
runmysteriet.logic.GuessAlphabetSelector.prototype.reset = function() {

    this.m_index = 0;
};

//------------------------------------------------------------------------------
// DISPOSE
//------------------------------------------------------------------------------

/**
 * Rensar GuessAlphabetSelector.
 *
 * @return {void}
 */
runmysteriet.logic.GuessAlphabetSelector.prototype.dispose = function() {

    this.m_letters = [];
    this.m_index = 0;
};