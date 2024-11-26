import CommonButton from '@/components/common/CommonButton';
import ContentBox from '@/components/common/ContentBox';
import Input from '@/components/common/Input';
import ProgressBar from '@/components/common/ProgressBar';
import Typography from '@/components/common/Typogrpahy';
import { useState } from 'react';

interface QuizInProgressProps {
    playTime: number | null;
    currentQuiz: any;
    submitAnswer: (e: any) => void;
}

const QuizInProgress = ({ currentQuiz, submitAnswer }: QuizInProgressProps) => {
    const [answer, setAnswer] = useState('');

    const MAX_TEXT_LENGTH = 100;
    const MIN_TEXT_LENGTH = 1;

    const handleSubmitAnswer = () => {
        if (answer.length >= MIN_TEXT_LENGTH && answer.length <= MAX_TEXT_LENGTH) {
            submitAnswer(answer);
        }
    };

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
            <img width="200px" src="/BooQuizLogo.png" alt="BooQuiz Logo" />
            <ProgressBar deadlineTime={currentQuiz.deadlineTime} onTimeEnd={() => {}} />
            <ContentBox className="md:min-w-[48rem] w-4/5">
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
