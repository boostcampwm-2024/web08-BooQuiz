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
        console.log(answer.length, answer);
        if (answer.length >= MIN_TEXT_LENGTH && answer.length <= MAX_TEXT_LENGTH) {
            submitAnswer(answer);
        }
    };

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
            <img width="200px" src="/BooQuizLogo.png" alt="BooQuiz Logo" />
            <ProgressBar
                deadlineTime={currentQuiz.deadlineTime}
                onTimeEnd={() => {
                    console.log('풀이 시간 종료');
                }}
            />
            <ContentBox className="md:min-w-[48rem] w-4/5">
                <Typography
                    text={`Q. ${currentQuiz.question}`}
                    size="2xl"
                    color="black"
                    bold={true}
                />
                {currentQuiz.type == 'SHORT' ? (
                    <>
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
                    </>
                ) : (
                    <div className="space-y-2">
                        {currentQuiz.options?.map((option: string, index: number) => (
                            <button
                                key={index + 'a'}
                                onClick={() => submitAnswer(option)}
                                className="block w-full p-2 text-left border rounded hover:bg-gray-100"
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                )}
            </ContentBox>
        </div>
    );
};

export default QuizInProgress;
