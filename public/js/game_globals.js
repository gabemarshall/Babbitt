// Variables set in here are global and used in both core game logic (game_loop.js & game_console.js)
// and also used in the ImpactJS draw method (lib/game/main.js)

//game states
var termInit = false;
var gameBegun = false;

//player
var playerName;
var oppName;

//ship
var shipHP = 100;

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