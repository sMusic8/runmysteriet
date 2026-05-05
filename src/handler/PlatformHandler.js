//------------------------------------------------------------------------------
// PLATFORM HANDLER
//------------------------------------------------------------------------------

// Denna klassen hanterar alla plattformar i spelet, skapar och kontrolerar dess kolision med players. 
runmysteriet.handler.PlatformHandler = function(stage, screenWidth) {
    this.stage = stage;
    this.screenWidth = screenWidth;

    this.platforms = [];
    this.holes = [];
    this.enemySpawns = [];

    this.levelWidth = 0;
};

runmysteriet.handler.PlatformHandler.prototype.init = function() {
    var segments = [
        new runmysteriet.segments.Segment_1(),
        new runmysteriet.segments.Segment_2(),
        new runmysteriet.segments.Segment_3(),
        new runmysteriet.segments.Segment_1(),
        new runmysteriet.segments.Segment_2(),

    ];

   var x = 0;

    for (var i = 0; i < segments.length; i++) {
        var result = segments[i].ground(this.stage, x);

        this.addPlatforms(result.platforms);
        this.addHoles(result.holes);
        this.addEnemySpawns(result.enemySpawns);

        x = result.endX;
    }

    this.levelWidth = x;
};


runmysteriet.handler.PlatformHandler.prototype.addPlatforms = function(platforms) {
    if (!platforms) {
        return;
    }

    for (var i = 0; i < platforms.length; i++) {
        this.platforms.push(platforms[i]);
    }
};

runmysteriet.handler.PlatformHandler.prototype.addHoles = function(holes) {
    if (!holes) {
        return;
    }

    for (var i = 0; i < holes.length; i++) {
        this.holes.push(holes[i]);
    }
};

runmysteriet.handler.PlatformHandler.prototype.updateHoles = function(players, onPlayerDead) {
    if (!players) {
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
                if (onPlayerDead) {
                    onPlayerDead(player, i);
                }

                break;
            }
        }
    }
};

runmysteriet.handler.PlatformHandler.prototype.addEnemySpawns = function(enemySpawns) {

    if (!enemySpawns) {
        return;
    }

    for (var i = 0; i < enemySpawns.length; i++) {
        this.enemySpawns.push(enemySpawns[i]);
    }
};

runmysteriet.handler.PlatformHandler.prototype.getEnemySpawns = function() {
    return this.enemySpawns;
};