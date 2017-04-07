function createConnection(config: RTCConfiguration): RTCPeerConnection {
    return new RTCPeerConnection(config);
}

export const WebRTCService = {
    createConnection
};
