//var availableCommands = ["[[b;#000;#d3d3d3]help, list, ls] - List the available commands", "[[b;#000;#d3d3d3]about] - Learn a little about me", "[[b;#000;#d3d3d3]resume] - View my resume", "[[b;#000;#d3d3d3]projects] - View a list of some recent projects I have been working on.", "[[b;#000;#d3d3d3]contact] - Get my contact info", "[[b;#000;#d3d3d3]blog] - View my latest blog entry"];
var console = {
    list: function(term) {
        for (i = 0; i < availableCommands.length; i++) {
            term.echo(availableCommands[i]);
        }
    },
    talkToPlayer: function(message, term) {

        var msg = message.replace('/t', '')
        return msg

    }
}

$(document).ready(function() {
    $('#term_demo').terminal(function(command, term) {

        // Check if the game was just loaded, if so then the player will need to enter their name
        if (!termInit) {
            playerName = command
            term.echo("\nThank you, welcome Cpt. " + command + ".")
            sendMessage({
                "playerInit": "true",
                "playerName": command
            })
            term.echo("Clear skies today sir...Sit back and relax, I'll alert you if I see any trouble.\n")
            termInit = true
        } else if (command != '') {

            if (command.indexOf("/t") >= 0) {

                term.echo("Message Transmitted...");
                var transmit = console.talkToPlayer(command)
                sendMessage({
                    "transmit": transmit,
                    "playerName": playerName
                })

                // LOCAL PLAYER FIRE LASER

            } else if (command.indexOf("laser") >= 0 || command.indexOf("laser_fire") >= 0) {

                var laserValue = command.replace(/(laser)/g, "")
                if (!laserValue) {
                    var laserValue = 1
                }

                if (shieldsActive) {
                    term.echo("Error: Cannot engage lasers while Shields are up.")
                } else if (laserActive) {
                    term.echo("Error: Laser system already engaged")
                } else if (!checkPowerAvailability(laserValue, "laser")) {
                    term.echo("Error: Not enough available power.")
                } else {
                    term.echo("Firing laser cannon!")
                    laserActive = true

                    // Send opponent a warning message that
                    // lasers are warming up so they will have a chance to defend
                    sendMessage({
                        "incoming_laser": true,
                        "playerName": playerName
                    })
                    setTimeout(function() {
                        sendMessage({
                            "laser": laserValue,
                            "playerName": playerName
                        })
                    }, 4500)
                    ig.game.spawnEntity(EntityLaser, 0, 0);
                }

            } else if (command.indexOf("shields") >= 0) {
                var shieldsPowerValue = command.replace(/(shields)/g, "")
                if (shieldsPowerValue == 0) {
                    term.echo("Lowering shields");
                    shieldsActive = false

                }
                else if (!shieldsPowerValue) {
                    term.echo("Error: You must enter a value after the command Shields")
                } else if (checkPowerAvailability(shieldsPowerValue, "shields") && shieldsPowerValue != 0) {
                    
                    term.echo("Raising shields. Shields set to " + shieldsPowerValue);
                    ig.game.spawnEntity(EntityShields, 0, 0);
                    shieldsActive = true
                    // TODO setShields
                } else {
                    term.echo("Error: Not enough power, cannot raise shields to that level.")
                }

            }

        } else {
            term.echo('Unknown command...type \'help\' to see a list of commands');
        }

        var oppJoined = function() {
            term.echo("Oh shit! " + oppName + " has entered our sector! Bringing him on screen now...")
            ig.game.spawnEntity(EntityShip, 0, 0);
            sendMessage({
                "playerInit": "true",
                "playerName": playerName
            })

            gameBegun = true

        }

        var printMessage = function(msg) {
            term.echo(msg)
        }

        var consoleChecksGameStatus = setInterval(function() {
            if (oppName && !gameBegun) {
                gameBegun = true
                oppJoined()
            } else {

            }
        }, 1000)

        // MULTIPLAYER 

        pubnub.subscribe({
            channel: 'main_game',
            callback: function(message) {

                if (message.playerInit) {

                    if (message.playerName != playerName && !oppName) {
                        oppName = message.playerName
                    }
                }

                // MULTIPLAYER CHAT

                if (message.transmit) {


                    if (message.playerName != playerName) {

                        printMessage("Incoming Transmission from Cpt. " + message.playerName + ":[[b;#000;#d3d3d3]" + message.transmit + "] ")

                    }
                }

                // MULTIPLAYER FIRE LASER
                else if (message.incoming_laser) {
                    if (message.playerName != playerName) {
                        printMessage(message.playerName + " is warming up his lasers!")
                    }
                } else if (message.laser) {
                    if (message.playerName != playerName) {
                        if (shieldsActive) {
                            printMessage("We've been hit! No worries sir, shields were active so no damage was taken.")
                            shakeScreen()
                            sendMessage({
                                "laser_hit": false,
                                "damage": 0,
                                "playerName": playerName
                            })
                        } else {
                            printMessage("We've been hit! We took [[b;#FF0000;#000000]" + message.laser + "] damage sir..")
                            shakeScreen()
                            // Subtract damage from hitpoints
                            shipHP = shipHP - message.laser;


                            sendMessage({
                                "laser_hit": true,
                                "damage": message.laser,
                                "hitpoints": shipHP,
                                "playerName": playerName
                            })
                            if (!checkIfAlive(shipHP)) {
                                destroyEnemyShip()
                                printMessage("You are dead.")
                                setTimeout(function() {
                                    window.location = 'http://www.youtube.com/watch?v=mD7R5yx27ec#t=21'
                                }, 2000)

                            }
                        }
                    }
                }
                // MULTIPLAYER ATTACKER RECEIVES WHETHER OR NOT HIT WAS SUCCESSFUL
                else if (message.laser_hit) {
                    laserActive = false // disengage laser to allow them to fire again
                    if (message.playerName != playerName) {
                        if (message.laser_hit === 0) {
                            printMessage("No Damage was Inflicted, damnit")
                            var laser = ig.game.getEntitiesByType(EntityLaser)[0];
                            laser.kill()
                            ig.game.spawnEntity(EntityeShields, 0, 0);
                            ig.game.spawnEntity(EntityLaserHit, 0, 0);

                        } else {
                            printMessage("Inflicted " + message.damage + " points of damage! Hurrah!")
                            printMessage(message.playerName + " is down to " + message.hitpoints)
                            var laser = ig.game.getEntitiesByType(EntityLaser)[0];
                            laser.kill()
                            ig.game.spawnEntity(EntityLaserHit, 0, 0);
                            if (!checkIfAlive(message.hitpoints)) {
                                destroyEnemyShip()
                                printMessage("We've won sir! Good job!")
                            }
                        }

                    }
                }

            }
        });

    }, {
        greetings: 'Hello..Sir, Welcome to [[b;#000;#d3d3d3]Babbitt] . \nYou must be our new captain, what is your name?',
        name: 'js_demo',
        height: 150,
        prompt: '$> '
    });
    pubnub.publish({
        channel: 'main_game',
        message: "COUNT_REQ"
    })
});
$('#term_demo').click(function() {
    this.focus();
})

// red [[b;#FF0000;#000000]Babbitt]

// yellow [[b;#FFFF00;#000000]Babbitt]

//[[b;#000;#d3d3d3]help]
