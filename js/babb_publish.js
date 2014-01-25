var pubnub = PUBNUB.init({
    publish_key: 'pub-c-2046f9d0-c49d-4375-b449-fc635c431624',
    subscribe_key: 'sub-c-b1fa38be-85ec-11e3-a9a9-02ee2ddab7fe',
    ssl: false,
    jsonp: false
});



var testAlert = function(msg){
    alert(msg)
}

var sendMessage = function(msg) {
    pubnub.publish({
        channel: 'main_game',
        message: msg
    })
}
