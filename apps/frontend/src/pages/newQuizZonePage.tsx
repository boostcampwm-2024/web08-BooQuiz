import QuizInProgress from '@/blocks/QuizZone/QuizInProgress';
import QuizZoneInProgress from '@/blocks/QuizZone/QuizZoneInProgress';
import QuizZoneLobby from '@/blocks/QuizZone/QuizZoneLobby';
import useQuizZone from '@/hook/quiz-zone/useQuizZone';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const NewQuizZonePage = () => {
    //QuizZoneId를 받아오기 위해 useParams 사용
    const { quizZoneId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const fetchQuizZoneData = async (quizZoneId: string) => {
        const response = await fetch(`/api/quiz-zone/${quizZoneId}`, { method: 'GET' });

        if (!response.ok) {
            throw new Error('퀴즈존을 찾을 수 없습니다.');
        }

        return response.json();
    };

    const { initQuizZoneData, quizZoneState, submitQuiz, startQuiz, playQuiz } = useQuizZone();

    const initQuizZone = async () => {
        try {
            const quizZoneInitialData = await fetchQuizZoneData(quizZoneId ?? '');
            console.log('quizZoneData', quizZoneInitialData);
            initQuizZoneData(quizZoneInitialData);
            setIsLoading(false);
        } catch (e) {
            //alertDialog >> 퀴즈존을 찾을 수 없습니다. >> 확인 누르면 navigate(-1)
            navigate(-1);
        }
    };

    useEffect(() => {
        initQuizZone();
    }, []);

    // 로딩 중 표시
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
    }

    const renderQuizZone = () => {
        console.log(quizZoneState.stage);
        switch (quizZoneState.stage) {
            case 'LOBBY':
                return (
                    <QuizZoneLobby
                        quizZoneState={quizZoneState}
                        quizZoneId={quizZoneId ?? ''}
                        startQuiz={startQuiz}
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
            // return <QuizZoneFinish />;
            default:
                return null;
        }
    };

    return <div>{renderQuizZone()}</div>;
};

export default NewQuizZonePage;
