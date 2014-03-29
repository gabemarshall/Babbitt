var userID = Math.floor((Math.random()*10000)+1);
var pubnub = PUBNUB.init({
    publish_key: 'pub-c-0c56cbfa-3510-4cb3-9fbd-0ffb2a11bfab',
    subscribe_key: 'sub-c-315c6844-a0b3-11e3-ab08-02ee2ddab7fe',
    uuid: userID
});