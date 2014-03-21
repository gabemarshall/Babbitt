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
    var target

    //ship operation
    var updateSystems = setInterval(
        function() {
            console.groupCollapsed('Ship Main Interval')

            capacitor.update(generator.getCurrentOutput())

            console.groupEnd()
        }, 
        1000
    )

    //public
    this.getShipID      = function(     )   { return id         }
    this.getID          = function(     )   { return id         }
    this.getName        = function(     )   { return name       }
    this.setName        = function(value)   { name = value      }
    this.getShipName    = function(     )   { return name       }
    this.setShipName    = function(value)   { name = value      }
    this.getPlayerName  = function(     )   { return captain    }
    this.setPlayerName  = function(value)   { captain = value   }
    this.getCaptainName = function(     )   { return captain    }
    this.setCaptainName = function(value)   { captain = value   }
    this.getLocation    = function(     )   { return location   }
    this.setLocation    = function(value)   { location = value  }
    this.getTarget      = function(     )   { return target     }
    this.setTarget      = function(value)   { target = value    }
}

//Capacitor System
//******************************************************************************
function Capacitor() {
    //public
    this.getCurrentPowerUnits = function() {
        return power.current
    }
    this.getCurrentPowerPercentage = function() {
        return (power.current / power.maximum) * 100
    }
    this.update = function(incomingPower) {
        power.current += incomingPower
        checkPowerLevels()
        consoleOutput()
    }
    //private
    var damage = {
        current: 0, //units
        minimum: 0, //units
        maximum: 100, //units
    }
    var power = {
        current: 10, //units
        minimum: 0, //units
        maximum: 1000, //units
    }
    var checkPowerLevels = function() {
        if (power.current > power.maximum) {
            //code
        }
        else if (power.current < power.minimum) {
            //code
        }
        else {
            //do nothing
        }
    }

    var consoleOutput = function() {
        console.groupCollapsed('System: Capacitor')
        
        //power data
        console.log(
            'Capacitor Power Storage: ' +
            power.current + '/' + power.maximum + ' or ' +
            Math.floor((power.current / power.maximum) * 100) +
            '%'
        )

        //damage

        //other

        console.groupEnd()
    }
}

//Generator System
//******************************************************************************
function Generator() {
    var output = {
        current: 1, //units
        minimum: 0, //units
        maximum: 0, //units 
    }
    this.getCurrentOutput = function() {
        return output.current
    }
    this.getMinimumOutput = function() {
        return output.minimum
    }
    this.getMaximumOutput = function() {
        return output.maximum
    }
}