var shipSystemsLoop = setInterval(function() {

    // Check if enemy is dead

    if (gameBegun && enemyShip.hull.damage.current <= 0) {
       // destroyEnemyShip();
        alert("Enemy Annihilated");
    } else if (gameBegun && myShip.hull.damage.current <= 0) {
        alert("You lose...")
    }

    // Check for shields being active
    if (!shieldsActive) {
        shieldLevel = 0
        try {
            var shield = ig.game.getEntitiesByType(EntityShields)[0];
            shield.kill()
        } catch (err) {

        }
    } else {


        // If power level is too lwo, set it to 0 and drop any shields
        if (powerLevel - (shieldLevel / 10) < 0) {
            shieldsActive = false
            var shield = ig.game.getEntitiesByType(EntityShields)[0];
            shield.kill()
            powerLevel = 0
        } else {
            powerLevel -= (shieldLevel / 10)
        }

    }

    // Determine power recharge rate

    if (powerLevel <= 100) {
        if (powerLevel + 1 >= 100) {
            powerLevel = 100;
        } else if (powerLevel < 0) {
            powerLevel = 0;
        } else {
            powerLevel += 1;
        }

    }
}, 100)
