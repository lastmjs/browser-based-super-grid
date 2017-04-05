import {State} from '../../typings/state';
import {Action} from '../../typings/action';
import {RootReducer} from '../../redux/reducers';

class BBApp {
    public is: string;
    public rootReducer: (state: State, action: Action) => State;

    beforeRegister() {
        this.is = 'bb-app';
    }

    async ready() {
        this.rootReducer = RootReducer;
    }
}

Polymer(BBApp);
