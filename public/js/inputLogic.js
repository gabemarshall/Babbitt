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
        ship.setLocation('babb' + gameID) //set location
        //set out warp drive signal
        sendData(
            ship.getLocation(),
            ship.getID(), 
            'none', 
            'warpDriveSignal', 
            'none'
        )
        term.echo('Systems Online')
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
        '/location'
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
            data.send.textMessage(
                ship.getLocation(),
                ship.getID(), 
                ship.getTarget(), 
                'textMessage', 
                input
            )
            /*
            sendData(
                ship.getLocation(),
                ship.getID(), 
                ship.getTarget(), 
                'textMessage', 
                input
            )
            */
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
        sendData(
            ship.getLocation(),
            ship.getID(),
            ship.getTarget(), 
            'scanForShip',
            'none'
        )
    }
    function setTarget(command, input) {
        target = removeCommand(command, input)
        target = target.trim()
        ship.setTarget(target)
        terminalOutput('Target: ' + target)
    }
    function getLocation() {
        terminalOutput('Current Location: ' + ship.getLocation())   
    }
}