import { useReducer } from 'react';
import useWebSocket from '@/hook/useWebSocket.tsx';
import {
    ChatMessage,
    InitQuizZoneResponse,
    NextQuizResponse,
    Player,
    QuizZone,
    QuizZoneResultState,
    SomeoneSubmitResponse,
    SubmitResponse,
} from '@/types/quizZone.types.ts';
import atob from '@/utils/atob';

export type QuizZoneAction =
    | { type: 'init'; payload: InitQuizZoneResponse }
    | { type: 'join'; payload: Player[] }
    | { type: 'someone_join'; payload: Player }
    | { type: 'someone_leave'; payload: string }
    | { type: 'start'; payload: undefined }
    | { type: 'submit'; payload: SubmitResponse }
    | { type: 'someone_submit'; payload: SomeoneSubmitResponse }
    | { type: 'nextQuiz'; payload: NextQuizResponse }
    | { type: 'playQuiz'; payload: undefined }
    | { type: 'quizTimeout'; payload: undefined }
    | { type: 'finish'; payload: undefined }
    | { type: 'summary'; payload: QuizZoneResultState }
    | { type: 'chat'; payload: ChatMessage }
    | { type: 'leave'; payload: undefined };

export type chatAction = {
    type: 'chat';
    payload: ChatMessage;
};

type Reducer<S, A> = (state: S, action: A) => S;

const quizZoneReducer: Reducer<QuizZone, QuizZoneAction> = (state, action) => {
    const { type, payload } = action;

    switch (type) {
        case 'init':
            const { quizZone, now } = payload;
            const receiveTime = new Date().getTime();
            return {
                ...state,
                ...quizZone,
                currentQuiz:
                    quizZone.currentQuiz !== undefined
                        ? {
                              ...quizZone.currentQuiz,
                              question: atob(quizZone.currentQuiz?.question ?? ''),
                          }
                        : undefined,
                offset: quizZone.serverTime - (now + receiveTime) / 2,
                players: [],
            };
        case 'join':
            return { ...state, players: payload };
        case 'someone_join':
            const isPlayerExist = state.players?.some((player) => player.id === payload.id);
            if (isPlayerExist) {
                return state; // 이미 존재하는 플레이어라면 상태 변경 없음
            }
            return { ...state, players: [...(state.players ?? []), payload] };
        case 'someone_leave':
            return {
                ...state,
                players: state.players?.filter((player) => player.id !== payload) ?? [],
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
                currentQuizResult: {
                    ...payload,
                    fastestPlayers: payload.fastestPlayerIds
                        .map((id) => state.players?.find((p) => p.id === id))
                        .filter((p) => !!p),
                },
            };
        case 'someone_submit':
            const { clientId, submittedCount } = payload;
            const player = state.players?.find((p) => p.id === clientId);
            const fastestPlayers = state.currentQuizResult?.fastestPlayers ?? [];

            return {
                ...state,
                currentQuizResult: {
                    ...state.currentQuizResult!,
                    fastestPlayers: [...fastestPlayers, player].slice(0, 3).filter((p) => !!p),
                    submittedCount,
                },
            };
        case 'nextQuiz':
            const { nextQuiz } = payload;

            return {
                ...state,
                stage: 'IN_PROGRESS',
                currentPlayer: {
                    ...state.currentPlayer,
                    state: 'WAIT',
                },
                currentQuiz: {
                    ...state.currentQuiz,
                    ...nextQuiz,
                    question: atob(nextQuiz.question),
                    startTime: nextQuiz.startTime - state.offset,
                    deadlineTime: nextQuiz.deadlineTime - state.offset,
                    quizType: 'SHORT',
                },
                currentQuizResult: {
                    ...state.currentQuizResult,
                    ...payload.currentQuizResult,
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
                ...payload,
                stage: 'RESULT',
                endSocketTime: payload.endSocketTime - state.offset,
            };
        case 'chat':
            return {
                ...state,
                chatMessages: [...(state.chatMessages || []), payload],
            };
        case 'leave':
            return {
                isQuizZoneEnd: true,
                ...state,
            };

        default:
            return state;
    }
};

export const chatMessagesReducer: Reducer<ChatMessage[], chatAction> = (chatMessages, action) => {
    const { type, payload } = action;

    switch (type) {
        case 'chat':
            return [...chatMessages, payload];
        default:
            return chatMessages;
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

const useQuizZone = (
    quizZoneId: string,
    handleReconnect?: () => void,
    handleClose?: () => void,
) => {
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
        chatMessages: [],
        maxPlayers: 0,
        offset: 0,
        serverTime: 0,
    };

    const [quizZoneState, dispatch] = useReducer(quizZoneReducer, initialQuizZoneState);

    const messageHandler = (event: MessageEvent) => {
        const { event: QuizZoneEvent, data } = JSON.parse(event.data);

        dispatch({
            type: QuizZoneEvent,
            payload: data,
        });
    };

    const handleFinish = () => {
        dispatch({ type: 'leave', payload: undefined });
        handleClose?.();
    };

    const wsUrl = `${import.meta.env.VITE_WS_URL}/play`;
    const { beginConnection, sendMessage, closeConnection } = useWebSocket({
        wsUrl,
        messageHandler,
        handleFinish,
        handleReconnect,
    });

    //initialize QuizZOne
    const initQuizZoneData = async (quizZone: QuizZone, now: number) => {
        dispatch({ type: 'init', payload: { quizZone, now } });
        beginConnection();
        joinQuizZone({ quizZoneId });
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

    const sendChat = (chatMessage: any) => {
        sendMessage(JSON.stringify({ event: 'chat', data: chatMessage }));
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
        sendChat,
    };
};

export default useQuizZone;
