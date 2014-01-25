ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	'game.entities.player',
	//'impact.debug.debug',
	'game.levels.test'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	gravity: 250, // All entities are affected by this
	gameState: true, // game should still be running
	killedPlayer: "",
	count: 0, // used for end game drawing text
	count1: 0, // same as above, will change to better var name soon
	deathanim: 145,
	deathSoundCounter: 0, // a counter to make sure the death sound is only played once
	nettimer: 0, // used for socket.io
	playerJoined: false,
	mydebug: false,
	speardif: 0, // difference between x positions of the two spears
	showWelcome: true,
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	deathSound: function(){
		if(this.deathSoundCounter == 0){
			var sound1 = new ig.Sound( 'media/die.ogg' );
			sound1.play();
			this.deathSoundCounter = 1;
		}
	},

	
	
	init: function() {

		ig.music.add( 'media/battlefight.og3');
		ig.music.add( 'media/crappydeathsong.ogg');
		ig.music.loop = true;
		ig.music.play();
		ig.music.volume = 0.8;
		
		
		
		// Bind keys
		ig.input.bind( ig.KEY.A, 'left' );
		ig.input.bind( ig.KEY.D, 'right' );
		ig.input.bind( ig.KEY.W, 'up' );
		ig.input.bind( ig.KEY.S, 'down' );
		ig.input.bind( ig.KEY.X, 'jump' );
		ig.input.bind( ig.KEY.C, 'stab' );
		ig.input.bind( ig.KEY.V, 'strike' );
		ig.input.bind( ig.KEY.F, 'dodge' );

		ig.input.bind( ig.KEY.LEFT_ARROW, 'p2left');
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'p2right');
		ig.input.bind( ig.KEY.UP_ARROW, 'p2up');
		ig.input.bind( ig.KEY.DOWN_ARROW, 'p2down');
		ig.input.bind( ig.KEY.M, 'p2stab');
		ig.input.bind( ig.KEY.K, 'p2dodge' );
		ig.input.bind( ig.KEY.N, 'p2strike' );

		ig.input.bind( ig.KEY.Q, 'help' );


		

		
		// Load the LevelTest as required above ('game.level.test')
		this.loadLevel( LevelTest );

		// set variables for player instances
		// grab positions and spawn spears
		// The "player" more or less will follow it's spear (the spear does the actual movement)

		var player = this.getEntitiesByType( EntityPlayer )[0]; 
		var player2 = this.getEntitiesByType( EntityPlayer2 )[0];
		player1X = player.pos.x + 40;
		player1Y = player.pos.y + 14;
		player2X = player2.pos.x - 40;
		player2Y = player2.pos.y + 14;

		ig.game.spawnEntity(EntitySpear,player1X,player1Y);
		ig.game.spawnEntity(EntityBear,player2X,player2Y);

		// spawn hearts for each player

		ig.game.spawnEntity(EntityHeart,100,180); 
		ig.game.spawnEntity(EntityHeart,50,180);

		// spawn both spears where the players are located

		var spear1 = ig.game.getEntitiesByType( EntitySpear )[0];
		var spear2 = ig.game.getEntitiesByType( EntityBear )[0];
		var heart1 = ig.game.getEntitiesByType( EntityHeart )[0];
		var heart2 = ig.game.getEntitiesByType( EntityHeart )[1];

		heart1.pos.y = spear1.pos.y;
		heart2.pos.y = spear2.pos.y;



	},
	
	update: function() {		


		// if(this.nettimer < 1)
		// {
		//    	socket.emit('moveplayer', { hello: 'World2' });
		//     this.nettimer = 100;
			
		
		// }
		// this.nettimer = this.nettimer - 1;


		this.parent();



		
		// set variables for players, spears, and hearts
		// here we will have the basic game logic

		var spear1 = ig.game.getEntitiesByType( EntitySpear )[0];
		var spear2 = ig.game.getEntitiesByType( EntityBear )[0];
		var player1 = this.getEntitiesByType( EntityPlayer )[0];
		var player2 = this.getEntitiesByType( EntityPlayer2 )[0];
		var heart1 = ig.game.getEntitiesByType( EntityHeart )[0];
		var heart2 = ig.game.getEntitiesByType( EntityHeart )[1];
		
		
		heart1.pos.x = player1.pos.x + 15;
		heart2.pos.x = player2.pos.x + 15;

		// determine hitbox location to calculate whether death should happen
		var hitbox = heart2.pos.x - spear1.pos.x;
		var hitbox2 = spear2.pos.x - heart1.pos.x;

		// calculate the distance between spears, if the two players are too close, they won't be able to hit each other
		this.speardif = spear2.pos.x - spear1.pos.x;


		if (hitbox <= 56 && this.killedPlayer != "Player 1" && spear2.dodgeState === spear1.dodgeState && spear1.thrust && this.speardif > 2){
			// end game here
			this.count = 0;
			this.killedPlayer = "Player 2";
			this.deathSound();
			

		}

		else if (hitbox2 <= 1 && this.killedPlayer != "Player 2" && spear1.dodgeState === spear2.dodgeState && spear2.thrust && this.speardif > 2){
			
			this.count = 0;
			this.killedPlayer = "Player 1";
			this.deathSound();
			
			// end game p2 wins
		}

		if(this.killedPlayer == "Player 1"){

			player1.currentAnim = player1.anims.death;
			spear1.gravityFactor = 1;
			spear1.stamina = 0;
			if(player1.anims.death.frame == 22){
				player1.currentAnim = player1.anims.deathend;
				if(this.gameState){
					ig.music.next();
					
				}
				//ig.system.stopRunLoop.call(ig.system);
				this.gameState = false;
				spear1.gameState = false;
				spear1.anims.idle.alpha = 0;
			}

		} else if (this.killedPlayer == "Player 2"){
			
			player2.currentAnim = player2.anims.death;
			spear2.gravityFactor = 1;
			spear2.stamina = 0;
			if(player2.anims.death.frame > 20){
				player2.currentAnim = player2.anims.deathend;
				if(this.gameState){
					ig.music.next();
				}
				//ig.system.stopRunLoop.call(ig.system);
				this.gameState = false;
				spear2.gameState = false;
				spear2.pos.y = 500;
				spear2.currentAnim = spear2.anims.idledead;

			}

		}

		// regenerate stamina for both players

		if(spear1.stamina < 10 || spear2.stamina < 10 && this.nettimer < 100){

			this.nettimer++
			
			if (this.nettimer >= 100){
				spear1.stamina += 1;
				if(spear2.stamina < 10){
					spear2.stamina += 1;
				}
				
				this.nettimer = 0;
			}
		}


	},
	
	draw: function() {
		// Draw all entities and BackgroundMaps
		this.parent();


		if(this.gameState){
		var heart1 = ig.game.getEntitiesByType( EntityHeart )[0];
		var player = this.getEntitiesByType( EntityPlayer )[0];
		var player2 = this.getEntitiesByType( EntityPlayer2 )[0];
		var spear = this.getEntitiesByType( EntitySpear )[0];
		var spear2 = this.getEntitiesByType( EntityBear )[0];

		if(this.showWelcome && this.count < 200 ){
			this.font.draw( 'Welcome to Heart of Honor', 95, 5);
			this.font.draw( 'P1 Movement: a,s,d,w', 2, 25);
			this.font.draw( 'P1 Stab: c', 2, 35);
			this.font.draw( 'P1 Lunge: v', 2, 45);
			this.font.draw( 'P1 Dodge: f', 2, 55);

			this.font.draw( 'P2 Movement: Arrow keys',200,25);
			this.font.draw( 'P2 Stab: m',200,35);
			this.font.draw( 'P2 Lunge: n',200,45);
			this.font.draw( 'P2 Dodge: k',200,55);
			this.count += 1;
		} else if (this.count < 300 && !this.killedPlayer){
			this.showWelcome = false;
			this.font.draw( 'Fight!', 135, 5);
			this.font.draw( '(Hold Q to show controls)', 95, 15);
			this.count += 1;
		}
		
		
		if(ig.input.state('help')){
			this.font.draw( 'P1 Movement: a,s,d,w', 2, 25);
			this.font.draw( 'P1 Stab: c', 2, 35);
			this.font.draw( 'P1 Lunge: v', 2, 45);
			this.font.draw( 'P1 Dodge: f', 2, 55);

			this.font.draw( 'P2 Movement: Arrow keys',200,25);
			this.font.draw( 'P2 Stab: m',200,35);
			this.font.draw( 'P2 Lunge: n',200,45);
			this.font.draw( 'P2 Dodge: k',200,55);
		}


		if(spear.stamina < 7 && spear.stamina > 1){
		this.font.draw( 'Player 1 looks tired..', 2, 75);
		}

		if(spear.stamina < 2 && this.killedPlayer != "Player 1"){
		this.font.draw( 'Player 1 looks exhausted..', 2, 75);
		}

		if(spear2.stamina < 7 && spear2.stamina > 1){
		this.font.draw( 'Player 2 looks tired..', 200, 75);
		}

		if(spear2.stamina < 2 && this.killedPlayer != "Player 2"){
		this.font.draw( 'Player 2 looks exhausted..', 200, 75);
		}
		// this.font.draw( 'Thrust: '+spear2.thrust+'',200,105);


		if(this.mydebug){

		this.font.draw( 'X: '+spear.pos.x+' Y:'+spear.pos.y+'', 2, 135);
		this.font.draw( 'SpearDif'+this.speardif+'', 2, 145);
		this.font.draw( 'X: '+spear2.pos.x+' Y:'+spear2.pos.y+'',200,135);
		// this.font.draw( 'Heart X: '+heart1.pos.x+' Y:'+heart1.pos.y+'',200,145);
		}

		
			
		} else {
			this.count += .1;
			if(this.count >= 10){
				if(this.deathanim > -110){
				this.count1 += .0008;
				this.deathanim = this.deathanim - this.count1;
				
				
				}
				
			}
			if(this.count >= 30){
				this.font.draw( 'Credits', 140, this.deathanim + 100);
			}
			if(this.count >= 40){
				this.font.draw( 'Game Design & Artwork by William Lawrence', 70, this.deathanim + 130);
			}
			if(this.count >= 50){
				this.font.draw( 'Game Development & Design by Gabe Marshall', 70, this.deathanim + 150);
			}
			if(this.count >= 70){
				this.font.draw( 'Music made lovingly by Stephen Baker', 80, this.deathanim + 190);
			}
			if(this.count >= 90){
				this.font.draw( 'Made with Impact JS during the 2013 Global Game Jam', 45, 125);
			}

			var deathMsg = this.font.draw( ''+this.killedPlayer+', thou hast died...',100,this.deathanim);
			
		}

		// this.font.draw( 'SpriteSheet: '+player.currentAnim.sheet+'', 2, 135);

		
	//	this.font.draw( 'Welcome to Heart of Honor...', 2, 2 );
	}
});


// Start the Game with 60fps, a resolution of 240x160, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 320, 240, 3 );
});
