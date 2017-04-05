import {Actions} from '../../redux/actions';
import {Action} from '../../typings/action';
import {State} from '../../typings/state';

class BBSourceCode extends HTMLElement {
    public is: string;
    public action: Action;
    public sourceCode: string;
    public verifiedStyle: string;
    public startJob: boolean;
    public stopJob: boolean;
    public verifiedText: string;

    beforeRegister() {
        this.is = 'bb-source-code';
    }

    ready() {
        // this loads the state initially for this component
        this.action = {
            type: 'DEFAULT_ACTION'
        };
    }

    async loadClick() {
        const repoURL: string = (<HTMLInputElement> this.querySelector('#repoURLInput')).value;
        const filePath: string = (<HTMLInputElement> this.querySelector('#filePathInput')).value;
        this.action = await Actions.retrieveCode(repoURL, filePath);
    }

    async verifyClick() {
        const repoURL: string = (<HTMLInputElement> this.querySelector('#repoURLInput')).value;
        const signatureFilePath: string = (<HTMLInputElement> this.querySelector('#signatureFilePathInput')).value;
        const keyID: string = (<HTMLInputElement> this.querySelector('#keyIDInput')).value;

        try {
            this.action = await Actions.verifyCode(this.sourceCode, repoURL, signatureFilePath, keyID);
        }
        catch(error) {
            alert(error);
        }
    }

    startJobClick() {
        this.startJob = true;
        this.startJob = false; // We need to set this to false here so that the Polymer data-binding system will apply the change again once the user clicks start job again. Otherwise startJob is set to true and remains true, so subsequent clicks do not trigger property observers
    }

    stopJobClick() {
        this.stopJob = true;
        this.stopJob = false; // We need to set this to false here so that the Polymer data-binding system will apply the change again once the user clicks stop job again. Otherwise stopJob is set to true and remains true, so subsequent clicks do not trigger property observers
    }

    stateChange(e: CustomEvent) {
        const state: State = e.detail.state;

        this.sourceCode = state.sourceCode;
        this.verifiedStyle = state.sourceCodeVerified ? 'color: green' : 'color: red';
        this.verifiedText = state.sourceCode ? state.sourceCodeVerified  ? 'Code verified' : 'Code not verified' : '';
    }
}

Polymer(BBSourceCode);
