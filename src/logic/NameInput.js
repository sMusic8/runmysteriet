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

/**
 * Går till nästa bokstav i alfabetväljaren.
 *
 * @this {runmysteriet.logic.NameInput}
 * @return {void}
 */
runmysteriet.logic.NameInput.prototype.nextLetter = function() {
    this.m_selector.next();
};

/**
 * Går till föregående bokstav i alfabetväljaren.
 *
 * @this {runmysteriet.logic.NameInput}
 * @return {void}
 */
runmysteriet.logic.NameInput.prototype.previousLetter = function() {
    this.m_selector.previous();
};

/**
 * Returnerar den aktuellt valda bokstaven från alfabetväljaren.
 *
 * @this {runmysteriet.logic.NameInput}
 * @return {string} Den valda bokstaven.
 */
runmysteriet.logic.NameInput.prototype.getSelectedLetter = function() {
    return this.m_selector.getLetter();
};
/**
 * Lägger till den aktuellt valda bokstaven i namnet.
 * Gör inget om maxlängden redan är uppnådd.
 *
 * @this {runmysteriet.logic.NameInput}
 * @return {void}
 */
runmysteriet.logic.NameInput.prototype.addSelectedLetter = function() {

    // Kontrollera att vi inte överskrider maxlängden
    if (this.m_name.length >= this.m_maxLength) {
        return;
    }

    this.m_name += this.getSelectedLetter();
};

/**
 * Tar bort den sista bokstaven i namnet.
 *
 * @this {runmysteriet.logic.NameInput}
 * @return {void}
 */
runmysteriet.logic.NameInput.prototype.removeLastLetter = function() {

    // Kontrollera att det finns något att ta bort
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