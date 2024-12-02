import { Test, TestingModule } from '@nestjs/testing';
import { QuizZoneService } from './quiz-zone.service';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { QuizZone } from './entities/quiz-zone.entity';
import { IQuizZoneRepository } from './repository/quiz-zone.repository.interface';
import { Quiz } from './entities/quiz.entity';
import { PLAYER_STATE, QUIZ_TYPE, QUIZ_ZONE_STAGE } from '../common/constants';
import { QuizService } from '../quiz/quiz.service';
import { max } from 'class-validator';

const nickNames: string[] = [
    '전설의고양이',
    '피카츄꼬리',
    '킹왕짱짱맨',
    '용맹한기사단',
    '무적의검사',
    '그림자암살자',
    '마법의마스터',
    '불꽃의전사',
    '어둠의기사',
    '번개의제왕',
];

const playTime = 30_000;

const quizzes: Quiz[] = [
    {
        question: '포도가 자기소개하면?',
        answer: '포도당',
        playTime,
        quizType: QUIZ_TYPE.SHORT_ANSWER,
    },
    {
        question: '고양이를 싫어하는 동물은?',
        answer: '미어캣',
        playTime,
        quizType: QUIZ_TYPE.SHORT_ANSWER,
    },
    {
        question: '게를 냉동실에 넣으면?',
        answer: '게으름',
        playTime,
        quizType: QUIZ_TYPE.SHORT_ANSWER,
    },
    {
        question: '오리를 생으로 먹으면?',
        answer: '회오리',
        playTime,
        quizType: QUIZ_TYPE.SHORT_ANSWER,
    },
    {
        question: '네 사람이 동시에 오줌을 누면?',
        answer: '포뇨',
        playTime,
        quizType: QUIZ_TYPE.SHORT_ANSWER,
    },
    {
        question: '지브리가 뭘로 돈 벌게요?',
        answer: '토토로',
        playTime,
        quizType: QUIZ_TYPE.SHORT_ANSWER,
    },
];

