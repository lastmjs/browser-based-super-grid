import {State} from '../../typings/state';
import {WorkerConnections} from '../../typings/worker-connections';
import {BBRTCConnection} from '../../typings/bb-rtc-connection';
import {Action} from '../../typings/action';

class BBInfo extends Polymer.Element {
    public is: string;
    public properties: any;
    public p: string;
    public q: string;
    public workerConnections: string[];
    public sourceConnection: BBRTCConnection;
    public action: Action;
    public n: string;
    public sqrtN: string;

    private runTimer: boolean;

    static get is() { return 'bb-info'; }
    static get properties() {
        return {
            runTimer: {
                observer: 'runTimerChanged'
            }
        };
    }

    subscribedToStore() {
        this.action = {
            type: 'DEFAULT_ACTION'
        };
    }

    nInputChanged() {
        const n = this.shadowRoot.querySelector('#nInput').value;
        this.action = {
            type: 'SET_N',
            n
        };
    }

    sqrtNInputChanged() {
        const sqrtN = this.shadowRoot.querySelector('#sqrtNInput').value;
        this.action = {
            type: 'SET_SQRT_N',
            sqrtN
        };
    }

    runTimerChanged() {
        const simpleTimer = this.shadowRoot.querySelector('#simpleTimer');
        if (this.runTimer) {
            simpleTimer.start();
        }
        else {
            simpleTimer.pause();
        }
    }

    stateChange(e: CustomEvent) {
        const state: State = e.detail.state;

        this.p = state.p || 'unknown';
        this.q = state.q || 'unknown';
        this.workerConnections = Object.keys(state.workerConnections);
        this.sourceConnection = state.sourceConnection;
        this.runTimer = state.runTimer;
        this.n = state.n;
        this.sqrtN = state.sqrtN;
    }
}

window.customElements.define(BBInfo.is, BBInfo);
