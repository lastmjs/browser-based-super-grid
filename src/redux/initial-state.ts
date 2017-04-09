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
        receiveChannel: null,
        type: null
    },
    signalingConnection: null,
    outgoingMessage: null,
    incomingMessage: null,
    p: '',
    q: '',
    n: '',
    solutionFound: false,
    sqrtN: ''
};
