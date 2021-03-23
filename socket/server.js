const io = require('socket.io')();
const storage = require('./storage.js');
var SerialPort = require('serialport');
var xbee_api = require('xbee-api');
var C = xbee_api.constants;


// on declare une constante contenant le nom du port utilisé par le coordinateur pour se relier à l'ordinateur
const port_USB = "COM6";
// on choisit le mode de l'API
var xbeeAPI = new xbee_api.XBeeAPI({
  api_mode: 1
});

// initier une connexion zigbee entre le port serie et le xbee
let serialport = new SerialPort(port_USB, {
  baudRate: 9600,
}, function (err) {
  if (err) {
    return console.log('Error: ', err.message)
  }
});

serialport.pipe(xbeeAPI.parser);
xbeeAPI.builder.pipe(serialport);

// ouvrir la connexion 

serialport.on("open", function () {

  // Creer une Frame de AT commande pour identification

  var frame_obj = { // AT Request to be sent
    type: C.FRAME_TYPE.AT_COMMAND,
    command: "NI",
    commandParameter: [],
  };

  // En envoi la frame précedement crée
  xbeeAPI.builder.write(frame_obj);

  // créer et remplis une frame AT commande a distance sur l'adresse de diffusion
  // cette commande demande a tous les Xbee de s'identifier
  frame_obj = { // AT Request to be sent
    type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
    destination64: "FFFFFFFFFFFFFFFF",
    command: "NI",
    commandParameter: [],
  };
  xbeeAPI.builder.write(frame_obj);

});

// All frames parsed by the XBee will be emitted here

xbeeAPI.parser.on("data", function (frame) {

  //on new device is joined, register it
  //on packet received, dispatch event
  //let dataReceived = String.fromCharCode.apply(null, frame.data);
  if (C.FRAME_TYPE.ZIGBEE_RECEIVE_PACKET === frame.type) {
    console.log("C.FRAME_TYPE.ZIGBEE_RECEIVE_PACKET");
    let dataReceived = String.fromCharCode.apply(null, frame.data);
    console.log(">> ZIGBEE_RECEIVE_PACKET >", dataReceived);

    browserClient && browserClient.emit('pad-event', {
      device: frame.remote64,
      data: dataReceived
    });
  }

  if (C.FRAME_TYPE.NODE_IDENTIFICATION === frame.type) {
    // let dataReceived = String.fromCharCode.apply(null, frame.nodeIdentifier);
    // console.log(">> ZIGBEE_RECEIVE_PACKET >", frame);


  }
  // traiter l'echantillonage de données récolté par le routeurs
  else if (C.FRAME_TYPE.ZIGBEE_IO_DATA_SAMPLE_RX === frame.type) {
    console.log(frame);
    //TODO: enregistrement dans la base de donnée

    storage.registerSample('luminosité', frame.analogSamples.AD2)
    storage.registerSample('Température', frame.analogSamples.AD3)


    // traitement de la donnée du thermometre AD3
    // si la temperature est basse on allume le chauffage
    if (frame.analogSamples.AD3 < 300) {
      //allumer chauffage
      console.log("la température est très basse, on allume le chauffage , la température va grimper")
      console.log("*********************************************************************************")

      var frame_obj = {
        type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
        destination64: frame.remote64,
        command: "D1",
        commandParameter: [5],
      };
      xbeeAPI.builder.write(frame_obj);
      
    }

    else {// si la temperature est haute on eteint le chauffage
       //eteindre chauffage
       console.log("la température est très haute, on etteint le chauffage , la température va baisser")
       console.log("**********************************************************************************")

       var frame_obj = {
        type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
        destination64: frame.remote64,
        command: "D1",
        commandParameter: [4],
      };
      xbeeAPI.builder.write(frame_obj);


    }


    // traitement de la donnée du capteur de luminosité AD2
    // si la lumiere est basse on allume l'eclairage(AD0)
    if (frame.analogSamples.AD2 < 300) {
      //allumer eclairage
      console.log("la luminosité est très basse, on allume l'eclairage")
      console.log("*********************************************************************************")

      var frame_obj = {
        type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
        destination64: frame.remote64,
        command: "D0",
        commandParameter: [5],
      };
      xbeeAPI.builder.write(frame_obj);
    }

    else {// si la temperature est haute on eteint l'eclairage
       //eteindre l'eclairage
       console.log("la luminosité est très haute, on etteint l'eclairage")
       console.log("**********************************************************************************")

       var frame_obj = {
        type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
        destination64: frame.remote64,
        command: "D0",
        commandParameter: [4],
      };
      xbeeAPI.builder.write(frame_obj);


    }



  } else if (C.FRAME_TYPE.REMOTE_COMMAND_RESPONSE === frame.type) {

  } else {
    console.debug(frame);
    let dataReceived = String.fromCharCode.apply(null, frame.commandData)
    console.log(dataReceived);
  }

});
let browserClient;
io.on('connection', (client) => {
  console.log(client.client.id);
  browserClient = client;

  client.on('subscribeToPad', (interval) => {
    console.log('client is subscribing to timer with interval ', interval);
    // setInterval(() => {
    //   client.emit('pad-event', {
    //     device: "test device",
    //     data: Math.round(Math.random()) * 2 - 1
    //   })
    //   ;
    // }, Math.random() * 1000);
  });

  client.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const port = 8000;
io.listen(port);
console.log('listening on port ', port);
//
// serial_xbee.on("data", function(data) {
//     console.log(data.type);
//   // console.log('xbee data received:', data.type);
//   // client.emit('timer', "pouet");
// //
// });

// shepherd.on('ready', function () {
//   console.log('Server is ready.');
//
//   // allow devices to join the network within 60 secs
//   shepherd.permitJoin(60, function (err) {
//     if (err)
//       console.log(err);
//   });
// });
//
// shepherd.start(function (err) {                // start the server
//   if (err)
//     console.log(err);
// });
