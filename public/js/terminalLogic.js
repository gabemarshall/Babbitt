//terminalLogic.js
/*
description
*/

//******************************************************************************
//Terminal
//******************************************************************************
$(document).ready(function() {
    //Terminal Initialization
    function initializeTerminal(term) {
        sendData(
            'babb' + gameID,
            ship.getPlayerName(), 
            'open', 
            'warpDriveSignal', 
            'none'
        )
        term.echo('Systems Online')
    }

    //Pass user input to terminalLogic
    $('#term_demo').terminal(
        function(command, term) {
            terminalLogic(command)
            //echo return from logic
        },
        /*Terminal setup*/ {
            greetings: "",
            prompt: "",
            height: 100,
            onInit: function(term) {
                initializeTerminal(term)
            }
        })
})

//******************************************************************************
//Terminal Output
//******************************************************************************
var terminalOutput = function(data) {
    $('#term_demo').terminal().echo(data)
}

//******************************************************************************
//Terminal Logic
//******************************************************************************
var terminalLogic = function(input) {
    
    input = cleanInput(input)
    commandFound = false

    //list of available commands
    commandList = [
        '/t',
        '/shields',
        '/lasers',
        '/playername',
        '/shipname',
        '/scan'
    ]

    if (input !== '') {
        //find commands in input
        for (var i = 0; i < commandList.length; i++) {
            if (input.search(commandList[i]) != -1) {
                commandFound = true
                switch (commandList[i]) {

                    case '/t':
                    sendTextMessage(commandList[i], input)
                    break

                    case '/shields':
                    break

                    case '/powerlasers':
                    break

                    case '/firelasers':
                    break

                    case '/playername':
                    changePlayerName(commandList[i], input)
                    break

                    case '/shipname':
                    changeShipName(commandList[i], input)
                    break

                    case '/scan':
                    scanForShip()
                    break

                    case '/target':
                    setTarget(commandList[i], data)
                    break

                    default:
                }
            }
        }
        //if no command was found in the input
        if (commandFound === false) {
            unknownCommand(input)
        }
    }
    //cleanup user input
    function cleanInput(input) {
        input = input.trim()
        input = input.toLowerCase()
        return input
    }
    //remove the command from input
    function removeCommand(command, input) {
        input = input.replace(command, '')
        return input
    }
    //transmit text message
    function sendTextMessage(command, input) {
        input = input.replace(command, '')
        input = input.trim()
        if (input !== '') {
            sendData(
                'babb' + gameID,
                ship.getPlayerName(), 
                'open', 
                'textMessage', 
                input
            )
        }
    }
    //unknown command
    function unknownCommand(command) {
        terminalOutput(
            'Unknown Command: ' + 
            command
        )
    }
    //change the name of player
    function changePlayerName(command, name) {
        name = name.replace(command, '')
        name = name.trim()
        if (name == '' || name == ship.getPlayerName()) {
        }
        else {
            ship.setPlayerName(name)
        }
        terminalOutput('Player name: ' + ship.getPlayerName())
    }
    //change the name of ship
    function changeShipName(command, name) {
        name = name.replace(command, '')
        name = name.trim()
        if (name == '' || name == ship.getShipName()) {
        }
        else {
            ship.setShipName(name)
        }
        terminalOutput('Ship name set to: ' + ship.getShipName())
    }
    //look for other ships in the solor system
    function scanForShip() {
        sendData(
            'babb' + gameID,
            ship.getPlayerName(), 
            'open', 
            'scanForShip',
            'none'
        )
    }
    function setTarget(command, input) {
        target = removeCommand(command, input)
        target = target.trim()
        ship.setTarget(target)
    }
}