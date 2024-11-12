import { useEffect, useState } from 'react';
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
    const [totalQuizCount, setTotalQuizCount] = useState(0);
    const handleGetQuizZoneData = () => {
        fetch(`http://localhost:3000/quiz-zone/${id}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch quiz waiting room');
                }
            })
            .then((data) => {
                console.log('data:', data);

                setTotalQuizCount(data.quizCount);
                console.log('totalQuizCount:', totalQuizCount);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };
    const [ws, setWs] = useState<WebSocket>();
    //임시로 렌더링 시에 요청 하고 totalCount 적용
    //로직 수정 필요
    useEffect(() => {
        handleGetQuizZoneData();
        //소켓 연결
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
            }
        };

        ws.onclose = () => {
            console.log('시스템', '서버와 연결이 끊어졌습니다.');
        };
    }, [totalQuizCount]);

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
        totalQuizzes: totalQuizCount,
        onQuizComplete: () => console.log('퀴즈 완료!'),
        onError: (error) => console.error('에러 발생:', error),
    });

    const id = 1;

    useEffect(() => {
        const Data = handleGetQuizZoneData();
        console.log(Data);
        // 로비 초기 데이터 설정
        updateStageData('Lobby', {
            participants: 1,
            isHost: true,
            totalQuizCount: totalQuizCount,
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
    }, [totalQuizCount]);

    const handleSocketQuizStart = () => {
        console.log(typeof ws);
        console.log(ws);
        ws.send(
            JSON.stringify({
                event: 'start',
            }),
        );
    };

    // 로비 화면 렌더링
    const renderLobby = () => (
        <>
            {quizZoneData.Lobby && (
                <QuizZoneLobby
                    quizZoneData={quizZoneData}
                    pinNumber={pinNumber}
                    startQuiz={() => {
                        startQuiz();
                        handleSocketQuizStart();
                    }}
                />
            )}
        </>
    );

    // 퀴즈 진행 화면 렌더링
    const renderQuizProgress = () => {
        const currentQuiz = quizZoneData.quizProgress?.currentQuiz;
        console.log(quizZoneData.quizProgress, currentQuiz);
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
