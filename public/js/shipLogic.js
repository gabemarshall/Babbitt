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
    //public methods
    this.getShipID = function() {return id}
    this.getID = function() {return id}
    this.getName = function() {return name}
    this.setName = function(data) {name = data}
    this.getShipName = function() {return name}
    this.setShipName = function(data) {name = data}
    this.getPlayerName = function() {return captain}
    this.setPlayerName = function(data) {captain = data}
    this.getCaptainName = function() {return captain}
    this.setCaptainName = function(data) {captain = data}
    this.getLocation = function() {return location}
    this.setLocation = function(data) {location = data}


    //private methods
    function Data(initialize) {
        var previous = initialize
        var current = initialize
        this.getPrevious = function() {
            return previous
        }
        this.getCurrent = function() {
            return current
        }
        this.setCurrent = function(data) {
            if (current !== data) {
                previous = current
                current = data
            }
        }
    }

    //basic ship data
    var id = Math.floor((Math.random()*1000000)+1)
    var captain = id
    var name = id
    var location = 'location'

    //update ship systems
    var updateSystems = function() {
        capacitor.update()
    }

    //ship operation
    var update = setInterval(
        function() {
            updateSystems()
            console.log('Power Level: ' + capacitor.getPower())
        }, 
        1000
    )


    //Capacitor System
    //**************************************************************************
    var capacitor = new function capacitor() {
        var power = 90.0
        this.getPower = function() {return power}
        this.update = function() {
            power += generator.getOutput()
            this.limitPower()
        }
        this.limitPower = function() {
            if (power > 100.0) {
                power = 100.0
            }
            else if (power < 0) {
                power = 0.0
            }
            else {
                //do nothing
            }
        }
    }

    //Generator System
    //**************************************************************************
    var generator = new function generator() {
        var output = 1.0
        this.getOutput = function() {
            return output
        }
    }
}