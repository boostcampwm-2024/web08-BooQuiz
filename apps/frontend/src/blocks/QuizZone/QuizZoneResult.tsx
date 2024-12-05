import ContentBox from '@/components/common/ContentBox';
import CustomAlert from '@/components/common/CustomAlert';
import CustomAlertDialog from '@/components/common/CustomAlertDialog';
import Typography from '@/components/common/Typogrpahy';
import { useTimer } from '@/hook/useTimer';
import { QuizZone } from '@/types/quizZone.types';
import atob from '@/utils/atob';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface QuizZoneResultProps {
    quizZoneState: QuizZone;
}

interface QuizResult {
    question: string;
    correctAnswer: string;
    userAnswer: string;
    isCorrect: boolean;
    submitRank: number | null;
    timeLimit: number;
}

const QuizZoneResult = ({ quizZoneState }: QuizZoneResultProps) => {
    const navigate = useNavigate();
    const { endSocketTime } = quizZoneState;
    const [isHomeAlertOpen, setIsHomeAlertOpen] = useState(false);
    const currentTime = new Date().getTime();
    const remainingTime = Math.max(0, ((endSocketTime ?? 0) - currentTime) / 1000);

    const { start, time } = useTimer({
        initialTime: remainingTime,
        onComplete: () => {
            setIsHomeAlertOpen(true);
        },
    });
    useEffect(() => {
        start();
    }, []);

    const handleCloseAlert = () => {
        setIsHomeAlertOpen(false);
    };

    const quizResults: QuizResult[] = (quizZoneState.quizzes ?? []).map((quiz, index) => {
        const submission = quizZoneState.submits?.[index];
        const isCorrect =
            submission?.answer?.replace(/\s/g, '') === quiz?.answer?.replace(/\s/g, '');
        return {
            question: quiz?.question ? atob(quiz.question) : '문제 정보 없음',
            correctAnswer: quiz?.answer ?? '정답 정보 없음',
            userAnswer: submission?.answer ?? '미제출',
            isCorrect: !!isCorrect,
            submitRank: submission?.submitRank ?? null,
            timeLimit: (quiz?.playTime ?? 30000) / 1000,
        };
    });

    const stats = {
        totalCorrect: quizResults.filter((r) => r.isCorrect).length,
        currentPlayerRank:
            quizZoneState.ranks?.find((r) => r.id === quizZoneState.currentPlayer.id)?.ranking ?? 0,
        totalQuestions: quizResults.length,
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
            {/* 상단 요약 정보 */}
            <ContentBox className="w-full h-full p-6 flex items-center bg-white shadow-lg">
                <div className="w-full flex flex-col items-center gap-4">
                    <Typography size="lg" color="blue" text="퀴즈 결과" bold={true} />
                    <div className="flex items-baseline gap-2">
                        <Typography
                            size="4xl"
                            color="blue"
                            text={`${stats.currentPlayerRank}위`}
                            bold={true}
                        />
                        <Typography
                            size="xl"
                            color="gray"
                            text={`/ ${quizZoneState.ranks?.length ?? 1} 명`}
                            bold={true}
                        />
                    </div>
                    <div className="w-full grid grid-cols-2 gap-4 mt-2">
                        <div className="flex flex-col items-center">
                            <Typography size="base" color="gray" text="풀이 결과" />
                            <Typography
                                size="xl"
                                color="black"
                                text={`${quizZoneState.score ?? 0} / ${quizZoneState.quizCount ?? 0}점`}
                                bold={true}
                            />
                        </div>
                        <div className="flex flex-col items-center">
                            <Typography size="base" color="gray" text="정답률" />
                            <Typography
                                size="xl"
                                color="black"
                                text={`${((stats.totalCorrect / stats.totalQuestions) * 100).toFixed(1)}%`}
                                bold={true}
                            />
                        </div>
                    </div>
                </div>

                <Typography
                    size="base"
                    color="blue"
                    text={`퀴즈존이 ${time.toFixed(0)}초 후에 종료됩니다.`}
                    bold={true}
                />
            </ContentBox>

            {quizResults.length > 0 && (
                <ContentBox className="w-full p-6 gap-2 bg-white shadow-lg">
                    <Typography size="lg" color="black" text="문제별 결과" bold={true} />
                    <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3 w-full">
                        {quizResults.map((result, index) => (
                            <ContentBox
                                key={index}
                                className={`border-l-4 ${
                                    result.isCorrect ? 'border-l-[#2563eb]' : 'border-l-red-500'
                                } bg-gray-50`}
                            >
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <Typography
                                            size="base"
                                            color="black"
                                            text={`문제 ${index + 1}`}
                                            bold={true}
                                        />
                                        <Typography
                                            size="sm"
                                            color={result.isCorrect ? 'blue' : 'red'}
                                            text={result.isCorrect ? '정답' : '오답'}
                                            bold={true}
                                        />
                                    </div>
                                    <Typography size="sm" color="black" text={result.question} />
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                                        <div>
                                            <Typography size="xs" color="gray" text="제출한 답안" />
                                            <Typography
                                                size="sm"
                                                color={result.isCorrect ? 'blue' : 'red'}
                                                text={result.userAnswer}
                                            />
                                        </div>
                                        <div>
                                            <Typography size="xs" color="gray" text="정답" />
                                            <Typography
                                                size="sm"
                                                color="blue"
                                                text={result.correctAnswer}
                                            />
                                        </div>
                                        {result.submitRank !== null && (
                                            <div className="col-span-2">
                                                <Typography
                                                    size="xs"
                                                    color="gray"
                                                    text="제출 순위"
                                                />
                                                <Typography
                                                    size="sm"
                                                    color="blue"
                                                    text={`${result.submitRank}등`}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </ContentBox>
                        ))}
                    </div>
                </ContentBox>
            )}

            <CustomAlert
                trigger={{
                    text: '나가기',
                    variant: 'outline',
                }}
                alert={{
                    title: '메인페이지로 이동하시겠습니까?',
                    description: '이 작업은 취소할 수 없습니다.',
                    type: 'info',
                }}
                onConfirm={() => navigate('/')}
                onCancel={() => {}}
                className="w-4/5 md:w-[40rem]"
            />

            <CustomAlertDialog
                showError={isHomeAlertOpen}
                setShowError={setIsHomeAlertOpen}
                title="퀴즈존이 종료되었습니다, 메인페이지로 이동하시겠습니까?"
                cancelText="결과 확인하기"
                confirmText="확인"
                onConfirm={() => navigate('/')}
                onCancel={handleCloseAlert}
            />
        </div>
    );
};

export default QuizZoneResult;
