//------------------------------------------------------------------------------
// Constructor scope
//------------------------------------------------------------------------------

/** 
 * Creates a new Requests object.
 * 
 * @constructor
 * @extends rune.resource.Requests
 * 
 * @class
 * @classdesc
 * 
 * This class includes (bakes) resource files used by the application. A 
 * resource file is made available by reference (URI) or base64-encoded string. 
 * Tip: Use Rune-tools to easily bake resource files into this class.
 */
runmysteriet.data.Requests = function() {

    //--------------------------------------------------------------------------
    // Super call
    //--------------------------------------------------------------------------
    
    /**
     * Extend rune.resource.Requests
     */
    rune.resource.Requests.call(this);
};

//------------------------------------------------------------------------------
// Inheritance
//------------------------------------------------------------------------------

runmysteriet.data.Requests.prototype = Object.create(rune.resource.Requests.prototype);
runmysteriet.data.Requests.prototype.constructor = runmysteriet.data.Requests;

//------------------------------------------------------------------------------
// Override protected prototype methods
//------------------------------------------------------------------------------

/**
 * @inheritDoc
 */
runmysteriet.data.Requests.prototype.m_construct = function() {
    rune.resource.Requests.prototype.m_construct.call(this);
    this.add("jord-gubbe", "./../asset/jord-gubbe.png");
	this.add("ax", "./../asset/png/ax.png");
	this.add("dead", "./../asset/png/dead.png");
	this.add("g-mitten", "./../asset/png/g-mitten.png");
	this.add("g-nere", "./../asset/png/g-nere.png");
	this.add("lila", "./../asset/png/lila.png");
	this.add("pickax", "./../asset/png/pickax.png");
	this.add("priest", "./../asset/png/priest.png");
	this.add("rosa", "./../asset/png/rosa.png");
	this.add("sick", "./../asset/png/sick.png");
	this.add("sick1", "./../asset/png/sick1.png");
	this.add("sick2", "./../asset/png/sick2.png");
	this.add("start", "./../asset/png/start.png");
	this.add("vapen-mitten", "./../asset/png/vapen-mitten.png");
	this.add("vapen-nere", "./../asset/png/vapen-nere.png");
	this.add("viking", "./../asset/png/viking.png");
	this.add("vikingmindre", "./../asset/png/vikingmindre.png");
	this.add("walk", "./../asset/png/walk.png");
	this.add("cartoon-music-soundtrack-bell-ui-swift-motion-489784", "./../asset/testljud/cartoon-music-soundtrack-bell-ui-swift-motion-489784.mp3");
	this.add("cartoon-music-soundtrack-video-game-bonus-points-512990", "./../asset/testljud/cartoon-music-soundtrack-video-game-bonus-points-512990.mp3");
	this.add("cartoon-music-soundtrack-video-game-collect-item-pop-amp-flutter-512992", "./../asset/testljud/cartoon-music-soundtrack-video-game-collect-item-pop-amp-flutter-512992.mp3");
	this.add("freesound_community-air-84482", "./../asset/testljud/freesound_community-air-84482.mp3");
	this.add("freesound_community-click_effect-86995", "./../asset/testljud/freesound_community-click_effect-86995.mp3");
	this.add("freesound_community-flipcard-91468", "./../asset/testljud/freesound_community-flipcard-91468.mp3");
	this.add("freesound_community-pixel-song-21-72593", "./../asset/testljud/freesound_community-pixel-song-21-72593.mp3");
	this.add("ksjsbwuil-whoosh-deep-short-2-513924", "./../asset/testljud/ksjsbwuil-whoosh-deep-short-2-513924.mp3");
	this.add("lazychillzone-owl-hooting-2-232348", "./../asset/testljud/lazychillzone-owl-hooting-2-232348.mp3");
	this.add("oxidvideos-ding-editing-sfx-414336", "./../asset/testljud/oxidvideos-ding-editing-sfx-414336.mp3");
	this.add("pexjojo-mouse-click-6-types-206762", "./../asset/testljud/pexjojo-mouse-click-6-types-206762.mp3");
	this.add("soundshelfstudio-ui-pop-up-open-516939", "./../asset/testljud/soundshelfstudio-ui-pop-up-open-516939.mp3");
};