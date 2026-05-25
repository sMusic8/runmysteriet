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
    //Gör att spelaren kan följa med flotten när spelaren står ovanpå den.
    
    this.sticky = true;
    this.immovable = true;

    
    this.startX = x || 0;
    this.minX = this.startX;
    this.maxX = this.startX + 100;

    this.speed = 1.4;
    this.direction = 1;

    this.previousX = this.x;
    this.deltaX = 0;

     //Flotten ska inte röra sig direkt.
     
    this.hasStarted = false;
    this.hasArrived = false;    
};



runmysteriet.ui.graphic.Raft.prototype = Object.create(rune.display.Graphic.prototype);
runmysteriet.ui.graphic.Raft.prototype.constructor = runmysteriet.ui.graphic.Raft;

runmysteriet.ui.graphic.Raft.prototype.start = function() {

    if (this.hasStarted === true || this.hasArrived === true) {
        return;
    }

    this.hasStarted = true;
};runmysteriet.ui.graphic.Raft.prototype.update = function(step) {

    //Spara position före rörelse.
     
    this.previousX = this.x;

    //Om flotten inte har startat ska den stå still.
     
    if (this.hasStarted !== true || this.hasArrived === true) {
        this.deltaX = 0;
        return;
    }

    //Flytta flotten mjukt åt höger.
     
    this.x += this.speed;

    //Stoppa vid maxX.
     
    if (this.x >= this.maxX) {
        this.x = this.maxX;
        this.hasArrived = true;
    }

    //Hur mycket flotten flyttade denna frame. Spelaren använder detta för att följa med.
     
    this.deltaX = this.x - this.previousX;
};