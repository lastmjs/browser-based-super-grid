import {State} from '../../typings/state';
import {WorkerConnections} from '../../typings/worker-connections';
import {BBRTCConnection} from '../../typings/bb-rtc-connection';

class BBSolution {
    public is: string;
    public p: string;
    public q: string;
    public n: string;
    public workerConnections: string[];
    public sourceConnection: BBRTCConnection;

    beforeRegister() {
        this.is = 'bb-info';
    }

    stateChange(e: CustomEvent) {
        const state: State = e.detail.state;

        this.p = state.p || 'unknown';
        this.q = state.q || 'unknown';
        this.n = state.n || 'unknown';
        this.workerConnections = Object.keys(state.workerConnections);
        this.sourceConnection = state.sourceConnection;
    }
}

Polymer(BBSolution);
