runmysteriet.handler.TestShield = function () {
    rune.display.Graphic.call(this, 0, 0, 40, 40);
    this.backgroundColor = "#ffffff";
};

// inheritance
runmysteriet.handler.TestShield.prototype = Object.create(rune.display.Graphic.prototype);
runmysteriet.handler.TestShield.prototype.constructor = runmysteriet.handler.TestShield;

// override init
runmysteriet.handler.TestShield.prototype.init = function () {
    rune.display.Graphic.prototype.init.call(this);


};