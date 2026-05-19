//------------------------------------------------------------------------------
// HOLE
//------------------------------------------------------------------------------

/**
 * Hål med lava.
 * Hole ansvarar för dödslogik och sin egen lava-grafik.
 *
 * @constructor
 * @extends {rune.display.DisplayObject}
 */
runmysteriet.ui.graphic.Hole = function(x, y, width, height, fallLimitY) {

    rune.display.DisplayObject.call(this, x, y, width, height);

    /*
     * Hole är logik. Själva lavan ritas av this.lava.
     */
    this.backgroundColor = "#000000";
    this.alpha = 0;

    this.fallLimitY = fallLimitY || 360;

    /*
     * Lava som fyller hela hålet.
     * En bild per hål, inte massa tiles.
     */
  var lavaBleedX = 2;
var lavaBleedY = 2;

this.lava = new rune.display.Graphic(
    x - lavaBleedX,
    y - lavaBleedY,
    width + lavaBleedX * 2,
    height + lavaBleedY,
    "lava_ny_komprimerad"
);

    /*
     * Enkel lava-effekt.
     */
this.lava.baseY = y - lavaBleedY;
this.lava.time = Math.random() * 100;
this.lava.alpha = 0.9;
};

runmysteriet.ui.graphic.Hole.prototype =
    Object.create(rune.display.DisplayObject.prototype);

runmysteriet.ui.graphic.Hole.prototype.constructor =
    runmysteriet.ui.graphic.Hole;

//------------------------------------------------------------------------------
// STAGE
//------------------------------------------------------------------------------

/**
 * Lägger till hålets lava på stage.
 * Själva Hole behöver inte synas, men kan ligga kvar för logik.
 *
 * @param {!rune.display.Stage} stage
 * @return {void}
 */
runmysteriet.ui.graphic.Hole.prototype.addToStage = function(stage) {

    if (!stage) {
        return;
    }

    if (this.lava) {
        stage.addChild(this.lava);
    }
};

//------------------------------------------------------------------------------
// UPDATE
//------------------------------------------------------------------------------

/**
 * Uppdaterar lavans visuella effekt.
 *
 * @param {number=} step
 * @return {void}
 */
runmysteriet.ui.graphic.Hole.prototype.update = function(step) {

    if (!this.lava) {
        return;
    }

    this.lava.time += 0.08;

    /*
     * Väldigt liten rörelse så lavan känns levande.
     */
    this.lava.y = this.lava.baseY + Math.sin(this.lava.time) * 2;

    /*
     * Pulsering.
     */
    this.lava.alpha = 0.9 + Math.sin(this.lava.time) * 0.15;
};

//------------------------------------------------------------------------------
// COLLISION
//------------------------------------------------------------------------------

/**
 * Check if player is inside hole.
 *
 * @param {!Object} player
 * @return {boolean}
 */
runmysteriet.ui.graphic.Hole.prototype.isPlayerInside = function(player) {

    if (!player) {
        return false;
    }

    var cx = player.x + player.width / 2;

    return cx >= this.x && cx <= this.x + this.width;
};

/**
 * Check if player fell into hole.
 *
 * @param {!Object} player
 * @return {boolean}
 */
runmysteriet.ui.graphic.Hole.prototype.hasPlayerFallen = function(player) {

    if (!player || player.isDead) {
        return false;
    }

    var cx = player.x + player.width / 2;
    var bottom = player.y + player.height;

    return (
        cx >= this.x &&
        cx <= this.x + this.width &&
        bottom >= this.y + 20
    );
};

//------------------------------------------------------------------------------
// REMOVE
//------------------------------------------------------------------------------

/**
 * Tar bort lavan från stage.
 *
 * @return {void}
 */
runmysteriet.ui.graphic.Hole.prototype.remove = function() {

    if (this.lava && this.lava.stage) {
        this.lava.stage.removeChild(this.lava);
    }

    this.lava = null;
};