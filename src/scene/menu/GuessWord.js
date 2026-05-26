//------------------------------------------------------------------------------
// GUESS WORD SCENE
//------------------------------------------------------------------------------

/**
 * Scene där spelaren ska gissa den saknade bokstaven i ordet.
 *
 * @constructor
 * @extends {rune.scene.Scene}
 * @param {number=} levelNumber
 * @param {number=} earnedScore
 * @param {number=} totalScore
 * @param {Object|string=} wordData
 * @param {?Object=} avatarData
 */
runmysteriet.scene.GuessWord = function(
    levelNumber,
    earnedScore,
    totalScore,
    wordData,
    avatarData
) {

    rune.scene.Scene.call(this);

    this.m_gameInput = null;

    this.m_levelNumber = levelNumber || 1;
    this.m_earnedScore = earnedScore || 0;
    this.m_totalScore = totalScore || 0;

    if (avatarData && typeof avatarData === "object") {
        this.m_avatarData = avatarData;
    } else {
        this.m_avatarData = null;
    }

    this.m_highscoreManager = null;
    this.m_highscoreSound = null;
    this.m_highscoreText = null;
    this.m_highscoreTimer = 0;
    this.m_highscoreNotified = false;

    this.m_scoreBeforeLevel = this.m_totalScore - this.m_earnedScore;

    if (this.m_scoreBeforeLevel < 0) {
        this.m_scoreBeforeLevel = 0;
    }

    if (typeof wordData === "string") {
        wordData = {
            word: wordData,
            Subword: []
        };
    }

    this.m_wordData = wordData || {
        word: "Button",
        Subword: ["Start", "Needle"]
    };

    this.m_word = String(this.m_wordData.word || "Button").toLowerCase();
    this.m_hints = this.m_wordData.Subword || [];

    this.m_puzzle = null;
    this.m_alphabetSelector = null;
    this.m_letterBoxes = [];

    this.m_titleText = null;
    this.m_letterText = null;
    this.m_hintText = null;
    this.m_scoreText = null;
    this.m_messageText = null;
    this.m_correctWordText = null;

    this.m_failedGuess = false;
    this.m_answeredCorrect = false;

    this.m_currentHintIndex = 0;
    this.m_hintCost = 20;
    this.m_wrongGuessPenalty = 10;
    this.m_wrongGuesses = 0;
    this.m_maxWrongGuesses = 3;

    this.backgroundMusic = null;
    this.menuSound = null;
};

