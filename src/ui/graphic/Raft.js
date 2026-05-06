runmysteriet.ui.graphic.Raft = function(x, y) {

    rune.display.Graphic.call(
        this,
        x || 0,
        y || 0,
        64,
        20,
        "flotte"
    );

    this.isRaft = true; 
    
    this.startX = x || 0;
    this.minX = this.startX;
    this.maxX = this.startX + 100;

    this.speed = 0.7;
    this.direction = 1;

    this.previousX = this.x;
    this.deltaX = 0;

     /*
     * Flotten ska inte röra sig direkt.
     */
    this.hasStarted = false;
    this.isRaft = true;
};


runmysteriet.ui.graphic.Raft.prototype = Object.create(rune.display.Graphic.prototype);
runmysteriet.ui.graphic.Raft.prototype.constructor = runmysteriet.ui.graphic.Raft;

runmysteriet.ui.graphic.Raft.prototype.start = function() {
    this.hasStarted = true;
};

runmysteriet.ui.graphic.Raft.prototype.update = function(step) {
    rune.display.Graphic.prototype.update.call(this, step);

    this.previousX = this.x;
    this.deltaX = 0;

    if (this.hasStarted !== true) {
        return;
    }

    this.x += this.speed * this.direction;

    if (this.x <= this.minX) {
        this.x = this.minX;
        this.direction = 1;
    }

    if (this.x >= this.maxX) {
        this.x = this.maxX;
        this.direction = -1;
    }

    this.deltaX = this.x - this.previousX;
};