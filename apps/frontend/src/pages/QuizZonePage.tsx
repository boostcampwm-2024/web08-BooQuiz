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
        setTotalQuizzes,
        setSolutionTime,
        setPrepareTime,
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
                const response = await fetch(`http://localhost:3000/quiz-zone/${pinNumber}`, {
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

            // 퀴즈 진행 데이터 설정
            // updateStageData('quizProgress', {
            //     currentQuiz: {
            //         question: '첫 번째 문제',
            //         timeLimit: 10,
            //         type: 'SHORT_ANSWER',
            //     },
            // });

            // 결과 페이지 초기 설정
            updateStageData('result', {
                score: 0,
                rank: 0,
                totalParticipants: initialData.participants?.length,
                correctAnswers: 0,
            });
        }
    }, [initialData]);

    //WebSocket 연결
    useEffect(() => {
        if (!initialData) return;

        const ws = new WebSocket('ws://localhost:3000/play');
        setWs(ws);

        ws.onopen = () => {
            console.log('연결됨');
        };

        // 서버로부터 메시지 수신
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('서버로부터 받은 데이터:', data);
            // 서버로부터 받은 데이터에 따라 처리
            // event를 기준으로 객체 형태 데이터가 서버로부터 전달됨
            switch (data.event) {
                case 'start':
                    console.log(data.data);
                    break;
                case 'nextQuiz':
                    console.log('nextQuiz');

                    //lexically scoped 하는 이유?
                    //quizProgress를 업데이트 하기 위해서
                    {
                        const { question, currentIndex, deadlineTime, playTime, startTime, stage } =
                            data.data;
                        // 퀴즈 진행 데이터 설정
                        updateStageData('quizProgress', {
                            currentQuiz: {
                                question: question,
                                timeLimit: playTime,
                                type: 'SHORT_ANSWER',
                                deadlineTime: deadlineTime,
                                startTime: startTime,
                                stage: stage,
                                currentIndex: currentIndex,
                            },
                        });
                        //playTime >> ms 기준이라 초로 변환
                        setSolutionTime(playTime / 1000);
                        console.log(data.data);
                    }
                    break;
                case 'quizTimeout':
                    {
                        const { stage } = data.data;
                        // 강제로 COMPLETED 상태로 전환하여 다음 대기 상태로 넘어가게 함
                        updateStageData('quizProgress', {
                            currentQuiz: {
                                ...quizZoneData.quizProgress?.currentQuiz,
                                stage: stage,
                                submissionResult: { submitted: false, timeExpired: true },
                            },
                        });
                        handleQuizCycle('COMPLETED');
                    }
                    break;
                case 'finish':
                    console.log('finish');
                    break;
                case 'summary':
                    console.log('summary');
                    console.log(data.data);
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
