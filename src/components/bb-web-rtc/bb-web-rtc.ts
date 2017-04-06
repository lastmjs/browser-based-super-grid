import {State} from '../../typings/state';

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
const peerConnection = new RTCPeerConnection(configuration);

const signalingServerConnection = new WebSocket('ws://localhost:8000');

const dataChannelOptions = {
    reliable: true
};
const dataChannel = peerConnection.createDataChannel('DATA_CHANNEL', dataChannelOptions);

class BBWebRTC {
    public is: string;

    private signalingServerConnection: WebSocket;

    beforeRegister() {
        this.is = 'bb-web-rtc';
    }

    ready() {
        // TODO experimenting with WebRTC, should be split up into services/actions and imported and called appropriately

        signalingServerConnection.onmessage = async (event) => {
            console.log('WebSocket message event', event);

            const signal = JSON.parse(event.data);
            if (signal.sdp) {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp));

                if (signal.sdp.type === 'offer') {
                    const sessionDescription: RTCSessionDescription = await peerConnection.createAnswer();
                    await this.setLocalDescription(sessionDescription);
                }
            }
            else if (signal.ice) {
                await peerConnection.addIceCandidate(new RTCIceCandidate(signal.ice));
            }
            else {
                alert('Unknown event received' + event);
                console.error('Unknown event received', event);
            }
        };

        peerConnection.onicecandidate = (event) => {
            console.log('RTC icecandidate event', event);
            if (event.candidate) {
                signalingServerConnection.send(JSON.stringify({
                    ice: event.candidate
                }));
            }
        };

        dataChannel.onmessage = (event) => {
            console.log('dataChannel event', event.data);
        };
        dataChannel.onerror = (event) => {
            console.log('dataChannel error', event);
        };
    }

    async setLocalDescription(description: RTCSessionDescription) {
        await peerConnection.setLocalDescription(description);
        signalingServerConnection.send(JSON.stringify({
            sdp: description
        }));
    }

    async initiateConnection() {
        const sessionDescription: RTCSessionDescription = await peerConnection.createOffer(this.setLocalDescription);
        await this.setLocalDescription(sessionDescription);
    }

    sendMessage() {
        console.log('sending message');
        dataChannel.send('The date is: ' + new Date());
    }

    stateChange(e: CustomEvent) {
        const state: State = e.detail.state;
    }
}

Polymer(BBWebRTC);
