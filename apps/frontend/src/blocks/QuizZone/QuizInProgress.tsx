import CommonButton from '@/components/common/CommonButton';
import ContentBox from '@/components/common/ContentBox';
import Input from '@/components/common/Input';
import ProgressBar from '@/components/common/ProgressBar';
import Typography from '@/components/common/Typogrpahy';
import { useState } from 'react';

interface QuizInProgressProps {
    solutionTime: number | null;
    currentQuiz: any;
    submitAnswer: (e: any) => void;
    timeOutHandler: () => void;
}

const QuizInProgress = ({ currentQuiz, submitAnswer, timeOutHandler }: QuizInProgressProps) => {
    const [answer, setAnswer] = useState('');

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
            <img width="200px" src="/BooQuizLogo.png" alt="BooQuiz Logo" />
            <ProgressBar
                deadlineTime={currentQuiz.deadlineTime}
                onTimeEnd={() => {
                    timeOutHandler();
                }}
            />
            <ContentBox className="md:min-w-[48rem] w-4/5">
                <Typography
                    text={`Q. ${currentQuiz.question}`}
                    size="2xl"
                    color="black"
                    bold={true}
                />
                {currentQuiz.type == 'SHORT_ANSWER' ? (
                    <>
                        <Input
                            onChange={(e) => setAnswer(e.target.value)}
                            name="quizAnswer"
                            value={answer}
                            placeholder={'정답을 입력해주세요'}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    submitAnswer(answer);
                                }
                            }}
                        />
                        <CommonButton
                            text={'제출하기'}
                            clickEvent={() => {
                                submitAnswer(answer);
                            }}
                        />
                        {/* <CommonButton text={'나가기'} clickEvent={() => {}} /> */}
                    </>
                ) : (
                    <div className="space-y-2">
                        {currentQuiz.options?.map((option: string, index: number) => (
                            <button
                                key={index}
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
