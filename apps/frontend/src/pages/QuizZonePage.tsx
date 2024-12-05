import QuizZoneInProgress from '@/blocks/QuizZone/QuizZoneInProgress';
import QuizZoneLoading from '@/blocks/QuizZone/QuizZoneLoading';
import QuizZoneLobby from '@/blocks/QuizZone/QuizZoneLobby';
import QuizZoneResult from '@/blocks/QuizZone/QuizZoneResult';
import { AsyncBoundary } from '@/components/boundary/AsyncBoundary';
import ChatBox from '@/components/common/ChatBox';
import useQuizZone from '@/hook/quizZone/useQuizZone';
import { useAsyncError } from '@/hook/useAsyncError';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { requestQuizZone } from '@/utils/requests.ts';
import { AlertDialog } from '@radix-ui/react-alert-dialog';
import CustomAlertDialogContent from '@/components/common/CustomAlertDialogContent.tsx';

const QuizZoneContent = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isDisconnection, setIsDisconnection] = useState(false);
    const [isClose, setIsClose] = useState(false);

    const navigate = useNavigate();
    const { quizZoneId } = useParams();
    const throwError = useAsyncError();

    if (quizZoneId === undefined) {
        throwError(new Error('접속하려는 퀴즈존의 입장 코드를 확인하세요.'));
        return;
    }

    const reconnectHandler = () => {
        setIsDisconnection(true);
    };

    const closeHandler = () => {
        setIsClose(true);
    };

    const { initQuizZoneData, quizZoneState, submitQuiz, startQuiz, playQuiz, exitQuiz, sendChat } =
        useQuizZone(quizZoneId, reconnectHandler, closeHandler);

    const initQuizZone = async () => {
        try {
            setIsLoading(true);

            const quizZone = await requestQuizZone(quizZoneId);
            const now = new Date().getTime();
            await initQuizZoneData(quizZone, now);

            setIsLoading(false);
            setIsDisconnection(false);
        } catch (error) {
            throwError(error);
        }
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
        const isSinglePlayer = quizZoneState.players?.length === 1;

        return !isPlaying && !isSinglePlayer;
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
                // endSocketTime이 Null이면 로딩 중
                if (!quizZoneState.endSocketTime) {
                    return <QuizZoneLoading />;
                }
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
                    <ChatBox
                        chatMessages={quizZoneState.chatMessages ?? []}
                        clientId={quizZoneState.currentPlayer.id}
                        nickname={quizZoneState.currentPlayer.nickname}
                        sendHandler={sendChat}
                        className="lg:h-[80vh] lg:max-h-[80vh] max-h-[60vh] flex flex-col w-full lg:w-[24rem]"
                        disabled={quizZoneState.isQuizZoneEnd ?? false}
                    />
                )}
            </div>
            <AlertDialog open={isDisconnection}>
                <CustomAlertDialogContent
                    title={'퀴즈존 입장'}
                    description={'서버와의 연결이 끊어졌습니다. 다시 연결하시겠습니까?'}
                    type={'error'}
                    confirmText={'다시 연결하기'}
                    cancelText={'나가기'}
                    handleCancel={() => navigate('/')}
                    handleConfirm={() => initQuizZone()}
                />
            </AlertDialog>
            <AlertDialog open={quizZoneState.stage === 'LOBBY' && isClose}>
                <CustomAlertDialogContent
                    title={'퀴즈존 종료'}
                    description={'방장이 퀴즈존을 떠나 퀴즈존이 삭제되었습니다.'}
                    type={'info'}
                    cancelText={'취소'}
                    handleCancel={() => setIsClose(false)}
                    confirmText={'나가기'}
                    handleConfirm={() => navigate('/')}
                />
            </AlertDialog>
        </div>
    );
};

const QuizZonePage = () => {
    const navigate = useNavigate();

    return (
        <AsyncBoundary
            pending={
                <div className="flex h-screen items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2563eb]" />
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
