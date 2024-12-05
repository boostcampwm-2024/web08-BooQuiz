let timerId: ReturnType<typeof setInterval> | null = null;
let startTime: number | null = null;
let duration: number | null = null;
let timeOffset: number = 0;
let pausedTimeRemaining: number | null = null;

self.onmessage = (event: MessageEvent) => {
    const { type, payload } = event.data;

    switch (type) {
        case 'START':
            if (!payload?.duration) return;

            if (pausedTimeRemaining !== null) {
                startTimer(pausedTimeRemaining, self.postMessage);
                pausedTimeRemaining = null;
            } else {
                if (payload.serverTime) {
                    timeOffset = Date.now() - payload.serverTime;
                }
                startTimer(payload.duration, self.postMessage);
            }
            break;

        case 'STOP':
            if (timerId !== null && startTime !== null && duration !== null) {
                const currentTime = Date.now() - timeOffset;
                const elapsed = (currentTime - startTime) / 1000;
                pausedTimeRemaining = Math.max(0, duration - elapsed);
            }
            stopTimer();
            break;

        case 'RESET':
            resetTimer();
            break;
    }
};

function startTimer(
    newDuration: number,
    postMessage: {
        (message: any, targetOrigin: string, transfer?: Transferable[]): void;
        (message: any, options?: WindowPostMessageOptions): void;
    },
) {
    stopTimer(); // 기존 타이머가 있다면 정리

    duration = newDuration;
    startTime = Date.now() - timeOffset;

    timerId = setInterval(() => {
        if (!startTime || !duration) return;

        const currentTime = Date.now() - timeOffset;
        const elapsed = (currentTime - startTime) / 1000;
        const remaining = Math.max(0, duration - elapsed);
        const roundedRemaining = Math.round(remaining * 10) / 10;

        if (roundedRemaining <= 0) {
            postMessage({ type: 'COMPLETE' });
            stopTimer();
        } else {
            postMessage({
                type: 'TICK',
                payload: { time: roundedRemaining },
            });
        }
    }, 100);
}

function stopTimer() {
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
    }
}

function resetTimer() {
    stopTimer();
    startTime = null;
    duration = null;
    timeOffset = 0;
    pausedTimeRemaining = null;
}
