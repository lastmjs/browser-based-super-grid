export interface RequestForWorkMessage {
    type: 'REQUEST_FOR_WORK';
    sourcePeerID: string;
    destinationPeerID: string;
}
