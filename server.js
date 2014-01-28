var express = require('express')
  , http = require('http')
  , path = require('path');

var pubnub = require("./node/pubnub.js").init({
    publish_key: "pub-c-2046f9d0-c49d-4375-b449-fc635c431624",
    subscribe_key: "sub-c-b1fa38be-85ec-11e3-a9a9-02ee2ddab7fe"
});


var app = express();

// all environments
app.set('port', process.env.PORT || 1338);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));




var players = []
var clients = 0

pubnub.subscribe({
    channel: "main_game",
    callback: function(message) {
        console.log("Message From Client - ", message);

        if (message === "COUNT_REQ") {
            clients++

            if (clients > 2) {
                setTimeout(function() {
                    pubnub.publish({
                        channel: "main_game",
                        message: {"error_player_count":"There are too many players in the game..."}
                    })
                }, 3000)
            }
            console.log("Requesting player count, there are " + players.length + " players.")
            console.log(clients)


        }

        if (message.playerName) {
            if (players.indexOf(message.playerName) >= 0) {

            } else {
                players.push(message.playerName)
                console.log("New player joined!")
            }

            if (message.transmit) {
                console.log("Message transmitted!")
            }
            else if (message.laser){
            	console.log("Laser fired from "+message.playerName+" with a value of "+message.laser)
            }
        }
    }
});



app.get('/', function(req, res){
    res.render('index');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// var startGame = function() {
//     pubnub.publish({
//         channel: "main_game",
//         message: 'GAMEON'
//     });
// }
// setInterval( function() {
//     pubnub.publish({
//         channel : "my_browser_channel",
//         message : 'Hello from Node!'
//     });
// }, 1000 );
