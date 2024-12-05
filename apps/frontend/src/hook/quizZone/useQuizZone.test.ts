import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QuizZone } from '@/types/quizZone.types';
import useQuizZone from './useQuizZone';

// useWebSocket 모킹
vi.mock('@/hook/useWebSocket', () => ({
    default: () => ({
        beginConnection: vi.fn(),
        sendMessage: vi.fn(),
        closeConnection: vi.fn(),
        messageHandler: vi.fn(),
    }),
}));

// env 모킹
vi.mock('@/utils/atob', () => ({
    default: vi.fn((str) => str),
}));

describe('useQuizZone', () => {
    const mockQuizZoneId = 'test-quiz-zone-id';

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('초기 상태가 올바르게 설정되어야 합니다', () => {
        const { result } = renderHook(() => useQuizZone(mockQuizZoneId));

        expect(result.current.quizZoneState).toEqual({
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
        });
    });

    it('playQuiz 액션이 상태를 올바르게 업데이트해야 합니다', () => {
        const { result } = renderHook(() => useQuizZone(mockQuizZoneId));

        act(() => {
            result.current.playQuiz();
        });

        expect(result.current.quizZoneState.stage).toBe('IN_PROGRESS');
        expect(result.current.quizZoneState.currentPlayer.state).toBe('PLAY');
    });

    it('init 액션이 상태를 올바르게 업데이트해야 합니다', () => {
        const { result } = renderHook(() => useQuizZone(mockQuizZoneId));

        const mockQuizZone: Partial<QuizZone> = {
            stage: 'LOBBY',
            currentPlayer: {
                id: 'player1',
                nickname: 'Player 1',
                state: 'WAIT',
            },
            title: 'Test Quiz',
            description: 'Test Description',
            hostId: 'host1',
            quizCount: 5,
            serverTime: Date.now(),
        };

        act(() => {
            result.current.initQuizZoneData(mockQuizZone as QuizZone, Date.now());
        });

        expect(result.current.quizZoneState.title).toBe('Test Quiz');
        expect(result.current.quizZoneState.currentPlayer.id).toBe('player1');
        expect(result.current.quizZoneState.quizCount).toBe(5);
    });

    describe('state transitions', () => {
        it('LOBBY에서 IN_PROGRESS로 상태 전환이 올바르게 되어야 합니다', () => {
            const { result } = renderHook(() => useQuizZone(mockQuizZoneId));

            expect(result.current.quizZoneState.stage).toBe('LOBBY');

            act(() => {
                result.current.playQuiz();
            });

            expect(result.current.quizZoneState.stage).toBe('IN_PROGRESS');
        });
    });
});
