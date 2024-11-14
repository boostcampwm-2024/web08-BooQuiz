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
        totalQuizCount: number;
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
            deadlineTime?: number;
            startTime?: number;
            stage: string;
            currentIndex: number;
            type?: 'MULTIPLE_CHOICE' | 'SHORT_ANSWER';
        };
        progress: QuizProgress;
    };
    result: {
        score: number;
        quizzes: any;
        submits: any;
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
    const PREPARE_TIME = 2;
    const SOLVE_TIME = 2;

    const [quizZone, setQuizZone] = useState<QuizZone>('LOBBY');
    const [solveStage, setSolveStage] = useState<SolveStage>('WAITING');
    const [totalQuizzes, setTotalQuizzes] = useState(config.totalQuizzes);

    const [quizProgress, setQuizProgress] = useState<QuizProgress>({
        currentQuizIndex: 0,
        totalQuizzes: totalQuizzes,
        timeLimit: SOLVE_TIME,
    });

    const [quizZoneData, setQuizZoneData] = useState<Partial<QuizZoneData>>({});
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [prepareTime, setPrepareTime] = useState(PREPARE_TIME);
    const [solutionTime, setSolutionTime] = useState(SOLVE_TIME);

    const prepareTimer = useTimer({
        initialTime: prepareTime,
        onComplete: () => handleQuizCycle('IN_PROGRESS'),
    });

    const solutionTimer = useTimer({
        initialTime: solutionTime,
        onComplete: handleTimeExpired,
    });

    const handleSetTotalQuizzes = (newTotal: number) => {
        setTotalQuizzes(newTotal);
        setQuizProgress((prev) => ({
            ...prev,
            totalQuizzes: newTotal,
        }));
        updateStageData('Lobby', {
            totalQuizCount: newTotal,
        });
    };

    function updateStageData<K extends keyof QuizZoneData>(
        stageKey: K,
        data: Partial<QuizZoneData[K]>,
    ) {
        setQuizZoneData((prev) => ({
            ...prev,
            [stageKey]: { ...(prev[stageKey] || {}), ...data },
        }));
    }
    const setQuizZoneState = (newState: typeof quizZone) => {
        setQuizZone(newState);
    };

    function handleTimeExpired() {
        solutionTimer.stop();
        setIsTransitioning(true);

        try {
            const nextIndex = quizProgress.currentQuizIndex + 1;
            const isLastQuiz = nextIndex >= totalQuizzes;

            if (isLastQuiz) {
                setQuizZone('RESULT');
                config.onQuizComplete?.();
            } else {
                setQuizProgress((prev) => ({ ...prev, currentQuizIndex: nextIndex }));
                setSolveStage('WAITING');
                prepareTimer.start();
            }

            const currentQuiz = quizZoneData.quizProgress?.currentQuiz;

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
                    submissionResult: { submitted: false, timeExpired: true },
                },
            });
        } catch (err) {
            config.onError?.(err instanceof Error ? err : new Error('Unknown error'));
        } finally {
            setIsTransitioning(false);
        }
    }

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

    function handleQuizCycle(stage: SolveStage, data?: any) {
        setIsTransitioning(true);
        try {
            setSolveStage(stage);
            if (stage === 'WAITING') {
                // prepareTimer.start();
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
                // 타이머 정리
                solutionTimer.stop();
                prepareTimer.stop();

                // 데이터 업데이트가 있다면 반영
                if (data) {
                    updateStageData('quizProgress', data);
                }

                // 다음 퀴즈로 진행
                proceedToNextQuiz();
                return; // COMPLETED 처리 후 바로 리턴
            }
        } catch (err) {
            config.onError?.(err instanceof Error ? err : new Error('Unknown error'));
        } finally {
            setIsTransitioning(false);
        }
    }

    function proceedToNextQuiz() {
        const nextIndex = quizProgress.currentQuizIndex + 1;

        if (nextIndex >= totalQuizzes) {
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
                timeLimit: solutionTime,
                type: 'SHORT_ANSWER',
            },
            progress: {
                currentQuizIndex: 0,
                totalQuizzes: totalQuizzes,
                timeLimit: solutionTime,
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
        setPrepareTime,
        setSolutionTime,
        setQuizZone: setQuizZoneState,
        setTotalQuizzes: handleSetTotalQuizzes,
        startPrepareTimer: prepareTimer.start,
    };
};

export default useQuizZoneManager;
