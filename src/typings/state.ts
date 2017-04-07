import {BBRTCConnection} from './bb-rtc-connection';

export interface State {
    readonly peerID: string;
    readonly sourceCode: string;
    readonly sourceCodeVerified: boolean;
    readonly repoURL: string;
    readonly filePath: string;
    readonly keyID: string;
    readonly signalingConnection: WebSocket;
    readonly sourceConnection: BBRTCConnection;
    readonly workerConnections: {
        [peerID: string]: BBRTCConnection;
    };
}
