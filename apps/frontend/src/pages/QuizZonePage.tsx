import { useEffect, useState } from 'react';
import { useQuizZoneManager } from '../hook/useQuizZoneManager';
import { useNavigate } from 'react-router-dom';
import QuizZoneLobby from '@/blocks/QuizZone/QuizZoneLobby';
import QuizWaiting from '@/blocks/QuizZone/QuizWaiting';
import QuizInProgress from '@/blocks/QuizZone/QuizInProgress';
import QuizCompleted from '@/blocks/QuizZone/QuizCompleted';
import QuizZoneResult from '@/blocks/QuizZone/QuizZoneResult';

interface QuizZoneProps {
    pinNumber: string;
}

interface QuizZoneInitialData {
    quizCount: number;
    title: string;
    description: string;
    isHost: boolean;
    participants: Array<{
        id: string;
        nickname: string;
    }>;
}

export const QuizZone = ({ pinNumber }: QuizZoneProps) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [initialData, setInitialData] = useState<QuizZoneInitialData | null>(null);
    const [ws, setWs] = useState<WebSocket>();
    const [isLastQuiz, setIsLastQuiz] = useState(false);

    const {
        quizZone,
        solveStage,
        quizZoneData,
        prepareTime,
        solutionTime,
        isTransitioning,
        updateStageData,
        startQuiz,
        setQuizZone,
        setTotalQuizzes,
        setSolutionTime,
        startPrepareTimer,
        handleQuizCycle,
    } = useQuizZoneManager({
        totalQuizzes: 0,
        onQuizComplete: () => console.log('퀴즈 완료!'),
        onError: (error) => console.error('에러 발생:', error),
    });

    // 초기 데이터 불러오기
    useEffect(() => {
        const fetchQuizZoneData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/quiz-zone/${pinNumber}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('퀴즈존을 찾을 수 없습니다.');
                }

                const data: QuizZoneInitialData = await response.json();
                setInitialData(data);
                setTotalQuizzes(data.quizCount); // 총 퀴즈 수 업데이트
            } catch (err) {
                setError(err instanceof Error ? err.message : '알 수 없는 에러가 발생했습니다.');
                navigate('/');
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuizZoneData();
    }, []);

    // 초기 데이터가 로드되면 스테이지 데이터 설정
    useEffect(() => {
        if (initialData) {
            // 로비 데이터 업데이트
            updateStageData('Lobby', {
                participants: initialData.participants?.length || 1,
                isHost: initialData?.isHost || true,
                quizTitle: initialData?.title || '퀴즈 제목',
                description: initialData?.description || '퀴즈 설명',
            });
        }
    }, [initialData]);

    const wsUrl = import.meta.env.VITE_WS_URL;
    //WebSocket 연결
    useEffect(() => {
        if (!initialData) return;

        const ws = new WebSocket(`${wsUrl}/play`);
        setWs(ws);

        ws.onopen = () => {
            console.log('연결됨');
        };

        // 서버로부터 메시지 수신
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            // 서버로부터 받은 데이터에 따라 처리
            // event를 기준으로 객체 형태 데이터가 서버로부터 전달됨
            switch (data.event) {
                case 'start':
                    break;
                case 'nextQuiz':
                    {
                        const { question, currentIndex, deadlineTime, playTime, startTime, stage } =
                            data.data;
                        const currentTime = new Date().getTime();
                        const remainingPrepTime = Math.max(0, startTime - currentTime) / 1000;

                        if (question) {
                            // question이 존재하는 경우에만 업데이트
                            updateStageData('quizProgress', {
                                currentQuiz: {
                                    question: question,
                                    timeLimit: playTime / 1000,
                                    stage: stage,
                                    currentIndex: currentIndex,
                                    type: 'SHORT_ANSWER',
                                    deadlineTime,
                                    startTime,
                                },
                            });

                            startPrepareTimer(remainingPrepTime);
                            setSolutionTime(playTime / 1000);
                            handleQuizCycle('WAITING');
                        }
                    }
                    break;
                case 'finish':
                    setIsLastQuiz(true);
                    handleQuizCycle('WAITING');
                    break;
                case 'summary':
                    setQuizZone('RESULT');
                    updateStageData('result', {
                        score: data.data.score,
                        quizzes: data.data.quizzes,
                        submits: data.data.submits,
                    });
                    break;
            }
        };

        ws.onclose = () => {
            console.log('시스템', '서버와 연결이 끊어졌습니다.');
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, [initialData]);

    // 로딩 중 표시
    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
    }

    // 에러 표시
    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    // 초기 데이터가 없으면 로딩 표시
    if (!initialData) {
        return <div className="flex justify-center items-center h-screen">초기화 중...</div>;
    }

    // startQuiz 핸들러 수정
    const handleStartQuiz = () => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(
                JSON.stringify({
                    event: 'start',
                    data: {
                        pinNumber,
                    },
                }),
            );
        }
        startQuiz();
    };

    const handleSubmitAnswer = (answer: string) => {
        if (ws?.readyState === WebSocket.OPEN) {
            const submissionData = {
                event: 'submit',
                data: {
                    answer,
                    index: quizZoneData.quizProgress?.currentQuiz.currentIndex,
                    submittedAt: Date.now(),
                },
            };
            const currentQuiz = quizZoneData.quizProgress?.currentQuiz;

            if (!currentQuiz) {
                console.error('현재 퀴즈 정보가 없습니다.');
                return;
            }

            ws.send(JSON.stringify(submissionData));

            // 제출 결과 상태 업데이트 및 COMPLETED로 전환
            updateStageData('quizProgress', {
                currentQuiz: {
                    ...currentQuiz, // 기존 필수 필드들을 모두 유지
                    question: currentQuiz.question, // 필수 필드 명시적 포함
                    timeLimit: currentQuiz.timeLimit, // 필수 필드 명시적 포함
                    stage: currentQuiz.stage, // 필수 필드 명시적 포함
                    currentIndex: currentQuiz.currentIndex, // 필수 필드 명시적 포함
                    submissionResult: {
                        submitted: true,
                        answer,
                    },
                },
            });

            handleQuizCycle('COMPLETED');
        }
    };

    const renderLobby = () => (
        <>
            {quizZoneData.Lobby && (
                <QuizZoneLobby
                    quizZoneData={quizZoneData}
                    pinNumber={pinNumber}
                    startQuiz={handleStartQuiz}
                />
            )}
        </>
    );

    const renderQuizProgress = () => {
        const currentQuiz = quizZoneData.quizProgress?.currentQuiz;
        //시간 지나면 다음 퀴즈로 넘어가는 로직 추가

        const timeOutHandler = () => {
            if (!currentQuiz) {
                console.error('현재 퀴즈 정보가 없습니다.');
                return;
            }
            updateStageData('quizProgress', {
                currentQuiz: {
                    ...currentQuiz, // 기존 필수 필드들을 모두 유지
                    question: currentQuiz.question, // 필수 필드 명시적 포함
                    timeLimit: currentQuiz.timeLimit, // 필수 필드 명시적 포함
                    stage: currentQuiz.stage, // 필수 필드 명시적 포함
                    currentIndex: currentQuiz.currentIndex, // 필수 필드 명시적 포함
                    submissionResult: {
                        submitted: true,
                        answer: undefined,
                    },
                },
            });
            handleQuizCycle('COMPLETED');
        };

        if (solveStage === 'WAITING') {
            return <QuizWaiting prepareTime={prepareTime} />;
        }

        if (solveStage === 'IN_PROGRESS' && currentQuiz) {
            return (
                <QuizInProgress
                    solutionTime={solutionTime}
                    currentQuiz={currentQuiz}
                    submitAnswer={handleSubmitAnswer}
                    timeOutHandler={timeOutHandler}
                />
            );
        }

        if (solveStage === 'COMPLETED') {
            return <QuizCompleted isLastQuiz={isLastQuiz} />;
        }

        return null;
    };

    const renderResult = () => (
        <>{quizZoneData.result && <QuizZoneResult quizZoneData={quizZoneData} />}</>
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
