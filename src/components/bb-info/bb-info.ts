import {State} from '../../typings/state';

class BBSolution {
    public is: string;
    public p: string;
    public q: string;
    public n: string;

    beforeRegister() {
        this.is = 'bb-info';
    }

    stateChange(e: CustomEvent) {
        const state: State = e.detail.state;

        this.p = state.p || 'unknown';
        this.q = state.q || 'unknown';
        this.n = state.n || 'unknown';
    }
}

Polymer(BBSolution);
