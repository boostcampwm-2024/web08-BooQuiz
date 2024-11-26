import { useReducer } from 'react';
import useWebSocket from '@/hook/useWebSocket.tsx';
import { CurrentQuiz, Player, QuizZone, QuizZoneResultState } from '@/types/quizZone.types.ts';
import atob from '@/utils/atob';

export type QuizZoneAction =
    | { type: 'init'; payload: QuizZone }
    | { type: 'join'; payload: { players: Player[] } }
    | { type: 'start'; payload: undefined }
    | { type: 'submit'; payload: undefined }
    | { type: 'nextQuiz'; payload: CurrentQuiz }
    | { type: 'playQuiz'; payload: undefined }
    | { type: 'quizTimeout'; payload: undefined }
    | { type: 'finish'; payload: undefined }
    | { type: 'summary'; payload: QuizZoneResultState }
    | { type: 'someone_join'; payload: Player }
    | { type: 'someone_leave'; payload: string };

type Reducer<S, A> = (state: S, action: A) => S;

const quizZoneReducer: Reducer<QuizZone, QuizZoneAction> = (state, action) => {
    const { type, payload } = action;
    let updatedPlayers = null;
    switch (type) {
        case 'init':
            const existingPlayers = payload.players || [];
            const currentPlayer = payload.currentPlayer;

            // currentPlayer가 이미 players 배열에 있는지 확인
            const isCurrentPlayerInPlayers = existingPlayers.some(
                (player) => player.id === currentPlayer.id,
            );
            // players 배열 구성
            updatedPlayers = isCurrentPlayerInPlayers
                ? existingPlayers
                : [...existingPlayers, currentPlayer];
            return {
                ...state,
                stage: payload.stage,
                title: payload.title,
                description: payload.description,
                quizCount: payload.quizCount,
                hostId: payload.hostId,
                currentPlayer: payload.currentPlayer,
                currentQuiz: payload.currentQuiz,
                players: updatedPlayers,
            };
        case 'join':
            return {
                ...state,
                players: Array.isArray(payload) ? [...payload, state.currentPlayer] : state.players,
            };
        case 'someone_join':
            // 이미 존재하는 플레이어인지 확인
            const isPlayerExist = state.players?.some((player) => player.id === payload.id);
            if (isPlayerExist) {
                return state; // 이미 존재하는 플레이어라면 상태 변경 없음
            }

            // 새로운 플레이어 추가
            return {
                ...state,
                players: [...(state.players || []), payload],
            };

        case 'someone_leave':
            // 플레이어 제거 시 배열이 undefined가 되지 않도록 보호
            updatedPlayers = state.players?.filter((player) => player.id !== payload) ?? [];

            return {
                ...state,
                players: updatedPlayers,
            };
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
                isLastQuiz: true,
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
        switch (QuizZoneEvent) {
            case 'someone_join':
                dispatch({
                    type: QuizZoneEvent,
                    payload: {
                        id: data.id,
                        nickname: data.nickname,
                    },
                });
                break;

            default:
                dispatch({
                    type: QuizZoneEvent,
                    payload: data,
                });
        }
    };
    const wsUrl = import.meta.env.VITE_WS_URL;

    const { sendMessage, closeConnection } = useWebSocket(`${wsUrl}/play`, messageHandler);

    //initialize QuizZOne
    const initQuizZoneData = (initialData: any) => {
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
