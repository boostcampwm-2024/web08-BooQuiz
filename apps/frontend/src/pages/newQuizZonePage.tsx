import QuizZoneInProgress from '@/blocks/QuizZone/QuizZoneInProgress';
import QuizZoneLobby from '@/blocks/QuizZone/QuizZoneLobby';
import QuizZoneResult from '@/blocks/QuizZone/QuizZoneResult';
import useQuizZone from '@/hook/quiz-zone/useQuizZone';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CustomAlertDialog from '@/components/common/CustomAlertDialog';

const NewQuizZonePage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [showError, setShowError] = useState(false);

    //QuizZoneId를 받아오기 위해 useParams 사용
    const { quizZoneId } = useParams();

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
            setShowError(true);
        } catch (e) {
            //alertDialog >> 퀴즈존을 찾을 수 없습니다. >> 확인 누르면 navigate(-1)
            setShowError(true);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        initQuizZone();
    }, []);

    const handleErrorConfirm = () => {
        setShowError(false);
        navigate(-1);
    };

    // 로딩 중 표시
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

    return (
        <div>
            {showError && (
                <CustomAlertDialog
                    showError={showError}
                    setShowError={setShowError}
                    onConfirm={handleErrorConfirm}
                    title="퀴즈존을 찾을 수 없습니다."
                    description="퀴즈존이 존재하지 않거나 삭제되었습니다."
                    confirmText="돌아가기"
                />
            )}
            {renderQuizZone()}
        </div>
    );
};

export default NewQuizZonePage;
