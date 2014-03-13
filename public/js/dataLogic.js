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
    deliver: function(channel, origin, destination, type, content) {
        console.log('data.deliver')
        pubnub.publish({
            channel: channel,
            message: {
                origin:         origin,
                destination:    destination,
                type:           type,
                content:        content
            }
        })
    },
    //Text Message
    //**************************************************************************
    textMessage: {
        send: function(channel, origin, destination, type, content) {
            console.log('data.textMessage.send')
            data.deliver(channel, origin, destination, type, content
                )
        },
        receive: function(incomingData) {
            console.log('data.textMessage.receive')
            terminalOutput(incomingData.origin + ': ' + incomingData.content)
        },
    },
    //Receive Data
    //**************************************************************************
    receive: function(incomingData) {
        console.log('data.receive')
        if (incomingData.origin != ship.getID()) { //check source
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
                console.log('data.receive: default')
                terminalOutput('ERROR: Uknown data.type')
            }
        }
        else {
            console.log('incoming data regected')
        }
    },

}