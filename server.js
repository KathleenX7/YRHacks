/**
 * @fileoverview server for YRHacks simulation
 */

// constants
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require("socket.io")(server);

//variables
var players = []
var globalStats = {economy: 5, happiness: 5, health: 5, waste: 5, deforestation: 5, carbon: 5, turtle: 5, water: 5};

// send all file things over to client
app.use(express.static(__dirname));
/**
 * send index.html to thc client as the file to serve
 */
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

/**
 * starts server listen
 * @param port 3000 the port to listen to
 */
server.listen(3000, () => {
  console.log('listening on *:3000');
});

/**
 * waits for socket connections
 * @param socket the socket to connect to
 */
io.sockets.on('connection', function(socket) {
  console.log("new connection");
  socket.on('name', function(name){
    console.log("client's name is " + name);
    // add a new player
    players.push({name: name, food: "0", energy: "0", transportation: "0", waste: "0"});
    console.log(players);
  });
  //deals with chat
  socket.on('chat message', function(msg) {
    console.log(msg);
    io.emit('chat message', msg);
  });
  //deals with calculations of stuffs
  socket.on('stats', function(stats){
    console.log(stats);
    //deal with stats
    globalStats.economy = 10 - stats.appliancePurchase/40 - stats.renewableEnergy/40 - stats.energyEfficiency/50; //add transportation
    if(stats.transportation === "Car"){
      globalStats.economy = Math.round(globalStats.economy - 0.5);
    }else if (stats.transportation === "Plane"){
      globalStats.economy = Math.round(globalStats.economy - 2);
    }
    globalStats.happiness = 1 + ((stats.meatEaten + stats.plantEaten)/2)/25 + globalStats.economy/3 + stats.appliancePurchase/50;
    globalStats.health = 4 + stats.plantEaten/25 + stats.meatEaten/5 - carbonEmission/2.5;
    globalStats.waste = 4 + stats.appliancePurchase/25 + (stats.meatEaten + stats.plantEaten)/125 - stats.recyclePercent/30; 
    globalStats.deforestation = 10 - stats.appliancePurchase/50 - stats.plantEaten/30 - stats.meatEaten/25;
    globalStats.carbon = (6 + stats.meatEaten/50 + globalStats.deforestation/5 - stats.energyEfficiency/40 - stats.renewableEnergy/40)/8;
    if(stats.transportation === "Car"){
      globalStats.carbon = Math.round(globalStats.carbon + 1);
    }else if(stats.transportation === "Bus"){
      globalStats.carbon = Math.round(globalStats.carbon + 0.5);
    }
    else if (stats.transportation === "Plane"){
      globalStats.carbon = Math.round(globalStats.carbon + 2);
    }
    globalStats.turtle = 1 + globalStats.waste/2 + globalStats.carbonEmission/7 + stats.appliancePurchase/40; 
    io.emit('stats', globalStats);
  });
});
//10 - frequencyOfPurchase/40 - percentageUseOfRenewable/40 - energyEfficiencyInHome/50 - (2 if Plane, 0.5 if car)
// 1 + ((meat + plant)/2)/25 + economyLevel/3 + frequencyOfPurchase/50 
// 4 + plant/25 + meat /50 - 2*carbonEmission/5
// 4 + frequencyOfPurchase/25 +  (meat + plant)/125 - percentageRecycled/30
// 10 - frequencyOfPurchse/50 - plant/30 - meat/25
// 6 + meat/50 + deforestation/5 - energyEfficiency/40 - percentageUseOfRenewable/40
//1 + wasteProduction/2 + carbonEmission/7 + frequencyOfPurchase/40