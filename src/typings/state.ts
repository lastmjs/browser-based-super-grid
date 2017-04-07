export interface State {
    readonly peerID: string;
    readonly sourceCode: string;
    readonly sourceCodeVerified: boolean;
    readonly repoURL: string;
    readonly filePath: string;
    readonly keyID: string;
    readonly sourceConnection: RTCPeerConnection;
    readonly signalingConnection: WebSocket;
    readonly workerConnections: {
        [peerID: string]: {
            peerID: string;
            connection: RTCPeerConnection;
        };
    };
}
