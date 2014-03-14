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
    send: function(systemD, shipD, type, content) {
        console.log('data.send')

        var object1 = {
            origin: {
                system: ship.getLocation(),
                ship: ship.getID(),
            },
            destination: {
                system: systemD,
                ship: shipD,
            },
            type: type,
        }
        var object2 = content
        //var object3 = mergeObjects(object1, object2)

        pubnub.publish({
            channel: systemD,
            message: {
                origin: {
                    system: ship.getLocation(),
                    ship: ship.getID(),
                },
                destination: {
                    system: systemD,
                    ship: shipD,
                },
                type: type,
                content: content
            }
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
                //data.confirmTextMessage.receive(data)
                break

                case 'warpDriveSignal':
                console.log('data.receive: warpDriveSignal')
                //data.warpDriveSignal.receive(data)
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
        send: function(systemDest, shipDest, message) {
            console.log('data.textMessage.send')
            data.send(systemDest, shipDest, 'textMessage',
                message
            )
        },
        //method called to receive a textMessage
        receive: function(inData) {
            if (inData.destination.ship === ship.getID ||
                inData.destination.ship === 'none') {
                console.log('data.textMessage.receive')
                terminalOutput(inData.origin.ship+': '+inData.content)
            }
        },
    },
}