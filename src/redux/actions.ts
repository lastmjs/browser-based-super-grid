import {Action} from '../typings/action';
import {GithubService} from '../services/github-service';
import {PGPService} from '../services/pgp-service';
import {UtilitiesService} from '../services/utilities-service';
import {WebSocketService} from '../services/web-socket-service';
import {WebRTCService} from '../services/web-rtc-service';
import {Signal} from '../typings/signal';
import {RequestForWorkMessage} from '../typings/request-for-work-message';
import {SolutionFoundMessage} from '../typings/solution-found-message';
import {WorkInfoMessage} from '../typings/work-info-message';

function handleIncomingMessage(component: any, incomingMessage: RequestForWorkMessage | SolutionFoundMessage | WorkInfoMessage) {
    const solutionFound = incomingMessage.type === 'SOLUTION_FOUND' ? true : false;

    if (solutionFound) {
        component.action = {
            type: 'HANDLE_OUTGOING_MESSAGE',
            outgoingMessage: incomingMessage
        };
    }

    component.action = {
        type: 'HANDLE_INCOMING_MESSAGE',
        incomingMessage,
        solutionFound,
        p: solutionFound ? (<SolutionFoundMessage> incomingMessage).p : null,
        q: solutionFound ? (<SolutionFoundMessage> incomingMessage).q : null,
        n: solutionFound ? (<SolutionFoundMessage> incomingMessage).n : null
    };
}

function handleOutgoingMessage(outgoingMessage: RequestForWorkMessage | SolutionFoundMessage | WorkInfoMessage, sourcePeerID: string): Action {
    const solutionFound = outgoingMessage.type === 'SOLUTION_FOUND' ? true : false;

    if (outgoingMessage.type === 'REQUEST_FOR_WORK' || outgoingMessage.type === 'WORK_INFO') {
        outgoingMessage.sourcePeerID = sourcePeerID;
    }

    return {
        type: 'HANDLE_OUTGOING_MESSAGE',
        outgoingMessage,
        solutionFound,
        p: solutionFound ? (<SolutionFoundMessage> outgoingMessage).p : null,
        q: solutionFound ? (<SolutionFoundMessage> outgoingMessage).q : null,
        n: solutionFound ? (<SolutionFoundMessage> outgoingMessage).n : null
    };
}

function createWorkerConnection(config: RTCConfiguration, peerID: string) {
    const connection: RTCPeerConnection = WebRTCService.createConnection(config);
    return {
        type: 'CREATE_WORKER_CONNECTION',
        peerID,
        connection
    };
}

function createSourceConnection(config: RTCConfiguration, sourcePeerID: string): Action {
    const sourceConnection: RTCPeerConnection = WebRTCService.createConnection(config);
    return {
        type: 'CREATE_SOURCE_CONNECTION',
        connection: sourceConnection,
        sourcePeerID: sourcePeerID
    };
}

function createSignalingConnection(host: string): Action {
    const signalingConnection: WebSocket = WebSocketService.createConnection(host);
    return {
        type: 'CREATE_SIGNALING_CONNECTION',
        connection: signalingConnection
    };
}

function generatePeerID(): Action {
    // I am purposefully not persisting the peerID because we want a different peerID for each instance of the app
    // Because the app is usually within the same domain on one machine (loaded from the same web server), persisting the peerID
    // would cause all instances of the app loaded over that domain to be the same
    return {
        type: 'GENERATE_PEER_ID',
        peerID: UtilitiesService.generateUUID().slice(26)
    };
}

function persistParameters(repoURL: string, filePath: string, keyID: string, signalingServerHostAndPort: string, n: string, sqrtN: string): Action {
    window.localStorage.setItem('repoURL', repoURL);
    window.localStorage.setItem('filePath', filePath);
    window.localStorage.setItem('keyID', keyID);
    window.localStorage.setItem('signalingServerHostAndPort', signalingServerHostAndPort);
    window.localStorage.setItem('n', n);
    window.localStorage.setItem('sqrtN', sqrtN);

    return {
        type: 'SET_PARAMETERS',
        repoURL,
        filePath,
        keyID,
        signalingServerHostAndPort,
        n,
        sqrtN
    };
}

function retrieveParameters(): Action {
    const repoURL: string = window.localStorage.getItem('repoURL');
    const filePath: string = window.localStorage.getItem('filePath');
    const keyID: string = window.localStorage.getItem('keyID');
    const signalingServerHostAndPort = window.localStorage.getItem('signalingServerHostAndPort');
    const n = window.localStorage.getItem('n');
    const sqrtN = window.localStorage.getItem('sqrtN');
    return {
        type: 'SET_PARAMETERS',
        repoURL,
        filePath,
        keyID,
        signalingServerHostAndPort,
        n,
        sqrtN
    };
}

async function verifyAndLoadCode(signature: string, keyID: string): Promise<Action> {
    const publicKey: string = await PGPService.loadPublicKey(keyID);
    const {sourceCode, sourceCodeVerified} = await PGPService.verifySignature(signature, publicKey);

    return {
        type: 'SET_SOURCE_CODE_INFO',
        sourceCode,
        sourceCodeVerified
    };
}

export const Actions = {
    verifyAndLoadCode,
    persistParameters,
    retrieveParameters,
    generatePeerID,
    createSourceConnection,
    createSignalingConnection,
    createWorkerConnection,
    handleIncomingMessage,
    handleOutgoingMessage
};
