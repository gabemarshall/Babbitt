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

//Data
//******************************************************************************
var data = {
    //Send Data
    //**************************************************************************
    send: function(systemD, shipD, contentBlock) {
        console.log('data.send')
        var currentTime = new Date() //record current time
        var addressBlock = {
            id: currentTime.getTime(),
            origin: {
                system: ship.getLocation(),
                ship: ship.getID(),
            },
            destination: {
                system: systemD,
                ship: shipD,
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
        var dataPackage = mergeObjects(addressBlock, contentBlock)

        pubnub.publish({
            channel: dataPackage.destination.system,
            message: dataPackage
        })

        //fucntion to merge two objects
        function mergeObjects(object1, object2) {
            for (var property in object2) {
                try {
                    if (object2[property].constructor == Object) {
                        object1[property] = mergeObjects(
                                                object1[property], 
                                                object2[property]
                                            )
                    }
                    else {
                        object1[property] = object2[property]
                    }
                }
                catch(err) {
                    object1[property] = object2[property]
                }
            }
            return object1
        }  
    },
    //Receive Data
    //**************************************************************************
    receive: function(incomingData) {
        console.log('data.receive')
        if (incomingData.origin.ship != ship.getID()) { //check source
            switch (incomingData.type) { //check type

                case 'textMessage':
                console.log('data.receive: textMessage')
                data.textMessage.receive(incomingData)
                break

                case 'confirmTextMessage':
                console.log('data.receive: confirmTextMessage')
                data.confirmTextMessage.receive(incomingData)
                break

                case 'warpDriveSignal':
                console.log('data.receive: warpDriveSignal')
                //data.warpDriveSignal.receive(incomingData)
                break

                default:
                console.log('data.receive: unrecognized data.type')
            }
        }
        else {
            console.log('incoming data regected')
        }
    },
    //Text Message
    //**************************************************************************
    textMessage: {
        //takes in the message's system destination, ship destination, and msg
        send: function(system, ship, message) {
            console.log('data.textMessage.send')
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
                console.log('data.textMessage.receive')
                terminalOutput(
                    'Message Received ' +
                    incomingData.timeStamp.hour + ':' + 
                    incomingData.timeStamp.min + ' ' +
                    incomingData.origin.ship + ': ' +
                    incomingData.message
                )
                data.confirmTextMessage.send(
                    incomingData.origin.system,
                    incomingData.origin.ship
                )
            }
        },
    },
    //Confirm Text Message
    //**************************************************************************
    confirmTextMessage: {
        send: function(system, ship) {
            console.log('data.confirmTextMessage.send')
            data.send(system, ship,
                {
                    type: 'confirmTextMessage',
                }
            )
        },
        receive: function(incomingData) {
            console.log('data.confirmTextMessage.receive')
            console.log('source: ' + incomingData.origin.ship)
            console.log('destination: ' + incomingData.destination.ship)
            if (incomingData.destination.ship === ship.getID()) {
                terminalOutput('Message Sent')
            }
        }
    },
    //Template for Data Types
    //**************************************************************************
    Template: {
        send: function() {

        },
        receive: function() {

        }
    },
}