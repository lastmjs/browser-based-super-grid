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

    loadClick() {
        const url: string = (<HTMLInputElement> this.querySelector('#urlInput')).value;
        this.action = Actions.retrieveCode(url);
    }

    stateChange(e: CustomEvent) {
        const state: State = e.detail.state;

        this.sourceCode = state.sourceCode;
    }
}

Polymer(BBSourceCode);
