var globalTest = 'hello'
var powerLevel = 10
var shieldLevel = 100



var powerCharge = setInterval(function(){
	if (powerLevel <= 100){
		if (powerLevel + 5 >= 100){
			powerLevel = 100
		} else {
			powerLevel += 5;
		}
		
	}
},500)





