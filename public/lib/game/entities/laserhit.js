ig.module(
    'game.entities.laserhit'
)
    .requires(
        'impact.entity'
)
    .defines(function() {

        EntityLaserHit = ig.Entity.extend({

            // The players (collision) size is a bit smaller than the animation
            // frames, so we have to move the collision box a bit (offset)

            offset: {
                x: 0,
                y: 0
            },
            gravityFactor: 0,

            // maxVel: {x: 100, y: 200},
            // friction: {x: 600, y: 0},

            type: ig.Entity.TYPE.A, // Player friendly group
            checkAgainst: ig.Entity.TYPE.NONE,
            collides: ig.Entity.COLLIDES.PASSIVE,
            animSheet: new ig.AnimationSheet('media/laser_hit/laserhit.png', 320, 240),

            // animSheet: new ig.AnimationSheet( 'media/redknight/red.png', 32, 32 ),


            // These are our own properties. They are not defined in the base
            // ig.Entity class. We just use them internally for the Player
            flip: false,

            init: function(x, y, settings) {
                this.parent(x, y, settings);

                // Add the animations

                // Idle animations


                this.addAnim('hit', .08, [0, 1, 2, 3, 4, 5]);
                // this.timer = new ig.Timer(1);




            },

            update: function() {

                if (this.anims.hit.frame === 5) {
                    this.kill()
                }
                // if (this.timer.delta() > 0) {
                // 	this.kill()
                //    }

                this.parent();
            }
        });

    });
