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

var destroyEnemyShip = function() {
    var ship = ig.game.getEntitiesByType(EntityShip)[0];
    ship.kill()
    
}
