import {BBRTCConnection} from './bb-rtc-connection';

export interface WorkerConnections {
    [peerID: string]: BBRTCConnection;
}
