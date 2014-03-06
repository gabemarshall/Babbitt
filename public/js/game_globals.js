// Variables set in here are global and used in both core game logic (game_loop.js & game_console.js)
// and also used in the ImpactJS draw method (lib/game/main.js)
//babbitt.gabemarshall.me/pushitrealgood
//babbitt.gabemarshall.me

//Ship Data
function playerShip() {
    //public
    this.shipName = generateShipName();
    this.playerName = this.shipName;
    this.generator = new Generator();
    this.capacitor = new Capacitor();
    this.laser = new Laser();
    this.shield = new Shield();
    this.hull = new Hull();

    //getters and setters
    this.getShipName = function() {
        return this.shipName
    }
    this.setShipName = function(name) {
        this.shipName = name
    }
    this.getPlayerName = function() {
        return this.playerName
    }
    this.setPlayerName = function(name) {
        this.playerName = name
    }
    this.getShipNumber = function() {
        return this.shipNumber
    }
    this.getShipNumber = function() {
        return shipNumber
    }
    //Randomly generate a ship number
    function generateShipName() {
        return Math.floor((Math.random()*1000000)+1);
    }
    this.incomingLaser = function(value) {
        //code
    }
    //Ship Systems
    function Generator() {
        this.damage = new Data(0.0);        //current amount of damage
        this.operation = new Data(100.0);   //current operational ability
        this.durability = new Data(100.0);  //how susceptible the system is to damage
        this.effeciency = new Data(100.0);  //how effient the system is at operating

        this.output = new Data(0.0);        //energy output
    }

    function Capacitor() {
        this.damage = new Data(0.0);        //current amount of damage
        this.operation = new Data(100.0);   //current operational ability
        this.durability = new Data(100.0);  //how susceptible the system is to damage
        this.effeciency = new Data(100.0);  //how effient the system is at operating

        this.reserve = new Data(0.0);       //energy available
    }

    function Laser() {
        this.damage = new Data(0.0);        //current amount of damage
        this.operation = new Data(100.0);   //current operational ability
        this.durability = new Data(100.0);  //how susceptible the system is to damage
        this.effeciency = new Data(100.0);  //how effient the system is at operating
    }

    function Shield () {
        this.damage = new Data(0.0);        //current amount of damage
        this.operation = new Data(100.0);   //current operational ability
        this.durability = new Data(100.0);  //how susceptible the system is to damage
        this.effeciency = new Data(100.0);  //how effient the system is at operating
    }

    function Hull() {
        this.damage = new Data(100.0);      //current amount of damage
        this.operation = new Data(100.0);   //current operational ability
        this.durability = new Data(100.0);  //how susceptible the system is to damage
        this.damage = new Data(100.0);
    }

    //object used to hold data, and keep record of its previous value
    function Data(initialize) {
        var previous = initialize;
        var current = initialize;
        this.__defineGetter__("previous", function() {
            return previous;
        });
        this.__defineGetter__("current", function() {
            return current;
        });  
        this.__defineSetter__("current", function(value) {
            if (current !== value) {
                previous = current;
                current = value;
            }
        });
    }
}

var myShip = new playerShip();

var ship = {
    name: 0,
    captain: 0,
    id: 0,
    location: 0
}