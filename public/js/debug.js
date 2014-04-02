//Debug
//******************************************************************************
var DEBUG = {
	state: true,
	startNest: function(value) {
		if (DEBUG.state === true) {
			console.groupCollapsed(value)
		}
	},
	endNest: function() {
		if (DEBUG.state === true) {
			console.groupEnd()
		}
	},
	log: function(value) {
		if (DEBUG.state === true) {
			console.log(value)
		}
	},
	clear: function() {
		if (DEBUG.state === true) {
			console.clear()
		}
	},
	setState: function(value) {
		DEBUG.state = value
	},
	getState: function() {
		return DEBUG.state
	},
	stateSwitch: function() {
		console.groupCollapsed('DEBUG.stateSwitch')
		if (DEBUG.state === true) {
			DEBUG.state = false
			console.log ('DEBUG.state = false')
		}
		else {
			DEBUG.state = true
			console.log ('DEBUG.state = true')
		}
		console.groupEnd()
	},
	getFunctionName: function() {
		return arguments.callee.caller.name
		/*
		var name = arguments.callee.caller.toString();
		name = name.substr('function '.length); 	//remove 'function '
		name = name.substr(0, name.indexOf('(')); 	//remove all after name
		return name
		*/
	}
}