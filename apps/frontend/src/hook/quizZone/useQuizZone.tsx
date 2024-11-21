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

function atob(encodedString: string): string {
    try {
        // 브라우저 native atob 사용
        return decodeURIComponent(escape(window.atob(encodedString)));
    } catch (error) {
        console.error('Base64 디코딩 실패:', error);
        return encodedString; // 실패 시 원본 문자열 반환
    }
}
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
                currentPlayer: payload.currentPlayer,
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
                currentPlayer: {
                    ...state.currentPlayer,
                    state: 'SUBMIT',
                },
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
                    question: atob(payload.question),
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
                currentPlayer: {
                    ...state.currentPlayer,
                    state: 'WAIT',
                },
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
    };
    const wsUrl = import.meta.env.VITE_WS_URL;

    const { sendMessage, closeConnection } = useWebSocket(`${wsUrl}/play`, messageHandler);

    //initialize QuizZOne
    const initQuizZoneData = (initialData: any) => {
        console.log('initialData', initialData);
        dispatch({ type: 'init', payload: initialData });
    };

    //퀴즈 시작 함수
    const startQuiz = () => {
        const message = JSON.stringify({ event: 'start' });
        sendMessage(message);
    };

    //퀴즈존 나가기 함수
    const exitQuiz = () => {
        const message = JSON.stringify({ event: 'leave' });
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

    const joinQuizZone = ({ quizZoneId }: any) => {
        console.log('joinQuizZone', quizZoneId);
        const message = JSON.stringify({ event: 'join', data: { quizZoneId } });
        sendMessage(message);
    };

    return {
        quizZoneState,
        initQuizZoneData,
        submitQuiz,
        startQuiz,
        playQuiz,
        closeConnection,
        exitQuiz,
        joinQuizZone,
    };
};

export default useQuizZone;
