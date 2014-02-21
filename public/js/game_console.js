//Code realating to the game console/terminal
//babbitt.gabemarshall.me/pushitrealgood
//babbitt.gabemarshall.me

//Terminal Logic
var terminalLogic = function(input) {
    
    input = cleanInput(input)
    var commandFound = false

    //list of available commands
    commandList = [ 
        '/t',
        '/shields',
        '/lasers',
        '/playername',
        '/shipname'
    ]

    //find commands in input
    for (var i = 0; i < commandList.length; i++) {
        if (input.search(commandList[i]) != -1) {
            commandFound = true
            switch (commandList[i]) {

                case '/t':
                sendTextMessage(commandList[i], input)
                break

                case '/shields':
                break

                case '/lasers':
                break

                case '/playername':
                changePlayerName(commandList[i], input)
                break

                case '/shipname':
                changeShipName(commandList[i], input)
                break

                default:
            }
        }
    }
    //if no command was found in the input
    if (commandFound === false) {
        unknownCommand(input)
    }
    //cleanup user input
    function cleanInput(input) {
        input = input.trim()
        input = input.toLowerCase()
        return input
    }
    //remove the command from input
    function removeCommand(command, input) {
        input = input.replace(command, '')
        return input
    }
    //transmit text message
    function sendTextMessage(command, input) {
        input = input.replace(command, '')
        //Phase out
        sendMessage({
            transmit: input,
            playerName: myShip.playerName
        })
        //Phase out
        //sendData(dataType.textMessage(myship.playerName, input))
    }
    //unknown command
    function unknownCommand(command) {
        terminal = $('#term_demo').terminal(function(command, term) {})
        terminal.echo('Unknown Command: ' + command)
    }
    //change the name of player
    function changePlayerName(command, name) {
        name = name.replace(command, '')
        name = name.trim()
        if (name == '' || name == myShip.getPlayerName) {
            terminal = $('#term_demo').terminal(function(command, term) {})
            terminal.echo('Player Name is currently: ' + myShip.getPlayerName())
        }
        else {
            myShip.setPlayerName(name)
            terminal = $('#term_demo').terminal(function(command, term) {})
            terminal.echo('Player Name set to: ' + myShip.getPlayerName())
        }
    }
    //change the name of ship
    function changeShipName(command, name) {
        name = name.replace(command, '')
        name = name.trim()
        if (name != '' && name != myShip.getShipName) {
            myShip.setShipName(name)
            terminal = $('#term_demo').terminal(function(command, term) {})
            terminal.echo('Ship name set to: ' + myShip.getShipName())            
        }
        else {
            terminal = $('#term_demo').terminal(function(command, term) {})
            terminal.echo('Ship name is currently: ' + myShip.getShipName())
        }
    }
}

/*
//framework for types of data  to send/receive
var dataType = {
    textMessage: function(value1, value2) {
        return {
            type: "textMessage",
            shipName: value1,
            message: value2
        }
    }
    laserValue: function(value1, value2) {
        retunr {
            type: "laserValue",
            shipName: value1,
            amount: value2
        }
    }
}

//framework to send data
var sendData = function(data) {
    pubnub.publish({
        channel: "babb" + gameID,
        data: data
    })
}

//framework for receiving data
var receiveData = function(data) {
    //code
}
*/

//Terminal
$(document).ready(function() {
    
    //Terminal Initialization
    function initializeTerminal(term) {
        term.echo('Initialize Terminal')
    }

    //Terminal Input
    $('#term_demo').terminal(function(command, term) {

        //Terminal Logic
        terminalLogic(command)

        var oppJoined = function() {
            term.echo(enemyShip.playerName + ' has entered this sector')
            ig.game.spawnEntity(EntityShip, 0, 0);
            sendMessage({
                'playerInit': 'true',
                'shipData': myShip
            })
            gameBegun = true;
        }

        // Check if the game was just loaded, if so then the player will need to enter their name
        if (!termInit) {
            myShip.playerName = command;
            term.echo('Player Name: ' + command);
            term.echo('Sector: ' + gameID);
            sendMessage({
                'playerInit': 'true',
                'shipData': myShip
            })
            termInit = true; //game has been initialized
        }

        //Interpret console commands
        else if (command != '') {

            //Transmit message
            if (command.indexOf('/t') >= 0) {
                //moved to terminalLogic
            }

            //Laser command
            else if (command.indexOf('laser') >= 0 || command.indexOf('laser_fire') >= 0) {
                var laserValue = command.replace(/(laser)/g, "")
                //Input error
                if (!laserValue) {
                    term.echo('Error: You must enter a value after the Laser command');
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
                        "playerName": myShip.playerName
                    })
                    setTimeout(function() {
                        sendMessage({
                            "laser": laserValue,
                            "playerName": myShip.playerName
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
            //moved to terminalLogic
        }


        if (!gameBegun) {
            var consoleChecksGameStatus = setInterval(function() {
                if (enemyShip && !gameBegun) {
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
                if (message.UPDATE && message.UPDATE.playerName != myShip.playerName) {
                    enemyShip = message.UPDATE;
                }

                //Get opponent's name
                if (message.playerInit) {
                    if (message.shipData.playerName != myShip.playerName && !enemyShip) {
                        enemyShip = message.shipData;
                        oppJoined()
                    }
                }

                //Incoming chat dialog from opponent
                if (message.transmit) {
                    if (message.playerName != myShip.playerName) {
                        term.echo(message.playerName + " :[[b;#000;#d3d3d3]" + message.transmit + "]");
                    }
                }

                //Warning of opponent firing lasers
                else if (message.incoming_laser) {
                    if (message.playerName != myShip.playerName) {
                        term.echo(message.playerName + " is preparing to fire laser.");
                    }
                }
                //Apply opponent lasers
                else if (message.laser) {
                    if (message.playerName != myShip.playerName) {
                        var laserDamage = adjustLaserValue(message.laser);
                        adjustShipHP(laserDamage);
                        if (laserDamage > 0){
                            term.echo("Damage taken. Hull down to "+myShip.hull.damage.current+" percent.")
                            shakeScreen()
                            notifyPlayerDamage(true)
                            updateOtherPlayer()
                        } else {
                            term.echo("No damage taken.")
                            notifyPlayerDamage(false)
                            updateOtherPlayer()
                        }
                        
                        
                    }
                }

                //Send message to opponent on whether his laser attack was successful or not
                else if (message.title === 'DAMAGE' && message.playerName != myShip.playerName) {
                    laserActive = false //disengage laser to allow them to fire again
                    
                        //unsuccessful
                        if (!message.successful) {
                            var laser = ig.game.getEntitiesByType(EntityLaser)[0];
                            laser.kill()
                            ig.game.spawnEntity(EntityeShields, 0, 0);
                            ig.game.spawnEntity(EntityLaserHit, 0, 0);
                        }
                        //successful
                        else {
                            term.echo("Laser appeared to do damage blah blah blah");
                            var laser = ig.game.getEntitiesByType(EntityLaser)[0];
                            laser.kill();
                            ig.game.spawnEntity(EntityLaserHit, 0, 0);
                            // if (!checkIfAlive(message.hitpoints)) {
                            //     destroyEnemyShip();
                            //     term.echo("Enemy Annihilated");
                            // }
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