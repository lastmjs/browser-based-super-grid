import {State} from '../../typings/state';

class BBWebRTC {
    public is: string;

    beforeRegister() {
        this.is = 'bb-web-rtc';
    }

    ready() {
        
    }

    stateChange(e: CustomEvent) {
        const state: State = e.detail.state;
    }
}

Polymer(BBWebRTC);
