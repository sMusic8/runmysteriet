//------------------------------------------------------------------------------
// MAKE LEVEL
//------------------------------------------------------------------------------

/**
 * Procedural level builder.
 *
 * Builds platforms and holes from segment data.
 *
 * @constructor
 * @param {!rune.display.Stage} stage
 */
runmysteriet.handler.MakeLevel = function(stage) {

    /** @type {!rune.display.Stage} */
    this.stage = stage;

    /** @type {!Array<!runmysteriet.ui.Platform>} */
    this.platforms = [];

    /** @type {!Array<!runmysteriet.ui.graphic.Hole>} */
    this.holes = [];

    /** @type {number} */
    this.tileSize = 268;

    /** @type {number} */
    this.groundY = 220;

    /** @type {number} */
    this.holeHeight = 200;

    /** @type {number} */
    this.fallLimitY = 360;

    /** @type {number} */
    this.levelWidth = 0;
};

//------------------------------------------------------------------------------
// BUILD LEVEL
//------------------------------------------------------------------------------

/**
 * Builds full level from segment array.
 *
 * @param {!Array<!Object>} segments
 * @return {{platforms: !Array, holes: !Array, levelWidth: number}}
 */
runmysteriet.handler.MakeLevel.prototype.build = function(segments) {

    var x = 0;

    for (var i = 0; i < segments.length; i++) {
        x = this.buildSegment(segments[i], x);
    }

    this.levelWidth = x;

    return {
        platforms: this.platforms,
        holes: this.holes,
        levelWidth: this.levelWidth
    };
};

//------------------------------------------------------------------------------
// BUILD SEGMENT
//------------------------------------------------------------------------------

/**
 * Builds a single segment.
 *
 * @param {{parts: !Array<{type: string, count?: number, width?: number}>}} segment
 * @param {number} startX
 * @return {number}
 */
runmysteriet.handler.MakeLevel.prototype.buildSegment = function(segment, startX) {

    if (!segment || !segment.parts) {
        console.log("Fel segment:", segment);
        return startX;
    }

    var x = startX;

    for (var i = 0; i < segment.parts.length; i++) {

        var part = segment.parts[i];

        if (part.type === "platform") {

            var count = part.count || 1;

            for (var j = 0; j < count; j++) {

                var platform = new runmysteriet.ui.Platform();

                platform.x = x;
                platform.y = this.groundY;

                this.platforms.push(platform);
                this.stage.addChild(platform);

                x += this.tileSize;
            }
        }

        else if (part.type === "hole") {

            var width = part.width || 40;

            var hole = new runmysteriet.ui.graphic.Hole(
                x,
                this.groundY,
                width,
                this.holeHeight,
                this.fallLimitY
            );

            this.holes.push(hole);
            this.stage.addChild(hole);

            x += width;
        }
    }

    return x;
};