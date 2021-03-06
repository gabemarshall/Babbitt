ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	'game.entities.player',
	'game.entities.laser',
	'game.entities.laserhit',
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
	
	mydebug: false,
	showWelcome: true,
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

		var player = this.getEntitiesByType( EntityPlayer )[0];

			

			if (this.welcomeTimer.delta() < 0) {
				this.font.draw( 'Welcome to Babbitt', this.centerXText, 25);
		    }

			if(ig.input.state('debug')){

				this.font.draw(globalTest, (ig.system.width - 70) / 2, ig.system.height / 2)
				this.font.draw("X:"+ ig.input.mouse.x, 270, 10)
				this.font.draw("Y:"+ ig.input.mouse.y, 270, 30)
				this.font.draw(termInit, 270, 50)
				//this.font.draw(, 270, 75)
			}
		
			this.count += 1;
	
		// Power
		this.font.draw("P", 271, 185)
		

		ig.system.context.fillStyle = "rgb(128,128,128)";
        ig.system.context.strokeStyle = "rgb(255,255,255)";  // Power low rgb(236,30,30)";
        ig.system.context.lineWidth = 3;
        ig.system.context.beginPath();
        //ig.system.context.rect(810, 700, 20, -powerLevel);
        ig.system.context.closePath();
        ig.system.context.fill();
        ig.system.context.stroke();        
		
		this.font.draw("S", 285, 185)
		// shields
		ig.system.context.fillStyle = "rgb(51,153,255)";
        ig.system.context.strokeStyle = "rgb(255,255,255)";
        ig.system.context.lineWidth = 3;
        ig.system.context.beginPath();
        //ig.system.context.rect(850, 700, 20, -shieldLevel);
        ig.system.context.closePath();
        ig.system.context.fill();
        ig.system.context.stroke();      
			
		

	}
});


// Start the Game with 60fps, a resolution of 240x160, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 320, 240, 3 );
});
