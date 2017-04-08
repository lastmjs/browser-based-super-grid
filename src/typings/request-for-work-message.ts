export interface RequestForWorkMessage {
    type: 'REQUEST_FOR_WORK';
    peerID: string;
    destinationPeerID: string;
}
