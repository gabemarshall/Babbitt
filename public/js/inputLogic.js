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
			debug.startNest('terminalLogic.input')
			terminalLogic.input(command)
			debug.endNest()
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
		debug.startNest('cleanUserInput')
		var stringIn = terminalLogic.cleanUserInput(stringIn)	//clean string
		debug.endNest()

		debug.startNest('findCommand')
		var command = terminalLogic.findCommand(stringIn)		//find command
		debug.endNest()

		debug.startNest('executeCommand')
		terminalLogic.executeCommand(command, stringIn)			//execute
		debug.endNest()
	},
	//Cleans up terminal input
	//**************************************************************************
	cleanUserInput: function(stringIn) {						
		var stringIn = stringIn.trim();							//remove excess
		stringIn = stringIn.toLowerCase();						//lower case
		debug.log('return "' + stringIn + '"')					//log
		return stringIn;										//return value
	},															
	//Looks for command in input
	//**************************************************************************
	findCommand: function(stringIn) {
		debug.startNest('getCommandList')
		var commandList = terminalLogic.getCommandList()		//get list
		debug.endNest()
		var command = ''										//set command
		if (stringIn !== '') {
			//look through command list
			for (var i = 0; i < commandList.length; i++) {
				//search for command in user input
				if (stringIn.search(commandList[i]) != -1) {
					//use longest length command that is found
					if (commandList[i].length > command.length) {
						command = commandList[i]
						debug.log('FOUND: ' + commandList[i]) 
					}
					else {
						debug.log('IGNORE: ' + commandList[i])
					}
				}
				else {
					debug.log('NOT: ' + commandList[i])
				}
			}
		}
		else {
			debug.log('NO VALUE')
		}
		return command
	},	
	//Execute Command
	//**************************************************************************
	executeCommand: function(command, stringIn) {
		if (command) {
			try {
				debug.startNest(command)
				terminalLogic[command](command, stringIn)
				debug.endNest()
			}
			catch(error) {
				terminalLogic.executionFail(command)
			}
		}
		else if (command === '') {

			terminalLogic.commandFail(stringIn)

		}
	},
	//Command not found
	//**************************************************************************
	commandFail: function(stringIn) {
		if (stringIn) {
			terminalLogic.output(
				'ERROR: ' +
				'Command Fail: ' +
				'Command Not Found In: ' + stringIn
			)
		}
	},
	//Command code returned error
	//**************************************************************************
	executionFail: function(command) {
		terminalLogic.output(
			'ERROR: ' +
			'Command "' + command + '" OK: ' +
			'Code Execution Fail'
		)
	},
	//Output to terminal
	//**************************************************************************
	output: function(output) {
		$('#term_demo').terminal().echo(output)
		debug.log('Terminal Output -> "' + output + '"')
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
		debug.log('return "' + commandList + '"')
		return commandList
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
		terminalLogic.output('ERROR: List Code not yet implemented')
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
	//Display ship stats in browser's console
	//**************************************************************************
	'/d/shipstats': function() {
		ship.getShipStats()
	},
	//Clear the browser's console
	//**************************************************************************
	'/d/clear': function() {
		debug.clear()
	},
	//Set debug state
	//**************************************************************************
	'/debug': function(command, userInput) {
		debug.stateSwitch()
	},
	//SOS
	//**************************************************************************
	'/sos': function(command, userInput) {
		data['Distress_Signal'].send(ship.getLocation())
		terminalLogic.output('Distress Signal Sent.')
	},

	//Template
	//**************************************************************************
	'template': function(command, userInput) {
		//code
	},
}