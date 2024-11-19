import { Test, TestingModule } from '@nestjs/testing';
import { PlayService } from './play.service';
import { QuizZoneService } from '../quiz-zone/quiz-zone.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { QuizZone } from '../quiz-zone/entities/quiz-zone.entity';
import { Player } from '../quiz-zone/entities/player.entity';
import { SubmittedQuiz } from '../quiz-zone/entities/submitted-quiz.entity';
describe('PlayService', () => {
    let service: PlayService;
    let quizZoneService: QuizZoneService;
    const mockQuizZoneService = {
        findOne: jest.fn(),
        clearQuizZone: jest.fn(),
        findOthersInfo: jest.fn(),
    };
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PlayService,
                {
                    provide: QuizZoneService,
                    useValue: mockQuizZoneService,
                },
            ],
        }).compile();
        service = module.get<PlayService>(PlayService);
        quizZoneService = module.get<QuizZoneService>(QuizZoneService);
    });
    describe('submit', () => {
        const quizZoneId = 'test123';
        const clientId = 'player1';
        let mockQuizZone: QuizZone;
        beforeEach(() => {
            mockQuizZone = {
                players: new Map<string, Player>([
                    [
                        clientId,
                        {
                            id: clientId,
                            nickname: 'TestPlayer',
                            score: 0,
                            submits: [],
                            state: 'PLAY',
                        },
                    ],
                ]),
                adminId: 'admin1',
                maxPlayers: 10,
                quizzes: [{ question: 'test?', answer: 'correct', playTime: 30000 }],
                stage: 'IN_PROGRESS',
                currentQuizIndex: 0,
                currentQuizStartTime: Date.now(),
                currentQuizDeadlineTime: Date.now() + 30000,
                intervalTime: 5000,
                title: 'Test Quiz',
                description: 'Test Description',
            };
        });
        it('플레이어가 PLAY 상태가 아니면 예외가 발생한다', async () => {
            // given
            mockQuizZone.players.get(clientId).state = 'WAIT';
            mockQuizZoneService.findOne.mockResolvedValue(mockQuizZone);
            // when & then
            await expect(
                service.submit(quizZoneId, clientId, { index: 0, answer: 'test' }),
            ).rejects.toThrow(BadRequestException);
        });
        it('정답을 맞추고 제한시간 내에 제출하면 점수가 증가한다', async () => {
            // given
            const submitQuiz: SubmittedQuiz = {
                index: 0,
                answer: 'correct',
                submittedAt: mockQuizZone.currentQuizDeadlineTime - 1000,
            };
            mockQuizZoneService.findOne.mockResolvedValue(mockQuizZone);
            // when
            await service.submit(quizZoneId, clientId, submitQuiz);
            // then
            const player = mockQuizZone.players.get(clientId);
            expect(player.score).toBe(1);
            expect(player.state).toBe('SUBMIT');
            expect(player.submits).toHaveLength(1);
        });
        it('오답을 제출하면 점수가 증가하지 않는다', async () => {
            // given
            const submitQuiz: SubmittedQuiz = {
                index: 0,
                answer: 'wrong',
                submittedAt: mockQuizZone.currentQuizDeadlineTime - 1000,
            };
            mockQuizZoneService.findOne.mockResolvedValue(mockQuizZone);
            // when
            await service.submit(quizZoneId, clientId, submitQuiz);
            // then
            const player = mockQuizZone.players.get(clientId);
            expect(player.score).toBe(0);
        });
        it('제한시간 이후 제출하면 점수가 증가하지 않는다', async () => {
            // given
            const submitQuiz: SubmittedQuiz = {
                index: 0,
                answer: 'correct',
                submittedAt: mockQuizZone.currentQuizDeadlineTime + 1000,
            };
            mockQuizZoneService.findOne.mockResolvedValue(mockQuizZone);
            // when
            await service.submit(quizZoneId, clientId, submitQuiz);
            // then
            const player = mockQuizZone.players.get(clientId);
            expect(player.score).toBe(0);
        });
    });
    describe('playNextQuiz', () => {
        const quizZoneId = 'test123';
        let mockQuizZone: QuizZone;
        beforeEach(() => {
            mockQuizZone = {
                players: new Map<string, Player>([
                    [
                        'player1',
                        {
                            id: 'player1',
                            nickname: 'Player1',
                            score: 0,
                            submits: [],
                            state: 'SUBMIT',
                        },
                    ],
                ]),
                adminId: 'admin1',
                maxPlayers: 10,
                quizzes: [
                    { question: 'q1?', answer: 'a1', playTime: 30000 },
                    { question: 'q2?', answer: 'a2', playTime: 30000 },
                ],
                stage: 'IN_PROGRESS',
                currentQuizIndex: -1,
                currentQuizStartTime: 0,
                currentQuizDeadlineTime: 0,
                intervalTime: 5000,
                title: 'Test Quiz',
                description: 'Test Description',
            };
        });
        it('다음 퀴즈를 성공적으로 불러온다', async () => {
            // given
            mockQuizZoneService.findOne.mockResolvedValue(mockQuizZone);
            // when
            const result = await service.playNextQuiz(quizZoneId);
            // then
            expect(result.nextQuiz.currentIndex).toBe(0);
            expect(result.nextQuiz.question).toBe('q1?');
            expect(mockQuizZone.players.get('player1').state).toBe('WAIT');
        });
        it('모든 퀴즈를 출제했으면 예외가 발생한다', async () => {
            // given
            mockQuizZone.currentQuizIndex = 1;
            mockQuizZoneService.findOne.mockResolvedValue(mockQuizZone);
            // when & then
            await expect(service.playNextQuiz(quizZoneId)).rejects.toThrow(NotFoundException);
        });
    });
    describe('quizTimeOut', () => {
        it('PLAY 상태인 플레이어들만 제출 처리한다', async () => {
            // given
            const quizZoneId = 'test123';
            const mockQuizZone: QuizZone = {
                players: new Map([
                    [
                        'player1',
                        { id: 'player1', nickname: 'P1', score: 0, submits: [], state: 'PLAY' },
                    ],
                    [
                        'player2',
                        { id: 'player2', nickname: 'P2', score: 0, submits: [], state: 'SUBMIT' },
                    ],
                    [
                        'player3',
                        { id: 'player3', nickname: 'P3', score: 0, submits: [], state: 'PLAY' },
                    ],
                ]),
                adminId: 'admin1',
                maxPlayers: 10,
                quizzes: [{ question: 'test?', answer: 'answer', playTime: 30000 }],
                stage: 'IN_PROGRESS',
                currentQuizIndex: 0,
                currentQuizStartTime: Date.now(),
                currentQuizDeadlineTime: Date.now() + 30000,
                intervalTime: 5000,
                title: 'Test Quiz',
                description: 'Test Description',
            };
            mockQuizZoneService.findOne.mockResolvedValue(mockQuizZone);
            // when
            await service.quizTimeOut(quizZoneId);
            // then
            const player1 = mockQuizZone.players.get('player1');
            const player2 = mockQuizZone.players.get('player2');
            const player3 = mockQuizZone.players.get('player3');
            expect(player1.submits).toHaveLength(1);
            expect(player2.submits).toHaveLength(0);
            expect(player3.submits).toHaveLength(1);
            expect(player1.state).toBe('SUBMIT');
            expect(player2.state).toBe('SUBMIT');
            expect(player3.state).toBe('SUBMIT');
        });
    });
    describe('summary', () => {
        it('플레이어의 퀴즈 결과를 반환한다', async () => {
            // given
            const quizZoneId = 'test123';
            const clientId = 'player1';
            const mockQuizZone: QuizZone = {
                players: new Map([
                    [
                        clientId,
                        {
                            id: clientId,
                            nickname: 'TestPlayer',
                            score: 2,
                            submits: [
                                { index: 0, answer: 'correct', submittedAt: 1000 },
                                { index: 1, answer: 'wrong', submittedAt: 2000 },
                            ],
                            state: 'SUBMIT',
                        },
                    ],
                ]),
                adminId: 'admin1',
                maxPlayers: 10,
                quizzes: [
                    { question: 'q1?', answer: 'a1', playTime: 30000 },
                    { question: 'q2?', answer: 'a2', playTime: 30000 },
                ],
                stage: 'COMPLETED',
                currentQuizIndex: 1,
                currentQuizStartTime: 0,
                currentQuizDeadlineTime: 0,
                intervalTime: 5000,
                title: 'Test Quiz',
                description: 'Test Description',
            };
            mockQuizZoneService.findOne.mockResolvedValue(mockQuizZone);
            // when
            const result = await service.summary(quizZoneId, clientId);
            // then
            expect(result.score).toBe(2);
            expect(result.submits).toHaveLength(2);
            expect(result.quizzes).toHaveLength(2);
        });
    });
    describe('findClientInfo', () => {
        it('존재하지 않는 플레이어 정보를 요청하면 예외가 발생한다', async () => {
            // given
            const quizZoneId = 'test123';
            const clientId = 'nonexistent';
            const mockQuizZone: QuizZone = {
                players: new Map(),
                adminId: 'admin1',
                maxPlayers: 10,
                quizzes: [],
                stage: 'LOBBY',
                currentQuizIndex: -1,
                currentQuizStartTime: 0,
                currentQuizDeadlineTime: 0,
                intervalTime: 5000,
                title: 'Test Quiz',
                description: 'Test Description',
            };
            mockQuizZoneService.findOne.mockResolvedValue(mockQuizZone);
            // when & then
            await expect(service.findClientInfo(quizZoneId, clientId)).rejects.toThrow(
                NotFoundException,
            );
        });
        it('플레이어 정보를 성공적으로 반환한다', async () => {
            // given
            const quizZoneId = 'test123';
            const clientId = 'player1';
            const mockPlayer: Player = {
                id: clientId,
                nickname: 'TestPlayer',
                score: 0,
                submits: [],
                state: 'WAIT',
            };
            const mockQuizZone: QuizZone = {
                players: new Map([[clientId, mockPlayer]]),
                adminId: 'admin1',
                maxPlayers: 10,
                quizzes: [],
                stage: 'LOBBY',
                currentQuizIndex: -1,
                currentQuizStartTime: 0,
                currentQuizDeadlineTime: 0,
                intervalTime: 5000,
                title: 'Test Quiz',
                description: 'Test Description',
            };
            mockQuizZoneService.findOne.mockResolvedValue(mockQuizZone);
            // when
            const result = await service.findClientInfo(quizZoneId, clientId);
            // then
            expect(result).toEqual(mockPlayer);
        });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
});
