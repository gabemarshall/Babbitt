// Attempt to Sync data with backend server on Init (assuming you have a valid session cookie)
function initSyncData(){
		$.ajax({
		  type: "GET",
		  url: "http://babbitt.gabemarshall.me:1982/init",
		  xhrFields: { withCredentials: true }
		}).done(function(Data){
			setLocalData(Data.ship_name, Data.playername, Data.ship_id)
		}).error(function(){
			TERMINAL_LOGIC.output("Currently not logged in, type /login emailaddress:password to login.")
		})
}

function saveData(playername, shipid, shipname){
		$.ajax({
		  type: "POST",
		  url: "http://babbitt.gabemarshall.me:1982/sync",
		  xhrFields: { withCredentials: true },
		  data: {"playername": playername, "shipid": shipid, "shipname": shipname}
		}).error(function(){
			alert("Not logged in")
		})
}	

// Set local values to data received from server
function setLocalData(shipname, playername, shipid){
	ship.setShipName(shipname)
	ship.setPlayerName(playername)
	ship.setShipID(shipid)

    TERMINAL_LOGIC.output("Sync successful, welcome "+playername)
    TERMINAL_LOGIC.output("Current ship name is "+shipname)
}