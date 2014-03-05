//receiveData.js

/*
description
*/

//******************************************************************************
//Receiving Data
//******************************************************************************
var receiveData = function(data) {

    //check the source and destination of the incoming data
    if (originCheck(data) === true &&
        destinationCheck(data) === true) {
        
        //execute code based on type of data
        switch (data.type) {

            case 'textMessage':
            textMessage(data)
            break

            case 'textMessageSuccess':
            textMessageSuccess(data)
            break

            case 'warpDriveSignal':
            warpDriveSignal(data)
            break

            case 'scanForShip':
            scanForShip(data)
            break

            case 'scanForShipSuccess':
            scanForShipSuccess(data)
            break

            case 'incomingLaser':
            incomingLaser(data)
            break

            default:
        }
    }

    //**************************************************************************
    //Data Origin Check
    //**************************************************************************
    function originCheck(data) {
        if (data.origin != myShip.getPlayerName()) {
            return true  //pass
        }
        else {
            return false //fail
        }
    }

    //**************************************************************************
    //Data Destination Check
    //**************************************************************************
    function destinationCheck(data) {
        if (data.destination === 'open' || 
            data.destination === myShip.getPlayerName()) {
            return true  //pass
        }
        else {
            return false //fail
        }
    }

    //**************************************************************************
    //Text Message
    //**************************************************************************
    function textMessage(data) {
        terminal = $('#term_demo').terminal()
        terminal.echo(data.origin + ': ' + data.content)
        //send confirmation that message received
        sendData(
            'babb' + gameID,
            myShip.getPlayerName(), 
            data.origin, 
            'textMessageSuccess', 
            'none'
        )
    }
    function textMessageSuccess(data) {
        terminal = $('#term_demo').terminal()
        terminal.echo('Message sent')
    }

    //**************************************************************************
    //Warp Drive Signal
    //**************************************************************************
    function warpDriveSignal(data) {
        terminal = $('#term_demo').terminal()
        terminal.echo('A warp drive has been detected')
    }

    //**************************************************************************
    //Scanning Signal
    //**************************************************************************
    function scanForShip(data) {
        terminal = $('#term_demo').terminal()
        terminal.echo('We are being scanned')
        sendData(
            'babb' + gameID,
            myShip.getPlayerName(), 
            data.origin, 
            'scanForShipSuccess',
            'none'
        )
    }
    function scanForShipSuccess(data) {
        ig.game.spawnEntity(EntityShip, 0, 0)
        terminal = $('#term_demo').terminal()
        terminal.echo(data.origin + ' has been detected')
    }

    //**************************************************************************
    //Incoming Laser
    //**************************************************************************
    function incomingLaser(data) {
        myShip.incomingLaser(value)
    }
}


/*
OLD CODE BELOW
needs to be sorted, relocated, intergrated , and/or phased out
*/

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
})