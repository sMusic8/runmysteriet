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
 * Alphabet selector som kan bläddra fram och tillbaka i en lista av bokstäver.
 * @constructor
 * @struct
 */
runmysteriet.logic.GuessAlphabetSelector = function() {

    /**
     * Nuvarande index i bokstavslistan.
     * @type {number}
     */
    this.m_index = 0;

    /**
     * Lista med bokstäver som kan väljas.
     * @type {!Array<string>}
     */
    this.m_letters = [];
};

/**
 * Går till nästa bokstav i listan.
 * Om slutet nås, börjar den om från början.
 *
 * @this {runmysteriet.logic.GuessAlphabetSelector}
 * @return {void}
 */
runmysteriet.logic.GuessAlphabetSelector.prototype.next = function() {

    this.m_index++;

    // Om vi passerat sista index, börja om från början
    if (this.m_index >= this.m_letters.length) {
        this.m_index = 0;
    }
};

/**
 * Går till föregående bokstav i listan.
 * Om det går under 0, hoppar vi till sista index.
 *
 * @this {runmysteriet.logic.GuessAlphabetSelector}
 * @return {void}
 */
runmysteriet.logic.GuessAlphabetSelector.prototype.previous = function() {

    this.m_index--;

    // Om index blir negativt, hoppa till sista elementet
    if (this.m_index < 0) {
        this.m_index = this.m_letters.length - 1;
    }
};
/**
 * Returnerar den aktuella bokstaven baserat på nuvarande index.
 *
 * @this {runmysteriet.logic.GuessAlphabetSelector}
 * @return {string} Den valda bokstaven.
 */
runmysteriet.logic.GuessAlphabetSelector.prototype.getLetter = function() {
    return this.m_letters[this.m_index];
};

/**
 * Återställer väljaren till första bokstaven i listan.
 *
 * @this {runmysteriet.logic.GuessAlphabetSelector}
 * @return {void}
 */
runmysteriet.logic.GuessAlphabetSelector.prototype.reset = function() {
    this.m_index = 0;
};