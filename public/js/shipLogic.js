//shipLogic.js

//SHIP
//******************************************************************************
var ship = new Ship(pubnub.publish)

function Ship(deliveryMethod) {
	var id = Math.floor((Math.random()*1000000)+1)
	var captain = id
	var name = id
	var location = 'location'
	var capacitor = new Capacitor()
	var generator = new Generator()
	var targetingSystem = new TargetingSystem()
	
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

	var debug = false
	var updateSystems = setInterval(
		function() {
			generator.update()
			capacitor.update(generator.sendPower())
			if (debug === true) { sendToConsole() }
		}, 
		1000
	)

	//Data System
	//**************************************************************************
	//receive controller
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
	//send controller
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
	//receive types defined
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

	this.setTarget = function(targetshipID) {

	}
}
