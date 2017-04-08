import {BBRTCConnection} from './bb-rtc-connection';
import {WorkerConnections} from './worker-connections';
import {RequestForWorkMessage} from './request-for-work-message';
import {SolutionFoundMessage} from './solution-found-message';
import {WorkInfoMessage} from './work-info-message';

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
    readonly incomingMessage: RequestForWorkMessage | SolutionFoundMessage | WorkInfoMessage;
    readonly outgoingMessage: RequestForWorkMessage | SolutionFoundMessage | WorkInfoMessage;
    readonly p: string;
    readonly q: string;
    readonly n: string;
    readonly solutionFound: boolean;
}
