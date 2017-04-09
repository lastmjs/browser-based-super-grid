export interface WorkInfoMessage {
    type: 'WORK_INFO';
    sourcePeerID: string;
    destinationPeerID: string;
    startIndex: string;
    stopIndex: string;
    product: string;
}
