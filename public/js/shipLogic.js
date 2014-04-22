//shipLogic.js

//SHIP
//******************************************************************************
var ship = new Ship(pubnub.publish)

    function Ship(deliveryMethod) {
        var id = Math.floor((Math.random() * 1000000) + 1)
        var captain = 'unknown'
        var name = 'unknown'
        var location = 'unknown'
        var capacitor = new Capacitor()
        var generator = new Generator()
        var targetingSystem = new TargetingSystem()
        var encounterLog = new EncounterLog()

        var updateSystems = setInterval(
            function() {
                generator.update()
                capacitor.update(generator.sendPower())
            },
            1000
        )

        //Data System
        //**************************************************************************
        //receive controller
        this.receiveData = function(incomingData) {
            //check source
            if (incomingData.origin.ship != id) {
                //check encounter log
                encounterLog.update(incomingData.origin.ship)
                //execute code based on data type
                data[incomingData.type](incomingData)
            } else {
                //if origin of data is sender
                console.log('ignore data, origin is my ship')
            }
        }

        //send controller
        var sendData = function(systemDestination, shipDestination, contentBlock) {
            var currentTime = new Date() //record current time
            var addressBlock = { //create address block
                origin: { //origin of data
                    system: location, //origin system name
                    ship: id, //origin ship id #
                },
                destination: { //destination of data
                    system: systemDestination, //destination system name
                    ship: shipDestination, //destination ship id #
                },
                timeStamp: { //time data created
                    mil: currentTime.getMilliseconds(), //millisecond (0-999)
                    sec: currentTime.getSeconds(), //second (0-59)
                    min: currentTime.getMinutes(), //minute (0-59)
                    hour: currentTime.getHours(), //hour (0-23)
                    day: currentTime.getDay(), //day of week (0-6)
                    date: currentTime.getDate(), //date of month (1-31)
                    month: currentTime.getMonth(), //month (0-11)
                    year: currentTime.getFullYear(), //year (four digit)
                },
            }
            //combine address block and content block to form data to send
            var dataBlock = mergeBlocks(addressBlock, contentBlock)

            //send data block through delivery method
            deliveryMethod({
                channel: dataBlock.destination.system, //system destination
                message: dataBlock //data
            })
            //fucntion to merge content and address blocks

                function mergeBlocks(block1, block2) {
                    for (var property in block2) {
                        try {
                            if (block2[property].constructor == Object) {
                                block1[property] = mergeBlocks(
                                    block1[property],
                                    block2[property]
                                )
                            } else {
                                block1[property] = block2[property]
                            }
                        } catch (Error) {
                            block1[property] = block2[property]
                        }
                    }
                    return block1
                }
        }
        //receive types defined
        var data = {
            'textMessage': function(incomingData) {
                var displayName = function() {
                    if (encounterLog.getShipName(incomingData.origin.ship) ===
                        encounterLog.getUnidentified()) {
                        return 'Unidentified Ship #' + incomingData.origin.ship
                    } else {
                        return encounterLog.getShipName(incomingData.origin.ship)
                    }
                }

                if (incomingData.destination.ship === id ||
                    incomingData.destination.ship === 'none') {
                    //output to terminal
                    TERMINAL_LOGIC.output(
                        'Message Received ' +
                        incomingData.timeStamp.hour + ':' +
                        incomingData.timeStamp.min + ' ' +
                        displayName() + ': ' +

                        //encounterLog.getShipName(incomingData.origin.ship) + ': ' +
                        //incomingData.origin.ship + ': ' +
                        incomingData.message
                    )
                }
            },
            'warpDriveSignal': function(incomingData) {
                TERMINAL_LOGIC.output('Warp Drive Detected')
            },
            'distressSignal': function(incomingData) {
                TERMINAL_LOGIC.output(
                    'A distress signal has been detected from a ship named "' +
                    incomingData.shipName +
                    '", located within the ' +
                    incomingData.origin.system +
                    ' system'
                )
            },
        }

        //Public Methods
        //**************************************************************************
        //get
        this.getShipID = function() {
            return id
        }
        this.getID = function() {
            return id
        }
        this.getName = function() {
            return name
        }
        this.getShipName = function() {
            return name
        }
        this.getPlayerName = function() {
            return captain
        }
        this.getCaptainName = function() {
            return captain
        }
        this.getLocation = function() {
            return location
        }
        this.getTarget = function() {
            return target
        }
        //set
        this.setName = function(value) {
            name = value
        }
        this.setShipID = function(value) {
            id = value
        }
        this.setShipName = function(value) {
            name = value
        }
        this.setPlayerName = function(value) {
            captain = value
        }
        this.setCaptainName = function(value) {
            captain = value
        }
        this.setLocation = function(value) {
            location = value
        }
        this.setTarget = function(value) {
            target = value
        }

        this.textMessage = function(systemDestination, shipDestination, msg) {
            sendData(systemDestination, shipDestination, {
                type: 'textMessage',
                message: msg,
            })
        }

        this.warpDriveSignal = function() {
            sendData(location, 'none', {
                type: 'warpDriveSignal',
                level: 0,
            })
        }

        this.distressSignal = function() {
            sendData(location, 'none', {
                type: 'distressSignal',
                shipName: name,
            })
        }

        this.login = function(username, password) {
            TERMINAL_LOGIC.output("Attempting to sync data with server...")
            // ajax login method, will set auth cookie and return ship data 
            // in JSON format if successful
            $.ajax({
                type: "POST",
                url: "http://babbitt.gabemarshall.me:1982/users/sign_in",
                xhrFields: {
                    withCredentials: true
                },
                data: {
                    "user[email]": username,
                    "user[password]": password,
                    commit: "Log in",
                    "user[remember_me]": 0
                }
            }).done(function(Data) {

                var serverShipName
                var serverPlayerName
                var serverShipId
                if (!Data.errors) {
                    if (!Data.ship_name) {
                        serverShipName = "unknown"
                    } else {
                        serverShipName = Data.ship_name
                    }

                    if (!Data.ship_id) {
                        serverShipId = Math.floor((Math.random() * 1000000) + 1)
                    } else {
                        serverShipId = Data.ship_id
                    }

                    if (!Data.playername) {
                        serverPlayerName = "unknown"
                    } else {
                        serverPlayerName = Data.playername
                    }
                    // Calls setData within the dbsync.js file
                    setLocalData(serverShipName, serverPlayerName, serverShipId)
                } else {
                    TERMINAL_LOGIC.output("Sorry, your credentials are not valid.."
                }
            });;
        }

        this.setTarget = function(targetshipID) {}

        this.useWarpDrive = function() {
            this.warpDriveSignal()
        }
    }
