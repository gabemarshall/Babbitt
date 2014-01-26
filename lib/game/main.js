ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	'game.entities.player',
	'game.entities.laser',
	'game.entities.ship',
	'game.entities.shields',
	'game.entities.eshields',
	// 'impact.debug.debug',
	'game.levels.battle'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	centerXText: "",
	centerYText: "",
	gravity: 250, // All entities are affected by this
	gameState: true, // game should still be running
	killedPlayer: "",
	count: 0, // used for end game drawing text
	mydebug: false,
	showWelcome: true,
	laserFired: false,
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	MenuImage: new ig.Image( 'media/sample_HUD.png' ),
	TurretImage: new ig.Image( 'media/Laser_Turret.png' ),


	
	
	init: function() {

		// ig.music.add( 'media/battlefight.og3');
		// ig.music.add( 'media/crappydeathsong.ogg');
		// ig.music.loop = true;
		// ig.music.play();
		// ig.music.volume = 0.8;
		
		
		
		// Bind keys
		

		ig.input.bind( ig.KEY.LEFT_ARROW, 'p2left');
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'p2right');
		ig.input.bind( ig.KEY.UP_ARROW, 'p2up');
		ig.input.bind( ig.KEY.DOWN_ARROW, 'p2down');
	

		ig.input.bind( ig.KEY.TAB, 'debug' );
		ig.input.initMouse()


		// Load blank level
		this.loadLevel( LevelBattle );

		this.welcomeTimer = new ig.Timer(2); // Timer to hide welcome Message



	},
	
	update: function() {		


		this.parent();



		
		// set variables for players, spears, and hearts
		// here we will have the basic game logic

		//var player1 = ig.game.getEntitiesByType( EntityPlayer )[0];
		
	},
	
	draw: function() {

		this.centerXText = (ig.system.width - 70) / 2
		this.centerYText = ig.system.height / 2
		// Draw all entities and BackgroundMaps
		this.parent();

		this.MenuImage.draw(0, 0 );

		
		this.TurretImage.draw(0,0);
		//this.LaserImage.draw(0,0);
		//this.LaserImage.draw(0,0);
		
		if(this.gameState){

		var player = this.getEntitiesByType( EntityPlayer )[0];

			

			if (this.welcomeTimer.delta() < 0) {
				this.font.draw( 'Welcome to Babbitt', this.centerXText, 25);
		    }

			if(ig.input.state('debug')){
				this.font.draw('Debug Message', (ig.system.width - 70) / 2, ig.system.height / 2)
				this.font.draw("X:"+ ig.input.mouse.x, 270, 10)
				this.font.draw("Y:"+ ig.input.mouse.y, 270, 30)
				this.font.draw(termInit, 270, 50)
				//this.font.draw(, 270, 75)
			}
		
			this.count += 1;
	
		// ig.system.context.fillStyle = "rgb(255,255,255)";
  //       ig.system.context.strokeStyle = "rgb(255,255,255)";
  //       ig.system.context.lineWidth = 3;
  //       ig.system.context.beginPath();
  //       ig.system.context.rect(270, 80, 2000, 50);
  //       ig.system.context.closePath();
  //       ig.system.context.fill();
  //       ig.system.context.stroke();        
		
		
			
		}

	}
});


// Start the Game with 60fps, a resolution of 240x160, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 320, 240, 3 );
});
