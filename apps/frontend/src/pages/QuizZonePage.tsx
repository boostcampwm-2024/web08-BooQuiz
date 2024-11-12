import { useEffect } from 'react';
import { useQuizZoneManager } from '../hook/useQuizZoneManager';
import QuizZoneLobby from '@/blocks/QuizZone/QuizZoneLobby';
import QuizWaiting from '@/blocks/QuizZone/QuizWaiting';
import QuizInProgress from '@/blocks/QuizZone/QuizInProgress';
import QuizCompleted from '@/blocks/QuizZone/QuizCompleted';
import QuizZoneResult from '@/blocks/QuizZone/QuizZoneResult';

interface QuizZoneProps {
    pinNumber: string;
}

export const QuizZone = ({ pinNumber }: QuizZoneProps) => {
    const {
        quizZone,
        solveStage,
        quizProgress,
        quizZoneData,
        prepareTime,
        solutionTime,
        isTransitioning,
        updateStageData,
        startQuiz,
        submitAnswer,
    } = useQuizZoneManager({
        totalQuizzes: 2,
        onQuizComplete: () => console.log('퀴즈 완료!'),
        onError: (error) => console.error('에러 발생:', error),
    });

    useEffect(() => {
        // 로비 초기 데이터 설정
        updateStageData('Lobby', {
            participants: 1,
            isHost: true,
            quizTitle: '연습 퀴즈',
            description: '혼자서 풀어보는 연습 퀴즈입니다.',
        });
        //퀴즈 진행 초기 데이터 인풋으로
        updateStageData('quizProgress', {
            currentQuiz: {
                question: '첫 번째 문제',
                timeLimit: 10,
                type: 'SHORT_ANSWER',
            },
        });

        // 결과 초기 페이지 설정
        updateStageData('result', {
            score: 100,
            rank: 1,
            totalParticipants: 1,
            correctAnswers: 2,
        });
    }, []);

    // 로비 화면 렌더링
    const renderLobby = () => (
        <>
            {quizZoneData.Lobby && (
                <QuizZoneLobby
                    quizZoneData={quizZoneData}
                    pinNumber={pinNumber}
                    startQuiz={startQuiz}
                />
            )}
        </>
    );

    // 퀴즈 진행 화면 렌더링
    const renderQuizProgress = () => {
        const currentQuiz = quizZoneData.quizProgress?.currentQuiz;
        const isLastQuiz = quizProgress.currentQuizIndex === quizProgress.totalQuizzes - 1;

        if (solveStage === 'WAITING') {
            return <QuizWaiting prepareTime={prepareTime} />;
        }

        if (solveStage === 'IN_PROGRESS' && currentQuiz) {
            return (
                <QuizInProgress
                    solutionTime={solutionTime}
                    currentQuiz={currentQuiz}
                    submitAnswer={submitAnswer}
                />
            );
        }

        if (solveStage === 'COMPLETED') {
            return <QuizCompleted isLastQuiz={isLastQuiz} />;
        }

        return null;
    };

    // 결과 화면 렌더링
    const renderResult = () => (
        <>
            {quizZoneData.result && (
                <QuizZoneResult quizZoneData={quizZoneData} quizProgress={quizProgress} />
            )}
        </>
    );

    if (isTransitioning) {
        return <div className="p-4 text-center">로딩 중...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto">
            {quizZone === 'LOBBY' && renderLobby()}
            {quizZone === 'QUIZ_PROGRESS' && renderQuizProgress()}
            {quizZone === 'RESULT' && renderResult()}
        </div>
    );
};

export default QuizZone;
