//shipLogic.js

//SHIP
//******************************************************************************
var ship = new Ship(pubnub.publish)

function Ship(deliveryMethod) {
	//Private
	//**************************************************************************
	var id = Math.floor((Math.random()*1000000)+1)
	var captain = id
	var name = id
	var location = 'location'
	var capacitor = new Capacitor()
	var generator = new Generator()
	var target = 'none'
	var debug = false

	var sendToConsole = function() {
		console.groupCollapsed('ship')
		console.groupCollapsed('Basic')
		console.log('Ship\'s ID #: ' + id)
		console.log('Ship\'s Name: ' + name)
		console.log('Ship\'s Captain: ' + captain)
		console.log('Ship\'s Location: ' + location)
		console.log('Ship\'s Target: ' + target)
		console.groupEnd()
		capacitor.sendToConsole()
		generator.sendToConsole()
		console.groupEnd()
	}

	var updateSystems = setInterval(
		function() {
			generator.update()
			capacitor.update(generator.sendPower())
			if (debug === true) { sendToConsole() }
		}, 
		1000
	)

	var sendData = function(systemDestination, shipDestination, contentBlock) {
		var currentTime = new Date()				//record current time
		var addressBlock = {						//create address block
			id: currentTime.getTime(),				//get unique id
			origin: {								//origin of data
				system: ship.getLocation(),			//origin system name
				ship: ship.getID(),					//origin ship id #
			},
			destination: {							//destination of data
				system: systemDestination,			//destination system name
				ship: shipDestination,				//destination ship id #
			},
			timeStamp: {							//time data created
				mil: currentTime.getMilliseconds(),	//millisecond (0-999)
				sec: currentTime.getSeconds(),		//second (0-59)
				min: currentTime.getMinutes(),		//minute (0-59)
				hour: currentTime.getHours(),		//hour (0-23)
				day: currentTime.getDay(),			//day of week (0-6)
				date: currentTime.getDate(),		//date of month (1-31)
				month: currentTime.getMonth(),		//month (0-11)
				year: currentTime.getFullYear(),	//year (four digit)
			},
		}
		//combine address block and content block to form data to send
		var dataBlock = mergeBlocks(addressBlock, contentBlock)

		//send data block through delivery method
		deliveryMethod({
			channel: dataBlock.destination.system,	//system destination
			message: dataBlock						//data
		})
		//fucntion to merge content and address blocks
		function mergeBlocks(block1, block2) {
			for (var property in block2) {
				try {
					if (block2[property].constructor == Object) {
						block1[property] = mergeBlocks (
												block1[property], 
												block2[property]
											)
					}
					else {
						block1[property] = block2[property]
					}
				}
				catch(Error) {
					block1[property] = block2[property]
				}
			}
			return block1
		}
	}

	//Data Types
	//**************************************************************************
	var data = {
		'textMessage': function(incomingData) {
			if (incomingData.destination.ship === ship.getID() ||
				incomingData.destination.ship === 'none') {
				//output to terminal
				TERMINAL_LOGIC.output (
					'Message Received ' +
					incomingData.timeStamp.hour + ':' + 
					incomingData.timeStamp.min + ' ' +
					incomingData.origin.ship + ': ' +
					incomingData.message
				)
			}
		},
		'warpDriveSignal': function(incomingData) {
			TERMINAL_LOGIC.output('Warp Drive Detected')
		},
		'distressSignal': function(incomingData) {
			TERMINAL_LOGIC.output(
				'A distress signal has been detected from the "' + 
				incomingData.shipName +
				'", located in the ' +
				incomingData.origin.system +
				' system'
			)
		},
	}

	//Public Methods
	//**************************************************************************
	this.getShipID = function() {return id}
	this.getID 			= function(     )   { return id                     }
	this.getName 		= function(     )   { return name                   }
	this.setName 		= function(value)   { name = value                  }
	this.getShipName 	= function(     )   { return name                   }
	this.setShipName 	= function(value)   { name = value                  }
	this.getPlayerName 	= function(     )   { return captain                }
	this.setPlayerName 	= function(value)   { captain = value               }
	this.getCaptainName = function(     )   { return captain                }
	this.setCaptainName = function(value)   { captain = value               }
	this.getLocation 	= function(     )   { return location               }
	this.setLocation 	= function(value)   { location = value              }
	this.getTarget 		= function(     )   { return target                 }
	this.setTarget 		= function(value)   { target = value                }
	this.getShipStats 	= function(     )   { sendToConsole()				}

	this.textMessage = function(systemDestination, shipDestination, msg) {
		sendData(systemDestination, shipDestination,
			{
				type: 'textMessage',
				message: msg,
			}
		)
	}
	
	this.warpDriveSignal = function() {
		sendData(location, 'none',
			{
				type: 'warpDriveSignal',
				level: 0,
			}
		)
	}

	this.distressSignal = function() {
		sendData(location, 'none',
			{
				type: 'distressSignal',
				shipName: name,
			}
		)
	}
	
	this.receiveData = function(incomingData) {
		 //check source
		if (incomingData.origin.ship != id) {
			//execute code based on data type
			data[incomingData.type](incomingData)
		}
		else {
			//if origin of data is sender
			console.log('ignore data, origin is my ship')
		}
	}
}

