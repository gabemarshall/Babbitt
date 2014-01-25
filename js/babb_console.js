//var availableCommands = ["[[b;#000;#d3d3d3]help, list, ls] - List the available commands", "[[b;#000;#d3d3d3]about] - Learn a little about me", "[[b;#000;#d3d3d3]resume] - View my resume", "[[b;#000;#d3d3d3]projects] - View a list of some recent projects I have been working on.", "[[b;#000;#d3d3d3]contact] - Get my contact info", "[[b;#000;#d3d3d3]blog] - View my latest blog entry"];
var console = {
    list: function(term) {
        for (i = 0; i < availableCommands.length; i++) {
            term.echo(availableCommands[i]);
        }
    },
    talkToPlayer: function(message, term) {

        var msg = message.replace('/t', '')
        return msg

    }
}

$(document).ready(function() {
    $('#term_demo').terminal(function(command, term) {

        // Check if the game was just loaded, if so then the player will need to enter their name
        if (!termInit) {
            playerName = command
            term.echo("\nThank you, welcome " + command + ".")
            sendMessage({
                "playerInit": "true",
                "playerName": command
            })
            term.echo("Clear skies today sir...Sit back and relax, I'll alert you if I see any trouble.\n")
            termInit = true
        } else if (command != '') {

            if (command.indexOf("/t") >= 0) {

                term.echo("Message Transmitted...");
                var transmit = console.talkToPlayer(command)
                sendMessage({
                    "transmit": transmit,
                    "playerName": playerName
                })

            }

        } else {
            term.echo('Unknown command...type \'help\' to see a list of commands');
        }

        var oppJoined = function() {
            term.echo("Oh shit! " + oppName + " has entered our sector!")
            sendMessage({
                "playerInit": "true",
                "playerName": playerName
            })

        }

        var printMessage = function(msg) {
            term.echo(msg)
        }

        var consoleChecksGameStatus = setInterval(function() {
            if (oppName && !gameBegun) {
                gameBegun = true
                oppJoined()
            } else {

            }
        }, 1000)

        pubnub.subscribe({
            channel: 'main_game',
            callback: function(message) {
                
                if (message.playerInit) {

                    if (message.playerName != playerName && !oppName) {
                        oppName = message.playerName
                    }
                }

                if (message.transmit) {



                    if (message.playerName != playerName) {

                        //  alert("Incoming Transmission Sir!! -- "+message.transmit)

                        printMessage("Incoming Transmission:" + message.transmit)

                    }
                }

            }
        });

    }, {
        greetings: 'Hello..Sir, Welcome to [[b;#000;#d3d3d3]Babbitt] . \nYou must be our new captain, what is your name?',
        name: 'js_demo',
        height: 200,
        prompt: '$> '
    });
   pubnub.publish({
        channel: 'main_game',
        message: "COUNT_REQ"
    })
});
$('#term_demo').click(function() {
    this.focus();
})


//[[b;#000;#d3d3d3]help]
