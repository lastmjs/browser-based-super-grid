import {State} from '../typings/state';
import {Action} from '../typings/action';
import {InitialState} from '../redux/initial-state';

export const RootReducer = (state: State = InitialState, action: Action): State => {
    switch (action.type) {
        case 'GENERATE_PEER_ID': {
            return {
                ...state,
                peerID: action.peerID
            };
        }
        case 'SET_SOURCE_CODE_INFO': {
            return {
                ...state,
                sourceCode: action.sourceCode,
                sourceCodeVerified: action.sourceCodeVerified
            };
        }
        case 'SET_PARAMETERS': {
            return {
                ...state,
                repoURL: action.repoURL,
                filePath: action.filePath,
                keyID: action.keyID
            };
        }
        case 'CREATE_SOURCE_CONNECTION': {
            return {
                ...state,
                sourceConnection: {
                    peerID: null,
                    connection: <RTCPeerConnection> action.connection,
                    sendChannel: null,
                    receiveChannel: null
                }
            };
        }
        case 'ADD_WORKER_CONNECTION': {
            const peerID: string = action.peerID;
            return {
                ...state,
                workerConnections: {
                    ...state.workerConnections,
                    [peerID]: {
                        peerID,
                        connection: <RTCPeerConnection> action.connection,
                        sendChannel: null,
                        receiveChannel: null
                    }
                }
            };
        }
        case 'CREATE_SIGNALING_CONNECTION': {
            return {
                ...state,
                signalingConnection: <WebSocket> action.connection
            };
        }
        default: {
            return state;
        }
    }
};
