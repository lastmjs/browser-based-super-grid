import {State} from '../../typings/state';
import {Action} from '../../typings/action';
import {Actions} from '../../redux/actions';
import {WebSocketService} from '../../services/web-socket-service';
import {BBRTCConnection} from '../../typings/bb-rtc-connection';
import {WorkerConnections} from '../../typings/worker-connections';

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

class BBWebRTC extends HTMLElement {
    public is: string;
    public action: Action;

    private signalingConnection: WebSocket;
    private sourceConnection: BBRTCConnection;
    private initiator: boolean;
    private peerID: string;
    private remotePeerID: string;
    private workerConnections: WorkerConnections;

    beforeRegister() {
        this.is = 'bb-web-rtc';
    }

    ready() {
        this.action = {
            type: 'DEFAULT_ACTION'
        };

        this.action = Actions.createSourceConnection(config);
        this.initConnectionHandlers(this.sourceConnection);
        this.initSendDataChannel(this.sourceConnection);

        this.action = Actions.createSignalingConnection('localhost:8000');
        this.initSignalingHandlers();
    }

    async initiateConnection() {
        this.initiator = true;
        this.remotePeerID = (<HTMLInputElement> this.querySelector('#peerIDInput')).value;

        const sessionDescription: RTCSessionDescriptionInit = await this.sourceConnection.connection.createOffer();
        await this.sourceConnection.connection.setLocalDescription(sessionDescription);
        this.signalingConnection.send(JSON.stringify({
            type: 'RTC_OFFER',
            peerID: this.remotePeerID,
            sdp: sessionDescription
        }));
    }

    sendMessageToSource() {
        console.log('sending message');

        const message = (<HTMLInputElement> this.querySelector('#messageInput')).value;
        this.sourceConnection.sendChannel.send(message);
    }

    sendMessageToWorkers() {
        const message = (<HTMLInputElement> this.querySelector('#messageInput')).value;
        Object.keys(this.workerConnections).forEach((key) => {
            this.workerConnections[key].sendChannel.send(message);
        });
    }

    initSignalingHandlers() {
        this.signalingConnection.onopen = (event) => {
            WebSocketService.sendSignal(this.signalingConnection, {
                type: 'INITIAL_CONNECTION',
                peerID: this.peerID
            });
        };

        this.signalingConnection.onmessage = async (event) => {
            console.log('WebSocket message event', event);

            const signal = JSON.parse(event.data);

            this.remotePeerID = signal.peerID;

            if (this.initiator) {
                if (signal.sdp) {
                    if (signal.sdp.type === 'answer') {
                        console.log('answer received, setRemoteDescription');
                        await this.sourceConnection.connection.setRemoteDescription(new RTCSessionDescription(signal.sdp));
                    }
                }

                if (signal.ice) {
                    console.log('ice received');
                    await this.sourceConnection.connection.addIceCandidate(new RTCIceCandidate(signal.ice));
                    return;
                }
            }
            else {
                if (signal.sdp) {
                    if (signal.sdp.type === 'offer') {
                        this.action = Actions.createWorkerConnection(config, signal.peerID);
                        this.initConnectionHandlers(this.workerConnections[signal.peerID]);
                        this.initSendDataChannel(this.workerConnections[signal.peerID]);

                        console.log('offer received, setRemoteDescription');
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
                    console.log('ice received');
                    await this.workerConnections[signal.peerID].connection.addIceCandidate(new RTCIceCandidate(signal.ice));
                    return;
                }
            }
        };
    }

    initConnectionHandlers(bbRTCConnection: BBRTCConnection) {
        bbRTCConnection.connection.onicecandidate = (event) => {
            console.log('RTC icecandidate event', event);

            if (event.candidate) {
                this.signalingConnection.send(JSON.stringify({
                    type: 'ICE_CANDIDATE',
                    peerID: this.remotePeerID,
                    ice: event.candidate
                }));
            }
        };

        bbRTCConnection.connection.ondatachannel = (event) => {
            console.log('sourceConnection datachannel event', event);

            const receiveChannel = event.channel;

            this.action = {
                type: 'UPDATE_CONNECTION_RECEIVE_CHANNEL',
                peerID: bbRTCConnection.peerID,
                dataChannel: receiveChannel,
                connectionType: bbRTCConnection.type
            };

            receiveChannel.onmessage = (event) => {
                console.log('receiveChannel message event', event);
            };

            receiveChannel.onopen = (event) => {
                console.log('receiveChannel open event', event);
            };

            receiveChannel.onclose = (event) => {
                console.log('receiveChannel close event', event);
            };
        };
    }

    initSendDataChannel(bbRTCConnection: BBRTCConnection) {
        const sendChannelOptions = {
            reliable: true
        };
        const sendChannel = bbRTCConnection.connection.createDataChannel('DATA_CHANNEL', sendChannelOptions);

        sendChannel.onopen = (event) => {
            console.log('sendChannel open event', event);
        };

        sendChannel.onclose = (event) => {
            console.log('sendChannel close event', event);
        };

        this.action = {
            type: 'UPDATE_CONNECTION_SEND_CHANNEL',
            peerID: bbRTCConnection.peerID,
            dataChannel: sendChannel,
            connectionType: bbRTCConnection.type
        };
    }

    stateChange(e: CustomEvent) {
        const state: State = e.detail.state;

        this.peerID = state.peerID;
        this.sourceConnection = state.sourceConnection;
        this.signalingConnection = state.signalingConnection;
        this.workerConnections = state.workerConnections;
    }
}

Polymer(BBWebRTC);
