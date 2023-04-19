const WebSocket = require('ws');
const socket = new WebSocket('wss://streamer.finance.yahoo.com');

// Connection opened -> Subscribe
socket.addEventListener('open', function (event) {

    console.log("Connected");

    socket.send(JSON.stringify({
        subscribe: ['MSFT']
    }));
});

// Listen for messages
socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
});

// Unsubscribe
var unsubscribe = function (symbol) {
    socket.send(JSON.stringify({ 'type': 'unsubscribe', 'symbol': symbol }))
}