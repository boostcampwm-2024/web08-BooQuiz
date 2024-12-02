import QuizZoneInProgress from '@/blocks/QuizZone/QuizZoneInProgress';
import QuizZoneLobby from '@/blocks/QuizZone/QuizZoneLobby';
import QuizZoneResult from '@/blocks/QuizZone/QuizZoneResult';
import { AsyncBoundary } from '@/components/boundary/AsyncBoundary';
import ChatBox from '@/components/common/ChatBox';
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
        sendChat,
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

    const shouldShowChat = () => {
        if (!quizZoneState.currentPlayer?.id || !quizZoneState.stage) {
            return false;
        }

        const isPlaying =
            quizZoneState.currentPlayer.state === 'PLAY' && quizZoneState.stage === 'IN_PROGRESS';
        const isResult = quizZoneState.stage === 'RESULT';
        const isSinglePlayer = quizZoneState.players?.length === 1;

        return !isPlaying && !isResult && !isSinglePlayer;
    };

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
                        maxPlayers={quizZoneState.maxPlayers ?? 0}
                        startQuiz={startQuiz}
                        exitQuiz={exitQuiz}
                        sendChat={sendChat}
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
        <div className="flex flex-col w-full min-h-[calc(100vh-4rem)] justify-center p-4 mt-16">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-center w-full">
                {/* QuizZone 컨텐츠를 위한 컨테이너 */}
                <div className="w-full lg:h-[80vh] lg:flex">{renderQuizZone()}</div>

                {/* 채팅 박스 컨테이너 */}
                {shouldShowChat() && (
                    <div className="w-full lg:w-[24rem]">
                        <ChatBox
                            chatMessages={quizZoneState.chatMessages ?? []}
                            clientId={quizZoneState.currentPlayer.id}
                            nickname={quizZoneState.currentPlayer.nickname}
                            sendHandler={sendChat}
                            className="lg:h-[60vh] h-[40vh]"
                        />
                    </div>
                )}
            </div>
        </div>
    );
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
