/**
 * @fileoverview client side JS
 */

// create the socket
var socket = io.connect();

//chat related cariables
var form = document.getElementById("chat");
var input = document.getElementById("chat-box");
var messages = document.getElementById("messages");

//options related variables
var meatEaten = document.getElementById("meat-eaten");
var plantEaten = document.getElementById("plant-eaten");
var renewableEnergy = document.getElementById("renewable-energy");
var energyEfficiency = document.getElementById("energy-efficiency");
var recyclePercent = document.getElementById("recycle");
var appliancePurchase = document.getElementById("appliance-purchase");
var transportation = document.getElementById("transportation");

//stats related variables
var economy = document.getElementById("economy");
var happiness = document.getElementById("happiness");
var health = document.getElementById("health");
var waste = document.getElementById("waste");
var deforestation = document.getElementById("deforestation");
var carbon = document.getElementById("carbon");
var turtles = document.getElementById("turtles");

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
    if(transportation != null && transportation.value){
        // console.log({meatEaten: meatEaten.value, plantEaten: plantEaten.value, renewableEnergy: renewableEnergy.value, energyEfficiency: energyEfficiency.value, recyclePercent: recyclePercent.value, appliancePurchase: appliancePurchase.value, transportation: transportation.value});
        socket.emit("stats", {meatEaten: meatEaten.value, plantEaten: plantEaten.value, renewableEnergy: renewableEnergy.value, energyEfficiency: energyEfficiency.value, recyclePercent: recyclePercent.value, appliancePurchase: appliancePurchase.value, transportation: transportation.value});
    }else{
        // console.log({meatEaten: meatEaten.value, plantEaten: plantEaten.value, renewableEnergy: renewableEnergy.value, energyEfficiency: energyEfficiency.value, recyclePercent: recyclePercent.value, appliancePurchase: appliancePurchase.value});
        socket.emit("stats", {meatEaten: meatEaten.value, plantEaten: plantEaten.value, renewableEnergy: renewableEnergy.value, energyEfficiency: energyEfficiency.value, recyclePercent: recyclePercent.value, appliancePurchase: appliancePurchase.value});
    }
    setTimeout(sendStats, 50);
}
sendStats();

socket.on('chat message', function(msg) {
    var item = document.createElement('div');
    item.className = "message";
    item.textContent = msg;
    
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('stats', function(stats){
    economy.textContent = Math.round(stats.economy);
    happiness.textContent = Math.round(stats.happiness);
    health.textContent = Math.round(stats.health);
    waste.textContent = Math.round(stats.waste);
    deforestation.textContent = Math.round(stats.deforestation);
    carbon.textContent = Math.round(stats.carbon);
    turtles.textContent = Math.round(stats.turtle);
});

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value){
        socket.emit('chat message', user + ": " + input.value);
        input.value = '';
    }
});