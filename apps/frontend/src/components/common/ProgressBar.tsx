import { Progress } from '../ui/progress';
import { useState, useEffect, useRef } from 'react';
import Typography from './Typogrpahy';

export interface ProgressBarProps {
    deadlineTime: number; // ISO string or Date object
    onTimeEnd?: () => void;
}

/**
 * @description
 * ProgressBar 컴포넌트는 주어진 마감 시간까지 남은 시간을 시각적으로 표시합니다.
 * 현재 시간과 마감 시간 사이의 진행도를 보여주며, 시간이 다 되면 콜백을 실행합니다.
 *
 * @example
 * <ProgressBar
 *   deadlineTime={new Date(Date.now() + 30000)}
 *   onTimeEnd={() => console.log('Time ended!')}
 * />
 */
const ProgressBar = ({ deadlineTime, onTimeEnd }: ProgressBarProps) => {
    const totalDurationRef = useRef(deadlineTime - Date.now());

    const calculateInitialProgress = () => {
        const now = Date.now();
        const totalDuration = totalDurationRef.current;
        const remaining = deadlineTime - now;
        const progress = Math.max(0, (remaining / totalDuration) * 100);
        return progress;
    };

    const calculateInitialSeconds = () => {
        const now = Date.now();
        return Math.max(0, (deadlineTime - now) / 1000);
    };

    const [progress, setProgress] = useState(calculateInitialProgress());
    const [remainingSeconds, setRemainingSeconds] = useState<number>(calculateInitialSeconds());

    useEffect(() => {
        const startTime = Date.now();
        const totalDuration = totalDurationRef.current;

        // deadlineTime이 이미 지난 경우
        if (deadlineTime <= startTime) {
            setProgress(0);
            setRemainingSeconds(0);
            onTimeEnd?.();
            return;
        }

        const updateProgress = () => {
            const currentTime = Date.now();
            const remaining = deadlineTime - currentTime;

            if (remaining <= 0) {
                setProgress(0);
                setRemainingSeconds(0);
                onTimeEnd?.();
                return false;
            }

            // totalDurationRef.current를 사용하여 일정한 비율로 감소
            const newProgress = (remaining / totalDuration) * 100;
            setProgress(Math.max(0, Math.min(100, newProgress)));
            setRemainingSeconds(remaining / 1000);

            return true;
        };

        const interval = setInterval(updateProgress, 100);

        return () => clearInterval(interval);
    }, [deadlineTime, onTimeEnd]);

    return (
        <div className="w-full flex justify-center flex-col items-center gap-2">
            <Progress value={progress} max={100} className="max-w-[60%]" />
            <Typography
                text={`남은시간 ${Math.max(0, remainingSeconds).toFixed(0)}초`}
                size="xl"
                color="black"
                bold={true}
            />
        </div>
    );
};

export default ProgressBar;
