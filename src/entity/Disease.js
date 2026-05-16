//------------------------------------------------------------------------------
// DISEASE
//------------------------------------------------------------------------------

runmysteriet.entity = runmysteriet.entity || {};

/**
 * En sjukdom som kan skada spelaren.
 *
 * @constructor
 * @extends rune.display.Graphic
 * @param {number} x
 * @param {number} y
 * @param {string} type
 */
runmysteriet.entity.Disease = function(x, y, type) {

    var data = runmysteriet.entity.Disease.getData(type);

    rune.display.Graphic.call(
        this,
        x || 0,
        y || 0,
        32,
        32,
        data.texture
    );

    this.type = type;
    this.damage = data.damage;
    this.isDisease = true;
    this.isActive = true;

    this.baseY = this.y;
    this.m_floatTime = Math.random() * 100;
};

runmysteriet.entity.Disease.prototype =
    Object.create(rune.display.Graphic.prototype);

runmysteriet.entity.Disease.prototype.constructor =
    runmysteriet.entity.Disease;

//------------------------------------------------------------------------------
// DATA
//------------------------------------------------------------------------------

runmysteriet.entity.Disease.getData = function(type) {

    if (type === "red") {
        return {
            texture: "sick2",
            damage: 50
        };
    }

    if (type === "brown") {
        return {
            texture: "sick1",
            damage: 30
        };
    }

    return {
        texture: "sick3",
        damage: 10
    };
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

runmysteriet.entity.Disease.prototype.update = function(step) {

    this.m_floatTime += 0.08;
    this.y = this.baseY + Math.sin(this.m_floatTime) * 2;
};

//------------------------------------------------------------------------------
// REMOVE
//------------------------------------------------------------------------------

runmysteriet.entity.Disease.prototype.remove = function() {

    this.isActive = false;

    if (this.stage) {
        this.stage.removeChild(this);
    }
};