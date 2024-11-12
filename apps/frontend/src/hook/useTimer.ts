import { useState, useEffect } from 'react';

interface TimerConfig {
    initialTime: number;
    onComplete?: () => void;
    autoStart?: boolean;
}

/**
 * 카운트다운 타이머를 관리하는 커스텀 훅입니다.
 *
 * @description
 * 이 훅은 시작, 정지 및 재설정 제어 기능을 갖춘 카운트다운 타이머 기능을 제공합니다.
 * 초기 시간, 타이머 완료 시 실행될 선택적 콜백, 초기화 시 타이머를 자동 시작할지 여부를 나타내는 선택적 플래그를 받습니다.
 *
 * @example
 * ```typescript
 * const { time, isRunning, start, stop, reset } = useTimer({
 *   initialTime: 60,
 *   onComplete: () => console.log('타이머 완료!'),
 *   autoStart: true,
 * });
 *
 * 타이머 시작
 * start();
 *
 * 타이머 정지
 * stop();
 *
 * 타이머 재설정
 * reset();
 * ```
 *
 * @param {TimerConfig} config - 타이머 설정 객체.
 * @param {number} config.initialTime - 카운트다운 초기 시간(초 단위).
 * @param {() => void} [config.onComplete] - 타이머 완료 시 실행될 선택적 콜백.
 * @param {boolean} [config.autoStart=false] - 초기화 시 타이머를 자동 시작할지 여부를 나타내는 선택적 플래그.
 *
 * @returns {object} 현재 시간, 실행 상태 및 제어 함수들을 포함하는 객체.
 * @returns {number | null} returns.time - 카운트다운의 현재 시간.
 * @returns {boolean} returns.isRunning - 타이머의 실행 상태.
 * @returns {() => void} returns.start - 타이머를 시작하는 함수.
 * @returns {() => void} returns.stop - 타이머를 정지하는 함수.
 * @returns {() => void} returns.reset - 타이머를 재설정하는 함수.
 */
export const useTimer = ({ initialTime, onComplete, autoStart = false }: TimerConfig) => {
    const [time, setTime] = useState<number | null>(autoStart ? initialTime : null);
    const [isRunning, setIsRunning] = useState(autoStart);

    useEffect(() => {
        if (!isRunning || time === null) return;

        const timer = setInterval(() => {
            setTime((prev) => {
                if (prev === null || prev <= 1) {
                    setIsRunning(false);
                    onComplete?.();
                    return null;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isRunning, time, onComplete]);

    const start = () => {
        setTime(initialTime);
        setIsRunning(true);
    };

    const stop = () => {
        setIsRunning(false);
        setTime(null);
    };

    const reset = () => {
        setTime(initialTime);
        setIsRunning(false);
    };

    return {
        time,
        isRunning,
        start,
        stop,
        reset,
    };
};
