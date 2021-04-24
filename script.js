/**
 * @fileoverview client side JS
 */

// create the socket
var socket = io.connect();
var form = document.getElementById("chat");
var input = document.getElementById("chat-box");
var messages = document.getElementById("messages");

var meatEaten = document.getElementById("meat-eaten");
var plantEaten = document.getElementById("plant-eaten");
var renewableEnergy = document.getElementById("renewable-energy");
var energyEfficiency = document.getElementById("energy-efficiency");
var recyclePercent = document.getElementById("recycle");
var appliancePurchase = document.getElementById("appliance-purchase");
var transportation = document.getElementById("transportation");
var user = "";

/**
 * stuff to run when the client connects
 */
function onConnect(){
    sendName();
    sendStats();
}

/**
 * sends the name of the player to the server 
 * creates a prompt which asks for the name then emits it to the server
 */
function sendName(){
    let name = prompt("What is your name?");
    socket.emit("name", name);
    user = name;
}

/**
 * Sends player stats to the server every second
 */
function sendStats(){
    socket.emit("stats", {meatEaten: meatEaten, plantEaten, plantEaten, renewableEnergy: renewableEnergy, energyEfficiency: energyEfficiency, recyclePercent: recyclePercent, appliancePurchase: appliancePurchase, transportation: transportation});
    setTimeout(sendStats, 1000);
}
sendStats();

socket.on('chat message', function(msg) {
    var item = document.createElement('div');
    item.className = "message";
    item.textContent = msg;
    
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value){
        console.log(input.value);
        socket.emit('chat message', user + ": " + input.value);
        input.value = '';
    }
});