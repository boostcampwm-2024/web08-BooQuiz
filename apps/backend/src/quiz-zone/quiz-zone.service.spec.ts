import { Test, TestingModule } from '@nestjs/testing';
import { QuizZoneService } from './quiz-zone.service';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { QuizZone } from './entities/quiz-zone.entity';
import { IQuizZoneRepository } from './repository/quiz-zone.repository.interface';
import { Quiz } from './entities/quiz.entity';
import { Player } from './entities/player.entity';
import { PLAYER_STATE, QUIZ_ZONE_STAGE } from '../common/constants';

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
    { question: '신이 화나면?', answer: '신발끈', playTime },
    { question: '도둑이 훔친 돈을 뭐라고 하는가?', answer: '슬그머니', playTime },
    { question: '털이 있는 동물들이 가장 좋아하는 장소는?', answer: '모텔', playTime },
    { question: '아몬드가 죽으면?', answer: '다이아몬드', playTime },
    { question: '왕이 넘어지면?', answer: '킹콩', playTime },
    { question: '바나나가 웃으면?', answer: '바나나킥', playTime },
];

describe('QuizZoneService', () => {
    let service: QuizZoneService;
    let repository: IQuizZoneRepository;

    const mockQuizZoneRepository = {
        set: jest.fn(),
        get: jest.fn(),
        delete: jest.fn(),
        has: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                QuizZoneService,
                {
                    provide: 'QuizZoneRepository',
                    useValue: mockQuizZoneRepository,
                },
            ],
        }).compile();

        service = module.get<QuizZoneService>(QuizZoneService);
        repository = module.get<IQuizZoneRepository>('QuizZoneRepository');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('새로운 퀴즈존을 생성한다', async () => {
            const quizZoneId = 'testQuizZone';
            const adminId = 'adminId';

            mockQuizZoneRepository.has.mockResolvedValue(false);

            await service.create(quizZoneId, adminId);

            expect(repository.set).toHaveBeenCalledWith(
                quizZoneId,
                expect.objectContaining({
                    hostId: adminId,
                    stage: QUIZ_ZONE_STAGE.LOBBY,
                    currentQuizIndex: -1,
                    title: '넌센스 퀴즈',
                    description: '넌센스 퀴즈 입니다',
                }),
            );
        });

        it('이미 존재하는 퀴즈존 ID로 생성 시 ConflictException을 던진다', async () => {
            const quizZoneId = 'testQuizZone';
            const adminId = 'adminId';

            mockQuizZoneRepository.has.mockResolvedValue(true);

            await expect(service.create(quizZoneId, adminId)).rejects.toThrow(ConflictException);
        });
    });

    describe('findOne', () => {
        it('퀴즈존을 ID로 조회한다', async () => {
            const quizZoneId = 'testQuizZone';
            const mockQuizZone: QuizZone = {
                players: new Map(),
                hostId: 'adminId',
                maxPlayers: 10,
                title: '테스트 퀴즈',
                description: '테스트 퀴즈입니다',
                quizzes: [],
                stage: QUIZ_ZONE_STAGE.LOBBY,
                currentQuizIndex: -1,
                currentQuizStartTime: 0,
                currentQuizDeadlineTime: 0,
                intervalTime: 5000,
                submitCount: 0,
            };

            mockQuizZoneRepository.get.mockResolvedValue(mockQuizZone);

            const result = await service.findOne(quizZoneId);

            expect(repository.get).toHaveBeenCalledWith(quizZoneId);
            expect(result).toEqual(mockQuizZone);
        });

        it('존재하지 않는 퀴즈존 ID로 조회 시 NotFoundException을 던진다', async () => {
            const quizZoneId = 'testQuizZone';

            mockQuizZoneRepository.get.mockResolvedValue(null);

            await expect(service.findOne(quizZoneId)).rejects.toThrow(NotFoundException);
        });
    });

    describe('getLobbyInfo', () => {
        it('대기실 정보를 반환한다', async () => {
            const quizZoneId = 'testQuizZone';
            const clientId = 'clientId';
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
                stage: QUIZ_ZONE_STAGE.LOBBY,
                currentQuizIndex: -1,
                currentQuizStartTime: 0,
                currentQuizDeadlineTime: 0,
                intervalTime: 5000,
                submitCount: 0,
            };

            mockQuizZoneRepository.get.mockResolvedValue(mockQuizZone);

            const result = await service.getLobbyInfo(clientId, quizZoneId);

            expect(result).toEqual({
                currentPlayer: { id: clientId, nickname: '닉네임', state: PLAYER_STATE.WAIT },
                title: '테스트 퀴즈',
                description: '테스트 퀴즈입니다',
                quizCount: quizzes.length,
                stage: QUIZ_ZONE_STAGE.LOBBY,
                hostId: 'adminId',
            });
        });
    });

    describe('getProgressInfo', () => {
        it('진행 중인 퀴즈 정보를 반환한다', async () => {
            const quizZoneId = 'testQuizZone';
            const clientId = 'clientId';
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
                submitCount: 0,
            };

            mockQuizZoneRepository.get.mockResolvedValue(mockQuizZone);

            const result = await service.getProgressInfo(clientId, quizZoneId);

            expect(result).toEqual({
                currentPlayer: { id: clientId, nickname: '닉네임', state: PLAYER_STATE.WAIT },
                title: '테스트 퀴즈',
                description: '테스트 퀴즈입니다',
                quizCount: quizzes.length,
                stage: QUIZ_ZONE_STAGE.IN_PROGRESS,
                hostId: 'adminId',
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
    });

    describe('getResultInfo', () => {
        it('결과 정보를 반환한다', async () => {
            const quizZoneId = 'testQuizZone';
            const clientId = 'clientId';
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
                submitCount: 0,
            };

            mockQuizZoneRepository.get.mockResolvedValue(mockQuizZone);

            const result = await service.getResultInfo(clientId, quizZoneId);

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
                hostId: 'adminId',
            });
        });
    });

    describe('setPlayerInfo', () => {
        it('이미 등록된 플레이어는 추가하지 않는다', async () => {
            const quizZoneId = 'testQuizZone';
            const clientId = 'clientId';
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
                stage: QUIZ_ZONE_STAGE.LOBBY,
                currentQuizIndex: -1,
                currentQuizStartTime: 0,
                currentQuizDeadlineTime: 0,
                intervalTime: 5000,
                submitCount: 0,
            };

            mockQuizZoneRepository.get.mockResolvedValue(mockQuizZone);

            await service.setPlayerInfo(clientId, quizZoneId);

            expect(mockQuizZone.players.size).toBe(1);
        });

        it('정원을 초과하면 예외를 던진다', async () => {
            const quizZoneId = 'testQuizZone';
            const clientId = 'clientId';
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
                submitCount: 0,
            };

            mockQuizZoneRepository.get.mockResolvedValue(mockQuizZone);

            await expect(service.setPlayerInfo(clientId, quizZoneId)).rejects.toThrow(
                BadRequestException,
            );
        });

        it('플레이어가 추가될 때 닉네임이 순서대로 할당된다', async () => {
            const quizZoneId = 'testQuizZone';
            const clientId = 'clientId';
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
                submitCount: 0,
            };

            mockQuizZoneRepository.get.mockResolvedValue(mockQuizZone);

            await service.setPlayerInfo(clientId, quizZoneId);

            const expectedPlayer = {
                id: clientId,
                nickname: nickNames[1], // 두 번째 닉네임이 할당되어야 함
                score: 0,
                submits: [],
                state: PLAYER_STATE.WAIT,
            };
            expect(mockQuizZone.players.get(clientId)).toEqual(expectedPlayer);
        });
    });

    describe('checkValidPlayer', () => {
        it('유효한 플레이어인지 확인한다', async () => {
            const quizZoneId = 'testQuizZone';
            const clientId = 'clientId';
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
                stage: QUIZ_ZONE_STAGE.LOBBY,
                currentQuizIndex: -1,
                currentQuizStartTime: 0,
                currentQuizDeadlineTime: 0,
                intervalTime: 5000,
                submitCount: 0,
            };

            mockQuizZoneRepository.get.mockResolvedValue(mockQuizZone);

            await expect(service.checkValidPlayer(clientId, quizZoneId)).resolves.not.toThrow();
        });

        it('유효하지 않은 플레이어인 경우 예외를 던진다', async () => {
            const quizZoneId = 'testQuizZone';
            const clientId = 'clientId';
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
                submitCount: 0,
            };

            mockQuizZoneRepository.get.mockResolvedValue(mockQuizZone);

            await expect(service.checkValidPlayer(clientId, quizZoneId)).rejects.toThrow(
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
                submitCount: 0,
            };

            mockQuizZoneRepository.get.mockResolvedValue(mockQuizZone);

            const result = await service.findOthersInfo(quizZoneId, clientId);

            expect(result).toEqual([
                { nickname: 'nick2', id: 'player2' },
                { nickname: 'nick3', id: 'player3' },
            ]);
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
                submitCount: 0,
            };

            mockQuizZoneRepository.get.mockResolvedValue(mockQuizZone);

            const result = await service.getQuizZoneStage(quizZoneId);

            expect(result).toEqual(QUIZ_ZONE_STAGE.LOBBY);
        });
    });
});
