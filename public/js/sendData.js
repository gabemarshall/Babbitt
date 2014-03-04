//sendData.js

/*
description
*/

//******************************************************************************
//Sending Data
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