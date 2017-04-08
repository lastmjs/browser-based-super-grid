import {ConnectionType} from './connection-type';
import {RequestForWorkMessage} from './request-for-work-message';
import {SolutionFoundMessage} from './solution-found-message';
import {WorkInfoMessage} from './work-info-message';

export interface Action {
    readonly type: string;
    readonly sourceCode?: string;
    readonly sourceCodeVerified?: boolean;
    readonly repoURL?: string;
    readonly filePath?: string;
    readonly keyID?: string;
    readonly peerID?: string;
    readonly connection?: RTCPeerConnection | WebSocket;
    readonly dataChannel?: RTCDataChannel;
    readonly connectionType?: ConnectionType;
    readonly incomingMessage?: RequestForWorkMessage | SolutionFoundMessage | WorkInfoMessage;
    readonly outgoingMessage?: RequestForWorkMessage | SolutionFoundMessage | WorkInfoMessage;
    readonly p?: string;
    readonly q?: string;
    readonly n?: string;
    readonly solutionFound?: boolean;
}
