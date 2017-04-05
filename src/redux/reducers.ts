import {State} from '../typings/state';
import {Action} from '../typings/action';
import {InitialState} from '../redux/initial-state';

export const RootReducer = (state: State = InitialState, action: Action) => {
    switch (action.type) {
        case 'SET_SOURCE_CODE_INFO': {
            return {
                ...state,
                sourceCode: action.sourceCode,
                sourceCodeVerified: action.sourceCodeVerified
            };
        }
        default: {
            return state;
        }
    }
};
