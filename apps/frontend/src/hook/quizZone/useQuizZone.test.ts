import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import useQuizZone from './useQuizZone';
import useWebSocket from '@/hook/useWebSocket';

// 모킹 설정
const mockSendMessage = vi.fn();
const mockCloseConnection = vi.fn();
let mockWebSocketHandler: ((event: MessageEvent) => void) | null = null;

// WebSocket 모킹
vi.mock('@/hook/useWebSocket', () => ({
    default: (url: string, handler: (event: MessageEvent) => void) => {
        mockWebSocketHandler = handler;
        return {
            sendMessage: mockSendMessage,
            closeConnection: mockCloseConnection,
        };
    },
}));

describe('useQuizZone 훅 테스트', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockWebSocketHandler = null;
    });

    describe('초기 상태 및 초기화', () => {
        it('초기 상태가 올바르게 설정되어야 한다', () => {
            const { result } = renderHook(() => useQuizZone());

            expect(result.current.quizZoneState).toStrictEqual({
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

        it('퀴즈존 데이터가 올바르게 초기화되어야 한다', () => {
            const { result } = renderHook(() => useQuizZone());
            const initialData = {
                stage: 'LOBBY',
                title: '테스트 퀴즈',
                description: '테스트 설명',
                hostId: 'host1',
                quizCount: 5,
            };

            act(() => {
                result.current.initQuizZoneData(initialData);
            });

            expect(result.current.quizZoneState).toMatchObject({
                stage: 'LOBBY',
                title: '테스트 퀴즈',
                description: '테스트 설명',
                hostId: 'host1',
                quizCount: 5,
            });
        });
    });

    describe('WebSocket 이벤트 처리', () => {
        it('퀴즈 시작 메시지를 올바르게 전송해야 한다', () => {
            const { result } = renderHook(() => useQuizZone());

            act(() => {
                result.current.startQuiz();
            });

            expect(mockSendMessage).toHaveBeenCalledWith(JSON.stringify({ event: 'start' }));
        });

        it('답안 제출이 올바른 형식으로 전송되어야 한다', () => {
            const { result } = renderHook(() => useQuizZone());
            const testAnswer = '테스트 답안';

            vi.setSystemTime(new Date('2024-01-01'));
            const fixedTime = new Date('2024-01-01').getTime();

            act(() => {
                result.current.submitQuiz(testAnswer);
            });

            expect(mockSendMessage).toHaveBeenCalledWith(
                JSON.stringify({
                    event: 'submit',
                    data: {
                        answer: testAnswer,
                        index: undefined,
                        submittedAt: fixedTime,
                    },
                }),
            );

            vi.useRealTimers();
        });

        it('nextQuiz 이벤트를 받으면 상태가 올바르게 업데이트되어야 한다', () => {
            const { result } = renderHook(() => useQuizZone());

            const mockEventData = {
                event: 'nextQuiz',
                data: {
                    question: '테스트 문제',
                    currentIndex: 1,
                    playTime: 30,
                    startTime: Date.now(),
                    deadlineTime: Date.now() + 30000,
                },
            };

            act(() => {
                if (mockWebSocketHandler) {
                    mockWebSocketHandler(
                        new MessageEvent('message', {
                            data: JSON.stringify(mockEventData),
                        }),
                    );
                }
            });

            expect(result.current.quizZoneState.stage).toBe('IN_PROGRESS');
            expect(result.current.quizZoneState.currentQuiz).toMatchObject({
                question: '테스트 문제',
                currentIndex: 1,
                type: 'SHORT',
            });
        });

        it('summary 이벤트를 받으면 결과가 올바르게 업데이트되어야 한다', () => {
            const { result } = renderHook(() => useQuizZone());

            const mockEventData = {
                event: 'summary',
                data: {
                    score: 100,
                    submits: ['답안1', '답안2'],
                    quizzes: ['문제1', '문제2'],
                },
            };

            act(() => {
                if (mockWebSocketHandler) {
                    mockWebSocketHandler(
                        new MessageEvent('message', {
                            data: JSON.stringify(mockEventData),
                        }),
                    );
                }
            });

            expect(result.current.quizZoneState.stage).toBe('RESULT');
            expect(result.current.quizZoneState.score).toBe(100);
            expect(result.current.quizZoneState.submits).toStrictEqual(['답안1', '답안2']);
            expect(result.current.quizZoneState.quizzes).toStrictEqual(['문제1', '문제2']);
        });

        it('playQuiz를 호출하면 상태가 적절하게 변경되어야 한다', () => {
            const { result } = renderHook(() => useQuizZone());

            act(() => {
                result.current.playQuiz();
            });

            expect(result.current.quizZoneState.stage).toBe('IN_PROGRESS');
            expect(result.current.quizZoneState.currentPlayer?.state).toBe('PLAY');
        });

        it('join 이벤트를 받으면 플레이어 목록이 업데이트되어야 한다', () => {
            const { result } = renderHook(() => useQuizZone());

            const mockEventData = {
                event: 'join',
                data: {
                    players: [
                        { id: 'player1', nickname: '참가자1' },
                        { id: 'player2', nickname: '참가자2' },
                    ],
                },
            };

            act(() => {
                if (mockWebSocketHandler) {
                    mockWebSocketHandler(
                        new MessageEvent('message', {
                            data: JSON.stringify(mockEventData),
                        }),
                    );
                }
            });

            expect(result.current.quizZoneState.players).toHaveLength(2);
            expect(result.current.quizZoneState.players).toStrictEqual([
                { id: 'player1', nickname: '참가자1' },
                { id: 'player2', nickname: '참가자2' },
            ]);
        });
    });
});
