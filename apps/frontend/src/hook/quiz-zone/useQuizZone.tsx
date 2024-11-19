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
    const initQuizZoneData = (initialData): any => {
        dispatch({ type: 'init', payload: initialData });
    };

    //퀴즈 시작 함수
    const startQuiz = () => {
        const message = JSON.stringify({ event: 'start' });
        sendMessage(message);
    };

    // 퀴즈 제출 함수
    const submitQuiz = (answer: string) => {
        const message = JSON.stringify({ type: 'submit-answer', answer });
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
    };
};

export default useQuizZone;
