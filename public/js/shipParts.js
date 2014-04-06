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

//Known ship List
//******************************************************************************
function encounterLog() {
	var log = []

	this.addShip = function() {

	}
	this.verifyShip = function (shipID) {
		//if shp is known, return true
		//else return false
	}
}

//Targeting System
//******************************************************************************
//this system handings targeting
function TargetingSystem() {
	var target = {
		current: 0,
	}
	this.getTarget = function() {
		return target.current
	}
	this.setTarget = function(newTarget) {
		target.current = newTarget
	}
}

//Ship Records
//******************************************************************************
//this system handles basic ship records and logging
function shipLog() {
	var shipID = Math.floor((Math.random()*1000000)+1)
	var shipName = 'unknown'
	var captainName = 'unknown'
	var location = 'unknown'

	this.getShipID = function() {
		return shipID
	}

	this.getShipName = function() {
		return shipName
	}

	this.getCaptainName = function() {
		return captainName
	}

	this.getLocation = function() {
		return location
	}
}