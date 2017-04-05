import {Actions} from '../../redux/actions';
import {Action} from '../../typings/action';
import {State} from '../../typings/state';

class BBSourceCode extends HTMLElement {
    public is: string;
    public action: Action;
    public sourceCode: string;
    public startJob: boolean;

    beforeRegister() {
        this.is = 'bb-source-code';
    }

    async loadClick() {
        const url: string = (<HTMLInputElement> this.querySelector('#urlInput')).value;
        const filePath: string = (<HTMLInputElement> this.querySelector('#filePathInput')).value;
        this.action = await Actions.retrieveCode(url, filePath);
    }

    startJobClick() {
        this.startJob = true;
        this.startJob = false; // We need to set this to false here so that the Polymer data-binding system will apply the change again once the user clicks start job again. Otherwise startJob is set to true and remains true, so subsequent clicks do not trigger property observers
    }

    stateChange(e: CustomEvent) {
        const state: State = e.detail.state;

        this.sourceCode = state.sourceCode;
    }
}

Polymer(BBSourceCode);
