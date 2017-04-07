import {State} from '../typings/state';

export const InitialState: State = {
    peerID: '',
    workerConnections: {},
    repoURL: '',
    sourceCode: '',
    filePath: '',
    keyID: '',
    sourceCodeVerified: false,
    sourceConnection: null,
    signalingConnection: null
};
