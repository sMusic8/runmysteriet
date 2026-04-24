//------------------------------------------------------------------------------
// PLAYER
//------------------------------------------------------------------------------

runmysteriet.entity.Player = function(controls, spriteConfig) {

    // 🔁 ÄNDRING: Graphic → Sprite (krävs för animationer)
    rune.display.Sprite.call(this,
        0,
        0,
        32,
        32,
        spriteConfig.texture // 🔥 HÄR används bilden du skickar in från Game
    );

    // Kontroller (vänster/höger/hopp)
    this.controls = controls;

    // 🔁 NYTT: sparar animation-data
    this.spriteConfig = spriteConfig;

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
runmysteriet.entity.Player.prototype = Object.create(rune.display.Sprite.prototype);
runmysteriet.entity.Player.prototype.constructor = runmysteriet.entity.Player;

//------------------------------------------------------------------------------
// INIT
//------------------------------------------------------------------------------

runmysteriet.entity.Player.prototype.init = function() {

    rune.display.Sprite.prototype.init.call(this);

    this.groundY = this.y;
    this.isOnGround = true;

    // 🔁 NYTT: Lägg till animationer från config
    for (var i = 0; i < this.spriteConfig.animations.length; i++) {
        this.animation.add(this.spriteConfig.animations[i]);
    }

    // 🔁 Start-animation
    this.animation.play(this.spriteConfig.start);
};

//------------------------------------------------------------------------------
// INPUT
//------------------------------------------------------------------------------

runmysteriet.entity.Player.prototype.handleInput = function() {

    var moving = false;

    // Höger
    if (this.keyboard.pressed(this.controls.right)) {
        this.x += 4;
        moving = true;
    }

    // Vänster
    if (this.keyboard.pressed(this.controls.left)) {
        this.x -= 4;
        moving = true;
    }

    // Hopp
    if (this.keyboard.pressed(this.controls.jump) && this.isOnGround) {
        this.velocityY = this.jumpPower;
        this.isOnGround = false;
    }

    // 🔁 NYTT: Animation baserat på rörelse
    if (!this.isOnGround) {
        this.animation.play("jump");
    }
    else if (moving) {
        this.animation.play("run");
    }
    else {
        this.animation.play("idle");
    }
};