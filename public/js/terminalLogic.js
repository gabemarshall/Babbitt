//terminalLogic.js

/*
description
*/

//******************************************************************************
//Terminal Input Logic
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
                myShip.getPlayerName(), 
                'open', 
                'textMessage', 
                input
            )
        }
    }
    //unknown command
    function unknownCommand(command) {
        terminal = $('#term_demo').terminal()
        terminal.echo('Unknown Command: ' + command)
    }
    //change the name of player
    function changePlayerName(command, name) {
        name = name.replace(command, '')
        name = name.trim()
        if (name == '' || name == myShip.getPlayerName()) {
            terminal = $('#term_demo').terminal()
            terminal.echo('Player name is currently: ' + myShip.getPlayerName())
        }
        else {
            myShip.setPlayerName(name)
            terminal = $('#term_demo').terminal()
            terminal.echo('Player name set to: ' + myShip.getPlayerName())
        }
    }
    //change the name of ship
    function changeShipName(command, name) {
        name = name.replace(command, '')
        name = name.trim()
        if (name == '' || name == myShip.getShipName()) {
            terminal = $('#term_demo').terminal()
            terminal.echo('Ship name is currently: ' + myShip.getShipName())
        }
        else {
            myShip.setShipName(name)
            terminal = $('#term_demo').terminal()
            terminal.echo('Ship name set to: ' + myShip.getShipName())
        }
    }
    //look for other ships in the solor system
    function scanForShip() {
        sendData(
            'babb' + gameID,
            myShip.getPlayerName(), 
            'open', 
            'scanForShip',
            'none'
        )
    }
}