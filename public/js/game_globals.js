// Variables set in here are global and used in both core game logic (game_loop.js & game_console.js)
// and also used in the ImpactJS draw method (lib/game/main.js)

//Ship Data
//Just getting organized, still needs a ton of work.
function playerShip() {

    //public
    this.shipName;
    this.playerName;
    this.generator = new Generator();
    this.laser = new Laser();
    this.shield = new Shield();
    this.hull = new Hull();

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

    //vector/locatin data type
    function Location(horizontal, vertical) {
        this.horizontal = new Data(horizontal);
        this.vertical = new Data(vertical);
    }

    //Ship Systems
    function Generator() {
        this.location = new Location(0, 0);
        this.damage = new Data(0.0);
        this.operation = new Data(100.0);
        this.output = new Data(0.0);
    }

    function Capacitor() {
        this.location = new Location(0, 0);
        this.damage = new Data(0.0);
        this.operation = new Data(100.0);
        this.reserve = new Data(0.0);
    }

    function Laser() {

    }

    function Shield () {

    }

    function Hull() {

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
    shipHP = shipHP - laserValue;
    //shipHP = limitValue(shipHP, ship)
    if (shipHP < 0) {
        shipHP = 0;
    }
    else if (shipHP > 100) {
        shipHP = 100;
    }
    return shipHP;
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