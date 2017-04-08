import {State} from '../../typings/state';
import {Action} from '../../typings/action';
import {RequestForWorkMessage} from '../../typings/request-for-work-message';
import {SolutionFoundMessage} from '../../typings/solution-found-message';
import {WorkInfoMessage} from '../../typings/work-info-message';

class BBCodeExecution {
    public is: string;
    public properties: any;
    public sourceCode: string;
    public startJob: boolean;
    public stopJob: boolean;
    public action: Action;

    private worker: Worker;
    private incomingMessage: RequestForWorkMessage | SolutionFoundMessage | WorkInfoMessage;

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
            },
            incomingMessage: {
                observer: 'incomingMessageChanged'
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
        this.worker.onmessage = (event) => {
            this.action = {
                type: 'HANDLE_OUTGOING_MESSAGE',
                outgoingMessage: event.data
            };
        };
    }

    stopJobChanged() {
        if (!this.stopJob || !this.worker) {
            return;
        }

        this.worker.terminate();
        this.worker = null;
    }

    incomingMessageChanged() {
        if (!this.incomingMessage) return;

        if (this.incomingMessage.type === 'SOLUTION_FOUND') {
            this.worker.terminate();
            this.worker = null;
        }
        else {
            this.worker.postMessage(this.incomingMessage);
        }
    }

    stateChange(e: CustomEvent) {
        const state: State = e.detail.state;

        this.sourceCode = state.sourceCode;
        this.incomingMessage = state.incomingMessage;
    }
}

Polymer(BBCodeExecution);
