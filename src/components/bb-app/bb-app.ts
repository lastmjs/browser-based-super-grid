import {State} from '../../typings/state';
import {Action} from '../../typings/action';
import {RootReducer} from '../../redux/reducers';
import {Actions} from '../../redux/actions';

class BBApp extends Polymer.Element {
    public is: string;
    public rootReducer: (state: State, action: Action) => State;
    public action: Action;

    static get is() { return 'bb-app'; }

    connectedCallback() {
        super.connectedCallback();

        this.rootReducer = RootReducer;
        this.action = Actions.generatePeerID();
    }
}

window.customElements.define(BBApp.is, BBApp);
