import {State} from '../../typings/state';
import {Action} from '../../typings/action';
import {Actions} from '../../redux/actions';
import {WebSocketService} from '../../services/web-socket-service';
import {BBRTCConnection} from '../../typings/bb-rtc-connection';
import {WorkerConnections} from '../../typings/worker-connections';
import {RequestForWorkMessage} from '../../typings/request-for-work-message';
import {SolutionFoundMessage} from '../../typings/solution-found-message';
import {WorkInfoMessage} from '../../typings/work-info-message';

// TODO put this config somewhere appropriate
const config: RTCConfiguration = {
    iceServers: [
        {
            url: 'stun:stun.services.mozilla.com'
        },
        {
            url: 'stun:stun.l.google.com:19302'
        }
    ]
};

class BBWebRTC extends Polymer.Element {
    public is: string;
    public properties: any;
    public action: Action;
    public signalingServerHostAndPort: string;

    private signalingConnection: WebSocket;
    private sourceConnection: BBRTCConnection; // This is our connection to the peer that we are asking to connect to
    private initiator: boolean; // If we ask to connect to a peer, this will be true
    private peerID: string;
    private remotePeerID: string;
    private workerConnections: WorkerConnections; // All of the peer connections that were initiated by other peers and that we have accepted
    private outgoingMessage: RequestForWorkMessage | SolutionFoundMessage | WorkInfoMessage;
    private keyID: string;
    private repoURL: string;
    private filePath: string;
    private n: string;
    private sqrtN: string;

    static get is() { return 'bb-web-rtc'; }
    static get properties() {
        return {
            outgoingMessage: {
                observer: 'outgoingMessageChanged'
            }
        };
    }

    subscribedToStore() {
        this.action = {
            type: 'DEFAULT_ACTION'
        };
    }

    async initiateConnection() {
        this.initiator = true;
        this.remotePeerID = (<HTMLInputElement> this.shadowRoot.querySelector('#peerIDInput')).value;
        this.action = Actions.createSourceConnection(config, this.remotePeerID);
        this.initICEHandling(this.sourceConnection);
        this.initReceiveDataChannel(this.sourceConnection);
        this.initSendDataChannel(this.sourceConnection);

        const sessionDescription: RTCSessionDescriptionInit = await this.sourceConnection.connection.createOffer();
        await this.sourceConnection.connection.setLocalDescription(sessionDescription);
        this.signalingConnection.send(JSON.stringify({
            type: 'RTC_OFFER',
            peerID: this.remotePeerID,
            sdp: sessionDescription
        }));
    }

    connectSignalingServer() {
        const signalingHostAndPort = this.shadowRoot.querySelector('#signalingServerInput').value;
        this.action = Actions.createSignalingConnection(signalingHostAndPort);
        this.initSignalingHandlers();
        this.action = Actions.persistParameters(this.repoURL, this.filePath, this.keyID, signalingHostAndPort, this.n, this.sqrtN);
    }

    outgoingMessageChanged() {
        if (!this.outgoingMessage) return;

        switch (this.outgoingMessage.type) {
            case 'SOLUTION_FOUND': {
                // Tell everyone that the solution has been found
                this.sourceConnection.sendChannel && this.sourceConnection.sendChannel.send(JSON.stringify(this.outgoingMessage)); // The first peer will not have a source peer
                Object.keys(this.workerConnections).forEach((key) => {
                    this.workerConnections[key].sendChannel.send(JSON.stringify(this.outgoingMessage));
                });
                break;
            }
            default: {
                console.log('send message out', this.outgoingMessage);
                if (this.workerConnections[this.outgoingMessage.destinationPeerID]) {
                    console.log('send to worker');
                    this.workerConnections[this.outgoingMessage.destinationPeerID].sendChannel.send(JSON.stringify(this.outgoingMessage));
                }
                else {
                    console.log('send to source');
                    this.sourceConnection.sendChannel && this.sourceConnection.sendChannel.send(JSON.stringify(this.outgoingMessage));
                }
                break;
            }
        }
    }

