/**
 * @fileoverview client side JS
 */

// create the socket
var socket = io.connect();
var form = document.getElementById("chat");
var input = document.getElementById("chat-box");
var messages = document.getElementById("messages");
var user = "";

/**
 * stuff to run when the client connects
 */
function onConnect(){
    sendName();
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

function switchView(event, viewName){
    var tabs = document.getElementsByClassName("tab-element");
    for(let i = 0;i < tabs.length;i++){
        tabs[i].style.display = "none";
    }
    var tabLinks = document.getElementsByClassName("tabs");
    for(let i = 0;i < tabLinks.length;i++){
        tabLinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    event.currentTarget.className += " active";
}

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