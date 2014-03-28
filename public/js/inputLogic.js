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
			debug.startNest('terminalLogic')
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
		debug.startNest('input')								//start nest
		var stringIn = terminalLogic.cleanUserInput(stringIn)	//clean string
		var command = terminalLogic.findCommand(stringIn)		//find command
		terminalLogic.executeCommand(command, stringIn)			//execute
		debug.endNest()											//end nest
	},
	//Cleans up terminal input
	//**************************************************************************
	cleanUserInput: function(stringIn) {		//start function
		debug.startNest('cleanUserInput')		//start nest
		var stringIn = stringIn.trim();			//remove excess
		stringIn = stringIn.toLowerCase();		//lower case
		debug.log('complete')					//log
		debug.endNest()							//end nest
		return stringIn;						//return value
	},											//end function
	//Looks for command in input
	//**************************************************************************
	findCommand: function(userInput) {
		debug.startNest('findCommand')
		var commandList = terminalLogic.getCommandList()
		var command = ''

		if (userInput !== '') {
			//look through command list
			for (var i = 0; i < commandList.length; i++) {
				//search for command in user input
				if (userInput.search(commandList[i]) != -1) {
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
		debug.endNest()
		return command
	},	
	//Execute Command
	//**************************************************************************
	executeCommand: function(command, userInput) {
		debug.startNest('executeCommand')
		if (command) {
			try {
				terminalLogic[command](command, userInput)
			}
			catch(Error) {
				terminalLogic.executionFail(command)
			}
		}
		else if (command === '') {
			terminalLogic.commandFail(userInput)
		}
		debug.endNest()
	},
	//Command not found
	//**************************************************************************
	commandFail: function(userInput) {
		debug.startNest('commandFail')
		if (userInput) {
			terminalLogic.output(
				'ERROR: ' +
				'Command Fail: ' +
				'Command Not Found In: ' + userInput
			)
		}
		debug.endNest()
	},
	//Command code returned error
	//**************************************************************************
	executionFail: function(command) {
		debug.startNest('executionFail')
		terminalLogic.output(
			'ERROR: ' +
			'Command "' + command + '" OK: ' +
			'Code Execution Fail'
		)
		debug.endNest()
	},
	//Output to terminal
	//**************************************************************************
	output: function(output) {
		debug.startNest('output')
		try {
			$('#term_demo').terminal().echo(output)
			debug.log('Terminal Output -> "' + output + '"')
		}
		catch(error) {
			debug.log('Failure')
		}
		debug.endNest()
	},
	//List of commands
	//**************************************************************************
	getCommandList: function() {
		debug.startNest('getCommandList')
		debug.endNest()
		return [
			'/t',               //send text message
			'/playername',      //get or set player name
			'/shipname',        //get or set ship name
			'/scan',            //scan for ships
			'/location',        //get location
			'/laser',           //fire laser
			'/list',            //list commands
			'/d/shipstats',     //output ship stats to browser's console
			'/d/clear',         //clear browser's console
		]
	},
	//Send Text Message
	//**************************************************************************
	'/t': function(command, userInput) {
		debug.startNest('/t')
		var message = userInput.replace(command, '')
		message = message.trim()
		if (message !== '') {
			data.textMessage.send(ship.getLocation(), 'none', message)
		}
		debug.endNest()
	},
	//Laser
	//**************************************************************************
	'/laser': function(command, userInput) {
		//code
	},
	//Display Ship System Location
	//**************************************************************************
	'/location': function() {
		debug.startNest('/location')
		terminalLogic.output('Current Location: ' + ship.getLocation())
		debug.endNest()   
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
	'/d/debug': function(command, userInput) {
		//code
	},
	//Template
	//**************************************************************************
	'template': function(command, userInput) {
		//code
	},
}

//debug stuff
//******************************************************************************
var debug = {
	state: true,
	startNest: function(value) {
		if (debug.state === true) {
			console.groupCollapsed(value)
		}
	},
	endNest: function() {
		if (debug.state === true) {
			console.groupEnd()
		}
	},
	log: function(value) {
		if (debug.state === true) {
			console.log(value)
		}
	},
	clear: function() {
		if (debug.state === true) {
			console.clear()
		}
	},
	setState: function() {
		//code
	},
	getState: function() {
		//code
	},
}