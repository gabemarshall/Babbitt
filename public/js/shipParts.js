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
		efficiency.sendToConsole()
		power.sendToConsole()
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
		structure.sendToConsole()
		damage.sendToConsole()
		output.sendToConsole()
		efficiency.sendToConsole()
	}
}

//Radiator
//******************************************************************************
function Radiator() {
	//private
	//public
}

//Stat
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
		console.log('Current: ' + current)
		console.log('Previous: ' + previous)
		console.log('Minimum: ' + minimum)
		console.log('Maximum: ' + maximum)
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

//Ship Encounter Log
//******************************************************************************
function EncounterLog() {
	/* this system handles ship encounter logging.  this system keeps records of
	ship that have been encountered.  if a new ship id is found, it makes a 
	new entry into the log with the ship id number */
	var log = [] //holds log entry data
	var unidentified = 'unidentified'
	this.getUnidentified = function() {
		return unidentified
	}
	this.findEntry = function(shipID) {
		/* returns a simnple true/false if an entry is found in log */
		try { 
			if(log[shipID].getShipID() === shipID) { 
				console.log('log entry found')
				return true 
			} 
		}
		catch(error) { 
			console.log('log entry not found')
			return false 
		}
	}
	this.getShipName = function(shipID) {
		/* returns name of ship of ship, if in log, else */
		if (this.findEntry(shipID) === true) {
			console.log('return ship name')
			return log[shipID].getShipName()
		}
	}
	this.getCaptainName = function(shipID) {
		if (this.findEntry(shipID) === true) {
			console.log('return captain name')
			return log[shipID].getCaptainName()
		}
	}
	this.newEntry = function(shipID) {
		/* adds a new entry to the log */
		log[shipID] = new ShipDiscription(shipID)
		console.log('adding new log entry, log: ' + shipID)
	}
	this.update = function(shipID) {
		/* use this public method to check for a log entry
		if entry not found, add to log */
		if (this.findEntry(shipID) === true) {
		}
		else {
			this.newEntry(shipID)
		}
	}
	this.updateEntry = function(shipID, shipName, captainName, loation) {
		/* use this public method to update data in a log entry */
		try {
			if (log[shipID].shipID === shipID) {
				log[entryLocation].setShipName(shipName)
				log[entryLocation].setCaptainName(captainName)
				log[entryLocation].setLocation(loation)
				console.log('ship\'s encounter log updated')
				console.log('ship\'s name: ' + shipName)
				console.log('ship\'s captain: ' + captainName)
				console.log('ship\'s location: ' + loation)
			}
		}
		catch(error) {
			console.log('ship id not found in log')
		}
	}
	function ShipDiscription(shipID, shipName, captainName, loation) {
		/* this object holds log entry values */
		var shipID = shipID || 'unidentified'
		var shipName = shipName || 'unidentified'
		var captainName = captainName || 'unidentified'
		var location = loation || 'unidentified'
		//get
		this.getShipID = function() {return shipID}
		this.getShipName = function() {return shipName}
		this.getCaptainName = function() {return captainName}
		this.getLocation = function() {return location}
		//set
		this.setShipID = function(value) {shipID = value}
		this.setShipName = function(value) {rshipName = value}
		this.setCaptainName = function(value) {captainName = value}
		this.setLocation = function(value) {location = value}
	}
}