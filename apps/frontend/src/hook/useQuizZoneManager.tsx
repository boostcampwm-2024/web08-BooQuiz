import { useState } from 'react';
import { useTimer } from './useTimer';

type QuizZone = 'LOBBY' | 'QUIZ_PROGRESS' | 'RESULT';
type SolveStage = 'WAITING' | 'IN_PROGRESS' | 'COMPLETED';

interface QuizProgress {
    currentQuizIndex: number;
    totalQuizzes: number;
    timeLimit: number;
}

interface QuizZoneData {
    Lobby: {
        participants: number;
        isHost: boolean;
        quizTitle: string;
        description?: string;
    };
    quizProgress: {
        currentQuiz: {
            question: string;
            options?: string[];
            timeLimit: number;
            submissionResult?: SubmissionResult;
            type?: 'MULTIPLE_CHOICE' | 'SHORT_ANSWER';
        };
        progress: QuizProgress;
    };
    result: {
        score: number;
        rank: number;
        totalParticipants: number;
        correctAnswers: number;
    };
}

interface SubmissionResult {
    submitted: boolean;
    answer?: string;
    timeExpired?: boolean;
}

interface QuizStageConfig {
    totalQuizzes: number;
    onMainStageChange?: (stage: QuizZone) => void;
    onSubStageChange?: (stage: SolveStage) => void;
    onQuizComplete?: () => void;
    onError?: (error: Error) => void;
}

export const useQuizZoneManager = (config: QuizStageConfig) => {
    //퀴즈 풀이 준비 시간
    const PREPARE_TIME = 2;
    //퀴즈 풀이 시간
    const SOLVE_TIME = 2;

    //퀴즈존 전체 진행 상태
    const [quizZone, setQuizZone] = useState<QuizZone>('LOBBY');
    // 퀴즈존 풀이 단계 상태
    const [solveStage, setSolveStage] = useState<SolveStage>('WAITING');

    //퀴즈 진행 상태
    const [quizProgress, setQuizProgress] = useState<QuizProgress>({
        currentQuizIndex: 0,
        totalQuizzes: config.totalQuizzes,
        timeLimit: SOLVE_TIME,
    });

    //퀴즈존 데이터
    const [quizZoneData, setQuizZoneData] = useState<Partial<QuizZoneData>>({});
    const [isTransitioning, setIsTransitioning] = useState(false);

    //퀴즈 풀이 준비 타이머
    const prepareTimer = useTimer({
        initialTime: PREPARE_TIME,
        onComplete: () => handleQuizCycle('IN_PROGRESS'),
    });

    //퀴즈 풀이 타이머
    const solutionTimer = useTimer({
        initialTime: SOLVE_TIME,
        onComplete: handleTimeExpired,
    });

    function updateStageData<K extends keyof QuizZoneData>(
        stageKey: K,
        data: Partial<QuizZoneData[K]>,
    ) {
        setQuizZoneData((prev) => ({
            ...prev,
            [stageKey]: { ...(prev[stageKey] || {}), ...data },
        }));
    }

    function handleTimeExpired() {
        // 타이머 즉시 중지
        solutionTimer.stop();

        // 상태 업데이트를 한 번에 처리
        setIsTransitioning(true);

        try {
            // 상태 업데이트를 일괄 처리
            const nextIndex = quizProgress.currentQuizIndex + 1;
            const isLastQuiz = nextIndex >= quizProgress.totalQuizzes;

            if (isLastQuiz) {
                // 마지막 문제인 경우 바로 결과 화면으로
                setQuizZone('RESULT');
                config.onQuizComplete?.();
            } else {
                // 다음 문제로 즉시 전환
                setQuizProgress((prev) => ({ ...prev, currentQuizIndex: nextIndex }));
                setSolveStage('WAITING');
                prepareTimer.start();
            }

            // 현재 문제의 제출 결과 업데이트
            updateStageData('quizProgress', {
                currentQuiz: {
                    ...quizZoneData.quizProgress?.currentQuiz,
                    submissionResult: { submitted: false, timeExpired: true },
                },
            });
        } catch (err) {
            config.onError?.(err instanceof Error ? err : new Error('Unknown error'));
        } finally {
            setIsTransitioning(false);
        }
    }

    //퀴즈존 상태 변경
    function changeMainStage(stage: QuizZone, data?: any) {
        setIsTransitioning(true);
        try {
            setQuizZone(stage);
            if (stage === 'QUIZ_PROGRESS') {
                setSolveStage('WAITING');
                prepareTimer.start();
                solutionTimer.stop();
                setQuizProgress((prev) => ({ ...prev, currentQuizIndex: 0 }));
            }

            if (data) {
                setQuizZoneData((prev) => ({
                    ...prev,
                    [stage === 'LOBBY'
                        ? 'Lobby'
                        : stage === 'QUIZ_PROGRESS'
                          ? 'quizProgress'
                          : 'result']: data,
                }));
            }

            config.onMainStageChange?.(stage);
        } catch (err) {
            config.onError?.(err instanceof Error ? err : new Error('Unknown error'));
        } finally {
            setIsTransitioning(false);
        }
    }

    //퀴즈 풀이 진행 단계 변경
    function handleQuizCycle(stage: SolveStage, data?: any) {
        setIsTransitioning(true);
        try {
            setSolveStage(stage);
            if (stage === 'WAITING') {
                prepareTimer.start();
                solutionTimer.stop();
            } else if (stage === 'IN_PROGRESS') {
                prepareTimer.stop();
                solutionTimer.start();
            }

            if (data) {
                updateStageData('quizProgress', data);
            }

            config.onSubStageChange?.(stage);

            if (stage === 'COMPLETED') {
                solutionTimer.stop();
                // setTimeout 제거하고 즉시 호출
                proceedToNextQuiz();
            }
        } catch (err) {
            config.onError?.(err instanceof Error ? err : new Error('Unknown error'));
        } finally {
            setIsTransitioning(false);
        }
    }

    function proceedToNextQuiz() {
        const nextIndex = quizProgress.currentQuizIndex + 1;

        if (nextIndex >= quizProgress.totalQuizzes) {
            changeMainStage('RESULT');
            config.onQuizComplete?.();
        } else {
            setQuizProgress((prev) => ({ ...prev, currentQuizIndex: nextIndex }));
            setSolveStage('WAITING');
            prepareTimer.start();
            solutionTimer.stop();
        }
    }

    function startQuiz() {
        const mockQuizData = {
            currentQuiz: {
                question: '첫 번째 문제',
                timeLimit: SOLVE_TIME,
                type: 'SHORT_ANSWER',
            },
            progress: {
                currentQuizIndex: 0,
                totalQuizzes: config.totalQuizzes,
                timeLimit: SOLVE_TIME,
            },
        };

        changeMainStage('QUIZ_PROGRESS', mockQuizData);
    }

    function submitAnswer(answer: string) {
        handleQuizCycle('COMPLETED', {
            currentQuiz: {
                ...quizZoneData.quizProgress?.currentQuiz,
                submissionResult: { submitted: true, answer },
            },
        });
    }

    return {
        quizZone,
        solveStage,
        quizProgress,
        quizZoneData,
        isTransitioning,
        prepareTime: prepareTimer.time,
        solutionTime: solutionTimer.time,
        changeMainStage,
        handleQuizCycle,
        startQuiz,
        submitAnswer,
        updateStageData,
    };
};

export default useQuizZoneManager;
