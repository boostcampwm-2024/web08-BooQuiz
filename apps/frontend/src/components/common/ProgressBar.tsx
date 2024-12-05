import { Progress } from '@/components/ui/progress';
import Typography from './Typogrpahy';

export interface ProgressBarProps {
    playTime: number;
    time: number;
    onTimeEnd?: () => void;
}

/**
 * @description
 * ProgressBar 컴포넌트는 주어진 플레이 시간과 현재 시간을 기반으로 진행도를 시각적으로 표시합니다.
 *
 * @example
 * <ProgressBar
 *   playTime={30}
 *   time={25}
 *   onTimeEnd={() => console.log('Time ended!')}
 * />
 */
const ProgressBar = ({ playTime, time, onTimeEnd }: ProgressBarProps) => {
    // 진행도 계산 (남은 시간 / 전체 시간 * 100)
    const progress = Math.max(0, Math.min(100, (time / playTime) * 100000));

    // 시간이 다 되었을 때 콜백 실행
    if (time <= 0) {
        onTimeEnd?.();
    }

    console.log(progress);

    return (
        <div className="w-full flex justify-center flex-col items-center gap-2">
            <Progress value={progress} max={100} className="max-w-[60%]" />
            <Typography
                text={`남은시간 ${Math.max(0, time).toFixed(0)}초`}
                size="xl"
                color="black"
                bold={true}
            />
        </div>
    );
};

export default ProgressBar;