describe('QuizZoneService', () => {
    let service: QuizZoneService;
    let repository: IQuizZoneRepository;
    let quizService: QuizService;
    const mockQuizZoneRepository = {
        set: jest.fn(),
        get: jest.fn(),
        delete: jest.fn(),
        has: jest.fn(),
    };

    const mockQuizService = {
        createQuizzes: jest.fn(),
        getQuizzes: jest.fn(),
        updateQuiz: jest.fn(),
        deleteQuiz: jest.fn(),
        findQuizSet: jest.fn(),
        findQuiz: jest.fn(),
    };
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                QuizZoneService,
                {
                    provide: 'QuizZoneRepository',
                    useValue: mockQuizZoneRepository,
                },
                {
                    provide: QuizService,
                    useValue: mockQuizService,
                },
            ],
        }).compile();

        service = module.get<QuizZoneService>(QuizZoneService);
        repository = module.get<IQuizZoneRepository>('QuizZoneRepository');
        quizService = module.get<QuizService>(QuizService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('새로운 퀴즈존을 생성한다', async () => {
            // given
            const createQuizZoneDto = {
                quizZoneId: 'test123',
                title: '테스트 퀴즈',
                description: '테스트용 퀴즈입니다',
                limitPlayerCount: 10,
                quizSetId: 1,
                maxPlayers: 10,
            };
            const adminId = 'adminId';
            const mockQuizzes = [
                {
                    question: '문제1',
                    answer: '답1',
                    playTime: 30000,
                    quizType: QUIZ_TYPE.SHORT_ANSWER,
                },
                {
                    question: '문제2',
                    answer: '답2',
                    playTime: 30000,
                    quizType: QUIZ_TYPE.SHORT_ANSWER,
                },
            ];

            mockQuizZoneRepository.has.mockResolvedValue(false);
            mockQuizService.getQuizzes.mockResolvedValue(mockQuizzes);

            // when
            await service.create(createQuizZoneDto, adminId);

            // then
            expect(repository.set).toHaveBeenCalledWith(
                createQuizZoneDto.quizZoneId,
                expect.objectContaining({
                    hostId: adminId,
                    title: createQuizZoneDto.title,
                    description: createQuizZoneDto.description,
                    maxPlayers: 10,
                    stage: QUIZ_ZONE_STAGE.LOBBY,
                    currentQuizIndex: -1,
                    currentQuizStartTime: 0,
                    currentQuizDeadlineTime: 0,
                    intervalTime: 5000,
                    players: expect.any(Map),
                    quizzes: mockQuizzes.map((quiz) => ({
                        ...quiz,
                        question: Buffer.from(quiz.question).toString('base64'),
                        playTime: quiz.playTime * 1000,
                    })),
                }),
            );
        });

        it('이미 존재하는 퀴즈존 ID로 생성 시 ConflictException을 던진다', async () => {
            // given
            const createQuizZoneDto = {
                quizZoneId: 'test123',
                title: '테스트 퀴즈',
                description: '테스트용 퀴즈입니다',
                limitPlayerCount: 100,
                quizSetId: 1,
            };
            const adminId = 'adminId';

            mockQuizZoneRepository.has.mockResolvedValue(true);

            // when & then
            await expect(service.create(createQuizZoneDto, adminId)).rejects.toThrow(
                ConflictException,
            );
        });
    });

    describe('findOne', () => {
        const quizZoneId = 'testQuizZone';

        it('퀴즈존을 ID로 조회한다', async () => {
            // given
            const mockQuizZone: QuizZone = {
                players: new Map(),
                hostId: 'adminId',
                title: '테스트 퀴즈',
                description: '테스트 퀴즈입니다',
                maxPlayers: 10,
                quizzes: quizzes.map((quiz) => ({
                    ...quiz,
                    question: Buffer.from(quiz.question).toString('base64'),
                })),
                stage: QUIZ_ZONE_STAGE.LOBBY,
                currentQuizIndex: -1,
                currentQuizStartTime: 0,
                currentQuizDeadlineTime: 0,
                intervalTime: 5000,
            };

            mockQuizZoneRepository.get.mockResolvedValue(mockQuizZone);

            // when
            const result = await (service as any).findOne(quizZoneId);

            // then
            expect(repository.get).toHaveBeenCalledWith(quizZoneId);
            expect(result).toEqual(mockQuizZone);
        });

        it('존재하지 않는 퀴즈존 조회 시 NotFoundException을 던진다', async () => {
            // given
            mockQuizZoneRepository.get.mockResolvedValue(null);

            // when & then
            await expect((service as any).findOne(quizZoneId)).rejects.toThrow(NotFoundException);
            expect(repository.get).toHaveBeenCalledWith(quizZoneId);
        });
    });

    describe('getQuizZoneInfo', () => {
        const quizZoneId = 'testQuizZone';
        const clientId = 'clientId';

        it('이미 접속해있는 퀴즈존이 있을때 다른 퀴즈존에 동시에 접속하면 기존 퀴즈존을 나가고 새로운 곳에 추가한다.', async () => {
            // given
            const newQuizZoneId = 'newQuizZone';
            const existingQuizZoneId = 'existingQuizZone';

            // 기존 퀴즈존 설정
            const existingQuizZone: QuizZone = {
                players: new Map([
                    [
                        clientId,
                        {
                            id: clientId,
                            nickname: nickNames[0],
                            state: PLAYER_STATE.WAIT,
                            score: 0,
                            submits: [],
                        },
                    ],
                    [
                        'otherPlayer',
                        {
                            id: 'otherPlayer',
                            nickname: nickNames[1],
                            state: PLAYER_STATE.WAIT,
                            score: 0,
                            submits: [],
                        },
                    ],
                ]),
                hostId: 'adminId',
                maxPlayers: 10,
                title: '기존 퀴즈',
                description: '기존 퀴즈입니다',
                quizzes: quizzes,
                stage: QUIZ_ZONE_STAGE.LOBBY,
                currentQuizIndex: -1,
                currentQuizStartTime: 0,
                currentQuizDeadlineTime: 0,
                intervalTime: 5000,
            };

            // 새로운 퀴즈존 설정
            const newQuizZone = {
                ...existingQuizZone,
                players: new Map(),
                title: '새로운 퀴즈',
                description: '새로운 퀴즈입니다',
            };

            // Mock 설정
            mockQuizZoneRepository.has.mockResolvedValue(true);
            mockQuizZoneRepository.get.mockImplementation((id) => {
                if (id === existingQuizZoneId) return existingQuizZone;
                if (id === newQuizZoneId) return newQuizZone;
            });

            // when
            await service.getQuizZoneInfo(clientId, newQuizZoneId, existingQuizZoneId);

            // then
            // 1. 기존 퀴즈존에서 해당 플레이어만 제거되었는지 확인
            expect(existingQuizZone.players.has(clientId)).toBeFalsy();
            expect(existingQuizZone.players.has('otherPlayer')).toBeTruthy();

            // 2. 새로운 퀴즈존에 플레이어가 추가되었는지 확인
            const newPlayer = newQuizZone.players.get(clientId);
            expect(newPlayer).toEqual({
                id: clientId,
                nickname: expect.any(String),
                state: PLAYER_STATE.WAIT,
                score: 0,
                submits: [],
            });
        });

        it('이전 퀴즈존이 존재하지 않으면 새로운 퀴즈존에만 참여한다', async () => {
            // given
            const clientId = 'player1';
            const newQuizZoneId = 'newQuizZone';
            const nonExistingQuizZoneId = 'nonExisting';

            const newQuizZone: QuizZone = {
                players: new Map(),
                hostId: 'adminId',
                title: '새로운 퀴즈',
                description: '새로운 퀴즈입니다',
                quizzes: quizzes,
                maxPlayers: 10,
                stage: QUIZ_ZONE_STAGE.LOBBY,
                currentQuizIndex: -1,
                currentQuizStartTime: 0,
                currentQuizDeadlineTime: 0,
                intervalTime: 5000,
            };

            mockQuizZoneRepository.has.mockResolvedValue(false);
            mockQuizZoneRepository.get.mockResolvedValue(newQuizZone);

            // when
            await service.getQuizZoneInfo(clientId, newQuizZoneId, nonExistingQuizZoneId);

            // then
            const newPlayer = newQuizZone.players.get(clientId);
            expect(newPlayer).toEqual({
                id: clientId,
                nickname: expect.any(String),
                state: PLAYER_STATE.WAIT,
                score: 0,
                submits: [],
            });
        });

        it('LOBBY 단계에서 새로운 플레이어가 접속하면 플레이어를 추가하고 정보를 반환한다', async () => {
            // given
            const mockQuizZone: QuizZone = {
                players: new Map([
                    [
                        'player1',
                        {
                            id: 'player1',
                            nickname: nickNames[0],
                            state: PLAYER_STATE.WAIT,
                            score: 0,
                            submits: [],
                        },
                    ],
                ]),
                hostId: 'adminId',
                maxPlayers: 10,
                title: '테스트 퀴즈',
                description: '테스트 퀴즈입니다',
                quizzes: quizzes,
                stage: QUIZ_ZONE_STAGE.LOBBY,
                currentQuizIndex: -1,
                currentQuizStartTime: 0,
                currentQuizDeadlineTime: 0,
                intervalTime: 5000,
            };

            mockQuizZoneRepository.get.mockResolvedValue(mockQuizZone);

            // when
            const result = await service.getQuizZoneInfo(clientId, quizZoneId);

            // then
            const addedPlayer = mockQuizZone.players.get(clientId);
            const nickname = addedPlayer.nickname;
            expect(addedPlayer).toEqual({
                id: clientId,
                nickname: nickname,
                score: 0,
                submits: [],
                state: PLAYER_STATE.WAIT,
            });

            expect(result).toEqual({
                currentPlayer: {
                    id: clientId,
                    nickname: nickname,
                    state: PLAYER_STATE.WAIT,
                },
                title: '테스트 퀴즈',
                maxPlayers: 10,
                description: '테스트 퀴즈입니다',
                quizCount: quizzes.length,
                stage: QUIZ_ZONE_STAGE.LOBBY,
                hostId: 'adminId',
            });
        });

        it('LOBBY 단계에서 이미 참가한 플레이어가 접속하면 기존 정보를 반환한다', async () => {
            // given
            const existingPlayer = {
                id: clientId,
                nickname: '닉네임',
                state: PLAYER_STATE.WAIT,
                score: 0,
                submits: [],
            };
            const mockQuizZone: QuizZone = {
                players: new Map([[clientId, existingPlayer]]),
                hostId: 'adminId',
                maxPlayers: 10,
                title: '테스트 퀴즈',
                description: '테스트 퀴즈입니다',
                quizzes: quizzes,
                stage: QUIZ_ZONE_STAGE.LOBBY,
                currentQuizIndex: -1,
                currentQuizStartTime: 0,
                currentQuizDeadlineTime: 0,
                intervalTime: 5000,
            };

            mockQuizZoneRepository.get.mockResolvedValue(mockQuizZone);

            // when
            const result = await service.getQuizZoneInfo(clientId, quizZoneId);

            // then
            expect(mockQuizZone.players.size).toBe(1);
            expect(result.currentPlayer).toEqual({
                id: clientId,
                nickname: '닉네임',
                state: PLAYER_STATE.WAIT,
            });
        });

        it('LOBBY 단계에서 정원이 초과된 경우 BadRequestException을 던진다', async () => {
            // given
            const mockQuizZone: QuizZone = {
                players: new Map([
                    [
                        'player1',
                        {
                            id: 'player1',
                            nickname: '닉네임1',
                            state: PLAYER_STATE.WAIT,
                            score: 0,
                            submits: [],
                        },
                    ],
                    [
                        'player2',
                        {
                            id: 'player2',
                            nickname: '닉네임2',
                            state: PLAYER_STATE.WAIT,
                            score: 0,
                            submits: [],
                        },
                    ],
                ]),
                hostId: 'adminId',
                maxPlayers: 2,
                title: '테스트 퀴즈',
                description: '테스트 퀴즈입니다',
                quizzes: quizzes,
                stage: QUIZ_ZONE_STAGE.LOBBY,
                currentQuizIndex: -1,
                currentQuizStartTime: 0,
                currentQuizDeadlineTime: 0,
                intervalTime: 5000,
            };

            mockQuizZoneRepository.get.mockResolvedValue(mockQuizZone);

            // when & then
            await expect(service.getQuizZoneInfo(clientId, quizZoneId)).rejects.toThrow(
                BadRequestException,
            );
        });

        it('IN_PROGRESS 단계일 때 진행 정보를 반환한다', async () => {
            // given
            const mockQuizZone: QuizZone = {
                players: new Map([
                    [
                        clientId,
                        {
                            id: clientId,
                            nickname: '닉네임',
                            state: PLAYER_STATE.WAIT,
                            score: 0,
                            submits: [],
                        },
                    ],
                ]),
                hostId: 'adminId',
                maxPlayers: 10,
                title: '테스트 퀴즈',
                description: '테스트 퀴즈입니다',
                quizzes: quizzes,
                stage: QUIZ_ZONE_STAGE.IN_PROGRESS,
                currentQuizIndex: 1,
                currentQuizStartTime: Date.now(),
                currentQuizDeadlineTime: Date.now() + playTime,
                intervalTime: 5000,
            };

            mockQuizZoneRepository.get.mockResolvedValue(mockQuizZone);

            // when
            const result = await service.getQuizZoneInfo(clientId, quizZoneId);

            // then
            expect(result).toEqual({
                currentPlayer: { id: clientId, nickname: '닉네임', state: PLAYER_STATE.WAIT },
                title: '테스트 퀴즈',
                description: '테스트 퀴즈입니다',
                quizCount: quizzes.length,
                stage: QUIZ_ZONE_STAGE.IN_PROGRESS,
                hostId: 'adminId',
                maxPlayers: 10,
                currentQuiz: {
                    currentIndex: 1,
                    startTime: mockQuizZone.currentQuizStartTime,
                    deadlineTime: mockQuizZone.currentQuizDeadlineTime,
                    playTime: quizzes[1].playTime,
                    question: quizzes[1].question,
                    stage: QUIZ_ZONE_STAGE.IN_PROGRESS,
                },
            });
        });

        it('RESULT 단계일 때 결과 정보를 반환한다', async () => {
            // given
            const mockQuizZone: QuizZone = {
                players: new Map([
                    [
                        clientId,
                        {
                            id: clientId,
                            nickname: '닉네임',
                            state: PLAYER_STATE.WAIT,
                            score: 100,
                            submits: [],
                        },
                    ],
                ]),
                hostId: 'adminId',
                maxPlayers: 10,
                title: '테스트 퀴즈',
                description: '테스트 퀴즈입니다',
                quizzes: quizzes,
                stage: QUIZ_ZONE_STAGE.RESULT,
                currentQuizIndex: -1,
                currentQuizStartTime: Date.now(),
                currentQuizDeadlineTime: Date.now() + playTime,
                intervalTime: 5000,
            };

            mockQuizZoneRepository.get.mockResolvedValue(mockQuizZone);

            // when
            const result = await service.getQuizZoneInfo(clientId, quizZoneId);

            // then
            expect(result).toEqual({
                currentPlayer: {
                    id: clientId,
                    nickname: '닉네임',
                    state: PLAYER_STATE.WAIT,
                    score: 100,
                    submits: [],
                },
                title: '테스트 퀴즈',
                description: '테스트 퀴즈입니다',
                quizCount: quizzes.length,
                stage: QUIZ_ZONE_STAGE.RESULT,
                maxPlayers: 10,
                hostId: 'adminId',
            });
        });

        it('존재하지 않는 퀴즈존을 조회하면 NotFoundException을 던진다', async () => {
            // given
            mockQuizZoneRepository.get.mockResolvedValue(null);

            // when & then
            await expect(service.getQuizZoneInfo(clientId, quizZoneId)).rejects.toThrow(
                NotFoundException,
            );
        });

        it('참가하지 않은 플레이어가 IN_PROGRESS 단계의 퀴즈존을 조회하면 BadRequestException을 던진다', async () => {
            // given
            const mockQuizZone: QuizZone = {
                players: new Map(),
                hostId: 'adminId',
                maxPlayers: 10,
                title: '테스트 퀴즈',
                description: '테스트 퀴즈입니다',
                quizzes: quizzes,
                stage: QUIZ_ZONE_STAGE.IN_PROGRESS,
                currentQuizIndex: -1,
                currentQuizStartTime: 0,
                currentQuizDeadlineTime: 0,
                intervalTime: 5000,
            };

            mockQuizZoneRepository.get.mockResolvedValue(mockQuizZone);

            // when & then
            await expect(service.getQuizZoneInfo(clientId, quizZoneId)).rejects.toThrow(
                BadRequestException,
            );
        });
    });

    describe('clearQuizZone', () => {
        it('퀴즈존을 삭제한다', async () => {
            const quizZoneId = 'testQuizZone';

            mockQuizZoneRepository.has.mockResolvedValue(true);

            await service.clearQuizZone(quizZoneId);

            expect(repository.delete).toHaveBeenCalledWith(quizZoneId);
        });

        it('존재하지 않는 퀴즈존을 삭제 시 예외를 던진다', async () => {
            const quizZoneId = 'testQuizZone';

            mockQuizZoneRepository.has.mockResolvedValue(false);

            await expect(service.clearQuizZone(quizZoneId)).rejects.toThrow(BadRequestException);
        });
    });
    describe('findOthersInfo', () => {
        it('다른 플레이어들의 닉네임 목록을 반환한다', async () => {
            const quizZoneId = 'testQuizZone';
            const clientId = 'clientId';
            const mockQuizZone: QuizZone = {
                players: new Map([
                    [
                        'clientId',
                        {
                            id: 'clientId',
                            nickname: 'nick1',
                            state: PLAYER_STATE.WAIT,
                            score: 0,
                            submits: [],
                        },
                    ],
                    [
                        'player2',
                        {
                            id: 'player2',
                            nickname: 'nick2',
                            state: PLAYER_STATE.WAIT,
                            score: 0,
                            submits: [],
                        },
                    ],
                    [
                        'player3',
                        {
                            id: 'player3',
                            nickname: 'nick3',
                            state: PLAYER_STATE.WAIT,
                            score: 0,
                            submits: [],
                        },
                    ],
                ]),
                hostId: 'adminId',
                maxPlayers: 10,
                title: '테스트 퀴즈',
                description: '테스트 퀴즈입니다',
                quizzes: quizzes,
                stage: QUIZ_ZONE_STAGE.LOBBY,
                currentQuizIndex: -1,
                currentQuizStartTime: 0,
                currentQuizDeadlineTime: 0,
                intervalTime: 5000,
            };

            mockQuizZoneRepository.get.mockResolvedValue(mockQuizZone);

            const result = await service.findOthersInfo(quizZoneId, clientId);

            expect(result).toEqual([
                { nickname: 'nick2', id: 'player2' },
                { nickname: 'nick3', id: 'player3' },
            ]);
        });

        it('다른 플레이어가 없으면 빈 배열을 반환한다', async () => {
            const quizZoneId = 'testQuizZone';
            const clientId = 'clientId';
            const mockQuizZone: QuizZone = {
                players: new Map([
                    [
                        clientId,
                        {
                            id: clientId,
                            nickname: 'nick1',
                            state: PLAYER_STATE.WAIT,
                            score: 0,
                            submits: [],
                        },
                    ],
                ]),
                hostId: 'adminId',
                maxPlayers: 10,
                title: '테스트 퀴즈',
                description: '테스트 퀴즈입니다',
                quizzes: quizzes,
                stage: QUIZ_ZONE_STAGE.LOBBY,
                currentQuizIndex: -1,
                currentQuizStartTime: 0,
                currentQuizDeadlineTime: 0,
                intervalTime: 5000,
            };

            mockQuizZoneRepository.get.mockResolvedValue(mockQuizZone);

            const result = await service.findOthersInfo(quizZoneId, clientId);

            expect(result).toEqual([]);
        });
    });

    describe('getQuizZoneStage', () => {
        it('퀴즈존의 현재 단계를 반환한다', async () => {
            const quizZoneId = 'testQuizZone';
            const mockQuizZone: QuizZone = {
                players: new Map(),
                hostId: 'adminId',
                maxPlayers: 10,
                title: '테스트 퀴즈',
                description: '테스트 퀴즈입니다',
                quizzes: quizzes,
                stage: QUIZ_ZONE_STAGE.LOBBY,
                currentQuizIndex: -1,
                currentQuizStartTime: 0,
                currentQuizDeadlineTime: 0,
                intervalTime: 5000,
            };

            mockQuizZoneRepository.get.mockResolvedValue(mockQuizZone);

            const result = await service.getQuizZoneStage(quizZoneId);

            expect(result).toEqual(QUIZ_ZONE_STAGE.LOBBY);
        });

        it('존재하지 않는 퀴즈존을 조회하면 NotFoundException을 던진다', async () => {
            const quizZoneId = 'testQuizZone';
            mockQuizZoneRepository.get.mockResolvedValue(null);

            await expect(service.getQuizZoneStage(quizZoneId)).rejects.toThrow(NotFoundException);
        });
    });
});
