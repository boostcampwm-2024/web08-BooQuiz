import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PlayService } from './play.service';
import { QuizZoneService } from '../quiz-zone/quiz-zone.service';
import { QuizZone } from '../quiz-zone/entities/quiz-zone.entity';
import { SubmittedQuiz } from '../quiz-zone/entities/submitted-quiz.entity';
import { PLAYER_STATE, QUIZ_TYPE, QUIZ_ZONE_STAGE } from '../common/constants';
import { RuntimeException } from '@nestjs/core/errors/exceptions';

describe('PlayService', () => {
    let service: PlayService;
    let quizZoneService: jest.Mocked<QuizZoneService>;
    let playsStorage: Map<string, NodeJS.Timeout>;

    const mockPlayer = {
        id: 'player-1',
        nickname: 'player1',
        state: PLAYER_STATE.WAIT,
        score: 0,
        submits: [],
    };

    const mockHost = {
        id: 'hostId',
        nickname: 'host-nickname',
        state: PLAYER_STATE.WAIT,
    }

    const mockQuizZone: QuizZone = {
        host: mockHost,
        stage: QUIZ_ZONE_STAGE.LOBBY,
        intervalTime: 5000,
        maxPlayers: 10,
        currentQuizIndex: -1,
        title: '퀴즈 존',
        description: '퀴즈 존입니다',
        currentQuizStartTime: Date.now(),
        currentQuizDeadlineTime: Date.now() + 10000,
        quizzes: [
            {
                question: '1번 문제입니다',
                answer: '정답1',
                playTime: 30000,
                quizType: QUIZ_TYPE.SHORT_ANSWER,
            },
            {
                question: '2번 문제입니다',
                answer: '정답2',
                playTime: 30000,
                quizType: QUIZ_TYPE.SHORT_ANSWER,
            },
        ],
        players: new Map([['player-1', mockPlayer]]),
    };

    beforeEach(async () => {
        playsStorage = new Map();
        const mockQuizZoneService = {
            findOne: jest.fn(),
            clearQuizZone: jest.fn(),
            updateQuizZone: jest.fn(),
        };

        const mockLogger = {
            log: jest.fn(),
            error: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PlayService,
                { provide: QuizZoneService, useValue: mockQuizZoneService },
                { provide: 'winston', useValue: mockLogger },
                { provide: 'PlayInfoStorage', useValue: playsStorage },
            ],
        }).compile();

        service = module.get<PlayService>(PlayService);
        quizZoneService = module.get(QuizZoneService);
    });

    describe('joinQuizZone', () => {
        it('참여자가 퀴즈존에 정상적으로 참여할 수 있어야 합니다', async () => {
            const mockQuizZoneWithPlayers = {
                ...mockQuizZone,
                players: new Map([
                    ['player-1', mockPlayer],
                    ['player-2', { ...mockPlayer, id: 'player-2', nickname: 'player2' }],
                ]),
            };
            quizZoneService.findOne.mockResolvedValue(mockQuizZoneWithPlayers);

            const result = await service.joinQuizZone('test-zone', 'player-1');

            expect(result).toEqual({
                currentPlayer: mockPlayer,
                players: [
                    { ...mockPlayer, id: 'player-1', nickname: 'player1' },
                    { ...mockPlayer, id: 'player-2', nickname: 'player2' },
                    {...mockHost}
                ],
            });
        });

        it('퀴즈존에 참여하지 않은 사용자는 NotFoundException이 발생해야 합니다', async () => {
            quizZoneService.findOne.mockResolvedValue(mockQuizZone);

            await expect(service.joinQuizZone('test-zone', 'unknown-player')).rejects.toThrow(
                new NotFoundException('참여하지 않은 사용자입니다.'),
            );
        });
    });

    describe('startQuizZone', () => {
        it('방장이 퀴즈를 정상적으로 시작할 수 있어야 합니다', async () => {
            const mockQuizZoneWithMultiplePlayers = {
                ...mockQuizZone,
                players: new Map([
                    ['player-1', mockPlayer],
                    ['player-2', { ...mockPlayer, id: 'player-2', nickname: 'player2' }],
                ]),
            };
            quizZoneService.findOne.mockResolvedValue(mockQuizZoneWithMultiplePlayers);

            const result = await service.startQuizZone('test-zone', mockHost.id);

            expect(result).toEqual(['player-1', 'player-2', mockHost.id]);
            expect(quizZoneService.updateQuizZone).toHaveBeenCalledWith(
                'test-zone',
                expect.objectContaining({
                    stage: QUIZ_ZONE_STAGE.IN_PROGRESS,
                    host: mockHost,
                }),
            );
        });

        it('방장이 아닌 사용자가 시작하면 UnauthorizedException이 발생해야 합니다', async () => {
            quizZoneService.findOne.mockResolvedValue(mockQuizZone);

            await expect(service.startQuizZone('test-zone', 'player-1')).rejects.toThrow(
                new UnauthorizedException('방장만 퀴즈를 시작할 수 있습니다.'),
            );
        });

        it('이미 시작된 퀴즈존은 BadRequestException이 발생해야 합니다', async () => {
            const inProgressQuizZone = {
                ...mockQuizZone,
                stage: QUIZ_ZONE_STAGE.IN_PROGRESS,
            };
            quizZoneService.findOne.mockResolvedValue(inProgressQuizZone);

            await expect(service.startQuizZone('test-zone', mockHost.id)).rejects.toThrow(
                new BadRequestException('이미 시작된 퀴즈존입니다.'),
            );
        });
    });

    describe('playNextQuiz', () => {
        const timeoutHandle = jest.fn();
        const now = Date.now();

        it('첫 번째 퀴즈가 정상적으로 설정되어야 합니다', async () => {
            const startTime = now + mockQuizZone.intervalTime;
            const mockInProgressQuizZone = {
                ...mockQuizZone,
                stage: QUIZ_ZONE_STAGE.IN_PROGRESS,
                currentQuizIndex: -1,
                currentQuizStartTime: startTime,
                currentQuizDeadlineTime: startTime + mockQuizZone.quizzes[0].playTime,
            };
            quizZoneService.findOne.mockResolvedValue(mockInProgressQuizZone);

            const result = await service.playNextQuiz('test-zone', timeoutHandle);

            expect(result).toEqual({
                nextQuiz: {
                    stage: QUIZ_ZONE_STAGE.IN_PROGRESS,
                    question: '1번 문제입니다',
                    currentIndex: 0,
                    playTime: 30000,
                    startTime: expect.any(Number),
                    deadlineTime: expect.any(Number),
                },
                playerIds: ['player-1', mockHost.id],
                currentQuizResult: {
                    answer: undefined,
                    totalPlayerCount: 0,
                    correctPlayerCount: 0,
                },
            });

            expect(quizZoneService.updateQuizZone).toHaveBeenCalledWith(
                'test-zone',
                expect.objectContaining({
                    currentQuizIndex: 0,
                    players: expect.any(Map),
                }),
            );
        });

        it('현재 진행중인 퀴즈의 결과를 포함해야 합니다', async () => {
            const mockPlayerWithSubmit = {
                ...mockPlayer,
                state: PLAYER_STATE.SUBMIT,
                submits: [
                    {
                        index: 0,
                        answer: '정답1',
                        submittedAt: now - 1000,
                    },
                ],
            };

            const mockQuizZoneWithSubmit = {
                ...mockQuizZone,
                stage: QUIZ_ZONE_STAGE.IN_PROGRESS,
                currentQuizIndex: 0,
                players: new Map([['player-1', mockPlayerWithSubmit]]),
            };
            quizZoneService.findOne.mockResolvedValue(mockQuizZoneWithSubmit);

            const result = await service.playNextQuiz('test-zone', timeoutHandle);

            expect(result.currentQuizResult).toEqual({
                answer: '정답1',
                totalPlayerCount: 1,
                correctPlayerCount: 1,
            });
        });

        it('모든 퀴즈가 종료되면 RuntimeException이 발생해야 합니다', async () => {
            quizZoneService.findOne.mockResolvedValue({
                ...mockQuizZone,
                currentQuizIndex: mockQuizZone.quizzes.length - 1,
            });

            await expect(service.playNextQuiz('test-zone', timeoutHandle)).rejects.toThrow(
                new RuntimeException('모든 퀴즈를 출제하였습니다.'),
            );
        });
    });

    describe('submit', () => {
        const now = Date.now();
        const submitQuiz: SubmittedQuiz = {
            index: 0,
            answer: '정답1',
            submittedAt: now,
        };

        it('정답을 정상적으로 제출할 수 있어야 합니다', async () => {
            const mockPlayerInPlay = {
                ...mockPlayer,
                state: PLAYER_STATE.PLAY,
            };

            const inProgressQuizZone = {
                ...mockQuizZone,
                stage: QUIZ_ZONE_STAGE.IN_PROGRESS,
                currentQuizIndex: 0,
                currentQuizDeadlineTime: now + 5000,
                players: new Map([['player-1', mockPlayerInPlay]]),
            };
            quizZoneService.findOne.mockResolvedValue(inProgressQuizZone);

            const result = await service.submit('test-zone', 'player-1', submitQuiz);

            expect(result).toEqual({
                isLastSubmit: true,
                fastestPlayerIds: ['player-1'],
                submittedCount: 1,
                totalPlayerCount: 1,
                otherSubmittedPlayerIds: [mockHost.id],
            });
        });

        it('여러 플레이어가 있을 때 정답 제출이 정상적으로 처리되어야 합니다', async () => {
            const mockPlayerInPlay = {
                ...mockPlayer,
                state: PLAYER_STATE.PLAY,
            };
            const mockPlayer2InSubmit = {
                ...mockPlayer,
                id: 'player-2',
                nickname: 'player2',
                state: PLAYER_STATE.SUBMIT,
                submits: [{ index: 0, answer: '정답1', submittedAt: now - 1000 }],
            };

            const inProgressQuizZone = {
                ...mockQuizZone,
                stage: QUIZ_ZONE_STAGE.IN_PROGRESS,
                currentQuizIndex: 0,
                currentQuizDeadlineTime: now + 5000,
                players: new Map([
                    ['player-1', mockPlayerInPlay],
                    ['player-2', mockPlayer2InSubmit],
                ]),
            };
            quizZoneService.findOne.mockResolvedValue(inProgressQuizZone);

            const result = await service.submit('test-zone', 'player-1', submitQuiz);

            expect(result).toEqual({
                isLastSubmit: true,
                fastestPlayerIds: ['player-2', 'player-1'],
                submittedCount: 2,
                totalPlayerCount: 2,
                otherSubmittedPlayerIds: ['player-2', mockHost.id],
            });
        });

        it('게임이 진행 중이 아닐 때는 제출할 수 없어야 합니다', async () => {
            quizZoneService.findOne.mockResolvedValue(mockQuizZone);

            await expect(service.submit('test-zone', 'player-1', submitQuiz)).rejects.toThrow(
                new BadRequestException('퀴즈를 제출할 수 없습니다.'),
            );
        });

        it('이미 제출한 플레이어는 다시 제출할 수 없어야 합니다', async () => {
            const submittedPlayer = {
                ...mockPlayer,
                state: PLAYER_STATE.SUBMIT,
                submits: [{ index: 0, answer: '정답1', submittedAt: now - 1000 }],
            };

            const submittedQuizZone = {
                ...mockQuizZone,
                stage: QUIZ_ZONE_STAGE.IN_PROGRESS,
                currentQuizIndex: 0,
                players: new Map([['player-1', submittedPlayer]]),
            };

            quizZoneService.findOne.mockResolvedValue(submittedQuizZone);

            await expect(service.submit('test-zone', 'player-1', submitQuiz)).rejects.toThrow(
                new BadRequestException('정답을 제출할 수 없습니다.'),
            );
        });
    });

    describe('leaveQuizZone', () => {
        it('일반 참여자가 퀴즈존을 나갈 수 있어야 합니다', async () => {
            const mockQuizZoneWithPlayers = {
                ...mockQuizZone,
                players: new Map([
                    ['player-1', mockPlayer],
                    ['player-2', { ...mockPlayer, id: 'player-2', nickname: 'player2' }],
                ]),
            };
            quizZoneService.findOne.mockResolvedValue(mockQuizZoneWithPlayers);

            const result = await service.leaveQuizZone('test-zone', 'player-1');

            expect(result).toEqual({
                isHost: false,
                playerIds: ['player-2', mockHost.id],
            });
        });

        it('방장이 나가면 퀴즈존이 삭제되어야 합니다', async () => {
            const mockQuizZoneWithPlayers = {
                ...mockQuizZone,
                players: new Map([
                    ['player-1', mockPlayer],
                    ['player-2', { ...mockPlayer, id: 'player-2', nickname: 'player2' }],
                ]),
            };
            quizZoneService.findOne.mockResolvedValue(mockQuizZoneWithPlayers);

            const result = await service.leaveQuizZone('test-zone', mockHost.id);

            expect(result).toEqual({
                isHost: true,
                playerIds: ['player-1', 'player-2', mockHost.id],
            });
            expect(quizZoneService.clearQuizZone).toHaveBeenCalledWith('test-zone');
        });
        it('게임 진행 중에는 나갈 수 없어야 합니다', async () => {
            const inProgressQuizZone = {
                ...mockQuizZone,
                stage: QUIZ_ZONE_STAGE.IN_PROGRESS,
                players: new Map([['player-1', { ...mockPlayer, state: PLAYER_STATE.PLAY }]]),
            };
            quizZoneService.findOne.mockResolvedValue(inProgressQuizZone);

            await expect(service.leaveQuizZone('test-zone', 'player-1')).rejects.toThrow(
                new BadRequestException('게임이 진행중입니다.'),
            );
        });
    });

    describe('summaryQuizZone', () => {
        const now = Date.now();

        it('퀴즈존의 결과를 정상적으로 반환해야 합니다', async () => {
            const mockSubmits = [
                { index: 0, answer: '정답1', submittedAt: now - 2000 },
                { index: 1, answer: '정답2', submittedAt: now - 1000 },
            ];

            const mockPlayerWithResults = {
                ...mockPlayer,
                state: PLAYER_STATE.SUBMIT,
                score: 2,
                submits: mockSubmits,
                nickname: 'player1',
            };

            const quizZoneWithResults = {
                ...mockQuizZone,
                stage: QUIZ_ZONE_STAGE.RESULT,
                currentQuizIndex: 1,
                players: new Map([
                    ['player-1', mockPlayerWithResults],
                    [
                        'player-2',
                        {
                            ...mockPlayer,
                            id: 'player-2',
                            nickname: 'player2',
                            score: 1,
                            submits: [
                                { index: 0, answer: '정답1', submittedAt: now - 1500 },
                                { index: 1, answer: '오답', submittedAt: now - 500 },
                            ],
                        },
                    ],
                ]),
            };

            quizZoneService.findOne.mockResolvedValue(quizZoneWithResults);

            const result = await service.summaryQuizZone('test-zone');

            expect(result).toEqual({
                summaries :[{
                    id: 'player-1',
                    score: 2,
                    submits: mockSubmits,
                    quizzes: mockQuizZone.quizzes,
                    ranks: [
                        { id: 'player-1', nickname: 'player1', score: 2, ranking: 1 },
                        { id: 'player-2', nickname: 'player2', score: 1, ranking: 2 },
                    ],
                },
                {
                    id: 'player-2',
                    score: 1,
                    submits: expect.arrayContaining([
                        expect.objectContaining({
                            index: 0,
                            answer: '정답1',
                        }),
                        expect.objectContaining({
                            index: 1,
                            answer: '오답',
                        }),
                    ]),
                    quizzes: mockQuizZone.quizzes,
                    ranks: [
                        { id: 'player-1', nickname: 'player1', score: 2, ranking: 1 },
                        { id: 'player-2', nickname: 'player2', score: 1, ranking: 2 },
                    ],
                },
            ], host: mockHost});

            expect(quizZoneService.clearQuizZone).toHaveBeenCalledWith('test-zone');
        });

        it('동점자가 있는 경우 동일한 순위가 부여되어야 합니다', async () => {
            const quizZoneWithTiedScores = {
                ...mockQuizZone,
                stage: QUIZ_ZONE_STAGE.RESULT,
                players: new Map([
                    [
                        'player-1',
                        {
                            ...mockPlayer,
                            id: 'player-1',
                            nickname: 'player1',
                            score: 2,
                            submits: [],
                        },
                    ],
                    [
                        'player-2',
                        {
                            ...mockPlayer,
                            id: 'player-2',
                            nickname: 'player2',
                            score: 2,
                            submits: [],
                        },
                    ],
                    [
                        'player-3',
                        {
                            ...mockPlayer,
                            id: 'player-3',
                            nickname: 'player3',
                            score: 1,
                            submits: [],
                        },
                    ],
                ]),
            };

            quizZoneService.findOne.mockResolvedValue(quizZoneWithTiedScores);

            const {summaries} = await service.summaryQuizZone('test-zone');

            const expectedRanks = [
                { id: 'player-1', nickname: 'player1', score: 2, ranking: 1 },
                { id: 'player-2', nickname: 'player2', score: 2, ranking: 1 },
                { id: 'player-3', nickname: 'player3', score: 1, ranking: 3 },
            ];

            expect(summaries[0].ranks).toEqual(expectedRanks);
            expect(summaries[1].ranks).toEqual(expectedRanks);
            expect(summaries[2].ranks).toEqual(expectedRanks);
        });

        it('플레이어가 없는 경우 빈 배열을 반환해야 합니다', async () => {
            const emptyQuizZone = {
                ...mockQuizZone,
                stage: QUIZ_ZONE_STAGE.RESULT,
                players: new Map(),
            };
            quizZoneService.findOne.mockResolvedValue(emptyQuizZone);

            const {summaries} = await service.summaryQuizZone('test-zone');

            expect(summaries).toEqual([]);
            expect(quizZoneService.clearQuizZone).toHaveBeenCalledWith('test-zone');
        });

        it('모든 플레이어의 퀴즈 제출 기록이 포함되어야 합니다', async () => {
            const mockPlayer1Submits = [
                { index: 0, answer: '정답1', submittedAt: now - 2000 },
                { index: 1, answer: undefined, submittedAt: now - 1000 }, // 시간 초과로 미제출
            ];

            const mockPlayer2Submits = [
                { index: 0, answer: '오답', submittedAt: now - 1500 },
                { index: 1, answer: '정답2', submittedAt: now - 500 },
            ];

            const quizZoneWithMixedResults = {
                ...mockQuizZone,
                stage: QUIZ_ZONE_STAGE.RESULT,
                currentQuizIndex: 1,
                players: new Map([
                    [
                        'player-1',
                        {
                            ...mockPlayer,
                            id: 'player-1',
                            nickname: 'player1',
                            score: 1,
                            submits: mockPlayer1Submits,
                        },
                    ],
                    [
                        'player-2',
                        {
                            ...mockPlayer,
                            id: 'player-2',
                            nickname: 'player2',
                            score: 1,
                            submits: mockPlayer2Submits,
                        },
                    ],
                ]),
            };

            quizZoneService.findOne.mockResolvedValue(quizZoneWithMixedResults);

            const {summaries} = await service.summaryQuizZone('test-zone');

            const expectedRanks = [
                { id: 'player-1', nickname: 'player1', score: 1, ranking: 1 },
                { id: 'player-2', nickname: 'player2', score: 1, ranking: 1 },
            ];

            expect(summaries).toEqual([
                {
                    id: 'player-1',
                    score: 1,
                    submits: mockPlayer1Submits,
                    quizzes: mockQuizZone.quizzes,
                    ranks: expectedRanks,
                },
                {
                    id: 'player-2',
                    score: 1,
                    submits: mockPlayer2Submits,
                    quizzes: mockQuizZone.quizzes,
                    ranks: expectedRanks,
                },
            ]);
        });
    });

    describe('chatQuizZone', () => {
        it('플레이어가 플레이 상태일 때는 채팅을 제출할 수 없어야 합니다.', async () => {
            const inPlayPlayer = {
                ...mockPlayer,
                state: PLAYER_STATE.PLAY,
            };

            const inPlayQuizZone = {
                ...mockQuizZone,
                players: new Map([['player-1', inPlayPlayer]]),
            };

            quizZoneService.findOne.mockResolvedValue(inPlayQuizZone);

            await expect(service.chatQuizZone('player-1', 'test-zone')).rejects.toThrow(
                new BadRequestException('채팅을 제출한 플레이어 상태가 PLAY입니다.'),
            );
        });

        it('플레이어가 플레이 상태가 아닐 때는 채팅을 제출할 수 있어야 합니다.', async () => {
            const inWaitPlayer = {
                ...mockPlayer,
                state: PLAYER_STATE.WAIT,
            };

            const inWaitQuizZone = {
                ...mockQuizZone,
                players: new Map([['player-1', inWaitPlayer]]),
            };

            quizZoneService.findOne.mockResolvedValue(inWaitQuizZone);

            const result = await service.chatQuizZone('player-1', 'test-zone');

            expect(result).toEqual(['player-1', mockHost.id]);
        });
    });

    describe('changeNickname', () => {
        it('Lobby에 있는 wait상태의 참여자는 닉네임을 변경할 수 있다.', async () => {
            const players = new Map([
                ['player-1', mockPlayer],
                ['player-2', { ...mockPlayer, id: 'player-2', nickname: 'player2' }],
            ]);
            const mockQuizZoneWithPlayers = {
                ...mockQuizZone,
                players: players,
            };
            quizZoneService.findOne.mockResolvedValue(mockQuizZoneWithPlayers);

            const result = await service.changeNickname('test-zone', 'player-2', 'new-nickname');
            expect(players.get('player-2').nickname).toEqual('new-nickname');
        });

        it('퀴즈존이 Lobby, 사용자는 Wait 상태에서만 닉네임을 변경할 수 있다.', async () => {
            const mockQuizZoneWithPlayers = {
                ...mockQuizZone,
                stage: QUIZ_ZONE_STAGE.IN_PROGRESS,
                players: new Map([
                    ['player-1', mockPlayer],
                    [
                        'player-2',
                        {
                            ...mockPlayer,
                            id: 'player-2',
                            nickname: 'player2',
                            state: PLAYER_STATE.WAIT,
                        },
                    ],
                ]),
            };
            quizZoneService.findOne.mockResolvedValue(mockQuizZoneWithPlayers);

            await expect(
                service.changeNickname('test-zone', 'player-2', 'new-nickname'),
            ).rejects.toThrow(new BadRequestException('현재 닉네임을 변경할 수 없습니다.'));
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});
