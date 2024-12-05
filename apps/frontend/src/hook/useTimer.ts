import { useCallback, useEffect, useRef, useState } from 'react';
import TimerWorker from '@/workers/timer.worker?worker';

interface TimerConfig {
    initialTime: number;
    onComplete?: () => void;
    autoStart?: boolean;
}

/**
 * Web Worker를 활용한 정확한 카운트다운 타이머 커스텀 훅
 *
 * @param {TimerConfig} config - 타이머 설정 객체
 * @returns {object} 타이머 상태와 컨트롤 함수들
 */
export const useTimer = ({ initialTime, onComplete }: TimerConfig) => {
    const [time, setTime] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(false);
    const workerRef = useRef<Worker | null>(null);

    useEffect(() => {
        // Worker가 이미 존재하면 종료
        if (workerRef.current) {
            workerRef.current.terminate();
        }

        // 새 Worker 생성
        workerRef.current = new TimerWorker();

        // Worker 메시지 핸들러
        workerRef.current.onmessage = (event) => {
            const { type, payload } = event.data;
            // console.log('Received from worker:', type, payload); // 디버깅용

            switch (type) {
                case 'TICK':
                    setTime(payload.time);
                    break;
                case 'COMPLETE':
                    setTime(0);
                    setIsRunning(false);
                    onComplete?.();
                    break;
            }
        };

        // Clean up
        return () => {
            workerRef.current?.terminate();
        };
    }, []);

    // 타이머 시작
    const start = useCallback(() => {
        if (isRunning || !workerRef.current) return;

        workerRef.current.postMessage({
            type: 'START',
            payload: {
                duration: initialTime,
                serverTime: Date.now(),
            },
        });

        setIsRunning(true);
    }, [isRunning, initialTime]);

    // 타이머 정지
    const stop = useCallback(() => {
        if (!isRunning || !workerRef.current) return;

        workerRef.current.postMessage({ type: 'STOP' });
        setIsRunning(false);
    }, [isRunning]);

    // 타이머 리셋
    const reset = useCallback(() => {
        if (!workerRef.current) return;

        workerRef.current.postMessage({ type: 'RESET' });
        setTime(initialTime);
        setIsRunning(false);
    }, [initialTime]);

    return {
        time,
        isRunning,
        start,
        stop,
        reset,
    };
};
