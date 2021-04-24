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
    // console.log(stats);
    //deal with stats
    io.emit('stats', globalStats);
  });
});