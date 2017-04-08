const WebSocket = require('ws');

const server = new WebSocket.Server({
    port: 8000
});

let clients = {};

server.on('connection', (client) => {
    client.on('message', (message) => {
        const deserializedMessage = JSON.parse(message);
        switch (deserializedMessage.type) {
            case 'INITIAL_CONNECTION': {
                client.peerID = deserializedMessage.peerID;
                clients[deserializedMessage.peerID] = client;
                break;
            }
            default: {
                if (!clients[deserializedMessage.peerID]) {
                    return;
                }

                clients[deserializedMessage.peerID].send(JSON.stringify(Object.assign({}, deserializedMessage, {
                    peerID: client.peerID
                })));
                break;
            }
        }
    });
});
