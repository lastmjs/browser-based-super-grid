import {BBRTCConnection} from './bb-rtc-connection';
import {WorkerConnections} from './worker-connections';

export interface State {
    readonly peerID: string;
    readonly sourceCode: string;
    readonly sourceCodeVerified: boolean;
    readonly repoURL: string;
    readonly filePath: string;
    readonly keyID: string;
    readonly signalingConnection: WebSocket;
    readonly sourceConnection: BBRTCConnection;
    readonly workerConnections: WorkerConnections;
}
