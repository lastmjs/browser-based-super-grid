import {State} from '../../typings/state';
import {Action} from '../../typings/action';

class BBWebRTC extends HTMLElement {
    public is: string;
    public action: Action;

    private signalingServerConnection: WebSocket;
    private sourceConnection: RTCPeerConnection;
    private sendChannel: any;
    private initiator: boolean;
    private peerID: string;
    private remotePeerID: string;

    beforeRegister() {
        this.is = 'bb-web-rtc';
    }

    ready() {
        this.action = {
            type: 'DEFAULT_ACTION'
        };

        // TODO experimenting with WebRTC, should be split up into services/actions and imported and called appropriately

        const configuration = {
            iceServers: [
                {
                    url: 'stun:stun.services.mozilla.com'
                },
                {
                    url: 'stun:stun.l.google.com:19302'
                }
            ]
        };
        this.sourceConnection = new RTCPeerConnection(configuration);

        this.signalingServerConnection = new WebSocket('ws://10.24.207.201:8000');
        this.signalingServerConnection.onopen = (event) => {
            this.signalingServerConnection.send(JSON.stringify({
                type: 'INITIAL_CONNECTION',
                peerID: this.peerID
            }));
        };

        this.signalingServerConnection.onmessage = async (event) => {
            console.log('WebSocket message event', event);

            const signal = JSON.parse(event.data);

            this.remotePeerID = signal.peerID;

            if (this.initiator) {
                if (signal.sdp) {
                    if (signal.sdp.type === 'answer') {
                        console.log('answer received, setRemoteDescription');
                        await this.sourceConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp));
                    }
                }

                if (signal.ice) {
                    console.log('ice received');
                    await this.sourceConnection.addIceCandidate(new RTCIceCandidate(signal.ice));
                    return;
                }
            }
            else {
                if (signal.sdp) {
                    if (signal.sdp.type === 'offer') {
                        console.log('offer received, setRemoteDescription');
                        await this.sourceConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp));
                        const sessionDescription: RTCSessionDescription = await this.sourceConnection.createAnswer();
                        await this.sourceConnection.setLocalDescription(sessionDescription);
                        this.signalingServerConnection.send(JSON.stringify({
                            type: 'RTC_ANSWER',
                            peerID: this.remotePeerID,
                            sdp: sessionDescription
                        }));
                    }
                }

                if (signal.ice) {
                    console.log('ice received');
                    await this.sourceConnection.addIceCandidate(new RTCIceCandidate(signal.ice));
                    return;
                }
            }
        };

        this.sourceConnection.onicecandidate = (event) => {
            console.log('RTC icecandidate event', event);

            if (event.candidate) {
                this.signalingServerConnection.send(JSON.stringify({
                    type: 'ICE_CANDIDATE',
                    peerID: this.remotePeerID,
                    ice: event.candidate
                }));
            }
        };

        const sendChannelOptions = {
            reliable: true
        };
        this.sendChannel = this.sourceConnection.createDataChannel('DATA_CHANNEL', sendChannelOptions);

        this.sendChannel.onopen = (event) => {
            console.log('sendChannel open event', event);
        };

        this.sendChannel.onclose = (event) => {
            console.log('sendChannel close event', event);
        };

        this.sourceConnection.ondatachannel = (event) => {
            console.log('sourceConnection datachannel event', event);

            const receiveChannel = event.channel;

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

    async initiateConnection() {
        this.initiator = true;
        this.remotePeerID = (<HTMLInputElement> this.querySelector('#peerIDInput')).value;

        const sessionDescription: RTCSessionDescription = await this.sourceConnection.createOffer();
        await this.sourceConnection.setLocalDescription(sessionDescription);
        this.signalingServerConnection.send(JSON.stringify({
            type: 'RTC_OFFER',
            peerID: this.remotePeerID,
            sdp: sessionDescription
        }));
    }

    sendMessage() {
        console.log('sending message');
        this.sendChannel.send('The date is: ' + new Date());
    }

    stateChange(e: CustomEvent) {
        const state: State = e.detail.state;

        this.peerID = state.peerID;
    }
}

Polymer(BBWebRTC);
