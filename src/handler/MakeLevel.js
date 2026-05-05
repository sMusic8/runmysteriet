runmysteriet.handler.MakeLevel = function(stage) {
    this.stage = stage;

    this.platforms = [];
    this.holes = [];

    this.tileSize = 268;
    this.groundY = 220;
    this.holeHeight = 200;
    this.fallLimitY = 360;

    this.levelWidth = 0;
};

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

runmysteriet.handler.MakeLevel.prototype.buildSegment = function(segment, startX) {
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
            var width = part.width || 50;

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