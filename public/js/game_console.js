//console takes in user input and breaks it down into something suitable to be passed to commandLogic

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

var terminalLogic = function(inputString) {
    var commandList = ["/t",
                       "sheilds",
                       "lasers"
                      ]

    var input = inputString.trim()
    var input = input.toLowerCase()
    
    for (var i = 0; i < commandList.length; i++) {
        if (input.search(commandList[i]) != -1) {
            switch (commandList[i]) {
                case "/t":
                talk(input)
                break
                case "shields":
                sheilds()
                break
                default:
                alert("default")
            }
        }
    }

    function talk(input) {
        var message = input.replace("/t", "")
    }

    function shields(blah) {

    }
}

//Terminal
$(document).ready(function() {
    
    function initializeTerminal(term) {
        term.echo("initializeTerminal")
    }

    $('#terminal').terminal(function(command, term) {

        var oppJoined = function() {
            term.echo("Player " + oppName + " has entered this sector")
            ig.game.spawnEntity(EntityShip, 0, 0);
            sendMessage({
                "playerInit": "true",
                "playerName": playerName
            })
            gameBegun = true;
        }

        // Check if the game was just loaded, if so then the player will need to enter their name
        if (!termInit) {
            term.echo("Enter Name: ");
            playerName = command;
            term.echo("Player Name: " + command);
            term.echo("Sector: " + gameID);
            sendMessage({
                "playerInit": "true",
                "playerName": command
            });
            termInit = true; //game has been initialized
        }

        //Interpret console commands
        else if (command != "") {

            //Transmit message
            if (command.indexOf("/t") >= 0) {
                var transmit = console.talkToPlayer(command);
                sendMessage({
                    "transmit": transmit,
                    "playerName": playerName
                })
                term.echo("Message Sent")
            }

            //Laser command
            else if (command.indexOf("laser") >= 0 || command.indexOf("laser_fire") >= 0) {
                var laserValue = command.replace(/(laser)/g, "")
                //Input error
                if (!laserValue) {
                    term.echo("Error: You must enter a value after the Laser command");
                }
                //Shields active
                if (shieldsActive) {
                    term.echo("Error: Cannot engage lasers while Shields are raised");
                }
                //Laser already active
                else if (laserActive) {
                    term.echo("Error: Laser system currently engaged");
                }
                //Power unavailable
                else if (!checkPowerAvailability(laserValue, "laser")) {
                    term.echo("Error: Not enough power");
                }
                //Power available
                else {
                    term.echo("Firing Lasers")
                    laserActive = true;
                    //Send oppoent warning of lasers being fired
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
            }

            //Shields command
            else if (command.indexOf("shields") >= 0) {
                var shieldsPowerValue = command.replace(/(shields)/g, "");
                //Input error
                if (!shieldsPowerValue) {
                    term.echo("Error: You must enter a value after the Shields command");
                }
                //Lower shields
                else if (shieldsPowerValue == 0) {
                    term.echo("Lowering shields to: " + shieldsPowerValue);
                    shieldsActive = false;
                }
                //Raise shields
                else if (checkPowerAvailability(shieldsPowerValue, "shields") && shieldsPowerValue != 0) {
                    term.echo("Raising shields to: " + shieldsPowerValue);
                    ig.game.spawnEntity(EntityShields, 0, 0);
                    shieldsActive = true;
                }
                else {
                    term.echo("ERROR: Not enough power");
                }
            }
        }

        // Unknown command
        else {
            term.echo("ERROR: Unknown Command");
        }


        if (!gameBegun) {
            var consoleChecksGameStatus = setInterval(function() {
                if (oppName && !gameBegun) {
                    gameBegun = true;
                    oppJoined();
                }
            }, 1000)
        }

        //Multiplayer
        pubnub.subscribe({
            channel: 'babb' + gameID,
            callback: function(message) {

                //If incoming message is from the opponent
                if (message.UPDATE && message.SENDER != playerName) {
                    opponent = message.UPDATE;
                }

                //Get opponent's name
                if (message.playerInit) {
                    if (message.playerName != playerName && !oppName) {
                        oppName = message.playerName;
                    }
                }

                //Incoming chat dialog from opponent
                if (message.transmit) {
                    if (message.playerName != playerName) {
                        term.echo(message.playerName + " :[[b;#000;#d3d3d3]" + message.transmit + "]");
                    }
                }

                //Waring of opponent firing lasers
                else if (message.incoming_laser) {
                    if (message.playerName != playerName) {
                        term.echo(message.playerName + " is preparing to fire laser.");
                    }
                }
                //Apply opponent lasers
                else if (message.laser) {
                    if (message.playerName != playerName) {
                        var laserDamage = adjustLaserValue(message.laser);
                        adjustShipHP(laserDamage);
                        alert(shipHP);
                    }
                }

                //Send message to opponent on whether his laser attack was successful or not
                else if (message.laser_hit) {
                    laserActive = false //disengage laser to allow them to fire again
                    if (message.playerName != playerName) {
                        //unsuccessful
                        if (message.laser_hit === 0) {
                            var laser = ig.game.getEntitiesByType(EntityLaser)[0];
                            laser.kill()
                            ig.game.spawnEntity(EntityeShields, 0, 0);
                            ig.game.spawnEntity(EntityLaserHit, 0, 0);
                        }
                        //successful
                        else {
                            term.echo("Inflicted " + message.damage + " damage");
                            var laser = ig.game.getEntitiesByType(EntityLaser)[0];
                            laser.kill();
                            ig.game.spawnEntity(EntityLaserHit, 0, 0);
                            if (!checkIfAlive(message.hitpoints)) {
                                destroyEnemyShip();
                                term.echo("Enemy Annihilated");
                            }
                        }
                    }
                }
            }
        });
    }, 
    {
        greetings: "",
        prompt: "",
        height: 100,
        onInit: function(term) {
            initializeTerminal(term)
        }
    });
});