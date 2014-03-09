//receiveData.js
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

//******************************************************************************
//Pubnub Subscribe
//******************************************************************************
pubnub.subscribe({
    channel: 'babb' + gameID,        
    callback: function(message) {

        //Receive Data
        receiveData(message)
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
            lased(data)
            break

            default:
        }
    }

    //**************************************************************************
    //Data Origin Check
    //**************************************************************************
    function originCheck(data) {
        if (data.origin != ship.getPlayerName()) {
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
            data.destination === ship.getPlayerName()) {
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
        terminalOutput(data.origin + ': ' + data.content)
        //send confirmation that message received
        sendData(
            'babb' + gameID,
            ship.getPlayerName(), 
            data.origin, 
            'textMessageSuccess', 
            'none'
        )
    }
    function textMessageSuccess(data) {
        terminalOutput('Message sent')
    }

    //**************************************************************************
    //Warp Drive Signal
    //**************************************************************************
    function warpDriveSignal(data) {
         terminalOutput('A warp drive has been detected')
    }

    //**************************************************************************
    //Scanning
    //**************************************************************************
    function scanForShip(data) {
        terminalOutput('We are being scanned')
        sendData(
            'babb' + gameID,
            ship.getPlayerName(), 
            data.origin, 
            'scanForShipSuccess',
            'none'
        )
    }

    function scanForShipSuccess(data) {
        ig.game.spawnEntity(EntityShip, 0, 0)
         terminalOutput(data.origin + ' has been detected')
    }

    //**************************************************************************
    //Lasers
    //**************************************************************************
    function laser(data) {
        //send a laser
    }
}