runmysteriet.scene.GuessWord.prototype = Object.create(rune.scene.Scene.prototype);
runmysteriet.scene.GuessWord.prototype.constructor = runmysteriet.scene.GuessWord;
/**
 * Initierar GuessWord-scenen och sätter upp ljud, logik och UI-komponenter.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.init = function() {

    rune.scene.Scene.prototype.init.call(this);

    /**
     * Bakgrundsmusik för scenen.
     * @type {Object}
     */
    this.backgroundMusic = this.application.sounds.sound.get("sound_musicMenu");

    /**
     * Meny-ljud som används vid interaktion.
     * @type {Object}
     */
    this.menuSound = this.application.sounds.sound.get("sound_menu");

    if (this.backgroundMusic) {
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.3;
        this.backgroundMusic.play();
    }

    /**
     * Hanterar highscore-logik.
     * @type {runmysteriet.logic.HighscoreManager}
     */
    this.m_highscoreManager =
        new runmysteriet.logic.HighscoreManager(this.application);

    /**
     * Ljud som spelas vid highscore-händelser.
     * @type {Object}
     */
    this.m_highscoreSound =
        this.application.sounds.sound.get("sound_highscore");

    /**
     * Inputhantering för spelaren.
     * @type {runmysteriet.input.GameInput}
     */
    this.m_gameInput = new runmysteriet.input.GameInput(this.application);

    /**
     * Pussellogik för gissningsspelet.
     * @type {runmysteriet.logic.GuessWordPuzzle}
     */
    this.m_puzzle = new runmysteriet.logic.GuessWordPuzzle(this.m_wordData);

    /**
     * Hanterar val av bokstäver i alfabetet.
     * @type {runmysteriet.logic.GuessAlphabetSelector}
     */
    this.m_alphabetSelector = new runmysteriet.logic.GuessAlphabetSelector();

    this.createText();
    this.createLetterBoxes();
    this.updateLetterBoxes();

    this.createHighscoreNotice();
    this.checkHighscoreNotice(this.m_totalScore);
};
/**
 * Skapar all textbaserad UI för GuessWord-scenen.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.createText = function() {

    /**
     * Titeltext för scenen.
     * @type {rune.text.BitmapField}
     */
    this.m_titleText = new rune.text.BitmapField("GUESS MISSING LETTERS");
    this.m_titleText.autoSize = true;
    this.m_titleText.center = this.application.screen.center;
    this.m_titleText.y -= 85;
    this.stage.addChild(this.m_titleText);

    /**
     * Visar aktuell vald bokstav.
     * @type {rune.text.BitmapField}
     */
    this.m_letterText = new rune.text.BitmapField("LETTER: A");
    this.m_letterText.autoSize = true;
    this.m_letterText.center = this.application.screen.center;
    this.m_letterText.y += 10;
    this.stage.addChild(this.m_letterText);

    /**
     * Hint-text som informerar om hjälp-funktion.
     * @type {rune.text.BitmapField}
     */
    this.m_hintText = new rune.text.BitmapField(
        "HINT: PRESS T / TRIANGLE, COSTS 20 POINTS"
    );

    this.m_hintText.autoSize = true;
    this.m_hintText.center = this.application.screen.center;
    this.m_hintText.y += 40;
    this.m_hintText.scale = 0.8;
    this.stage.addChild(this.m_hintText);

    /**
     * Visar spelarens nuvarande poäng.
     * @type {rune.text.BitmapField}
     */
    this.m_scoreText = new rune.text.BitmapField(
        "SCORE: " + this.m_totalScore
    );

    this.m_scoreText.autoSize = true;
    this.m_scoreText.center = this.application.screen.center;
    this.m_scoreText.y += 65;
    this.m_scoreText.scale = 0.8;
    this.stage.addChild(this.m_scoreText);

    /**
     * Instruktionstext för kontroller och antal försök.
     * @type {rune.text.BitmapField}
     */
    this.m_messageText = new rune.text.BitmapField(
        "TRIES LEFT 3   UP/DOWN = LETTER, ENTER/CROSS = GUESS"
    );

    this.m_messageText.autoSize = true;
    this.m_messageText.center = this.application.screen.center;
    this.m_messageText.y += 90;
    this.m_messageText.scale = 0.7;
    this.stage.addChild(this.m_messageText);
};
/**
 * Skapar visuella bokstavsrutor för det hemliga ordet.
 *
 * Räknar ut centrering baserat på ordets längd och placerar
 * varje bokstavsbox horisontellt med jämnt mellanrum.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.createLetterBoxes = function() {

    /**
     * Det hemliga ordet som ska gissas.
     * @type {string}
     */
    var word = this.m_puzzle.getWord();

    /**
     * Bredd på varje bokstavsruta.
     * @type {number}
     */
    var boxWidth = 28;

    /**
     * Mellanrum mellan bokstavsrutor.
     * @type {number}
     */
    var spacing = 10;

    /**
     * Total bredd för hela ordet inklusive mellanrum.
     * @type {number}
     */
    var totalWidth = word.length * boxWidth + (word.length - 1) * spacing;

    /**
     * Startposition X för centrering av bokstavsrutor.
     * @type {number}
     */
    var startX = this.application.screen.center.x - Math.floor(totalWidth / 2);

    /**
     * Y-position för alla bokstavsrutor.
     * @type {number}
     */
    var y = this.application.screen.center.y - 35;

    var i = 0;

    /**
     * Temporärt bokstavsbox-objekt som skapas i loopen.
     * @type {?runmysteriet.logic.GuessLetterBox}
     */
    var box = null;

    /**
     * Array som innehåller alla skapade bokstavsrutor.
     * @type {Array.<runmysteriet.logic.GuessLetterBox>}
     */
    this.m_letterBoxes = [];

    for (i = 0; i < word.length; i++) {
        box = new runmysteriet.logic.GuessLetterBox(
            startX + i * (boxWidth + spacing),
            y,
            i
        );

        box.create(this.stage);

        this.m_letterBoxes.push(box);
    }
};
/**
 * Uppdaterar alla bokstavsboxar baserat på spelstatus.
 * Visar rätt bokstav, vald bokstav eller tom ruta beroende på läge.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.updateLetterBoxes = function() {

    /**
     * Det hemliga ordet som spelas.
     * @type {string}
     */
    var word = this.m_puzzle.getWord();

    /**
     * Karta över redan avslöjade bokstäver.
     * @type {Array.<boolean>}
     */
    var revealedMap = this.m_puzzle.getRevealedMap();

    /**
     * Index för aktuell bokstav som ska gissas.
     * @type {number}
     */
    var currentIndex = this.m_puzzle.getCurrentMissingIndex();

    /**
     * Bokstav som spelaren just nu har valt.
     * @type {string}
     */
    var selectedLetter = this.m_alphabetSelector.getLetter();

    var i = 0;

    for (i = 0; i < word.length; i++) {
        if (revealedMap[i] === true) {
            this.m_letterBoxes[i].setLetter(word.charAt(i));
            this.m_letterBoxes[i].setActive(false);

        } else if (i === currentIndex) {
            this.m_letterBoxes[i].setPreviewLetter(selectedLetter);
            this.m_letterBoxes[i].setActive(true);

        } else {
            this.m_letterBoxes[i].clear();
            this.m_letterBoxes[i].setActive(false);
        }
    }

    if (this.m_letterText) {
        this.m_letterText.text = "LETTER: " + selectedLetter.toUpperCase();
    }
};

