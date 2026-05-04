runmysteriet.entity.Kristen = function(stage, texture) {

    rune.display.Sprite.call(
        this,
        100, // startposition X (ändra vid behov)
        100, // startposition Y
        32,
        40,
        texture
    );

    this.stage = stage;

    this.speed = 2;
    this.hp = 100;

    this.isOnGround = true;
    this.groundY = 0;
};

runmysteriet.entity.Kristen.prototype = Object.create(rune.display.Sprite.prototype);
runmysteriet.entity.Kristen.prototype.constructor = runmysteriet.entity.Kristen;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.entity.Kristen.prototype.init = function() {

    rune.display.Sprite.prototype.init.call(this);

    // Lägg till på stage (VIKTIGT annars syns hon inte)
    this.stage.addChild(this);

    this.groundY = this.y;

    // Animation
    this.animation.create("start", [0, 1], 3, true);

    // ✅ FIX
    this.animation.play("start");
};

//------------------------------------------------------------------------------
// UPDATE (valfri, men bra att ha)
//------------------------------------------------------------------------------

runmysteriet.entity.Kristen.prototype.update = function() {
    rune.display.Sprite.prototype.update.call(this);
};

//------------------------------------------------------------------------------
// FIGHT
//------------------------------------------------------------------------------

runmysteriet.entity.Kristen.prototype.fight = function(){
    console.log("Kristen slåss");
};

//------------------------------------------------------------------------------
// DIE
//------------------------------------------------------------------------------

runmysteriet.entity.Kristen.prototype.die = function(){
    if(this.hp <= 0){
        console.log("Kristen död");
        this.stage.removeChild(this);
    }
};