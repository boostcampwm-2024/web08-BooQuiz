import { useState, useEffect, useRef, useCallback } from 'react';

interface TimerConfig {
    initialTime: number;
    onComplete?: () => void;
    autoStart?: boolean;
}

/**
 * 카운트다운 타이머를 관리하는 커스텀 훅입니다.
 *
 * @description
 * 이 훅은 시작 제어 기능을 갖춘 카운트다운 타이머 기능을 제공합니다.
 * 초기 시간과 타이머 완료 시 실행될 선택적 콜백을 받습니다.
 *
 * @example
 * ```typescript
 * const { time, start } = useTimer({
 *   initialTime: 60,
 *   onComplete: () => console.log('타이머 완료!'),
 * });
 *
 * // 타이머 시작
 * start();
 * ```
 *
 * @param {TimerConfig} config - 타이머 설정 객체
 * @param {number} config.initialTime - 카운트다운 초기 시간(초 단위)
 * @param {() => void} [config.onComplete] - 타이머 완료 시 실행될 선택적 콜백
 *
 * @returns {object} 현재 시간과 시작 함수를 포함하는 객체
 * @returns {number} returns.time - 카운트다운의 현재 시간
 * @returns {() => void} returns.start - 타이머를 시작하는 함수
 */

export const useTimer = ({ initialTime, onComplete }: TimerConfig) => {
    const [time, setTime] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        if (isRunning) {
            timer = setInterval(() => {
                setTime((prev) => {
                    const nextTime = prev - 0.1;
                    if (nextTime <= 0) {
                        setIsRunning(false);
                        onComplete?.();
                        return 0;
                    }
                    return nextTime;
                });
            }, 100);
        }

        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [isRunning, onComplete]);

    const start = useCallback(() => {
        if (isRunning) return;
        setIsRunning(true);
    }, [isRunning]);

    return {
        time,
        start,
    };
};
