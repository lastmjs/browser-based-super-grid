import {State} from '../typings/state';

export const InitialState: State = {
    peerID: '',
    workerConnections: {},
    repoURL: '',
    sourceCode: '',
    filePath: '',
    keyID: '',
    sourceCodeVerified: false,
    sourceConnection: {
        peerID: null,
        connection: null,
        sendChannel: null,
        receiveChannel: null
    },
    signalingConnection: null
};
