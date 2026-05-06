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
    this.waterAreas = [];
    this.movingPlatforms = [];
    this.boats = [];                                    

    this.levelWidth = 0;
};

//här initieras platformhandlern
runmysteriet.handler.PlatformHandler.prototype.init = function(levelNumber) {
    levelNumber = levelNumber || 1;

    this.platforms = [];
    this.holes = [];
    this.enemySpawns = [];
    this.levelWidth = 0;

    var segmentTypes = [
        runmysteriet.segments.Segment_3,
        runmysteriet.segments.Segment_1,
        runmysteriet.segments.Segment_2,
        runmysteriet.segments.Segment_3
    ];

    //
    var segmentCount = 4 + Math.floor((levelNumber - 1) / 5);

    if (segmentCount > 20) {
        segmentCount = 20;
    }

    var x = 0;
//här loopar vi igenom segmenten och bygger upp leveln
    for (var i = 0; i < segmentCount; i++) {
        var segmentIndex = (levelNumber + i - 1) % segmentTypes.length;
        var SegmentClass = segmentTypes[segmentIndex];
        var segment = new SegmentClass();

        var result = segment.ground(this.stage, x);

        this.addPlatforms(result.platforms);
        this.addHoles(result.holes);
        this.addEnemySpawns(result.enemySpawns);
        this.addWaterAreas(result.waterAreas || []);
        this.addMovingPlatforms(result.movingPlatforms || []);
        this.addBoats(result.boats || []);  
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

///
runmysteriet.handler.PlatformHandler.prototype.addWaterAreas = function(waterAreas) {
    if(!this.waterAreas){
        this.waterAreas = [];
    }
    
    for (var i = 0; i < waterAreas.length; i++) {
        this.waterAreas.push(waterAreas[i]);
    }
};


runmysteriet.handler.PlatformHandler.prototype.addMovingPlatforms = function(movingPlatforms) {
    for (var i = 0; i < movingPlatforms.length; i++) {
        this.movingPlatforms.push(movingPlatforms[i]);
    }
};

runmysteriet.handler.PlatformHandler.prototype.addBoats = function(boats) {
    
    if(!this.boats){
        this.boats = [];
    }
    for (var i = 0; i < boats.length; i++) {
        this.boats.push(boats[i]);
    }
};
