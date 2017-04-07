import {State} from '../../typings/state';
import {Action} from '../../typings/action';
import {RootReducer} from '../../redux/reducers';
import {Actions} from '../../redux/actions';

class BBApp {
    public is: string;
    public rootReducer: (state: State, action: Action) => State;
    public action: Action;

    beforeRegister() {
        this.is = 'bb-app';
    }

    async ready() {
        this.rootReducer = RootReducer;
        this.action = Actions.generatePeerID();
    }
}

Polymer(BBApp);
