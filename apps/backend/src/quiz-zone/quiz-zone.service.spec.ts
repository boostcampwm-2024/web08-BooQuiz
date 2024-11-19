import { Test, TestingModule } from '@nestjs/testing';
import { QuizZoneService } from './quiz-zone.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { QuizZone } from './entities/quiz-zone.entity';
import { IQuizZoneRepository } from './repository/quiz-zone.repository.interface';

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


describe('QuizZoneService', () => {
    let service: QuizZoneService;
    let repository: IQuizZoneRepository;
    const mockQuizZoneRepository = {
        set: jest.fn(),
        get: jest.fn(),
        delete: jest.fn(),
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
                    adminId,
                    stage: 'LOBBY',
                    currentQuizIndex: -1,
                    title: '넌센스 퀴즈',
                    description: '넌센스 퀴즈 입니다',
                })
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
                })
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
                    quizzes: expect.any(Array),
                })
            );
        });

        it('첫 번째 플레이어는 방장으로 등록된다', async () => {
            // given
            const quizZoneId = 'testQuizZone';
            const adminId = 'adminId';
            // when
            await service.create(quizZoneId, adminId);
        
            expect(repository.set).toHaveBeenCalledWith(
                quizZoneId,
                expect.objectContaining({
                    adminId: adminId,
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
                adminId: 'adminId',
                maxPlayers: 10,
                title: '테스트 퀴즈',
                description: '테스트 퀴즈입니다',
                quizzes: [],
                stage: 'LOBBY',
                currentQuizIndex: -1,
                currentQuizStartTime: 0,
                currentQuizDeadlineTime: 0,
                intervalTime: 5000,
            };
            mockQuizZoneRepository.get.mockResolvedValue(mockQuizZone);
            // when
            const result = await service.findOne(quizZoneId);
            // then
            expect(repository.get).toHaveBeenCalledWith(quizZoneId);
            expect(result).toEqual(mockQuizZone);
        });
    });
    describe('getQuizWaitingRoom', () => {
        const quizZoneId = 'testQuizZone';
        const sessionId = 'testSession';
     
        it('최대 인원을 초과하면 예외가 발생한다', async () => {
            // given
            const mockQuizZone: QuizZone = {
                players: new Map([
                    ['player1', { id: 'player1', nickname: '1', score: 0, submits: [], state: 'WAIT' }],
                    ['player2', { id: 'player2', nickname: '2', score: 0, submits: [], state: 'WAIT' }],
                ]),
                maxPlayers: 2,
                adminId: 'adminId',
                title: '테스트 퀴즈',
                description: '테스트 퀴즈입니다',
                quizzes: [],
                stage: 'LOBBY',
                currentQuizIndex: -1,
                currentQuizStartTime: 0,
                currentQuizDeadlineTime: 0,
                intervalTime: 5000,
            };
            mockQuizZoneRepository.get.mockResolvedValue(mockQuizZone);
     
            // when & then
            await expect(
                service.getQuizWaitingRoom(quizZoneId, sessionId)
            ).rejects.toThrow(BadRequestException);
        });
     
        it('플레이어가 추가될 때 닉네임이 순서대로 할당된다', async () => {
            // given
            const mockQuizZone: QuizZone = {
                players: new Map([
                    ['player1', { id: 'player1', nickname: nickNames[0], score: 0, submits: [], state: 'WAIT' }],
                ]),
                maxPlayers: 10,
                adminId: 'adminId',
                title: '테스트 퀴즈',
                description: '테스트 퀴즈입니다',
                quizzes: [],
                stage: 'LOBBY',
                currentQuizIndex: -1,
                currentQuizStartTime: 0,
                currentQuizDeadlineTime: 0,
                intervalTime: 5000,
            };
            mockQuizZoneRepository.get.mockResolvedValue(mockQuizZone);
     
            // when
            await service.getQuizWaitingRoom(quizZoneId, sessionId);
     
            // then
            const expectedPlayer = {
                id: sessionId,
                nickname: nickNames[1], // 두 번째 닉네임이 할당되어야 함
                score: 0,
                submits: [],
                state: 'WAIT'
            };
            expect(mockQuizZone.players.get(sessionId)).toEqual(expectedPlayer);
        });
     
        it('대기실 정보를 성공적으로 반환한다', async () => {
            // given
            const mockQuizZone: QuizZone = {
                players: new Map(),
                maxPlayers: 10,
                adminId: 'adminId',
                title: '테스트 퀴즈',
                description: '테스트 퀴즈입니다',
                quizzes: [{ question: 'test?', answer: 'test', playTime: 30000 }],
                stage: 'LOBBY',
                currentQuizIndex: -1,
                currentQuizStartTime: 0,
                currentQuizDeadlineTime: 0,
                intervalTime: 5000,
            };
            mockQuizZoneRepository.get.mockResolvedValue(mockQuizZone);
     
            // when
            const result = await service.getQuizWaitingRoom(quizZoneId, sessionId);
     
            // then
            // result는 대기실 정보를 담은 DTO
            expect(result).toEqual({
                quizZoneTitle: mockQuizZone.title,
                quizZoneDescription: mockQuizZone.description,
                quizCount: mockQuizZone.quizzes.length,
                stage: mockQuizZone.stage,
            });
     
            // 플레이어가 제대로 추가되었는지 확인
            const addedPlayer = mockQuizZone.players.get(sessionId);
            expect(addedPlayer).toBeDefined();
            expect(addedPlayer).toEqual({
                id: sessionId,
                nickname: nickNames[0],
                score: 0,
                submits: [],
                state: 'WAIT'
            });
        });
     });
    describe('findOthersInfo', () => {
        it('다른 플레이어들의 닉네임 목록을 반환한다', async () => {
            // given
            const quizZoneId = 'testQuizZone';
            const sessionId = 'player1';
            const mockQuizZone: QuizZone = {
                players: new Map([
                    ['player1', { id: 'player1', nickname: 'nick1', score: 0, submits: [], state: 'WAIT' }],
                    ['player2', { id: 'player2', nickname: 'nick2', score: 0, submits: [], state: 'WAIT' }],
                    ['player3', { id: 'player3', nickname: 'nick3', score: 0, submits: [], state: 'WAIT' }],
                ]),
                maxPlayers: 10,
                adminId: 'adminId',
                title: '테스트 퀴즈',
                description: '테스트 퀴즈입니다',
                quizzes: [],
                stage: 'LOBBY',
                currentQuizIndex: -1,
                currentQuizStartTime: 0,
                currentQuizDeadlineTime: 0,
                intervalTime: 5000,
            };
            mockQuizZoneRepository.get.mockResolvedValue(mockQuizZone);
            // when
            const result = await service.findOthersInfo(quizZoneId, sessionId);
            // then
            expect(result).toEqual(['nick2', 'nick3']);
            expect(result).not.toContain('nick1');
        });
    });
    describe('clearQuizZone', () => {
        it('퀴즈존을 삭제한다', async () => {
            // given
            const quizZoneId = 'testQuizZone';
            // when
            await service.clearQuizZone(quizZoneId);
            // then
            expect(repository.delete).toHaveBeenCalledWith(quizZoneId);
        });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
});