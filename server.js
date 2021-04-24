/**
 * @fileoverview server for YRHacks simulation
 */

// constants
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require("socket.io")(server);

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
});