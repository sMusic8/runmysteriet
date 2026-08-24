//------------------------------------------------------------------------------
// GUESS ALPHABET SELECTOR
//------------------------------------------------------------------------------

/**
 * Hanterar val av bokstav i GuessWord-scenen.
 *
 * @constructor
 */
runmysteriet.logic.GuessAlphabetSelector = function() {

    /**
     * Alla bokstäver spelaren kan välja mellan.
     *
     * @type {!Array<string>}
     */
    this.m_letters = [
        "a", "b", "c", "d", "e", "f", "g",
        "h", "i", "j", "k", "l", "m", "n",
        "o", "p", "q", "r", "s", "t", "u",
        "v", "w", "x", "y", "z"
    ];

    /**
     * Nuvarande vald bokstav.
     *
     * @type {number}
     */
    this.m_index = 0;
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
 * Hämtar vald bokstav.
 *
 * @return {string}
 */
runmysteriet.logic.GuessAlphabetSelector.prototype.getLetter = function() {

    if (!this.m_letters || this.m_letters.length === 0) {
        return "a";
    }

    return this.m_letters[this.m_index];
};

/**
 * Återställer bokstavsväljaren till A.
 *
 * @return {void}
 */
runmysteriet.logic.GuessAlphabetSelector.prototype.reset = function() {

    this.m_index = 0;
};

/**
 * Rensar objektet.
 *
 * @return {void}
 */
runmysteriet.logic.GuessAlphabetSelector.prototype.dispose = function() {

    this.m_letters = [];
    this.m_index = 0;
};