import { useState } from 'react';
import { useTimer } from './useTimer';

// 스테이지 타입
export type QuizZone = 'LOBBY' | 'QUIZ_PROGRESS' | 'RESULT';
// export type QuizZone = 'LOBBY' | 'IN_PROGRESS' | 'RESULT'

export type SolveStage = 'WAITING' | 'IN_PROGRESS' | 'COMPLETED';
// export type SolveStage = 'WAIT' | 'PLAY' | SUBMIT'

// 퀴즈 타입
export type QuizType = 'MULTIPLE_CHOICE' | 'SHORT_ANSWER';

// 퀴즈 진행 상태
export interface QuizProgress {
    currentQuizIndex: number; // 현재 퀴즈 인덱스
    totalQuizzes: number; // 전체 퀴즈 개수
    timeLimit: number; // 제한 시간
}

// 기본 퀴즈 구조
export interface Quiz {
    question: string; // 문제
    type: QuizType; // 퀴즈 유형 (객관식/주관식)
    options?: string[]; // 객관식 보기 (객관식일 때만 사용)
    timeLimit: number; // 문제 제한 시간
}

// 답안 제출 결과
export interface SubmissionResult {
    submitted: boolean; // 제출 여부
    answer?: string; // 제출한 답안
    timeExpired?: boolean; // 시간 초과 여부
}

// 대기실 데이터
export interface LobbyData {
    participants: number; // 참가자 수
    totalQuizCount: number; // 전체 퀴즈 수
    isHost: boolean; // 방장 여부
    quizTitle: string; // 퀴즈 제목
    description?: string; // 퀴즈 설명
}

// 현재 진행중인 퀴즈 데이터
export interface CurrentQuizData extends Quiz {
    submissionResult?: SubmissionResult; // 제출 결과
    deadlineTime?: number; // 마감 시간
    startTime?: number; // 시작 시간
    stage: string; // 현재 단계
    currentIndex: number; // 현재 인덱스
}

// 퀴즈 진행 데이터
export interface QuizProgressData {
    currentQuiz: CurrentQuizData; // 현재 퀴즈 정보
    progress: QuizProgress; // 진행 상황
}

// 결과 데이터
export interface ResultData {
    score: number; // 점수
    quizzes: Quiz[]; // 전체 퀴즈 목록
    submits: SubmissionResult[]; // 제출 결과 목록
}

// 전체 퀴즈존 데이터
export interface QuizZoneData {
    Lobby: LobbyData;
    quizProgress: QuizProgressData;
    result: ResultData;
}

// 설정 타입
export interface QuizStageConfig {
    totalQuizzes: number; // 전체 퀴즈 수
    onMainStageChange?: (stage: QuizZone) => void; // 메인 스테이지 변경 콜백
    onSubStageChange?: (stage: SolveStage) => void; // 서브 스테이지 변경 콜백
    onQuizComplete?: () => void; // 퀴즈 완료 콜백
    onError?: (error: Error) => void; // 에러 처리 콜백
}

// 타이머 설정
export interface TimerConfig {
    prepareTime: number; // 준비 시간
    solutionTime: number; // 풀이 시간
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
