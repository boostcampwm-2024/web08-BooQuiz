import { Test, TestingModule } from '@nestjs/testing';
import { QuizZoneService } from './quiz-zone.service';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { QuizZone } from './entities/quiz-zone.entity';
import { IQuizZoneRepository } from './repository/quiz-zone.repository.interface';
import { Quiz } from './entities/quiz.entity';
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
    { question: '포도가 자기소개하면?', answer: '포도당', playTime },
    { question: '고양이를 싫어하는 동물은?', answer: '미어캣', playTime },
    { question: '게를 냉동실에 넣으면?', answer: '게으름', playTime },
    { question: '오리를 생으로 먹으면?', answer: '회오리', playTime },
    { question: '네 사람이 동시에 오줌을 누면?', answer: '포뇨', playTime },
    { question: '지브리가 뭘로 돈 벌게요?', answer: '토토로', playTime },
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
        const quizZoneId = 'testQuizZone';

        it('퀴즈존을 ID로 조회한다', async () => {
            // given
            const mockQuizZone: QuizZone = {
                players: new Map(),
                hostId: 'adminId',
                maxPlayers: 10,
                title: '테스트 퀴즈',
                description: '테스트 퀴즈입니다',
                quizzes: quizzes.map((quiz) => ({
                    ...quiz,
                    question: Buffer.from(quiz.question).toString('base64'),
                })),
                stage: QUIZ_ZONE_STAGE.LOBBY,
                currentQuizIndex: -1,
                currentQuizStartTime: 0,
                currentQuizDeadlineTime: 0,
                intervalTime: 5000,
                submitCount: 0,
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
                submitCount: 0,
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
                submitCount: 0,
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
                submitCount: 0,
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
                submitCount: 0,
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
                submitCount: 0,
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
                submitCount: 0,
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
                submitCount: 0,
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
                submitCount: 0,
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
                submitCount: 0,
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

    describe('leave', () => {
        it('퀴즈존에서 플레이어를 제거한다', async () => {
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
                submitCount: 0,
            };

            mockQuizZoneRepository.get.mockResolvedValue(mockQuizZone);

            await service.leave(quizZoneId, clientId);

            expect(mockQuizZone.players.has(clientId)).toBeFalsy();
        });
    });
});
