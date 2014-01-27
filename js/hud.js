var powerLevel = 100
var shieldLevel = 100



var powerLevel = setInterval(function(){
	if (powerLevel <= 100){
		if (powerLevel + 5 >= 100){
			powerLevel = 100;
		} 
		else {
			powerLevel += 5;
		}
		
	}


	if(!shieldsActive){
		shieldLevel = 0
	} else {
		shieldLevel = 100
		powerLevel -= 10
	}

},500)




