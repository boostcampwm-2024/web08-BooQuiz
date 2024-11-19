import { useEffect, useReducer, useState } from 'react';
import useWebSocket from '@/hook/useWebSocket.tsx';
import { useNavigate } from 'react-router-dom';
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

const quizZoneReducer = (state: QuizZone, action: QuizZoneAction) => {
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
            };
        case 'join':
            return { ...state, players: payload.players };
        case 'start':
            return {
                ...state,
                stage: 'IN_PROGRESS',
                playerState: 'WAIT',
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
                playerState: 'WAIT',
                question: payload.question,
                currentIndex: payload.currentIndex,
                playTime: payload.playTime,
                startTime: payload.startTime,
                deadlineTime: payload.deadlineTime,
            };
        case 'playQuiz':
            return {
                ...state,
                stage: 'IN_PROGRESS',
                playerState: 'PLAY',
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
            throw new Error(`Unhandled stage: ${action}`);
    }
};

const fetchQuizZoneData = async (quizZoneId: string) => {
    const response = await fetch(`/api/quiz-zone/${quizZoneId}`, { method: 'GET' });

    if (!response.ok) {
        throw new Error('퀴즈존을 찾을 수 없습니다.');
    }

    return response.json();
};

const useQuizZone = (url: string) => {
    const quizZone: QuizZone = {
        stage: 'LOBBY',
        currentPlayer: {
            id: '',
            nickname: '',
        },
        title: '',
        description: '',
        hostId: '',
        quizCount: 0,
    };
    const [quizZoneState, dispatch] = useReducer<QuizZone, QuizZoneAction>(
        quizZoneReducer,
        quizZone,
    );
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const initQuizZone = async () => {
        try {
            const quizZoneInitialData = await fetchQuizZoneData(url);
            dispatch(quizZoneInitialData);
            setIsLoading(false);
        } catch (e) {
            navigate(-1);
        }
    };

    useEffect(() => {
        initQuizZone();
    }, []);

    const messageHandler = (event: MessageEvent) => {
        const { stage } = JSON.parse(event.data);

        dispatch({ type: stage, data: stage });
    };

    const { sendMessage } = useWebSocket(url, messageHandler);

    // 퀴즈 제출 함수
    const submitQuiz = (answer: string) => {
        const message = JSON.stringify({ type: 'submit-answer', answer });
        sendMessage(message);
    };

    return {
        ...state,
        submitQuiz,
    };
};

export default useQuizZone;