/**
 * Uppdaterar GuessWord-scenen varje frame.
 * Hanterar input, spelstatus, navigation och spel-logik.
 *
 * @param {number} step Tidssteg (delta time) för uppdatering.
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.update = function(step) {

    /**
     * Inläst input från spelaren.
     * @type {?Object}
     */
    var input = null;

    rune.scene.Scene.prototype.update.call(this, step);

    if (!this.m_gameInput) {
        return;
    }

    input = this.m_gameInput.read(this.keyboard);

    this.updateVolumeInput(input);
    this.updateHighscoreNotice();

    if (this.m_answeredCorrect === true) {
        if (this.isConfirmPressed(input)) {
            this.goToLevelComplete();
        }

        return;
    }

    if (this.m_failedGuess === true) {
        if (this.isConfirmPressed(input)) {
            this.goToGameOver();
        }

        return;
    }

    if (!this.m_alphabetSelector || !this.m_puzzle) {
        return;
    }

    if (input.hint) {
        this.buyHint();
        return;
    }

    if (input.up) {
        this.m_alphabetSelector.previous();
        this.updateLetterBoxes();
        return;
    }

    if (input.down) {
        this.m_alphabetSelector.next();
        this.updateLetterBoxes();
        return;
    }

    if (input.choose) {
        this.checkAnswer(this.m_alphabetSelector.getLetter());
    }
};
/**
 * Hanterar volyminmatning för bakgrundsmusiken i scenen.
 *
 * @param {?Object} input Inläst spelarinput.
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.updateVolumeInput = function(input) {

    /**
     * Stegstorlek för volymändring.
     * @type {number}
     */
    var stepVol = 0.1;

    if (!input || !this.backgroundMusic) {
        return;
    }

    if (input.volumeUp === true) {
        this.backgroundMusic.volume += stepVol;

        if (this.backgroundMusic.volume > 1) {
            this.backgroundMusic.volume = 0;
        }

        return;
    }

    if (input.volumeDown === true) {
        this.backgroundMusic.volume -= stepVol;

        if (this.backgroundMusic.volume < 0) {
            this.backgroundMusic.volume = 1;
        }
    }
};
/**
 * Köper och visar en ledtråd (hint) i GuessWord-scenen.
 * Drar poäng från spelaren och uppdaterar UI samt highscore-status.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.buyHint = function() {

    /**
     * Aktuell ledtråd som hämtas från listan.
     * @type {?string}
     */
    var hint = null;

    if (this.m_currentHintIndex >= this.m_hints.length) {
        this.updateMessageText("NO MORE HINTS");
        return;
    }

    if (this.m_earnedScore < this.m_hintCost) {
        this.updateMessageText("NOT ENOUGH POINTS FOR HINT");
        return;
    }

    this.m_earnedScore -= this.m_hintCost;

    if (this.m_earnedScore < 0) {
        this.m_earnedScore = 0;
    }

    this.m_totalScore = this.m_scoreBeforeLevel + this.m_earnedScore;

    hint = this.m_hints[this.m_currentHintIndex];
    this.m_currentHintIndex++;

    if (this.m_hintText) {
        this.m_hintText.text =
            "HINT " +
            this.m_currentHintIndex +
            ": " +
            String(hint).toUpperCase();
    }

    this.updateScoreText();
    this.updateMessageText("HINT COST 20 POINTS");
    this.checkHighscoreNotice(this.m_totalScore);
};
/**
 * Kontrollerar om vald bokstav är korrekt.
 * Uppdaterar spelstatus beroende på om svaret är rätt eller fel.
 *
 * @param {string} letter Bokstaven som spelaren gissar.
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.checkAnswer = function(letter) {

    /**
     * Resultat av kontrollen mot pusslet.
     * @type {boolean}
     */
    var correct = this.m_puzzle.checkLetter(String(letter).toLowerCase());

    if (correct) {
        this.m_alphabetSelector.reset();
        this.updateLetterBoxes();

        if (this.m_puzzle.isComplete()) {
            this.m_answeredCorrect = true;
            this.updateMessageText("RIGHT! CONTINUE: PRESS X / ENTER");
            return;
        }

        this.updateMessageText("RIGHT! NEXT LETTER");
        return;
    }

    this.applyWrongGuessPenalty();
};

