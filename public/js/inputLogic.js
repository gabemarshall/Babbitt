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

	//Pass user input to TERMINAL_LOGIC
	$('#term_demo').terminal(
		function(command, term) {
			//pass user input to TERMINAL_LOGIC
			DEBUG.startNest('TERMINAL_LOGIC.input')
			TERMINAL_LOGIC.input(command)
			DEBUG.endNest()
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
var TERMINAL_LOGIC = {
	//Input
	//**************************************************************************  
	input: function(stringIn)
	{
		DEBUG.startNest('cleanUserInput')
		var stringIn = TERMINAL_LOGIC.cleanUserInput(stringIn)	//clean string
		DEBUG.endNest()

		DEBUG.startNest('findCommand')
		var command = TERMINAL_LOGIC.findCommand(stringIn)		//find command
		DEBUG.endNest()

		DEBUG.startNest('executeCommand')
		TERMINAL_LOGIC.executeCommand(command, stringIn)			//execute
		DEBUG.endNest()
	},

	//Cleans up terminal input
	//**************************************************************************
	cleanUserInput: function(stringIn)
	{						
		var stringIn = stringIn.trim();							//remove excess
		stringIn = stringIn.toLowerCase();						//lower case
		DEBUG.log('return "' + stringIn + '"')					//log
		return stringIn;										//return value
	},															
	//Looks for command in input
	//**************************************************************************
	findCommand: function(stringIn) {
		DEBUG.startNest('getCommandList')
		var commandList = TERMINAL_LOGIC.getCommandList()		//get list
		DEBUG.endNest()
		var command = ''										//set command
		if (stringIn !== '') {
			//look through command list
			for (var i = 0; i < commandList.length; i++) {
				//search for command in user input
				if (stringIn.search(commandList[i]) != -1) {
					//use longest length command that is found
					if (commandList[i].length > command.length) {
						command = commandList[i]
						DEBUG.log('FOUND: ' + commandList[i]) 
					}
					else {
						DEBUG.log('IGNORE: ' + commandList[i])
					}
				}
				else {
					DEBUG.log('NOT: ' + commandList[i])
				}
			}
		}
		else {
			DEBUG.log('NO VALUE')
		}
		return command
	},	
	//Execute Command
	//**************************************************************************
	executeCommand: function(command, stringIn) {
		if (command) {
			try {
				DEBUG.startNest(command)
				TERMINAL_LOGIC[command](command, stringIn)
				DEBUG.endNest()
			}
			catch(error) {
				TERMINAL_LOGIC.executionFail(command)
			}
		}
		else if (command === '') {
			TERMINAL_LOGIC.commandFail(stringIn)
		}
	},
	//Command not found
	//**************************************************************************
	commandFail: function(stringIn) {
		if (stringIn) {
			TERMINAL_LOGIC.output(
				'ERROR: ' +
				'Command Fail: ' +
				'Command Not Found In: ' + stringIn
			)
		}
	},
	//Command code returned error
	//**************************************************************************
	executionFail: function(command) {
		TERMINAL_LOGIC.output(
			'ERROR: ' +
			'Command "' + command + '" OK: ' +
			'Code Execution Fail'
		)
	},
	//Output to terminal
	//**************************************************************************
	output: function(output) {
		$('#term_demo').terminal().echo(output)
		DEBUG.log('Terminal Output -> "' + output + '"')
	},
	//List of commands
	//**************************************************************************
	getCommandList: function() {
		var commandList = [
			'/t',               //send text message
			'/playername',      //get or set player name
			'/shipname',        //get or set ship name
			'/scan',            //scan for ships
			'/location',        //get location
			'/laser',           //fire laser
			'/list',            //list commands
			'/d/shipstats',     //output ship stats to browser's console
			'/d/clear',         //clear browser's console
			'/debug',			//turn debug mode on or off
			'/sos',				//Gabe's prototype for an SOS "help" call
		]
		DEBUG.log('return "' + commandList + '"')
		return commandList
	},
	//Send Text Message
	//**************************************************************************
	'/t': function(command, userInput) {
		var message = userInput.replace(command, '')
		DEBUG.log('removing command "' + command + '" from message') 
		message = message.trim()
		if (message !== '') {
			DEBUG.log('sending message "' + message + '"')
			data.textMessage.send(ship.getLocation(), 'none', message)
		}
		else {
			DEBUG.log('No message after command')
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
		TERMINAL_LOGIC.output('Current Location: ' + ship.getLocation()) 
	},
	//Display Terminal Command List
	//**************************************************************************
	'/list': function(command, userInput) {
		var list = TERMINAL_LOGIC.getCommandList()
		TERMINAL_LOGIC.output('ERROR: List Code not yet implemented')
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
		TERMINAL_LOGIC.output('Player name: ' + ship.getCaptainName())
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
		TERMINAL_LOGIC.output('Ship name: ' + ship.getShipName())
	},
	//Display ship stats in browser's console
	//**************************************************************************
	'/d/shipstats': function() {
		ship.getShipStats()
	},
	//Clear the browser's console
	//**************************************************************************
	'/d/clear': function() {
		DEBUG.clear()
	},
	//Set debug state
	//**************************************************************************
	'/debug': function(command, userInput) {
		DEBUG.stateSwitch()
	},
	//SOS
	//**************************************************************************
	'/sos': function(command, userInput) {
		data['Distress_Signal'].send(ship.getLocation())
		TERMINAL_LOGIC.output('Distress Signal Sent.')
	},
	//Template
	//**************************************************************************
	'template': function(command, userInput) {
		//code
	},
}