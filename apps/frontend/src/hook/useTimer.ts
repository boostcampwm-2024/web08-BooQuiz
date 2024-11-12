import { useState, useEffect } from 'react';

interface TimerConfig {
    initialTime: number;
    onComplete?: () => void;
    autoStart?: boolean;
}

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
