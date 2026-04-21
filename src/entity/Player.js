runmysteriet.entity.Player = function() {
   //variabler för att hantera hoppning
    this.m_velocityY = 0;
    this.m_gravity = 0.5;
    this.m_jumping = -5;
    this.m_groundY = 0;
    this.m_onground = false;


    rune.display.Graphic.call(this,
        0,
        0,
        32,
        32,
        "start" 
    );

};

//Arv ----spelaren ska ärva funktioner från Graphic
runmysteriet.entity.Player.prototype = Object.create(rune.display.Graphic.prototype);
runmysteriet.entity.Player.prototype.constructor = runmysteriet.entity.Player;  //konstruktören som pekar på sig själv 

runmysteriet.entity.Player.prototype.init = function() {
    rune.display.Graphic.prototype.init.call(this);
    this.m_groundY = this.y;
    this.m_onground = true;
}
//uppdateringsmetod som körs varje "steg" i spelet
runmysteriet.entity.Player.prototype.update = function(step) {
    rune.display.Graphic.prototype.update.call(this, step);

    //kontrollerar om höger/vänster knapp är nedtryckt och flyttar spelaren i den riktning
    if (this.keyboard.pressed("RIGHT")){
        this.x += 4;
    }
    if(this.keyboard.pressed("LEFT")){
        this.x -= 3;
    }
    //hoppning
    if(this.keyboard.pressed("UP") && this.m_onground){
        this.m_velocityY = this.m_jumping;
        this.m_onground = false;
    }
//ny kommentar
    //lägger till gravitation
    this.m_velocityY += this.m_gravity;
    this.y += this.m_velocityY;
//kontrolerar om spelaren är på marken och stoppar den isåfall
    if(this.y >=this.m_groundY){
        this.y = this.m_groundY;
        this.m_velocityY = 0;
        this.m_onground = true;
    }
};
