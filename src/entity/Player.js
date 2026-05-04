//------------------------------------------------------------------------------
// PLAYER
//------------------------------------------------------------------------------
// Denna klassen representerar en spelare i spelet. 
// Den har ingen kollisionslogik, ingen input-logik och ingen gravitationslogik. 
// Den sköter bara om att rita spelaren och spela animationer.
// Allt annat sköts av PlayerHandler.js 

runmysteriet.entity.Player = function(controls, spriteConfig) {

    rune.display.Sprite.call(
        this,
        0,
        0,
        32,
        32,
        spriteConfig.texture
    );
this.maxHp = 100;
this.hitCooldown = 0;


    this.controls = controls;
    this.spriteConfig = spriteConfig;

    this.speed = 2;

    this.velocityY = 0;
    this.gravity = 0.5;
    this.jumpPower = -9;

    this.isOnGround = false;
    this.groundY = 0;

    this.isMoving = false;
    this.currentAnimation = "";

    this.hp = 100;

};

//------------------------------------------------------------------------------
// INHERITANCE
//------------------------------------------------------------------------------

runmysteriet.entity.Player.prototype = Object.create(rune.display.Sprite.prototype);
runmysteriet.entity.Player.prototype.constructor = runmysteriet.entity.Player;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.entity.Player.prototype.init = function() {

    rune.display.Sprite.prototype.init.call(this);

    this.groundY = this.y;
    this.isOnGround = true;

    /*
        Eftersom dina move-spritesheets har 2 frames:
        frame 0 = står still / första bild
        frame 1 = rörelse / andra bild
    */

    this.animation.create("idle", [0], 1, true);
    this.animation.create("run", [0, 1], 4, true);
    this.animation.create("jump", [1], 1, false);

    this.playAnimation("idle");
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

runmysteriet.entity.Player.prototype.update = function(step) {

    rune.display.Sprite.prototype.update.call(this, step);

    /*
        Game.js sköter:
        - handleInput()
        - gravitation
        - plattformskollision
        - updateAnimation()

        Därför ska vi inte göra det här också.
    */
};

//------------------------------------------------------------------------------
// ANIMATION
//------------------------------------------------------------------------------

runmysteriet.entity.Player.prototype.updateAnimation = function() {

    if (this.isOnGround === false) {
        this.playAnimation("jump");
    }
    else if (this.isMoving === true) {
        this.playAnimation("run");
    }
    else {
        this.playAnimation("idle");
    }
};

//------------------------------------------------------------------------------
// ANIMATION HELPER
//------------------------------------------------------------------------------

runmysteriet.entity.Player.prototype.playAnimation = function(name) {

    if (this.currentAnimation !== name) {
        this.animation.gotoAndPlay(name);
        this.currentAnimation = name;
    }
};
runmysteriet.entity.Player.prototype.die = function(){
    if(this.hp <= 0){
        console.log("Player död");
        this.stage.removeChild(this);
    }
};