var express = require('express'),
    http = require('http'),
    path = require('path');

var child = require('child_process');

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


app.get('/sector', function(req, res) {
    res.render('sector');
});

app.get('/', function(req, res) {
    res.render('index');
})

app.get('/pushitrealgood', function(req, res) {
	console.log("Pushing and Pulling!")
	var gitIt = child.spawn('git', ['pull']);
    process.stdin.pipe(gitIt.stdin);

    gitIt.stdin.on("end", function() {
        console.log("Done!")
        res.send("Push/Pull Complete! (Do not refresh this page)")
    });

    gitIt.stdout.on('data', function(data) {
        console.log(data + '');
    });

    gitIt.stderr.on('data', function(data) {
        console.log('stderr: ' + data);
    });
})

app.get('/error', function(req, res) {
    res.render('error');
})

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});


// var subscribeToChannel = function(channelID) {
//     pubnub.subscribe({
//         channel: "main_game"+channelID,
//         callback: function(message) {
//             console.log("Message From Client - ", message);


//             if (message.CANPLAY) {
//                 clients++

//                 console.log("Number of clients: " + clients)

//             }

//             if (message.playerName) {
//                 if (players.indexOf(message.playerName) >= 0) {

//                 } else {
//                     players.push(message.playerName)
//                     console.log("New player joined!")
//                 }

//                 if (message.transmit) {
//                     console.log("Message transmitted!")
//                 } else if (message.laser) {
//                     console.log("Laser fired from " + message.playerName + " with a value of " + message.laser)
//                 }
//             }
//         }
//     });
// }

// subscribeToChannel("main_game512")


//"main_game512"

// var HealthCheck = function(gameID, p_clients) {
//     pubnub.publish({
//         channel: gameID,
//         message: {
//             "HEALTHCHECK": p_clients,
//             "GAMEID": gameID
//         }
//     });
// }


// setInterval(function() {
//     for (i = 0; i < games.length; i++) {
//         HealthCheck(games[i].id, games[i].clients)
//     }
//     //console.log("hummm")
// }, 1000);
