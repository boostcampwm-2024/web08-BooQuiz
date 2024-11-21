import { useReducer } from 'react';
import useWebSocket from '@/hook/useWebSocket.tsx';
import {
    CurrentQuiz,
    Player,
    QuizZone,
    QuizZoneLobbyState,
    QuizZoneResultState,
} from '@/types/quizZone.types.ts';

export type QuizZoneAction =
    | { type: 'init'; payload: QuizZoneLobbyState }
    | { type: 'join'; payload: { players: Player[] } }
    | { type: 'start'; payload: undefined }
    | { type: 'submit'; payload: undefined }
    | { type: 'nextQuiz'; payload: CurrentQuiz }
    | { type: 'playQuiz'; payload: undefined }
    | { type: 'quizTimeout'; payload: undefined }
    | { type: 'finish'; payload: undefined }
    | { type: 'summary'; payload: QuizZoneResultState };

type Reducer<S, A> = (state: S, action: A) => S;

const quizZoneReducer: Reducer<QuizZone, QuizZoneAction> = (state, action) => {
    const { type, payload } = action;

    switch (type) {
        case 'init':
            return {
                ...state,
                stage: payload.stage,
                title: payload.title,
                description: payload.description,
                quizCount: payload.quizCount,
                hostId: payload.hostId,
                players: [],
            };
        case 'join':
            return { ...state, players: payload.players };
        case 'start':
            return {
                ...state,
                stage: 'LOBBY',
            };
        case 'submit':
            return {
                ...state,
                state: 'IN_PROGRESS',
                playerState: 'SUBMIT',
            };
        case 'nextQuiz':
            return {
                ...state,
                stage: 'IN_PROGRESS',
                currentPlayer: {
                    ...state.currentPlayer,
                    state: 'WAIT',
                },
                currentQuiz: {
                    ...state.currentQuiz,
                    question: payload.question,
                    currentIndex: payload.currentIndex,
                    playTime: payload.playTime,
                    startTime: payload.startTime,
                    deadlineTime: payload.deadlineTime,
                    type: 'SHORT',
                },
            };
        case 'playQuiz':
            return {
                ...state,
                stage: 'IN_PROGRESS',
                currentPlayer: {
                    ...state.currentPlayer,
                    state: 'PLAY',
                },
            };
        case 'quizTimeout':
            return {
                ...state,
                state: 'IN_PROGRESS',
                playerState: 'WAIT',
            };
        case 'finish':
            return {
                ...state,
                stage: 'RESULT',
            };
        case 'summary':
            return {
                ...state,
                stage: 'RESULT',
                score: payload.score,
                submits: payload.submits,
                quizzes: payload.quizzes,
            };
        default:
            return state;
    }
};

/**
 * @description 다중 사용자 퀴즈 게임 환경에서 퀴즈존 상태와 상호작용을 관리하는 커스텀 훅입니다.
 *
 * @example
 * ```tsx
 * const QuizComponent = () => {
 *   const {
 *     quizZoneState,
 *     initQuizZoneData,
 *     submitQuiz,
 *     startQuiz,
 *     playQuiz
 *   } = useQuizZone();
 *
 *   // 퀴즈 초기화
 *   useEffect(() => {
 *     initQuizZoneData(initialData);
 *   }, []);
 *
 *   // 답안 제출
 *   const handleSubmit = (answer: string) => {
 *     submitQuiz(answer);
 *   };
 * ```
 *
 * @returns {Object} 퀴즈존 상태와 제어 함수들을 포함하는 객체
 * @returns {QuizZone} .quizZoneState - 현재 퀴즈존의 상태
 * @returns {Function} .initQuizZoneData - 초기 데이터로 퀴즈존을 초기화하는 함수
 * @returns {Function} .submitQuiz - 현재 퀴즈에 대한 답안을 제출하는 함수
 * @returns {Function} .startQuiz - 퀴즈 세션을 시작하는 함수
 * @returns {Function} .playQuiz - 퀴즈 상태를 플레이 모드로 변경하는 함수
 */

const useQuizZone = () => {
    const initialQuizZoneState: QuizZone = {
        stage: 'LOBBY',
        currentPlayer: {
            id: '',
            nickname: '',
        },
        title: '',
        description: '',
        hostId: '',
        quizCount: 0,
        players: [],
        score: 0,
        submits: [],
        quizzes: [],
    };
    const [quizZoneState, dispatch] = useReducer(quizZoneReducer, initialQuizZoneState);

    const messageHandler = (event: MessageEvent) => {
        const { event: QuizZoneEvent, data } = JSON.parse(event.data);

        dispatch({
            type: QuizZoneEvent,
            payload: data,
        });
        console.log('이벤트 실행:', quizZoneState);
    };
    const wsUrl = import.meta.env.VITE_WS_URL;

    const { sendMessage, closeConnection } = useWebSocket(`${wsUrl}/play`, messageHandler);

    //initialize QuizZOne
    const initQuizZoneData = (initialData: any) => {
        if (initialData.stage === 'WAITING') {
            dispatch({
                type: 'init',
                payload: { ...initialData, stage: 'IN_PROGRESS', playerState: 'WAIT' },
            });
        } else {
            dispatch({ type: 'init', payload: initialData });
        }
    };

    //퀴즈 시작 함수
    const startQuiz = () => {
        const message = JSON.stringify({ event: 'start' });
        sendMessage(message);
    };

    // 퀴즈 제출 함수
    const submitQuiz = (answer: string) => {
        const message = JSON.stringify({
            event: 'submit',
            data: {
                answer,
                index: quizZoneState.currentQuiz?.currentIndex,
                submittedAt: Date.now(),
            },
        });
        sendMessage(message);
    };

    const playQuiz = () => {
        dispatch({ type: 'playQuiz', payload: undefined });
    };

    return {
        quizZoneState,
        initQuizZoneData,
        submitQuiz,
        startQuiz,
        playQuiz,
        closeConnection,
    };
};

export default useQuizZone;
