import { Progress } from '../ui/progress';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TimerDisplay from './TimerDisplay';
import Typography from './Typogrpahy';

export interface ProgressBarProps {
    maxTime: number;
}

const ProgressBar = ({ maxTime = 10 }: ProgressBarProps) => {
    const navigate = useNavigate();
    const [timeValue, setTimeValue] = useState(100);
    const intervalsPerSecond = 10; // 초당 업데이트 횟수
    const intervalDuration = 1000 / intervalsPerSecond; // ms 단위로 계산
    console.log('timeValue: ', timeValue);
    useEffect(() => {
        const incrementPerInterval = 100 / (maxTime * intervalsPerSecond); // maxTime에 맞춰 증가량 조정
        if (timeValue == 0) {
            navigate('/waiting');
        }
        const interval = setInterval(() => {
            setTimeValue((prevTimeValue) => {
                const newTimeValue = prevTimeValue - incrementPerInterval;
                if (newTimeValue <= 0) {
                    clearInterval(interval);
                    return 0;
                }
                return newTimeValue;
            });
        }, intervalDuration);

        return () => clearInterval(interval);
    }, [maxTime, timeValue, navigate]);

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
