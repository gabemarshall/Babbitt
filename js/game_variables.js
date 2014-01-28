// Variables set in here are global and used in both core game logic (game_loop.js & game_console.js)
// and also used in the ImpactJS draw method (lib/game/main.js)

var powerLevel = 100
var shieldLevel = 100

var playerName
var oppName
var termInit = false
var gameBegun = false

var shieldsActive = false
var laserActive = false

var shipHP = 10

var checkIfAlive = function(hp) {
    if (hp <= 0) {
        return false
    } else {
        return true
    }
}

var checkPowerAvailability = function(powerRequest, module){
    var actualPowerReq = Math.ceil((powerRequest + 0) / 10) * 10;
    if ((powerLevel - actualPowerReq) <= 0){
        return false;
    } else {
        
        if(module === "shields"){
            shieldLevel = actualPowerReq;
            //powerLevel -= actualPowerReq
        } else {
            powerLevel -= actualPowerReq
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
