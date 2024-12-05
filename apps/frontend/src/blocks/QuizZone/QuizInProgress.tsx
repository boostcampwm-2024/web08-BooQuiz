import CommonButton from '@/components/common/CommonButton';
import ContentBox from '@/components/common/ContentBox';
import Input from '@/components/common/Input';
import ProgressBar from '@/components/common/ProgressBar';
import Typography from '@/components/common/Typogrpahy';
import { useTimer } from '@/hook/useTimer';
import { CurrentQuiz } from '@/types/quizZone.types';
import { useEffect, useState } from 'react';

interface QuizInProgressProps {
    playTime: number | null;
    currentQuiz: CurrentQuiz;
    submitAnswer: (e: any) => void;
}

const QuizInProgress = ({ currentQuiz, submitAnswer }: QuizInProgressProps) => {
    const [answer, setAnswer] = useState('');

    const MAX_TEXT_LENGTH = 100;
    const MIN_TEXT_LENGTH = 1;

    const now = new Date().getTime();
    const { playTime, deadlineTime } = currentQuiz;

    const { start, time } = useTimer({
        initialTime: (deadlineTime - now) / 1000,
        onComplete: () => {},
    });

    useEffect(() => {
        start();
    }, []);

    const handleSubmitAnswer = () => {
        if (answer.length >= MIN_TEXT_LENGTH && answer.length <= MAX_TEXT_LENGTH) {
            submitAnswer(answer);
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
            <ProgressBar time={time} playTime={playTime} onTimeEnd={() => {}} />
            <ContentBox className="w-full flex flex-col gap-4 bg-white shadow-lg">
                <Typography
                    text={`Q. ${currentQuiz.question}`}
                    size="2xl"
                    color="black"
                    bold={true}
                />

                <Input
                    onChange={(e) => setAnswer(e.target.value)}
                    name="quizAnswer"
                    value={answer}
                    placeholder={'정답을 입력해주세요'}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSubmitAnswer();
                        }
                    }}
                    height="h-14"
                    isBorder={true}
                />

                <CommonButton
                    text={'제출하기'}
                    clickEvent={() => {
                        handleSubmitAnswer();
                    }}
                />
            </ContentBox>
        </div>
    );
};

export default QuizInProgress;
