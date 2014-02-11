// Variables set in here are global and used in both core game logic (game_loop.js & game_console.js)
// and also used in the ImpactJS draw method (lib/game/main.js)


//game states
var termInit = false;
var gameBegun = false;

//player
//**plase out this 
var playerName;

//opponent
var oppName;

//used to limit values
function Limit(low, high) {
    this.lower = low;
    this.upper = high;
}

//store data, history, and limits
function Value(low, high) {
    this.current = 0.0;
    this.previous = 0.0;
    this.limit = new Limit(low, high);
}

//foundation for ship systems
function System() {
    this.power = new Value(0.0,100.0);
    this.operation = new Value(0.0,100.0);
}

//ship systems defined
//**work to inherit methods/vars from System
function Reactor() {
    this.output = new Value(0.0,100.0);
}

function Laser() {

}

function Sheild() {

}

function playerShip() {
    //reactor
    this.shipName;
    this.playerName;
    this.hull = new System();
    this.reactor = new System();
    this.laser = new System();
    this.shield = new System();
}

var myShip = new playerShip();
var enemyShip;

//ship
var shipHP = 100;
var shipHPBound = {lowerBound:0, upperBound:100};

//reactor
var powerLevel = 100;

//lasers
var laserActive = false;
var laserBound = {lowerBound:0, upperBound:100};

//shields
var shieldsActive = false;
var shieldLevel = 100;
var shieldBound = {lowerBound:0, upperBound:100};

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