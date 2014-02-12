// Variables set in here are global and used in both core game logic (game_loop.js & game_console.js)
// and also used in the ImpactJS draw method (lib/game/main.js)

//Ship Data
//Just getting organized, still needs a ton of work.
function playerShip() {

    this.shipName;
    this.playerName;
    this.reactor = new Reactor();
    this.laser = new Laser();
    this.shield = new Shield();

    //A function that keep tract of current/previous value
    //** Merge Limit/Resource with History, and rename to Data
    function History(previous, current, lower, upper) {
        var previous = previous;
        var current = current;
        var limit = new Limit(lower, upper);
        this.__defineGetter__("previous", function() {
            return previous;
        });
        this.__defineGetter__("current", function() {
            return current;
        });  
        this.__defineSetter__("current", function(value) {
            if (value !== current) {
                previous = current;
                current = value;

                //insert code to keep in limits
            }
        });
        function Limit(lower, upper) {
            this.lower = lower;
            this.upper = upper;
        }
    }

    function Vector(horizontal, vertical) {
        this.horizontal = new History(horizontal, horizontal);
        this.vertical = new History(vertical, vertical);
    }

    //** Phase out
    function Limit(lower, upper) {
        this.lower = new History(lower, lower);
        this.upper = new History(upper, upper);
    }
    // ** Merge Limit/Resource with History - rename history as "Data"
    function Resource(lower, upper) {
        this.reserve = new History(0,0);
        this.limit = new Limit(lower, upper);
    }
    //** Phase out

    function Reactor() {
        this.location = new Vector(0,0);   
    }

    function Laser() {
        this.location = new Vector(0,0);
    }

    function Shield() {
        this.location = new Vector(0,0);
    }
}

//two variables that hold player ship and enemy ship data
var myShip = new playerShip();
var enemyShip;

//an example of acessing ship data
//getting the upper power limit of a reactor system
//alert(myShip.reactor.power.limit.upper.current);

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