/**
 * Kontrollerar om bekräftelseknappen är nedtryckt.
 *
 * @param {?Object} input Inläst spelarinput.
 * @return {boolean} True om choose/confirm är aktiv.
 */
runmysteriet.scene.GuessWord.prototype.isConfirmPressed = function(input) {

    if (!input) {
        return false;
    }

    return input.choose === true;
};

/**
 * Byter till scenen för nivåslut (Level Complete) och skickar med spelarens data.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.goToLevelComplete = function() {

    this.stopBackgroundMusic();

    this.application.scenes.load([
        new runmysteriet.scene.LevelComplete(
            this.m_levelNumber,
            this.m_totalScore,
            this.m_earnedScore,
            this.m_avatarData
        )
    ]);
};

/**
 * Applicerar straff för felaktig gissning.
 * Uppdaterar poäng, antal fel och kontrollerar om spelet är över.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.applyWrongGuessPenalty = function() {

    /**
     * Antal försök kvar (beräknas efter felgissning).
     * @type {number}
     */
    var triesLeft = 0;

    this.m_wrongGuesses++;

    this.m_earnedScore -= this.m_wrongGuessPenalty;
    this.m_totalScore -= this.m_wrongGuessPenalty;

    if (this.m_earnedScore < 0) {
        this.m_earnedScore = 0;
    }

    if (this.m_totalScore < 0) {
        this.m_totalScore = 0;
    }

    this.updateScoreText();
    this.checkHighscoreNotice(this.m_totalScore);

    if (this.m_wrongGuesses >= this.m_maxWrongGuesses) {
        this.showCorrectWordText();
        return;
    }

    triesLeft = this.m_maxWrongGuesses - this.m_wrongGuesses;

    this.updateMessageText(
        "WRONG LETTER. -" +
        this.m_wrongGuessPenalty +
        " POINTS. TRIES LEFT " +
        triesLeft
    );
};
/**
 * Visar Game Over-text och det korrekta ordet när spelaren förlorar.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.showCorrectWordText = function() {

    this.m_failedGuess = true;

    /**
     * Textfält som visar korrekt ord vid game over.
     * @type {rune.text.BitmapField}
     */
    if (!this.m_correctWordText) {
        this.m_correctWordText = new rune.text.BitmapField("");
        this.m_correctWordText.autoSize = true;
        this.m_correctWordText.scale = 1;

        this.stage.addChild(this.m_correctWordText);
    }

    this.m_correctWordText.text =
        "GAME OVER \n\n THE WORD WAS:  " + this.m_word.toUpperCase();

    this.m_correctWordText.center = this.application.screen.center;
    this.m_correctWordText.y = this.application.screen.center.y - 65;

    this.updateMessageText("CONTINUE: PRESS X / ENTER");
};
/**
 * Byter till Game Over-scenen och stoppar bakgrundsmusiken.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.goToGameOver = function() {

    this.stopBackgroundMusic();

    this.application.scenes.load([
        new runmysteriet.scene.GameOver(
            this.m_totalScore,
            "TOO MANY WRONG GUESSES"
        )
    ]);
};

/**
 * Uppdaterar meddelandetext.
 *
 * @param {string} text
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.updateMessageText = function(text) {

    if (!this.m_messageText) {
        return;
    }

    this.m_messageText.text = text;
};

/**
 * Uppdaterar scoretext.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.updateScoreText = function() {

    if (!this.m_scoreText) {
        return;
    }

    this.m_scoreText.text = "SCORE: " + this.m_totalScore;
};

/**
 * Skapar text för highscore-notis i scenen.
 * Texten är dold tills ett nytt highscore uppnås.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.createHighscoreNotice = function() {

    /**
     * Textfält som visar highscore-notis.
     * @type {rune.text.BitmapField}
     */
    this.m_highscoreText = new rune.text.BitmapField("NEW HIGHSCORE!");
    this.m_highscoreText.autoSize = true;
    this.m_highscoreText.visible = false;

    this.stage.addChild(this.m_highscoreText);
};
/**
 * Visar highscore-notis och spelar ljud första gången den triggas.
 * Startar även en timer för visningstiden.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.showHighscoreNotice = function() {

    if (this.m_highscoreNotified === true) {
        return;
    }

    this.m_highscoreNotified = true;
    this.m_highscoreTimer = 180;

    /**
     * Visuell highscore-notis.
     * @type {?rune.text.BitmapField}
     */
    if (this.m_highscoreText) {
        this.m_highscoreText.visible = true;
        this.m_highscoreText.alpha = 1;
        this.m_highscoreText.scaleX = 1;
        this.m_highscoreText.scaleY = 1;
    }

    /**
     * Ljud som spelas vid highscore.
     * @type {?Object}
     */
    if (this.m_highscoreSound) {
        this.m_highscoreSound.play();
    }
};
/**
 * Uppdaterar highscore-notisen (animation, position och fade-out).
 * Hanterar puls-effekt och timer för visning.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.updateHighscoreNotice = function() {

    /**
     * Skalfaktor för pulserande animation.
     * @type {number}
     */
    var pulse = 0;

    if (!this.m_highscoreText || this.m_highscoreText.visible !== true) {
        return;
    }

    this.m_highscoreTimer--;

    pulse = 1 + Math.sin(this.m_highscoreTimer * 0.25) * 0.15;

    this.m_highscoreText.scaleX = pulse;
    this.m_highscoreText.scaleY = pulse;

    this.m_highscoreText.center = this.application.screen.center;
    this.m_highscoreText.y = 35;

    if (this.m_highscoreTimer < 30) {
        this.m_highscoreText.alpha = this.m_highscoreTimer / 30;
    }

    if (this.m_highscoreTimer <= 0) {
        this.m_highscoreText.visible = false;
        this.m_highscoreText.alpha = 1;
        this.m_highscoreText.scaleX = 1;
        this.m_highscoreText.scaleY = 1;
    }
};
/**
 * Kontrollerar om spelaren har uppnått nytt highscore.
 * Visar highscore-notis om ett nytt rekord har satts.
 *
 * @param {number} score Aktuell poäng som ska kontrolleras.
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.checkHighscoreNotice = function(score) {

    if (this.m_highscoreNotified === true) {
        return;
    }

    if (!this.m_highscoreManager) {
        return;
    }

    if (this.m_highscoreManager.isNewRecord(score) === true) {
        this.showHighscoreNotice();
    }
};
/**
 * Tar bort ett displayobjekt från scenen eller dess parent.
 * Säkerställer att objektet inte längre visas i scenens display-lista.
 *
 * @param {?Object} object Displayobjekt som ska tas bort.
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.removeDisplayObject = function(object) {

    if (!object) {
        return;
    }

    if (object.parent) {
        object.parent.removeChild(object);
        return;
    }

    if (object.stage) {
        object.stage.removeChild(object);
    }
};
/**
 * Stoppar bakgrundsmusiken och återställer uppspelningen till början.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.stopBackgroundMusic = function() {

    /**
     * Media-element kopplat till ljudkällan.
     * @type {?HTMLMediaElement}
     */
    var mediaElement = null;

    if (!this.backgroundMusic) {
        return;
    }

    if (
        this.backgroundMusic.m_source &&
        this.backgroundMusic.m_source.mediaElement
    ) {
        mediaElement = this.backgroundMusic.m_source.mediaElement;

        if (typeof mediaElement.pause === "function") {
            mediaElement.pause();
        }

        try {
            mediaElement.currentTime = 0;
        } catch (error) {
        }
    }
};
/**
 * Rensar upp GuessWord-scenen och frigör resurser.
 *
 * @return {void}
 */
