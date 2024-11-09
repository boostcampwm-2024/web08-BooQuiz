import { useState, useEffect } from 'react';
import Typography from './Typogrpahy';

interface TimerDisplayProps {
    time?: number;
    isFulfill: boolean;
    width?: string;
    height?: string;
    onTimeEnd: () => void;
}

/**
 * @description
 * 이 컴포넌트는 주어진 시간에서 시작하여 매 초마다 감소하는 카운트다운 타이머를 표시합니다.
 * 타이머가 0에 도달하면 `onTimeEnd` 콜백 함수를 호출합니다.
 * 타이머의 배경색과 호버 효과는 `isFulfill` 속성에 따라 사용자 정의할 수 있습니다.
 *
 * @example
 * ```tsx
 * <TimerDisplay time={10} isFulfill={true} onTimeEnd={() => console.log('시간 종료!')} />
 * ```
 *
 * @param {TimerDisplayProps} props - TimerDisplay 컴포넌트의 속성.
 * @param {number} [props.time=3] - 카운트다운 타이머의 초기 시간 값.
 * @param {boolean} props.isFulfill - 타이머의 배경색과 호버 효과를 결정합니다.
 * @param {string} [props.width] - 타이머 디스플레이의 너비.
 * @param {string} [props.height] - 타이머 디스플레이의 높이.
 * @param {() => void} props.onTimeEnd - 타이머가 0에 도달했을 때 호출되는 콜백 함수.
 *
 * @returns {JSX.Element} TimerDisplay 컴포넌트.
 */
const TimerDisplay = ({ time = 3, isFulfill = true, onTimeEnd }: TimerDisplayProps) => {
    const backgroundColorClass = isFulfill ? 'bg-gray300' : 'bg-white';
    const textColorClass = 'black';
    const INTERVAL_SECOND = 1000;
    const hoverBackgroundColorClass = isFulfill ? 'hover:bg-gray500' : 'hover:bg-[#f5f5f5]';

    const [timeValue, setTimeValue] = useState(time);

    useEffect(() => {
        if (timeValue === 0) {
            onTimeEnd();
        }

        const interval = setInterval(() => {
            setTimeValue(timeValue - 1);
        }, INTERVAL_SECOND);

        return () => clearInterval(interval);
    }, [timeValue, onTimeEnd]);
    return (
        <div
            className={`w-[557px] h-[47px] ${backgroundColorClass}${hoverBackgroundColorClass} flex items-center justify-center`}
        >
            <Typography text={timeValue.toString()} color={textColorClass} size="xl" />
        </div>
    );
};

export default TimerDisplay;
