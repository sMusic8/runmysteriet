//------------------------------------------------------------------------------
// NAME INPUT
//------------------------------------------------------------------------------

/**
 * Hanterar spelarens namn.
 *
 * @constructor
 */

//------------------------------------------------------------------------------
// NAME INPUT
//------------------------------------------------------------------------------

runmysteriet.logic.NameInput = function(maxLength) {
    this.m_selector = new runmysteriet.logic.GuessAlphabetSelector();
    this.m_name = "";
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

runmysteriet.logic.NameInput.prototype.getName = function() {

    if (this.m_name.length <= 0) {
        return "PLAYER";
    }

    return this.m_name.toUpperCase();
};