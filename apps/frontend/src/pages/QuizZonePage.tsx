import QuizZoneInProgress from '@/blocks/QuizZone/QuizZoneInProgress';
import QuizZoneLobby from '@/blocks/QuizZone/QuizZoneLobby';
import QuizZoneResult from '@/blocks/QuizZone/QuizZoneResult';
import { AsyncBoundary } from '@/components/boundary/AsyncBoundary';
import useQuizZone from '@/hook/quizZone/useQuizZone';
import { useAsyncError } from '@/hook/useAsyncError';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const QuizZoneContent = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { quizZoneId } = useParams();
    const throwError = useAsyncError();

    const {
        initQuizZoneData,
        quizZoneState,
        submitQuiz,
        startQuiz,
        playQuiz,
        exitQuiz,
        joinQuizZone,
    } = useQuizZone();

    const initQuizZone = async () => {
        const response = await fetch(`/api/quiz-zone/${quizZoneId}`, { method: 'GET' });

        if (!response.ok) {
            throw throwError(response);
        }

        const quizZoneInitialData = await response.json();
        initQuizZoneData(quizZoneInitialData);
        joinQuizZone({ quizZoneId });
        setIsLoading(false);
    };

    useEffect(() => {
        initQuizZone();
    }, []);

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
    }

    const renderQuizZone = () => {
        switch (quizZoneState.stage) {
            case 'LOBBY':
                return (
                    <QuizZoneLobby
                        quizZoneState={quizZoneState}
                        quizZoneId={quizZoneId ?? ''}
                        startQuiz={startQuiz}
                        exitQuiz={exitQuiz}
                    />
                );
            case 'IN_PROGRESS':
                return (
                    <QuizZoneInProgress
                        quizZoneState={quizZoneState}
                        submitAnswer={submitQuiz}
                        playQuiz={playQuiz}
                    />
                );
            case 'RESULT':
                return <QuizZoneResult quizZoneState={quizZoneState} />;
            default:
                return null;
        }
    };

    return <div className="w-4/5 h-screen">{renderQuizZone()}</div>;
};

const QuizZonePage = () => {
    const navigate = useNavigate();

    return (
        <AsyncBoundary
            pending={
                <div className="flex h-screen items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
                </div>
            }
            handleError={(error: any) => {
                console.error('QuizZone Error:', error);
            }}
            onReset={() => navigate('/')}
        >
            <QuizZoneContent />
        </AsyncBoundary>
    );
};

export default QuizZonePage;
