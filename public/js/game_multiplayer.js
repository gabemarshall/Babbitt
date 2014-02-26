var userID = Math.floor((Math.random()*10000)+1);
var pubnub = PUBNUB.init({
    publish_key: 'pub-c-2046f9d0-c49d-4375-b449-fc635c431624',
    subscribe_key: 'sub-c-b1fa38be-85ec-11e3-a9a9-02ee2ddab7fe',
    uuid: userID
});

var sendMessage = function(msg) {
    pubnub.publish({
        channel: 'babb'+gameID,
        message: msg,
    })
}

var notifyPlayerDamage = function(bool){
    pubnub.publish({
        channel: 'babb'+gameID,
        message: { 
            title: 'DAMAGE',
            'successful': bool, 
            playerName: myShip.playerName
        }
    })
}

var updateOtherPlayer = function(){
    pubnub.publish({
        channel: 'babb'+gameID,
        message: {
            'UPDATE':myShip
        }
    })
}

setTimeout(function() {
    getPlayers()
    pubnub.publish({
        channel: 'nolagging',
        message: 'HEALTHCHECK'
    })
},2000)