//inputLogic.js
/*
description
*/

//Terminal Setup
//******************************************************************************
$(document).ready(function() {
    //Terminal Initialization
    function initializeTerminal(term) {
        //set ship location
        ship.setLocation('babb' + gameID)
        //send out warp drive signal
        data.warpDriveSignal.send(ship.getLocation())
        //notify player
        term.echo('Current Location: ' + ship.getLocation())
    }

    //Pass user input to terminalLogic
    $('#term_demo').terminal(
        function(command, term) {
            //pass user input to terminalLogic
            terminalLogic.input(command)
        },
        /*Terminal setup*/ {
            height: 200,
            greetings: '',
            onInit: function(term) {
                initializeTerminal(term)
            },
            prompt: '',
        })
})

//Terminal Logic
//******************************************************************************
var terminalLogic = {
    //Input
    //**************************************************************************  
    input: function(stringIn) {
        
        var commandList = terminalLogic.getCommandList()
            
        var stringIn = stringIn.trim()
        stringIn = stringIn.toLowerCase()
            
        var command = ''

        //ignore blank input
        if (stringIn !== '') {
            //look through command list
            for (var i = 0; i < commandList.length; i++) {
                //search for command in user input
                if (stringIn.search(commandList[i]) != -1) {
                    //use longest length command that is found
                    if (commandList[i].length > command.length) {
                        command = commandList[i]
                    }
                }
            }
        }

        if (command) {
            try {
                terminalLogic[command](command, stringIn)
            }
            catch(Error) {
                terminalLogic.executionFail(command)
            }
        }
        else if (command === '') {
            terminalLogic.commandFail(stringIn)
        }
    },
    //Unknown Command
    //**************************************************************************
    commandFail: function(userInput) {
        terminalLogic.output(
            'ERROR: ' +
            'Command Fail: ' +
            'Command Not Found In: ' + userInput
        )
    },
    //Unknown Command
    //**************************************************************************
    executionFail: function(command) {
        terminalLogic.output(
            'ERROR: ' +
            'Command "' + command + '" OK: ' +
            'Code Execution Fail'
        )
    },
    //Display Output
    //**************************************************************************
    output: function(output) {
        $('#term_demo').terminal().echo(output)
    },
    //Command List
    //**************************************************************************
    getCommandList: function() {
        return [
            '/t',
            '/playername',
            '/shipname',
            '/scan',
            '/location',
            '/laser',
            '/list',
        ]
    },
    //Send Text Message
    //**************************************************************************
    '/t': function(command, userInput) {
        var message = userInput.replace(command, '')
        message = message.trim()
        if (message !== '') {
            data.textMessage.send(ship.getLocation(), 'none', message)
        }
    },
    //Laser
    //**************************************************************************
    '/laser': function(command, userInput) {
        //code
    },
    //Display Ship System Location
    //**************************************************************************
    '/location': function() {
        terminalLogic.output('Current Location: ' + ship.getLocation())   
    },
    //Display Terminal Command List
    //**************************************************************************
    '/list': function(command, userInput) {
        var list = terminalLogic.getCommandList()
        terminalLogic.output('ERROR: Code not yet implemented')
        //output list of user commands to terminal
    },
    //Display or change player name
    //**************************************************************************
    '/playername': function(command, userInput) {
        var name = userInput.replace(command, '')
        name = name.trim()
        if (name == '' || name == ship.getCaptainName()) {
            //code
        }
        else {
            ship.setPlayerName(name)
        }
        terminalLogic.output('Player name: ' + ship.getCaptainName())
    },
    //Display or change ship name
    //**************************************************************************
    '/shipname': function(command, userInput) {
        var name = userInput.replace(command, '')
        name = name.trim()
        if (name == '' || name == ship.getShipName()) {
            //code
        }
        else {
            ship.setShipName(name)
        }
        terminalLogic.output('Ship name: ' + ship.getShipName())
    },
    //Template
    //**************************************************************************
    'template': function(command, userInput) {
        //code
    },
}