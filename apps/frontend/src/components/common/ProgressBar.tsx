import { Progress } from '../ui/progress';
import { useState, useEffect } from 'react';
import Typography from './Typogrpahy';
export interface ProgressBarProps {
    maxTime: number;
    onTimeEnd?: () => void;
}

/**
 * @description
 * ProgressBar 컴포넌트는 시간이 지남에 따라 감소하는 진행 막대를 표시합니다.
 * 최대 시간과 시간이 끝났을 때 호출될 콜백 함수를 받습니다.
 *
 * @example
 * <ProgressBar maxTime={10} onTimeEnd={() => console.log('Time ended!')} />
 *
 * @param {number} maxTime - 진행 막대가 실행될 최대 시간(초)입니다.
 * @param {() => void} onTimeEnd - 시간이 끝났을 때 호출될 콜백 함수입니다.
 *
 * @returns {JSX.Element} 렌더링된 진행 막대 컴포넌트입니다.
 */
const ProgressBar = ({ maxTime = 10, onTimeEnd }: ProgressBarProps) => {
    const MAX_PERCENTAGE = 100;
    const [timeValue, setTimeValue] = useState(MAX_PERCENTAGE);
    const INTERVALS_PER_SECOND = 10; // 초당 업데이트 횟수
    const INTERVAL_DURATION = 1000 / INTERVALS_PER_SECOND; // ms 단위로 계산
    // 타이머 관련 상수와 계산 로직 분리
    const calculateIncrementPerInterval = (maxTime: number) => {
        return MAX_PERCENTAGE / (maxTime * INTERVALS_PER_SECOND);
    };

    // 타이머 업데이트 로직 분리
    const createTimerUpdateFunction = (
        incrementPerInterval: number,
        clearIntervalFn: (intervalId: NodeJS.Timeout) => void,
        intervalId: NodeJS.Timeout,
    ) => {
        return (prevTimeValue: number) => {
            const newTimeValue = prevTimeValue - incrementPerInterval;
            if (newTimeValue <= 0) {
                clearIntervalFn(intervalId);
                return 0;
            }
            return newTimeValue;
        };
    };

    // useEffect 내부에서 사용할 타이머 설정 로직 분리
    const setupTimer = (timeValue: number, incrementPerInterval: number, onTimeEnd: () => void) => {
        if (timeValue === 0 && onTimeEnd) {
            onTimeEnd();
        }

        const interval = setInterval(() => {
            setTimeValue((prevTimeValue) =>
                createTimerUpdateFunction(
                    incrementPerInterval,
                    clearInterval,
                    interval,
                )(prevTimeValue),
            );
        }, INTERVAL_DURATION);

        return interval;
    };

    useEffect(() => {
        const incrementPerInterval = calculateIncrementPerInterval(maxTime);
        const interval = setupTimer(timeValue, incrementPerInterval, onTimeEnd ?? (() => {}));

        return () => clearInterval(interval);
    }, [maxTime, timeValue, onTimeEnd]);

    return (
        <div className="w-full flex justify-center flex-col items-center gap-2">
            <Progress value={timeValue} max={100} className="max-w-[60%]" time={50} />
            <Typography
                text={`${((timeValue / 100) * maxTime).toFixed(1)}초`}
                size="xl"
                color="black"
            />
        </div>
    );
};

export default ProgressBar;
