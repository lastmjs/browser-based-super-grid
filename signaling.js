const WebSocket = require('ws');

const server = new WebSocket.Server({
    port: 8000
});

server.on('connection', (client) => {
    console.log('client connection established');
    client.on('message', (message) => {
        console.log('client message', message);
        broadcast(server, message);
    });
});

function broadcast(server, message) {
    console.log('broadcasting');
    server.clients.forEach((client) => {
        client.send(message);
    });
}
