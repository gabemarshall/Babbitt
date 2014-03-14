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
    this.getShipID = function() {
        return id
    }
    this.getID = function() {
        return id
    }
    this.getName = function() {
        return name
    }
    this.setName = function(data) {
        name = data
    }
    this.getShipName = function() {
        return name
    }
    this.setShipName = function(data) {
        name = data
    }
    this.getPlayerName = function() {
        return captain
    }
    this.setPlayerName = function(data) {
        captain = data
    }
    this.getCaptainName = function() {
        return captain
    }
    this.setCaptainName = function(data) {
        captain = data
    }
    this.getTarget = function() {
        return target
    }
    this.setTarget = function(data) {
        target = data
    }
    this.getLocation = function() {
        return location
    }
    this.setLocation = function(data) {
        location = data
    }

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
    function LaserTurret() {
        this.power = new Data(100.0)
    }

    //private variables
    var id = Math.floor((Math.random()*1000000)+1)
    var shipName = id
    var captain = id
    var name = id
    var target = 'none'
    var laserTurret = new LaserTurret()
    var location = 'location'

    //ship operation
    var update = setInterval(
        function() {
            //code
        }, 
        1000
    )
}