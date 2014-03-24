//shipLogic.js

/*
Variables set in here are global and used in both core game logic (game_loop.js & game_console.js)
and also used in the ImpactJS draw method (lib/game/main.js)
babbitt.gabemarshall.me/pushitrealgood
babbitt.gabemarshall.me
*/

//SHIP
//******************************************************************************
var ship = new function ship() {
	//private
	var id = Math.floor((Math.random()*1000000)+1)
	var captain = id
	var name = id
	var location = 'location'
	var capacitor = new Capacitor()
	var generator = new Generator()
	var target = 'none'
	var debug = false

	var sendToConsole = function() {
		console.groupCollapsed('Ship')
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
	//public
	this.getShipID		= function(     )   { return id                     }
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