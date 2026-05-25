//------------------------------------------------------------------------------
// NAME INPUT
//------------------------------------------------------------------------------

/**
 * Hanterar ett nickname med fast antal bokstäver.
 *
 * @constructor
 * @param {number=} maxLength
 */
runmysteriet.logic.NameInput = function(maxLength) {

    /** @type {!runmysteriet.logic.GuessAlphabetSelector} */
    this.m_selector = new runmysteriet.logic.GuessAlphabetSelector();

    /** @type {string} */
    this.m_name = "";

    /** @type {number} */
    this.m_maxLength = maxLength || 4;
};

runmysteriet.logic.NameInput.prototype.nextLetter = function() {
    this.m_selector.next();
};

runmysteriet.logic.NameInput.prototype.previousLetter = function() {
    this.m_selector.previous();
};

runmysteriet.logic.NameInput.prototype.getSelectedLetter = function() {
    return this.m_selector.getLetter();
};

runmysteriet.logic.NameInput.prototype.addSelectedLetter = function() {

    if (this.m_name.length >= this.m_maxLength) {
        return;
    }

    this.m_name += this.getSelectedLetter();
};

runmysteriet.logic.NameInput.prototype.removeLastLetter = function() {

    if (this.m_name.length <= 0) {
        return;
    }

    this.m_name = this.m_name.slice(0, -1);
};

/**
 * Namnet exakt som spelaren har skrivit det, utan PLAYER-standard.
 *
 * @return {string}
 */
runmysteriet.logic.NameInput.prototype.getRawName = function() {
    return this.m_name.toUpperCase();
};

/**
 * Antal bokstäver som är skrivna.
 *
 * @return {number}
 */
runmysteriet.logic.NameInput.prototype.getLength = function() {
    return this.m_name.length;
};

/**
 * Kollar om namnet är färdigt.
 *
 * @return {boolean}
 */
runmysteriet.logic.NameInput.prototype.isComplete = function() {
    return this.m_name.length >= this.m_maxLength;
};

/**
 * Namnet som ska sparas.
 *
 * @return {string}
 */
runmysteriet.logic.NameInput.prototype.getName = function() {

    if (this.m_name.length <= 0) {
        return "PLAYER";
    }

    return this.m_name.toUpperCase();
};