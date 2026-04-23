//------------------------------------------------------------------------------
// PLAYER
//------------------------------------------------------------------------------

runmysteriet.entity.Player = function() {

    rune.display.Graphic.call(this,
        0,
        0,
        32,
        32,
        "start"
    );

    // Y-hastighet
    this.velocityY = 0;

    // Gravitation
    this.gravity = 0.5;

    // Hopphastighet
    this.jumpPower = -7;

    // Markstatus
    this.isOnGround = false;

    // Startmark
    this.groundY = 0;
};

// Inheritance
runmysteriet.entity.Player.prototype = Object.create(rune.display.Graphic.prototype);
runmysteriet.entity.Player.prototype.constructor = runmysteriet.entity.Player;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.entity.Player.prototype.init = function() {

    rune.display.Graphic.prototype.init.call(this);

    this.groundY = this.y;
    this.isOnGround = true;
};

//------------------------------------------------------------------------------
// INPUT
//------------------------------------------------------------------------------

runmysteriet.entity.Player.prototype.handleInput = function() {

    // Höger
    if (this.keyboard.pressed("RIGHT")) {
        this.x += 4;
    }

    // Vänster
    if (this.keyboard.pressed("LEFT")) {
        this.x -= 4;
    }

    // Hopp
    if (this.keyboard.pressed("UP") && this.isOnGround) {

        this.velocityY = this.jumpPower;
        this.isOnGround = false;
    }
};