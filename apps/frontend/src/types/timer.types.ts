export interface TimerMessage {
    type: 'START' | 'STOP' | 'RESET';
    payload?: {
        duration: number;
        serverTime?: number;
    };
}

export interface TimerResponse {
    type: 'TICK' | 'COMPLETE';
    payload?: {
        time: number;
    };
}
