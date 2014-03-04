//game_console.js

//Terminal
$(document).ready(function() {
    
    //Terminal Initialization
    function initializeTerminal(term) {
        sendData(
            'babb' + gameID,
            myShip.getPlayerName(), 
            'open', 
            'warpDriveDetected', 
            'none'
        )
        term.echo('Systems Online')
    }

    //Terminal Input
    $('#term_demo').terminal(function(command, term) {

        //Terminal Logic
        terminalLogic(command)

        //Laser command
        if (command.indexOf('laser') >= 0 || command.indexOf('laser_fire') >= 0) {
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

        //Listen for data
        pubnub.subscribe({
            channel: 'babb' + gameID,        
            callback: function(message) {

                //Receive Data
                receiveData(message)

                //Warning of opponent firing lasers
                if (message.incoming_laser) {
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
                        } 
                        else {
                            term.echo("No damage taken.")
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