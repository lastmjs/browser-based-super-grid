import {Signal} from '../typings/signal';

function sendSignal(signalingSocket: WebSocket, signal: Signal) {
    signalingSocket.send(JSON.stringify(signal));
}

function createConnection(host: string) {
    return new WebSocket(`ws://${host}`);
}

export const WebSocketService = {
    sendSignal,
    createConnection
};
