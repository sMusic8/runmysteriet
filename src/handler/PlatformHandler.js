//------------------------------------------------------------------------------
// PLATFORM HANDLER
//------------------------------------------------------------------------------

// Denna klassen hanterar alla plattformar i spelet, skapar och kontrolerar dess kolision med players. 
runmysteriet.handler.PlatformHandler = function(stage, screenWidth) {
    this.stage = stage;
    this.screenWidth = screenWidth;

    this.platforms = [];
    this.holes = [];

    this.levelWidth = 0;
};

runmysteriet.handler.PlatformHandler.prototype.init = function() {
    var segments = [
        new runmysteriet.segments.Segment_1(),
        new runmysteriet.segments.Segment_2(),
        new runmysteriet.segments.Segment_3(),
        new runmysteriet.segments.Segment_1()
    ];

    var levelBuilder = new runmysteriet.handler.MakeLevel(this.stage);
    var level = levelBuilder.build(segments);

    this.platforms = level.platforms;
    this.holes = level.holes;
    this.levelWidth = level.levelWidth;
};

runmysteriet.handler.PlatformHandler.prototype.updateHoles = function(players, onPlayerDead) {
    if (!players || !onPlayerDead) {
        return;
    }

    for (var i = 0; i < players.length; i++) {
        var player = players[i];

        if (!player || player.isDead === true) {
            continue;
        }

        for (var j = 0; j < this.holes.length; j++) {
            var hole = this.holes[j];

            if (hole.hasPlayerFallen(player)) {
                onPlayerDead(player, i);
                break;
            }
        }
    }
};