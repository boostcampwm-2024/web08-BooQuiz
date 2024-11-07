import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from './Typogrpahy';

interface TimerDisplayProps {
    time?: number;
    isFulfill: boolean;
    width?: string;
    height?: string;
}

const TimerDisplay = ({ time = 3, isFulfill = true }: TimerDisplayProps) => {
    const backgroundColorClass = isFulfill ? 'bg-gray300' : 'bg-white';
    const textColorClass = 'black';
    const hoverBackgroundColorClass = isFulfill ? 'hover:bg-gray500' : 'hover:bg-[#f5f5f5]';

    const navigate = useNavigate();
    const [timeValue, setTimeValue] = useState(time);

    useEffect(() => {
        if (timeValue === 0) {
            navigate('/quiz');
        }

        const interval = setInterval(() => {
            setTimeValue(timeValue - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeValue]);
    return (
        <div
            className={`w-[557px] h-[47px] ${backgroundColorClass}${hoverBackgroundColorClass} flex items-center justify-center`}
        >
            <Typography text={timeValue.toString()} color={textColorClass} size="xl" />
        </div>
    );
};

export default TimerDisplay;
