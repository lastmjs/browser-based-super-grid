import {State} from '../../typings/state';

class BBCodeExecution {
    public is: string;
    public properties: any;
    public sourceCode: string;
    public startJob: boolean;
    public stopJob: boolean;

    private worker: Worker;

    beforeRegister() {
        this.is = 'bb-code-execution';
        this.properties = {
            startJob: {
                type: Boolean,
                observer: 'startJobChanged'
            },
            stopJob: {
                type: Boolean,
                observer: 'stopJobChanged'
            }
        };
    }

    startJobChanged() {
        if (!this.startJob || this.worker) {
            return;
        }

        // This looks crazy, but it allows us to start up a Web Worker from a string instead of a file
        // There are cross-origin issues with loading the file straight from GitHub into the Web Worker
        const blob: Blob = new window.Blob([this.sourceCode]);
        const objectURL: string = window.URL.createObjectURL(blob);
        this.worker = new Worker(objectURL);
    }

    stopJobChanged() {
        if (!this.stopJob || !this.worker) {
            return;
        }

        this.worker.terminate();
        this.worker = null;
    }

    stateChange(e: CustomEvent) {
        const state: State = e.detail.state;

        this.sourceCode = state.sourceCode;
    }
}

Polymer(BBCodeExecution);
