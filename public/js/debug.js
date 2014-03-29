//Debug
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
	setState: function(value) {
		debug.state = value
	},
	getState: function() {
		return debug.state
	},
	stateSwitch: function() {
		console.groupCollapsed('debug.stateSwitch')
		if (debug.state === true) {
			debug.state = false
			console.log ('debug.state = false')
		}
		else {
			debug.state = true
			console.log ('debug.state = true')
		}
		console.groupEnd()
	},
}