export interface Signal {
    type: 'INITIAL_CONNECTION' | 'RTC_ANSWER' | 'RTC_OFFER' | 'ICE_CANDIDATE';
    peerID: string;
}
