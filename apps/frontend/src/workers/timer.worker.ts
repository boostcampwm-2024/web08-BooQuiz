import { TimerMessage, TimerResponse } from '@/types/timer.types';

class TimerWorker {
    private timerId: ReturnType<typeof setInterval> | null = null;
    private startTime: number | null = null;
    private duration: number | null = null;
    private timeOffset: number = 0;
    private pausedTimeRemaining: number | null = null;

    constructor() {
        self.onmessage = this.handleMessage.bind(this);
    }

    private handleMessage(event: MessageEvent<TimerMessage>) {
        const { type, payload } = event.data;

        switch (type) {
            case 'START':
                if (!payload?.duration) return;

                if (this.pausedTimeRemaining !== null) {
                    this.startTimer(this.pausedTimeRemaining);
                    this.pausedTimeRemaining = null;
                } else {
                    if (payload.serverTime) {
                        this.timeOffset = Date.now() - payload.serverTime;
                    }
                    this.startTimer(payload.duration);
                }
                break;

            case 'STOP':
                if (this.timerId !== null && this.startTime !== null && this.duration !== null) {
                    const currentTime = Date.now() - this.timeOffset;
                    const elapsed = (currentTime - this.startTime) / 1000;
                    this.pausedTimeRemaining = Math.max(0, this.duration - elapsed);
                }
                this.stopTimer();
                break;

            case 'RESET':
                this.resetTimer();
                break;
        }
    }

    private startTimer(duration: number) {
        this.stopTimer(); // 기존 타이머가 있다면 정리

        this.duration = duration;
        this.startTime = Date.now() - this.timeOffset;

        // setInterval 직접 사용
        this.timerId = setInterval(() => {
            if (!this.startTime || !this.duration) return;

            const currentTime = Date.now() - this.timeOffset;
            const elapsed = (currentTime - this.startTime) / 1000;
            const remaining = Math.max(0, this.duration - elapsed);
            const roundedRemaining = Math.round(remaining * 10) / 10;

            if (roundedRemaining <= 0) {
                this.postMessage({ type: 'COMPLETE' });
                this.stopTimer();
            } else {
                this.postMessage({
                    type: 'TICK',
                    payload: { time: roundedRemaining },
                });
            }
        }, 100);
    }

    private stopTimer() {
        if (this.timerId !== null) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
    }

    private resetTimer() {
        this.stopTimer();
        this.startTime = null;
        this.duration = null;
        this.timeOffset = 0;
        this.pausedTimeRemaining = null;
    }

    private postMessage(message: TimerResponse) {
        self.postMessage(message);
    }
}

new TimerWorker();