    initSignalingHandlers() {
        // As soon as the WebSocket connection opens with the server, tell the server our peerID so that it can begin to create its mapping between its known clients and peerIDs
        this.signalingConnection.onopen = (event) => {
            WebSocketService.sendSignal(this.signalingConnection, {
                type: 'INITIAL_CONNECTION',
                peerID: this.peerID
            });
        };

        this.signalingConnection.onmessage = async (event) => {
            console.log('this.signalingConnection.onmessage', event);

            const signal = JSON.parse(event.data);
            this.remotePeerID = signal.peerID; //TODO manage this mutation better, other parts of this class might depend on this being set and I do not understand it right now...potentially bring it into Redux

            // If we initiated the connection request, then we only look for an answer to come back, and we still accept any ICE candidates
            if (this.initiator) {
                if (signal.sdp) {
                    if (signal.sdp.type === 'answer') {
                        await this.sourceConnection.connection.setRemoteDescription(new RTCSessionDescription(signal.sdp));
                    }
                }

                if (signal.ice) {
                    await this.sourceConnection.connection.addIceCandidate(new RTCIceCandidate(signal.ice));
                    return;
                }
            }
            else {
                // We did not initiate the request, so we only look for offers, and we still accept any ICE candidates
                // All connections offered to us will become worker connections
                if (signal.sdp) {
                    if (signal.sdp.type === 'offer') {
                        this.action = Actions.createWorkerConnection(config, signal.peerID);
                        this.initICEHandling(this.workerConnections[signal.peerID]);
                        this.initReceiveDataChannel(this.workerConnections[signal.peerID]);
                        this.initSendDataChannel(this.workerConnections[signal.peerID]);

                        await this.workerConnections[signal.peerID].connection.setRemoteDescription(new RTCSessionDescription(signal.sdp));
                        const sessionDescription: RTCSessionDescriptionInit = await this.workerConnections[signal.peerID].connection.createAnswer();
                        await this.workerConnections[signal.peerID].connection.setLocalDescription(sessionDescription);
                        this.signalingConnection.send(JSON.stringify({
                            type: 'RTC_ANSWER',
                            peerID: this.remotePeerID,
                            sdp: sessionDescription
                        }));
                    }
                }

                if (signal.ice) {
                    await this.workerConnections[signal.peerID].connection.addIceCandidate(new RTCIceCandidate(signal.ice));
                    return;
                }
            }
        };
    }

    initICEHandling(bbRTCConnection: BBRTCConnection) {
        bbRTCConnection.connection.onicecandidate = (event) => {
            console.log('bbRTCConnection.connection.onicecandidate', event);

            if (event.candidate) {
                this.signalingConnection.send(JSON.stringify({
                    type: 'ICE_CANDIDATE',
                    peerID: this.remotePeerID,
                    ice: event.candidate
                }));
            }
        };
    }

    initSendDataChannel(bbRTCConnection: BBRTCConnection) {
        const sendChannelOptions = {
            reliable: true
        };
        const sendChannel = bbRTCConnection.connection.createDataChannel('DATA_CHANNEL', sendChannelOptions);

        sendChannel.onopen = (event) => {
            console.log('sendChannel.onopen', event);
        };

        sendChannel.onclose = (event) => {
            console.log('sendChannel.onclose', event);
        };

        this.action = {
            type: 'UPDATE_CONNECTION_SEND_CHANNEL',
            peerID: bbRTCConnection.peerID,
            dataChannel: sendChannel,
            connectionType: bbRTCConnection.type
        };
    }

    initReceiveDataChannel(bbRTCConnection: BBRTCConnection) {
        bbRTCConnection.connection.ondatachannel = (event) => {
            console.log('bbRTCConnection.connection.ondatachannel', event);

            const receiveChannel = event.channel;

            receiveChannel.onmessage = (event) => {
                console.log('receiveChannel.onmessage', event);

                Actions.handleIncomingMessage(this, JSON.parse(event.data));
            };

            receiveChannel.onopen = (event) => {
                console.log('receiveChannel.onopen', event);
            };

            receiveChannel.onclose = (event) => {
                console.log('receiveChannel.onclose', event);
            };

            this.action = {
                type: 'UPDATE_CONNECTION_RECEIVE_CHANNEL',
                peerID: bbRTCConnection.peerID,
                dataChannel: receiveChannel,
                connectionType: bbRTCConnection.type
            };
        };
    }

    stateChange(e: CustomEvent) {
        const state: State = e.detail.state;

        this.peerID = state.peerID;
        this.sourceConnection = state.sourceConnection;
        this.signalingConnection = state.signalingConnection;
        this.workerConnections = state.workerConnections;
        this.outgoingMessage = state.outgoingMessage;
        this.repoURL = state.repoURL;
        this.keyID = state.keyID;
        this.filePath = state.filePath;
        this.signalingServerHostAndPort = state.signalingServerHostAndPort;
        this.n = state.n;
        this.sqrtN = state.sqrtN;
    }
}

window.customElements.define(BBWebRTC.is, BBWebRTC);