//Capacitor
//******************************************************************************
function Capacitor() {
	//private
	var power = new Stat('Power Stored', 0, 0, 1)
	var efficiency = new Stat('Efficiency', 0, 0, 100)
	var checkPowerLevels = function() {
		if (power.getCurrent() > power.getMaximum()) {
			//code
		}
		else if (power.getCurrent() < power.getMinimum) {
			//code
		}
		else {
			//code
		}
	}
	//public
	this.receivePower = function(incomingPower) {
		power.setCurrent( power.getCurrent() + incomingPower )
	}
	this.update = function(incomingPower) {
		this.calculate 
		this.receivePower(incomingPower)
	}
	this.sendToConsole = function() {
		console.groupCollapsed('Capacitor')
		efficiency.sendToConsole()
		power.sendToConsole()
		console.groupEnd()
	}
}

//Generator
//******************************************************************************
function Generator() {
	//private
	var structure = new Stat('Structure', 75, 0, 100)	//units
	var damage = new Stat('Damage', 0, 0, 1)			//percentage
	var output = new Stat('Output', 1, 0, 1)			//units
	var efficiency = new Stat('Efficiency', 1, 0, 1)	//percentage
	var calculateDamage = function() {
		damage.setCurrent(
			Math.round( //round to 2 decimal places
				(1 - structure.getCurrent() / structure.getMaximum() ) * 100
			) / 100
		)
	}
	var calculateEfficiency = function() {
		efficiency.setCurrent(
			1 - damage.getCurrent()
		)
	}
	var calculateOutput = function() {
		output.setCurrent(
			output.getMaximum() * efficiency.getCurrent()
		)
	}
	//public
	this.sendPower = function() {
		return output.getCurrent() 
	}
	this.update = function() {
		calculateDamage()
		calculateEfficiency()
		calculateOutput()
	}
	this.sendToConsole = function() {
		console.groupCollapsed('Generator')
		structure.sendToConsole()
		damage.sendToConsole()
		output.sendToConsole()
		efficiency.sendToConsole()
		console.groupEnd()
	}
}

//Radiator
//******************************************************************************
function Radiator() {
	//private
	//public
}

//LimitedValue
//******************************************************************************
function Stat(nam, cur, min, max) {
	//private
	var name = nam		//stat name, string
	var current = cur	//current value
	var previous = cur	//previous value
	var minimum = min	//minimum value
	var maximum = max	//maximum value
	//private
	this.sendToConsole = function() {
		console.groupCollapsed(name)
		console.log('Current: ' + current)
		console.log('Previous: ' + previous)
		console.log('Minimum: ' + minimum)
		console.log('Maximum: ' + maximum)
		console.groupEnd()
	}
	this.getCurrent = function() {
		return current
	}
	this.getPrevious = function() {
		return previous
	}
	this.getMinimum = function() {
		return minimum
	}
	this.getMaximum = function() {
		return maximum
	}
	this.setCurrent = function(value) {
		if (value !== current) {
			previous = current
			current = value
		}
	}
	this.setMinimum = function(value) {
		minimum = value
	}
	this.setMaximum = function(value) {
		maximum = value
	}
}