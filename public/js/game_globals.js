// Variables set in here are global and used in both core game logic (game_loop.js & game_console.js)
// and also used in the ImpactJS draw method (lib/game/main.js)
//babbitt.gabemarshall.me/pushitrealgood
//babbitt.gabemarshall.me

//Ship Data
function playerShip() {
    //public
    this.shipName;
    var shipNumber = generateShipNumber();
    this.playerName;
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
    function generateShipNumber() {
        //code
        return 0;
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

//two variables that hold player ship and enemy ship data
var myShip = new playerShip();
var enemyShip;

//Game States
var termInit = false;
var gameBegun = false;

//**PHASE OUT
var playerName; 
var oppName;
var shipHP = 100;
var shipHPBound = {lowerBound:0, upperBound:100};
var powerLevel = 100;
var laserActive = false;
var laserBound = {lowerBound:0, upperBound:100};
var shieldsActive = false;
var shieldLevel = 100;
var shieldBound = {lowerBound:0, upperBound:100};
//**PHASE OUT

var checkIfAlive = function(hp) {
    if (hp <= 0) {
        return false;
    }
    else {
        return true;
    }
}

var checkPowerAvailability = function(powerRequest, module) {
    if ((powerLevel - powerRequest) <= 0) {
        return false;
    }
    else {
        if(module === "shields") {
            shieldLevel = powerRequest;
        }
        else {
            powerLevel -= powerRequest;
        }
        return true;
    }
}

var destroyEnemyShip = function() {
    var ship = ig.game.getEntitiesByType(EntityShip)[0];
    ship.kill()
}

var shakeScreen = function() {
    $('.wrapper').jrumble({
        x: 2,
        y: 2,
        rotation: 1
    });
    $('.wrapper').trigger('startRumble');
    setTimeout(function(){
    	$('.wrapper').trigger('stopRumble');
    }, 200)
}

var adjustLaserValue = function(laserValue) {
    laserValue = laserValue - shieldLevel;
    if (laserValue < 0) {
        laserValue = 0;
    }
    else if (laserValue > 100) {
        laserValue = 100;
    }
    return laserValue;
}

var adjustShipHP = function(laserValue) {
    myShip.hull.damage.current = myShip.hull.damage.current - laserValue;
    //shipHP = limitValue(shipHP, ship)
    if (myShip.hull.damage.current < 0) {
        myShip.hull.damage.current = 0;
    }
    else if (myShip.hull.damage.current > 100) {
        myShip.hull.damage.current = 100;
    }
    return myShip.hull.damage.current;
}

var limitValue = function(value, lbound, ubound) {
    if (value < lbound) {
        value = lbound;
    }
    else if (value > ubound) {
        value = ubound;
    }
    return value;
}
