ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityPlayer = ig.Entity.extend({
	
	// The players (collision) size is a bit smaller than the animation
	// frames, so we have to move the collision box a bit (offset)
	size: {x: 32, y:32},
	offset: {x: 0, y: 0},
	gravityFactor: 0,
	
	// maxVel: {x: 100, y: 200},
	// friction: {x: 600, y: 0},
	
	type: ig.Entity.TYPE.A, // Player friendly group
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.PASSIVE,
	messagebox:"Test",
	
	animSheet: new ig.AnimationSheet( 'media/redknight/red.png', 32, 32 ),
	
	
	// These are our own properties. They are not defined in the base
	// ig.Entity class. We just use them internally for the Player
	flip: false,
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		// Add the animations
		
		// Idle animations

		
		this.addAnim( 'idleLowNo', 1, [14]);
		this.addAnim( 'idleMidNo', 1, [34]);
		this.addAnim( 'idleHighNo', 1, [54]);
		this.addAnim( 'idleLowYes', 1, [74]);
		this.addAnim( 'idleMedYes', 1, [94]);
		this.addAnim( 'idleHighYes', 1, [114]);

		this.addAnim( 'runLowNo', .05, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]);
		this.addAnim( 'runLowNoReverse', .05, [19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1]);
		this.addAnim( 'runMidNo', .05, [20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39]);
		this.addAnim( 'runMidNoReverse', .05, [39,38,37,36,35,34,33,32,31,30,29,28,27,26,25,24,23,22,21,20]);
		this.addAnim( 'runHighNo', .05, [40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59]);
		this.addAnim( 'runHighNoReverse', .05, [59,58,57,56,55,54,53,52,51,50,49,48,47,46,45,44,43,42,41,40]);

		this.addAnim( 'death', .1, [118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140]);
		this.addAnim( 'deathend', 1, [139]);

		this.addAnim( 'runLowYes', .05, [60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79]);
		//this.addAnim( 'runMidYes', .05, [80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99]);


	},
	
	update: function() {

		var spear = ig.game.getEntitiesByType( EntitySpear )[0];
		
		if (spear.thrust){
			base = 10;
			this.pos.x = spear.pos.x - base;
		} else {
			base = 0;
			this.pos.x = spear.pos.x - base;
		}
		
		
		// move!
		this.parent();
	}
});

});