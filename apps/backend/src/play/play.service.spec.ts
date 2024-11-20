import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PlayService } from './play.service';
import { QuizZoneService } from '../quiz-zone/quiz-zone.service';
import { QuizZone } from '../quiz-zone/entities/quiz-zone.entity';
import { SubmittedQuiz } from '../quiz-zone/entities/submitted-quiz.entity';
import { PLAYER_STATE, QUIZ_ZONE_STAGE } from '../common/constants';

describe('PlayService', () => {
    let service: PlayService;
    let quizZoneService: jest.Mocked<QuizZoneService>;

    const mockQuizZone: QuizZone = {
        hostId: 'host-1',
        stage: QUIZ_ZONE_STAGE.LOBBY,
        intervalTime: 5000,
        maxPlayers: 10,
        currentQuizIndex: -1,
        title: '퀴즈 존',
        description: '퀴즈 존입니다',
        currentQuizStartTime: Date.now(),
        currentQuizDeadlineTime: Date.now() + 10000,
        submitCount: 0,
        quizzes: [
            { question: '1번 문제입니다', answer: '정답1', playTime: 30000 },
            { question: '2번 문제입니다', answer: '정답2', playTime: 30000 },
        ],
        players: new Map([
            [
                'player-1',
                {
                    id: 'player-1',
                    nickname: 'player1',
                    state: PLAYER_STATE.PLAY,
                    score: 0,
                    submits: [],
                },
            ],
        ]),
    };

    beforeEach(async () => {
        const mockQuizZoneService = {
            findOne: jest.fn(),
            clearQuizZone: jest.fn(),
            findOthersInfo: jest.fn(),
            checkHost: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [PlayService, { provide: QuizZoneService, useValue: mockQuizZoneService }],
        }).compile();

        service = module.get<PlayService>(PlayService);
        quizZoneService = module.get(QuizZoneService);
    });

    describe('답안 제출 테스트', () => {
        it('정상적으로 답안이 제출되어야 합니다', async () => {
            const submitQuiz: SubmittedQuiz = {
                index: 0,
                answer: '정답1',
                submittedAt: Date.now(),
                receivedAt: Date.now(),
            };

            quizZoneService.findOne.mockResolvedValue({ ...mockQuizZone });

            await service.submit('test-zone', 'player-1', submitQuiz);

            expect(quizZoneService.findOne).toHaveBeenCalledWith('test-zone');
        });

        it('플레이어가 PLAY 상태가 아닐 때 BadRequestException이 발생해야 합니다', async () => {
            const invalidQuizZone: QuizZone = {
                ...mockQuizZone,
                players: new Map([
                    [
                        'player-1',
                        {
                            ...mockQuizZone.players.get('player-1'),
                            state: PLAYER_STATE.SUBMIT,
                        },
                    ],
                ]),
            };

            quizZoneService.findOne.mockResolvedValue(invalidQuizZone);

            await expect(
                service.submit('test-zone', 'player-1', {} as SubmittedQuiz),
            ).rejects.toThrow(BadRequestException);
        });
    });

    describe('다음 퀴즈 진행 테스트', () => {
        it('다음 퀴즈 데이터를 정상적으로 반환해야 합니다', async () => {
            quizZoneService.findOne.mockResolvedValue({ ...mockQuizZone });

            const result = await service.playNextQuiz('test-zone');

            expect(result).toMatchObject({
                intervalTime: 5000,
                nextQuiz: expect.objectContaining({
                    question: expect.any(String),
                    playTime: expect.any(Number),
                    startTime: expect.any(Number),
                    deadlineTime: expect.any(Number),
                }),
            });
        });

        it('더 이상 출제할 퀴즈가 없을 때 NotFoundException이 발생해야 합니다', async () => {
            const completedQuizZone = {
                ...mockQuizZone,
                currentQuizIndex: 2,
            };

            quizZoneService.findOne.mockResolvedValue(completedQuizZone);

            await expect(service.playNextQuiz('test-zone')).rejects.toThrow(NotFoundException);
        });
    });

    describe('퀴즈 시간 초과 테스트', () => {
        it('PLAY 상태인 플레이어들의 시간 초과가 정상적으로 처리되어야 합니다', async () => {
            quizZoneService.findOne.mockResolvedValue({ ...mockQuizZone });

            await service.quizTimeOut('test-zone');

            expect(quizZoneService.findOne).toHaveBeenCalledWith('test-zone');
        });
    });

    describe('퀴즈 결과 요약 테스트', () => {
        it('플레이어의 퀴즈 결과 요약이 정상적으로 반환되어야 합니다', async () => {
            quizZoneService.findOne.mockResolvedValue({ ...mockQuizZone });

            const summary = await service.summary('test-zone', 'player-1');

            expect(summary).toMatchObject({
                score: expect.any(Number),
                submits: expect.any(Array),
                quizzes: expect.any(Array),
            });
        });
    });

    describe('전체 제출 확인 테스트', () => {
        it('모든 플레이어가 제출했을 때 true를 반환해야 합니다', async () => {
            const submittedQuizZone: QuizZone = {
                ...mockQuizZone,
                submitCount: 1,
                players: new Map([
                    [
                        'player-1',
                        { ...mockQuizZone.players.get('player-1'), state: PLAYER_STATE.SUBMIT },
                    ],
                ]),
            };

            quizZoneService.findOne.mockResolvedValue(submittedQuizZone);

            const result = await service.checkAllSubmitted('test-zone');
            expect(result).toBe(true);
        });

        it('일부 플레이어가 제출하지 않았을 때 false를 반환해야 합니다', async () => {
            const partialSubmitQuizZone: QuizZone = {
                ...mockQuizZone,
                submitCount: 0,
                players: new Map([
                    [
                        'player-1',
                        { ...mockQuizZone.players.get('player-1'), state: PLAYER_STATE.PLAY },
                    ],
                    [
                        'player-2',
                        { ...mockQuizZone.players.get('player-2'), state: PLAYER_STATE.SUBMIT },
                    ],
                ]),
            };

            quizZoneService.findOne.mockResolvedValue(partialSubmitQuizZone);

            const result = await service.checkAllSubmitted('test-zone');
            expect(result).toBe(false);
        });
    });
});