runmysteriet.scene.GuessWord.prototype.dispose = function() {

    /**
     * Räknare för loopning genom bokstavsboxar.
     * @type {number}
     */
    var i = 0;

    /**
     * Temporär referens till en bokstavsbox vid cleanup.
     * @type {?Object}
     */
    var box = null;

    this.stopBackgroundMusic();

    if (this.m_letterBoxes) {
        for (i = 0; i < this.m_letterBoxes.length; i++) {
            box = this.m_letterBoxes[i];

            if (!box) {
                continue;
            }

            if (typeof box.dispose === "function") {
                box.dispose();
                continue;
            }

            if (typeof box.clear === "function") {
                box.clear();
                continue;
            }

            this.removeDisplayObject(box.m_box);
            this.removeDisplayObject(box.m_text);
            this.removeDisplayObject(box.m_background);
            this.removeDisplayObject(box.m_letterText);
        }
    }

    this.removeDisplayObject(this.m_titleText);
    this.removeDisplayObject(this.m_letterText);
    this.removeDisplayObject(this.m_hintText);
    this.removeDisplayObject(this.m_scoreText);
    this.removeDisplayObject(this.m_messageText);
    this.removeDisplayObject(this.m_correctWordText);
    this.removeDisplayObject(this.m_highscoreText);

    this.m_gameInput = null;

    this.m_puzzle = null;
    this.m_alphabetSelector = null;
    this.m_letterBoxes = [];

    this.m_titleText = null;
    this.m_letterText = null;
    this.m_hintText = null;
    this.m_scoreText = null;
    this.m_messageText = null;
    this.m_correctWordText = null;

    this.m_wordData = null;
    this.m_word = "";
    this.m_hints = [];

    this.m_highscoreText = null;
    this.m_highscoreManager = null;
    this.m_highscoreSound = null;
    this.m_highscoreTimer = 0;
    this.m_highscoreNotified = false;

    this.m_avatarData = null;

    this.backgroundMusic = null;
    this.menuSound = null;

    this.m_failedGuess = false;
    this.m_answeredCorrect = false;

    rune.scene.Scene.prototype.dispose.call(this);
};