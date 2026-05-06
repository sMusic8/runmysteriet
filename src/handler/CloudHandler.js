//------------------------------------------------------------------------------
// CLOUD HANDLER
//------------------------------------------------------------------------------

//moln handler
// Klassen som skapar moln och hanterar dess rörelse

/**
 * Handles cloud spawning and movement.
 *
 * @constructor
 * @param {!rune.display.Stage} stage
 * @param {number} screenWidth
 */
runmysteriet.handler.CloudHandler = function(stage, screenWidth) {

    /** @type {!rune.display.Stage} */
    this.stage = stage;

    /** @type {number} */
    this.screenWidth = screenWidth;

    /** @type {number} */
    this.levelWidth = screenWidth * 4; //då vi tänkt göra 4 segment till att börja med

    /** @type {!Array<!rune.display.Graphic & {speed:number}>} */
    this.clouds = [];

    /** @type {!Array<string>} */
    this.cloudResources = ["moln1", "moln2", "moln3"];
};

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

//Init-funktionen skapar moln med hjälp av en loop. 
//Loopen placerar ut molnen med ett visst avstånd (spacing) och ger dem en slupmässig y-positon och en slumpmässig hastighet. 
//Molnen läggs sedan till på scenen.

/**
 * Initializes clouds.
 *
 * @return {void}
 */
runmysteriet.handler.CloudHandler.prototype.init = function() {

    var startX = 0;
    var spacing = 160;

    for (var i = 0; i < 8; i++) {

        var randomIndex = Math.floor(Math.random() * this.cloudResources.length);

        var cloud = new rune.display.Graphic(
            startX + (i * spacing),
            20 + Math.random() * 70,
            100,
            60,
            this.cloudResources[randomIndex]
        );

        /** @type {number} */
        cloud.speed = 0.5 + Math.random() * 0.3;

        this.clouds.push(cloud);
        this.stage.addChild(cloud);
    }
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

//Uppdaterar molnens position och slumpar ny position för samma när molnen är utanför screenWidth.

/**
 * Updates cloud movement.
 *
 * @return {void}
 */
runmysteriet.handler.CloudHandler.prototype.update = function() {

    for (var i = 0; i < this.clouds.length; i++) {

        var cloud = this.clouds[i];

        cloud.x += cloud.speed;

        if (cloud.x > this.levelWidth + 150) {

            cloud.x = -150;
            cloud.y = 20 + Math.random() * 70;
        }
    }
};