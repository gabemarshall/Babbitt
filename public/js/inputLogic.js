//inputLogic.js
/*
description
*/

//******************************************************************************
//Terminal
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
            terminalLogic(command)
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
    command = ''

    //list of available commands
    commandList = [
        '/t',
        '/shields',
        '/lasers',
        '/playername',
        '/shipname',
        '/scan',
        '/target',
        '/location',
        '/list',
    ]

    //ignore blank input
    if (input !== '') {
        //look through command list
        for (var i = 0; i < commandList.length; i++) {
            //search for command in user input
            if (input.search(commandList[i]) != -1) {
                //use longest length command that is found
                if (commandList[i].length > command.length) {
                    command = commandList[i]
                }
            }
        }
    }

    //execute action 
    if (command !== '') {
        switch (command) {
            case '/t':
            textMessage(command, input)
            break

            case '/shields':
            break

            case '/powerlasers':
            break

            case '/firelasers':
            break

            case '/playername':
            changePlayerName(command, input)
            break

            case '/shipname':
            changeShipName(command, input)
            break

            case '/scan':
            scanForShip()
            break

            case '/target':
            setTarget(command, input)
            break

            case '/location':
            getLocation()
            break

            case '/list':
            getCommandList()
            break

            default:
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
    function textMessage(command, input) {
        input = input.replace(command, '')
        input = input.trim()
        if (input !== '') {
            console.log('input: command is textMessage')
            data.textMessage.send(ship.getLocation(), 'none', input)
        }
    }
    //unknown command
    function unknownCommand(command) {
        terminalOutput('Unknown Command: ' + command)
    }
    //change the name of player
    function changePlayerName(command, data) {
        data = data.replace(command, '')
        data = data.trim()
        if (data == '' || data == ship.getCaptainName()) {
            //code
        }
        else {
            ship.setPlayerName(data)
        }
        terminalOutput('Player name: ' + ship.getCaptainName())
    }
    //change the name of ship
    function changeShipName(command, name) {
        name = name.replace(command, '')
        name = name.trim()
        if (name == '' || name == ship.getShipName()) {
            //code
        }
        else {
            ship.setShipName(name)
        }
        terminalOutput('Ship name: ' + ship.getShipName())
    }
    //look for other ships in the solor system
    function scanForShip() {
    }

    function setTarget(command, input) {
    }

    function getLocation() {
        terminalOutput('Current Location: ' + ship.getLocation())   
    }

    function getCommandList() {
        terminalOutput('Command List:')
        terminalOutput('/t, /location, /playername, /shipname, /scan, /target')
    }
}