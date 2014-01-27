

var shipSystemsLoop = setInterval(function() {

// Check for shields being active
    if (!shieldsActive) {
        shieldLevel = 0
        try {
        	var shield = ig.game.getEntitiesByType(EntityShields)[0];
            shield.kill()
        } catch (err){

        }
    } else {
        shieldLevel = 100

        // If power level is too lwo, set it to 0 and drop any shields
        if (powerLevel - 10 < 0) {
        	shieldsActive = false
        	var shield = ig.game.getEntitiesByType(EntityShields)[0];
            shield.kill()
            powerLevel = 0
        } else {
            powerLevel -= 10
        }

    }

// Determine power recharge rate

    if (powerLevel <= 100) {
        if (powerLevel + 5 >= 100) {
            powerLevel = 100;
        } else if (powerLevel < 0) {
            powerLevel = 0;
        } else {
            powerLevel += 5;
        }

    }




}, 500)
