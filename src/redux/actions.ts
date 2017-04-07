import {Action} from '../typings/action';
import {GithubService} from '../services/github-service';
import {PGPService} from '../services/pgp-service';
import {UtilitiesService} from '../services/utilities-service';
import {WebSocketService} from '../services/web-socket-service';
import {WebRTCService} from '../services/web-rtc-service';
import {Signal} from '../typings/signal';

function createSourceConnection(config: RTCConfiguration): Action {
    const sourceConnection: RTCPeerConnection = WebRTCService.createConnection(config);
    return {
        type: 'CREATE_SOURCE_CONNECTION',
        connection: sourceConnection
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

function persistParameters(repoURL: string, filePath: string, keyID: string): Action {
    window.localStorage.setItem('repoURL', repoURL);
    window.localStorage.setItem('filePath', filePath);
    window.localStorage.setItem('keyID', keyID);

    return {
        type: 'SET_PARAMETERS',
        repoURL,
        filePath,
        keyID
    };
}

function retrieveParameters(): Action {
    const repoURL: string = window.localStorage.getItem('repoURL');
    const filePath: string = window.localStorage.getItem('filePath');
    const keyID: string = window.localStorage.getItem('keyID');

    return {
        type: 'SET_PARAMETERS',
        repoURL,
        filePath,
        keyID
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
    createSignalingConnection
};
