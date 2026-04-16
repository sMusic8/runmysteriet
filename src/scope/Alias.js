//------------------------------------------------------------------------------
// Global scope aliases
//------------------------------------------------------------------------------

/**
 * Exports the application to the global scope.
 */
if (typeof window !== "undefined") {
    if (typeof window.runmysteriet === "undefined") {
        window.runmysteriet = runmysteriet;
    }
}

/**
 * Install the application to Rune OS. If the application is executed within 
 * Rune OS.
 */
if (typeof window !== "undefined" && typeof window.runeos === "object") {
    window.runeos.install(runmysteriet);
}