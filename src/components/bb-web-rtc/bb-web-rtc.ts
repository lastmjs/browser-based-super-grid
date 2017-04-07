import {State} from '../../typings/state';

class BBWebRTC {
    public is: string;

    private signalingServerConnection: WebSocket;
    private peerConnection: RTCPeerConnection;
    private sendChannel: any;
    private initiator: boolean;

    beforeRegister() {
        this.is = 'bb-web-rtc';
    }

    ready() {
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
        this.peerConnection = new RTCPeerConnection(configuration);

        this.signalingServerConnection = new WebSocket('ws://10.24.207.201:8000');

        this.signalingServerConnection.onmessage = async (event) => {
            console.log('WebSocket message event', event);

            const signal = JSON.parse(event.data);

            if (this.initiator) {
                if (signal.sdp) {
                    if (signal.sdp.type === 'answer') {
                        console.log('answer received, setRemoteDescription');
                        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp));
                    }
                }

                if (signal.ice) {
                    console.log('ice received');
                    await this.peerConnection.addIceCandidate(new RTCIceCandidate(signal.ice));
                    return;
                }
            }
            else {
                if (signal.sdp) {
                    if (signal.sdp.type === 'offer') {
                        console.log('offer received, setRemoteDescription');
                        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp));
                        const sessionDescription: RTCSessionDescription = await this.peerConnection.createAnswer();
                        await this.peerConnection.setLocalDescription(sessionDescription);
                        this.signalingServerConnection.send(JSON.stringify({
                            sdp: sessionDescription
                        }));
                    }
                }

                if (signal.ice) {
                    console.log('ice received');
                    await this.peerConnection.addIceCandidate(new RTCIceCandidate(signal.ice));
                    return;
                }
            }
        };

        this.peerConnection.onicecandidate = (event) => {
            console.log('RTC icecandidate event', event);
            if (event.candidate) {
                this.signalingServerConnection.send(JSON.stringify({
                    ice: event.candidate
                }));
            }
        };

        const sendChannelOptions = {
            reliable: true
        };
        this.sendChannel = this.peerConnection.createDataChannel('DATA_CHANNEL', sendChannelOptions);

        this.sendChannel.onopen = (event) => {
            console.log('sendChannel open event', event);
        };

        this.sendChannel.onclose = (event) => {
            console.log('sendChannel close event', event);
        };

        this.peerConnection.ondatachannel = (event) => {
            console.log('peerConnection datachannel event', event);

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

        const sessionDescription: RTCSessionDescription = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(sessionDescription);
        this.signalingServerConnection.send(JSON.stringify({
            sdp: sessionDescription
        }));
    }

    sendMessage() {
        console.log('sending message');
        this.sendChannel.send('The date is: ' + new Date());
    }

    stateChange(e: CustomEvent) {
        const state: State = e.detail.state;
    }
}

Polymer(BBWebRTC);
