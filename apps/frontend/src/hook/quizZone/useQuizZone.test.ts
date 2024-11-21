import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import useQuizZone from './useQuizZone';
import useWebSocket from '@/hook/useWebSocket';

// Mock 함수들을 미리 생성
const mockSendMessage = vi.fn();
const mockCloseConnection = vi.fn();
let messageHandler: (event: MessageEvent) => void;

// useWebSocket 모듈 전체를 모킹
vi.mock('@/hook/useWebSocket', () => ({
    default: (_url: string, handler: (event: MessageEvent) => void) => {
        messageHandler = handler;
        return {
            sendMessage: mockSendMessage,
            closeConnection: mockCloseConnection,
        };
    },
}));

describe('useQuizZone', () => {
    // 각 테스트 전에 실행
    beforeEach(() => {
        mockSendMessage.mockClear();
        mockCloseConnection.mockClear();
    });

    // 각 테스트 후에 실행
    afterEach(() => {
        vi.clearAllMocks();
    });

    // 초기 상태 테스트
    it('초기 상태가 올바르게 설정되어야 한다', () => {
        const { result } = renderHook(() => useQuizZone());

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
        });
    });

    // 퀴즈존 초기화 테스트
    it('제공된 데이터로 퀴즈존이 올바르게 초기화되어야 한다', () => {
        const { result } = renderHook(() => useQuizZone());
        const initialData = {
            stage: 'LOBBY',
            title: '테스트 퀴즈',
            description: '테스트 설명',
            quizCount: 5,
            hostId: 'host123',
            players: [],
        };

        act(() => {
            result.current.initQuizZoneData(initialData);
        });

        expect(result.current.quizZoneState).toMatchObject(initialData);
    });

    // 퀴즈 제출 테스트
    it('퀴즈 답안 제출 시 올바른 메시지가 전송되어야 한다', () => {
        const { result } = renderHook(() => useQuizZone());

        // Mock Date.now()
        const mockNow = 1234567890;
        vi.spyOn(Date, 'now').mockImplementation(() => mockNow);

        // 답안 제출
        act(() => {
            result.current.submitQuiz('테스트 답안');
        });

        // 전송된 메시지 검증
        expect(mockSendMessage).toHaveBeenCalledWith(
            JSON.stringify({
                event: 'submit',
                data: {
                    answer: '테스트 답안',
                    submittedAt: mockNow,
                },
            }),
        );
    });

    // 퀴즈 시작 테스트
    it('퀴즈 시작 시 start 이벤트가 전송되어야 한다', () => {
        const { result } = renderHook(() => useQuizZone());

        act(() => {
            result.current.startQuiz();
        });

        expect(mockSendMessage).toHaveBeenCalledWith(JSON.stringify({ event: 'start' }));
    });

    // WebSocket 메시지 처리 테스트
    it('join 이벤트 수신 시 players 상태가 올바르게 업데이트되어야 한다', () => {
        const { result } = renderHook(() => useQuizZone());

        // join 이벤트 시뮬레이션
        act(() => {
            // messageHandler가 정의되어 있어야 함
            if (!messageHandler) {
                throw new Error('메시지 핸들러가 정의되지 않았습니다');
            }

            messageHandler(
                new MessageEvent('message', {
                    data: JSON.stringify({
                        event: 'join',
                        data: {
                            players: [{ id: 'player1', nickname: '참가자 1' }],
                        },
                    }),
                }),
            );
        });

        // 상태 업데이트 확인
        expect(result.current.quizZoneState.players).toEqual([
            { id: 'player1', nickname: '참가자 1' },
        ]);
    });

    // playQuiz 테스트
    it('퀴즈 플레이 시 상태가 올바르게 업데이트되어야 한다', () => {
        const { result } = renderHook(() => useQuizZone());

        act(() => {
            result.current.playQuiz();
        });

        expect(result.current.quizZoneState.stage).toBe('IN_PROGRESS');
        expect(result.current.quizZoneState.currentPlayer?.state).toBe('PLAY');
    });

    // 연결 종료 테스트
    it('WebSocket 연결이 올바르게 종료되어야 한다', () => {
        const { result } = renderHook(() => useQuizZone());

        act(() => {
            result.current.closeConnection();
        });

        expect(mockCloseConnection).toHaveBeenCalled();
    });

    // 타임아웃 이벤트 테스트
    it('타임아웃 이벤트 수신 시 상태가 올바르게 업데이트되어야 한다', () => {
        const { result } = renderHook(() => useQuizZone());

        act(() => {
            if (!messageHandler) {
                throw new Error('메시지 핸들러가 정의되지 않았습니다');
            }

            messageHandler(
                new MessageEvent('message', {
                    data: JSON.stringify({
                        event: 'quizTimeout',
                        data: undefined,
                    }),
                }),
            );
        });

        expect(result.current.quizZoneState.playerState).toBe('WAIT');
    });

    // 퀴즈 완료 이벤트 테스트
    it('퀴즈 완료 이벤트 수신 시 결과가 올바르게 업데이트되어야 한다', () => {
        const { result } = renderHook(() => useQuizZone());

        const summaryData = {
            score: 100,
            submits: [{ questionId: 1, answer: '테스트 답안', correct: true }],
            quizzes: [{ id: 1, question: '테스트 문제' }],
        };

        act(() => {
            if (!messageHandler) {
                throw new Error('메시지 핸들러가 정의되지 않았습니다');
            }

            messageHandler(
                new MessageEvent('message', {
                    data: JSON.stringify({
                        event: 'summary',
                        data: summaryData,
                    }),
                }),
            );
        });

        expect(result.current.quizZoneState.stage).toBe('RESULT');
        expect(result.current.quizZoneState.score).toBe(100);
        expect(result.current.quizZoneState.submits).toEqual(summaryData.submits);
        expect(result.current.quizZoneState.quizzes).toEqual(summaryData.quizzes);
    });
});
