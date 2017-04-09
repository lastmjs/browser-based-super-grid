import {State} from '../typings/state';
import {Action} from '../typings/action';
import {InitialState} from '../redux/initial-state';
import {SolutionFoundMessage} from '../typings/solution-found-message';

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
        case 'SET_N': {
            return {
                ...state,
                n: action.n
            };
        }
        case 'SET_SQRT_N': {
            return {
                ...state,
                sqrtN: action.sqrtN
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
        case 'HANDLE_INCOMING_MESSAGE': {
            return {
                ...state,
                incomingMessage: action.incomingMessage,
                solutionFound: action.solutionFound,
                p: action.p || state.p,
                q: action.q || state.q,
                n: action.n || state.n
            };
        }
        case 'HANDLE_OUTGOING_MESSAGE': {
            return {
                ...state,
                outgoingMessage: state.solutionFound && action.outgoingMessage.type === 'SOLUTION_FOUND' ? state.outgoingMessage : action.outgoingMessage,
                solutionFound: action.solutionFound,
                p: action.p || state.p,
                q: action.q || state.q,
                n: action.n || state.n
            };
        }
        case 'CREATE_SOURCE_CONNECTION': {
            return {
                ...state,
                sourceConnection: {
                    type: 'SOURCE',
                    peerID: action.sourcePeerID,
                    connection: <RTCPeerConnection> action.connection,
                    sendChannel: null,
                    receiveChannel: null
                }
            };
        }
        case 'CREATE_WORKER_CONNECTION': {
            const peerID: string = action.peerID;
            return {
                ...state,
                workerConnections: {
                    ...state.workerConnections,
                    [peerID]: {
                        type: 'WORKER',
                        peerID,
                        connection: <RTCPeerConnection> action.connection,
                        sendChannel: null,
                        receiveChannel: null
                    }
                }
            };
        }
        case 'UPDATE_CONNECTION_RECEIVE_CHANNEL': {
            const dataChannel: RTCDataChannel = action.dataChannel;
            if (action.connectionType === 'WORKER') {
                const peerID: string = action.peerID;
                return {
                    ...state,
                    workerConnections: {
                        ...state.workerConnections,
                        [peerID]: {
                            ...state.workerConnections[peerID],
                            receiveChannel: dataChannel
                        }
                    }
                };
            }
            else {
                return {
                    ...state,
                    sourceConnection: {
                        ...state.sourceConnection,
                        receiveChannel: dataChannel
                    }
                };
            }
        }
        case 'UPDATE_CONNECTION_SEND_CHANNEL': {
            const dataChannel: RTCDataChannel = action.dataChannel;
            if (action.connectionType === 'WORKER') {
                const peerID: string = action.peerID;
                return {
                    ...state,
                    workerConnections: {
                        ...state.workerConnections,
                        [peerID]: {
                            ...state.workerConnections[peerID],
                            sendChannel: dataChannel
                        }
                    }
                };
            }
            else {
                return {
                    ...state,
                    sourceConnection: {
                        ...state.sourceConnection,
                        sendChannel: dataChannel
                    }
                };
            }
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
