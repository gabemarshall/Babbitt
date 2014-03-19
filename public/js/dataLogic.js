//dataLogic.js
/*
description
*/

//Pubnub Subscribe
//******************************************************************************
pubnub.subscribe({
    channel: 'babb' + gameID,        
    callback: function(message) {
        console.log('pubnub.suscribe')
        data.receive(message)
    }
})

//Data Logic
//******************************************************************************
var data = {
    //Send Data
    //**************************************************************************
    send: function(systemDestination, shipDestination, contentBlock) {
        var currentTime = new Date() //record current time
        var addressBlock = {
            id: currentTime.getTime(),
            origin: {
                system: ship.getLocation(),
                ship: ship.getID(),
            },
            destination: {
                system: systemDestination,
                ship: shipDestination,
            },
            timeStamp: {
                mil: currentTime.getMilliseconds(), //millisecond (0-999)
                sec: currentTime.getSeconds(), //second (0-59)
                min: currentTime.getMinutes(), //minute (0-59)
                hour: currentTime.getHours(), //hour (0-23)
                day: currentTime.getDay(), //day of week (0-6)
                date: currentTime.getDate(), //date of month (1-31)
                month: currentTime.getMonth(), //month (0-11)
                year: currentTime.getFullYear(), //year (four digit)
            },
        }
        var dataBlock = mergeBlocks(addressBlock, contentBlock)

        //send data through pubnub
        pubnub.publish({
            channel: dataBlock.destination.system,
            message: dataBlock
        })

        //fucntion to merge two objects
        function mergeBlocks(block1, block2) {
            for (var property in block2) {
                try {
                    if (block2[property].constructor == Object) {
                        block1[property] = mergeBlocks(
                                                block1[property], 
                                                block2[property]
                                            )
                    }
                    else {
                        block1[property] = block2[property]
                    }
                }
                catch(Error) {
                    block1[property] = block2[property]
                }
            }
            return block1
        }  
    },
    //Receive Data
    //**************************************************************************
    receive: function(incomingData) {
         //check source
        if (incomingData.origin.ship != ship.getID()) {
            console.log('data type: ' + incomingData.type)
            //execute code based on data type
            data[incomingData.type].receive(incomingData)
        }
        else {
            console.log('incoming data regected')
        }
    },
    //Text Message
    //**************************************************************************
    'textMessage': {
        //takes in the message's system destination, ship destination, and msg
        send: function(system, ship, message) {
            data.send(system, ship,
                {
                    type: 'textMessage',
                    message: message,
                }
            )
        },
        //method called to receive a textMessage
        receive: function(incomingData) {
            if (incomingData.destination.ship === ship.getID() ||
                incomingData.destination.ship === 'none') {
                //output to terminal
                terminalLogic.output(
                    'Message Received ' +
                    incomingData.timeStamp.hour + ':' + 
                    incomingData.timeStamp.min + ' ' +
                    incomingData.origin.ship + ': ' +
                    incomingData.message
                )
                //sende confirmation
                data['confirmTextMessage'].send(
                    incomingData.origin.system,
                    incomingData.origin.ship
                )
            }
        },
    },
    //Confirm Text Message
    //**************************************************************************
    'confirmTextMessage': {
        send: function(systemDestination, shipDestination) {
            data.send(systemDestination, shipDestination,
                {
                    type: 'confirmTextMessage',
                }
            )
        },
        receive: function(incomingData) {
            if (incomingData.destination.ship === ship.getID()) {
                terminalLogic.output('Message Sent')
            }
        },
    },
    //Warp Drive Signal
    //**************************************************************************
    'warpDriveSignal': {
        send: function(systemDestination) {
            data.send(systemDestination, 'none',
                {
                    type: 'warpDriveSignal',
                }
            )
        },
        receive: function(incomingData) {
            terminalLogic.output('Warp Drive Detected')
        },
    },
    //Scan For Ship
    //**************************************************************************
    'shipScan': {
        send: function(systemDestination, shipDestination) {
            data.send(systemDestination, shipDestination,
                {
                    type: 'shipScan',
                }
            )
        },
        receive: function() {

        },
    },
    //Template for Data Types
    //**************************************************************************
    'template': {
        send: function(systemDestination, shipDestination) {
            data.send(systemDestination, shipDestination,
                {
                    type: 'template', //name of data type
                    //list other custom variables here
                }
            )
        },
        receive: function() {
            //code to execute when receiving this type of data
        },
    },
}