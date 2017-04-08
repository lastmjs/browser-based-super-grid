export interface BBRTCConnection {
    type: 'WORKER' | 'SOURCE';
    peerID: string;
    connection: RTCPeerConnection;
    sendChannel: RTCDataChannel;
    receiveChannel: RTCDataChannel;
}
