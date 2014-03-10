//dataLogic.js
/*
description
*/

//******************************************************************************
//Pubnub Publish
//******************************************************************************
var sendData = function(channel, origin, destination, type, content) {
    pubnub.publish({
        channel: channel,
        message: {
            origin:         origin,
            destination:    destination,
            type:           type,
            content:        content
        }
    })
}

var data = new function dataClass() {
    this.send = new function sendClass() {
         this.textMessage = function(channel, origin, destination, type, content) {
             pubnub.publish({
                channel: channel,
                message: {
                    origin:         origin,
                    destination:    destination,
                    type:           type,
                    content:        content
                }
            })  
        }     
     }
}


//******************************************************************************
//Pubnub Subscribe
//******************************************************************************
pubnub.subscribe({
    channel: 'babb' + gameID,        
    callback: function(message) {
        receiveData(message) //Receive Data
    }
})

//******************************************************************************
//Receive Data
//******************************************************************************
var receiveData = function(data) {
    //check the source and destination of the incoming data
    if (originCheck(data) === true) {
        
        //execute code based on type of data received
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

            case 'laser':
            break

            case 'confirmTarget':
            break

            case 'confirmTargetSuccess':
            break

            default:
        }
    }

    //**************************************************************************
    //Data Origin Check
    //**************************************************************************
    function originCheck(data) {
        if (data.origin != ship.getID()) {
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
        if (data.destination === 'none' || 
            data.destination === ship.getID()) {
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
        if (destinationCheck(data) === true) {
            terminalOutput(data.origin + ': ' + data.content)
            //send confirmation that message received
            sendData(
                ship.getLocation(),
                ship.getID(), 
                data.origin, 
                'textMessageSuccess', 
                'none'
            )
        }
    }

    function textMessageSuccess(data) {
        terminalOutput('Message sent')
    }

    //**************************************************************************
    //Warp Drive Signal
    //**************************************************************************
    function warpDriveSignal(data) {
         terminalOutput('A warp drive signal has been detected.')
    }

    //**************************************************************************
    //Scanning
    //**************************************************************************
    function scanForShip(data) {
        terminalOutput('We are being scanned.')
        sendData(
            ship.getLocation(),
            ship.getID(), 
            data.origin, 
            'scanForShipSuccess',
            'none'
        )
    }

    function scanForShipSuccess(data) {
        ig.game.spawnEntity(EntityShip, 0, 0)
         terminalOutput(data.origin + ' has been detected.')
    }

    //**************************************************************************
    //Targeting
    //**************************************************************************
    function confirmTarget() {
        
    }

    function confirmTargetSuccess() {

    }
}