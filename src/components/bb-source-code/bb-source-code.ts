import {Actions} from '../../redux/actions';
import {Action} from '../../typings/action';
import {State} from '../../typings/state';
import {GithubService} from '../../services/github-service';

class BBSourceCode extends HTMLElement {
    public is: string;
    public action: Action;
    public sourceCode: string;
    public sourceCodeVerified: boolean;
    public verifiedStyle: string;
    public startJob: boolean;
    public stopJob: boolean;
    public verifiedText: string;
    public repoURL: string;
    public filePath: string;
    public keyID: string;
    public peerID: string;
    public n: string;
    public sqrtN: string;
    public signalingServerHostAndPort: string;

    beforeRegister() {
        this.is = 'bb-source-code';
    }

    ready() {
        this.action = Actions.retrieveParameters();
    }

    async loadAndVerifyClick() {
        const repoURL: string = (<HTMLInputElement> this.querySelector('#repoURLInput')).value;
        const filePath: string = (<HTMLInputElement> this.querySelector('#filePathInput')).value;
        const keyID: string = (<HTMLInputElement> this.querySelector('#keyIDInput')).value;
        const signature: string = await GithubService.loadFile(repoURL, filePath);

        try {
            this.action = Actions.persistParameters(repoURL, filePath, keyID, this.signalingServerHostAndPort);
            this.action = await Actions.verifyAndLoadCode(signature, keyID);
        }
        catch(error) {
            alert(error);
        }
    }

    startJobClick() {
        this.startJob = true;
        this.startJob = false; // We need to set this to false here so that the Polymer data-binding system will apply the change again once the user clicks start job again. Otherwise startJob is set to true and remains true, so subsequent clicks do not trigger property observers

        this.action = {
            type: 'START_TIMER'
        };

        this.action = {
            type: 'HANDLE_INCOMING_MESSAGE',
            incomingMessage: {
                type: 'WORK_INFO',
                sourcePeerID: 'ROOT_NODE',
                destinationPeerID: this.peerID,
                startIndex: '2',
                stopIndex: this.sqrtN,
                product: this.n
            }
        };
    }

    stopJobClick() {
        this.stopJob = true;
        this.stopJob = false; // We need to set this to false here so that the Polymer data-binding system will apply the change again once the user clicks stop job again. Otherwise stopJob is set to true and remains true, so subsequent clicks do not trigger property observers
    }

    requestWork() {
        this.startJob = true;
        this.startJob = false; // We need to set this to false here so that the Polymer data-binding system will apply the change again once the user clicks start job again. Otherwise startJob is set to true and remains true, so subsequent clicks do not trigger property observers

        this.action = {
            type: 'HANDLE_OUTGOING_MESSAGE',
            outgoingMessage: {
                type: 'REQUEST_FOR_WORK',
                sourcePeerID: this.peerID,
                destinationPeerID: null
            }
        };
    }

    stateChange(e: CustomEvent) {
        const state: State = e.detail.state;

        this.sourceCode = state.sourceCode;
        this.sourceCodeVerified = state.sourceCodeVerified;
        this.verifiedStyle = state.sourceCodeVerified ? 'color: green' : 'color: red';
        this.verifiedText = state.sourceCode ? state.sourceCodeVerified  ? 'Code verified' : 'Code not verified' : '';
        this.repoURL = state.repoURL;
        this.filePath = state.filePath;
        this.keyID = state.keyID;
        this.peerID = state.peerID;
        this.n = state.n;
        this.sqrtN = state.sqrtN;
        this.signalingServerHostAndPort = state.signalingServerHostAndPort;
    }
}

Polymer(BBSourceCode);
