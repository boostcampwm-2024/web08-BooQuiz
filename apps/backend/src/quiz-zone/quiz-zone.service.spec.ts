import { Test, TestingModule } from '@nestjs/testing';
import { QuizZoneService } from './quiz-zone.service';
import { BadRequestException } from '@nestjs/common';
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

    describe('create', () => {
        it('새로운 퀴즈존을 생성한다', async () => {
            // given
            const quizZoneId = 'testQuizZone';
            const adminId = 'adminId';

            // when
            await service.create(quizZoneId, adminId);

            // then
            expect(repository.set).toHaveBeenCalledWith(
                quizZoneId,
                expect.objectContaining({
                    hostId: adminId,
                    stage: 'LOBBY',
                    currentQuizIndex: -1,
                    title: '넌센스 퀴즈',
                    description: '넌센스 퀴즈 입니다',
                }),
            );
        });
        it('퀴즈존이 초기화되면 현재 퀴즈 번호는 -1로 초기화된다.', async () => {
            // given
            const quizZoneId = 'testQuizZone';
            const adminId = 'adminId';
            // when
            await service.create(quizZoneId, adminId);
            // then
            expect(repository.set).toHaveBeenCalledWith(
                quizZoneId,
                expect.objectContaining({
                    currentQuizIndex: -1,
                }),
            );
        });
        it('퀴즈존이 초기화되면 문제들이 할당된다.', async () => {
            // given
            const quizZoneId = 'testQuizZone';
            const adminId = 'adminId';
            // when
            await service.create(quizZoneId, adminId);
            // then
            expect(repository.set).toHaveBeenCalledWith(
                quizZoneId,
                expect.objectContaining({
                    quizzes: quizzes,
                }),
            );
        });

        it('첫 번째 플레이어는 방장으로 등록된다', async () => {
            // given
            const quizZoneId = 'testQuizZone';
            const hostId = 'hostId';
            // when
            await service.create(quizZoneId, hostId);

            expect(repository.set).toHaveBeenCalledWith(
                quizZoneId,
                expect.objectContaining({
                    hostId: hostId,
                }),
            );
        });
    });
    describe('findOne', () => {
        it('퀴즈존을 ID로 조회한다', async () => {
            // given
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
            // when
            const result = await service.findOne(quizZoneId);
            // then
            expect(repository.get).toHaveBeenCalledWith(quizZoneId);
            expect(result).toEqual(mockQuizZone);
        });
    });
    describe('getWaitingInfo', () => {
        const quizZoneId = 'testQuizZone';

        it('퀴즈존의 정적 정보를 성공적으로 반환한다', async () => {
            // given
            const mockQuizZone: QuizZone = {
                players: new Map(),
                maxPlayers: 10,
                hostId: 'adminId',
                title: '테스트 퀴즈',
                description: '테스트 퀴즈입니다',
                quizzes: [{ question: 'test?', answer: 'test', playTime: 30000 }],
                stage: QUIZ_ZONE_STAGE.LOBBY,
                currentQuizIndex: -1,
                currentQuizStartTime: 0,
                currentQuizDeadlineTime: 0,
                intervalTime: 5000,
                submitCount: 0,
            };
            mockQuizZoneRepository.get.mockResolvedValue(mockQuizZone);

            // when
            const result = await service.getWaitingInfo(quizZoneId);

            // then
            // result는 대기실 정보를 담은 DTO
            expect(result).toEqual({
                hostId: 'adminId',
                quizZoneTitle: mockQuizZone.title,
                quizZoneDescription: mockQuizZone.description,
                quizCount: mockQuizZone.quizzes.length,
                stage: mockQuizZone.stage,
            });
        });

        it('퀴즈존이 존재하지 않는 경우 에러를 던진다.', async () => {
            //given
            const quizZoneId = 'testQuizZone';
            mockQuizZoneRepository.get.mockRejectedValue(new BadRequestException());

            //when
            await expect(service.getWaitingInfo(quizZoneId)).rejects.toThrow(BadRequestException);
        });
    });

    describe('setPlayerInfo', () => {
        const quizZoneId = 'testQuizZone';
        const sessionId = 'testSession';

        it('이미 players에 등록된 사용자이면 players 추가하지 않는다.', async () => {
            const player = {
                id: 'player1',
                nickname: '1',
                score: 0,
                submits: [],
                state: PLAYER_STATE.WAIT,
            };

            //given
            const mockQuizZone: QuizZone = {
                players: new Map([
                    [
                        'player1',
                        {
                            id: 'player1',
                            nickname: '1',
                            score: 0,
                            submits: [],
                            state: PLAYER_STATE.WAIT,
                        },
                    ],
                    [
                        'player2',
                        {
                            id: 'player2',
                            nickname: '2',
                            score: 0,
                            submits: [],
                            state: PLAYER_STATE.WAIT,
                        },
                    ],
                ]),
                maxPlayers: 5,
                hostId: 'adminId',
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

            //when
            await service.setPlayerInfo(quizZoneId, player.id);

            //then
            expect(mockQuizZone.players.size).toEqual(2);
        });

        it('최대 인원을 초과하면 예외가 발생한다', async () => {
            // given
            const mockQuizZone: QuizZone = {
                players: new Map([
                    [
                        'player1',
                        {
                            id: 'player1',
                            nickname: '1',
                            score: 0,
                            submits: [],
                            state: PLAYER_STATE.WAIT,
                        },
                    ],
                    [
                        'player2',
                        {
                            id: 'player2',
                            nickname: '2',
                            score: 0,
                            submits: [],
                            state: PLAYER_STATE.WAIT,
                        },
                    ],
                ]),
                maxPlayers: 2,
                hostId: 'adminId',
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

            // when & then
            await expect(service.setPlayerInfo(quizZoneId, sessionId)).rejects.toThrow(
                BadRequestException,
            );
        });

        it('플레이어가 추가될 때 닉네임이 순서대로 할당된다', async () => {
            // given
            const mockQuizZone: QuizZone = {
                players: new Map([
                    [
                        'player1',
                        {
                            id: 'player1',
                            nickname: nickNames[0],
                            score: 0,
                            submits: [],
                            state: PLAYER_STATE.WAIT,
                        },
                    ],
                ]),
                maxPlayers: 10,
                hostId: 'adminId',
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

            // when
            await service.setPlayerInfo(quizZoneId, sessionId);

            // then
            const expectedPlayer = {
                id: sessionId,
                nickname: nickNames[1], // 두 번째 닉네임이 할당되어야 함
                score: 0,
                submits: [],
                state: 'WAIT',
            };
            expect(mockQuizZone.players.get(sessionId)).toEqual(expectedPlayer);
        });

        it('퀴즈존의 사용자가 성공적으로 추가된다', async () => {
            const mockQuizZone: QuizZone = {
                players: new Map(),
                maxPlayers: 10,
                hostId: 'adminId',
                title: '테스트 퀴즈',
                description: '테스트 퀴즈입니다',
                quizzes: [{ question: 'test?', answer: 'test', playTime: 30000 }],
                stage: QUIZ_ZONE_STAGE.LOBBY,
                currentQuizIndex: -1,
                currentQuizStartTime: 0,
                currentQuizDeadlineTime: 0,
                intervalTime: 5000,
                submitCount: 0,
            };
            mockQuizZoneRepository.get.mockResolvedValue(mockQuizZone);

            // when
            await service.setPlayerInfo(quizZoneId, sessionId);

            // 플레이어가 제대로 추가되었는지 확인
            const addedPlayer = mockQuizZone.players.get(sessionId);
            expect(addedPlayer).toBeDefined();
            expect(addedPlayer).toEqual({
                id: sessionId,
                nickname: nickNames[0],
                score: 0,
                submits: [],
                state: 'WAIT',
            });
        });
    });

    describe('findOthersInfo', () => {
        it('다른 플레이어들의 닉네임 목록을 반환한다', async () => {
            // given
            const quizZoneId = 'testQuizZone';
            const sessionId = 'player1';
            const players = new Map<string, Player>([
                [
                    'player1',
                    {
                        id: 'player1',
                        nickname: 'nick1',
                        score: 0,
                        submits: [],
                        state: PLAYER_STATE.WAIT,
                    },
                ],
                [
                    'player2',
                    {
                        id: 'player2',
                        nickname: 'nick2',
                        score: 0,
                        submits: [],
                        state: PLAYER_STATE.WAIT,
                    },
                ],
                [
                    'player3',
                    {
                        id: 'player3',
                        nickname: 'nick3',
                        score: 0,
                        submits: [],
                        state: PLAYER_STATE.WAIT,
                    },
                ],
            ]);

            const mockQuizZone: QuizZone = {
                players,
                maxPlayers: 10,
                hostId: 'adminId',
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

            // when
            const result = await service.findOthersInfo(quizZoneId, sessionId);

            // then
            expect(result).toEqual([
                { nickname: 'nick2', id: 'player2' },
                { nickname: 'nick3', id: 'player3' },
            ]);

            expect(result).not.toContain('nick1');
        });
    });

    describe('clearQuizZone', () => {
        it('퀴즈존을 삭제한다', async () => {
            // given
            const quizZoneId = 'testQuizZone';

            mockQuizZoneRepository.has.mockResolvedValue(true);

            // when
            await service.clearQuizZone(quizZoneId);

            // then
            expect(repository.delete).toHaveBeenCalledWith(quizZoneId);
        });

        it('존재하지 않는 퀴즈존을 삭제하려 시도하면 에러가 발생한다.', async () => {
            // given
            const quizZoneId = 'testQuizZone';

            // when
            mockQuizZoneRepository.has.mockResolvedValue(false);

            // then
            expect(service.clearQuizZone(quizZoneId)).rejects.toThrow(BadRequestException);
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});
