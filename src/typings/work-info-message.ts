export interface WorkInfoMessage {
    type: 'WORK_INFO';
    peerID: string;
    startIndex: string;
    stopIndex: string;
    product: string;
}
