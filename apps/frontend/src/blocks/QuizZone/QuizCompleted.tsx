import ContentBox from '@/components/common/ContentBox';
import Typography from '@/components/common/Typogrpahy';
import { useTimer } from '@/hook/useTimer';
import { useEffect } from 'react';
import { CurrentQuizResult } from '@/types/quizZone.types.ts';
import { Player } from '@/types/quizZone.types';
import PodiumPlayers from '@/components/common/\bPodiumPlayers';

interface QuizCompletedProps {
    currentPlayer: Player;
    isLastQuiz: boolean;
    deadlineTime: number;
    currentQuizResult?: CurrentQuizResult;
}

const QuizCompleted = ({
    currentPlayer,
    isLastQuiz,
    deadlineTime,
    currentQuizResult,
}: QuizCompletedProps) => {
    const currentTime = new Date().getTime();
    const remainingPrepTime = Math.max(0, deadlineTime - currentTime) / 1000;

    const { fastestPlayers, submittedCount } = currentQuizResult ?? {};
    const { start, time } = useTimer({
        initialTime: remainingPrepTime,
        onComplete: () => {},
    });

    useEffect(() => {
        start();
    }, []);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
            <ContentBox className="w-full flex flex-col items-center justify-center gap-2 h-full bg-white shadow-lg">
                <Typography
                    size="3xl"
                    color="gray"
                    text={isLastQuiz ? '결과를 산출 중입니다.' : '다음 퀴즈를 준비 중입니다.'}
                    bold={true}
                />
                <Typography size="3xl" color="gray" text="잠시만 기다려주세요" bold={true} />
                {!isLastQuiz && time !== null && (
                    <div className="w-full flex flex-row justify-center items-end">
                        <Typography
                            size="5xl"
                            color="blue"
                            text={`${time.toFixed(0)}`}
                            bold={true}
                        />
                        <Typography
                            size="2xl"
                            color="blue"
                            text={` 초 뒤에 다음문제로 넘어갑니다`}
                            bold={true}
                        />
                    </div>
                )}
            </ContentBox>
            {currentQuizResult && (
                <ContentBox className="w-full flex flex-col items-center justify-center gap-2 h-full bg-white shadow-lg">
                    <Typography
                        size="xl"
                        color="black"
                        text={`${submittedCount}명 제출 완료`}
                        bold={true}
                    />
                    <PodiumPlayers
                        currentPlayer={currentPlayer}
                        players={fastestPlayers ?? []}
                        hostId="1234"
                        className="mt-8"
                    />
                </ContentBox>
            )}
        </div>
    );
};

export default QuizCompleted;
