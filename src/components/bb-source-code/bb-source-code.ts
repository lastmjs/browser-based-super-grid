import {Actions} from '../../redux/actions';
import {Action} from '../../typings/action';
import {State} from '../../typings/state';

class BBSourceCode extends HTMLElement {
    public is: string;
    public action: Action;
    public sourceCode: string;

    beforeRegister() {
        this.is = 'bb-source-code';
    }

    async loadClick() {
        const url: string = (<HTMLInputElement> this.querySelector('#urlInput')).value;
        const filePath: string = (<HTMLInputElement> this.querySelector('#filePathInput')).value;
        this.action = await Actions.retrieveCode(url, filePath);
    }

    startJobClick() {
        Actions.executeSourceCode(this, this.sourceCode);
    }

    stateChange(e: CustomEvent) {
        const state: State = e.detail.state;

        this.sourceCode = state.sourceCode;
    }
}

Polymer(BBSourceCode);
