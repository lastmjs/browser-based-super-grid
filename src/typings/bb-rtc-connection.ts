export interface BBRTCConnection {
    peerID: string;
    connection: RTCPeerConnection;
    sendChannel: RTCDataChannel;
    receiveChannel: RTCDataChannel;
}
