runmysteriet.entity.Player = function() {
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


//uppdateringsmetod som körs varje "steg" i spelet
runmysteriet.entity.Player.prototype.update = function(step) {
    rune.display.Graphic.prototype.update.call(this, step);

    //kontrollerar om höger/vänster knapp är nedtryckt och flyttar spelaren i den riktning
    if (this.keyboard.pressed("RIGHT")){
        this.x += 2;
    }
    if(this.keyboard.pressed("LEFT")){
        this.x -= 2;
    }
};
