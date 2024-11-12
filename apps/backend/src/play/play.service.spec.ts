import { Test, TestingModule } from '@nestjs/testing';
import { PlayService } from './play.service';
import { QuizZoneService } from '../quiz-zone/quiz-zone.service';
import { BadRequestException } from '@nestjs/common';

describe('PlayService', () => {
    let playService: PlayService;
    let quizZoneService: Partial<QuizZoneService>;

    const player = { score: 0, state: 'WAIT', submits: [] };
    const quizzes = [
        { question: 'Sample question1?', playTime: 1000, answer: '42' },
        { question: 'Sample question1?', playTime: 1000, answer: '42' },
    ];
    const submittedQuiz = {
        index: 0,
        receivedAt: 0,
        submittedAt: 50,
        answer: '42',
    };

    const quizZone = {
        player,
        quizzes,
        stage: 'IN_PROGRESS',
        currentQuizIndex: 0,
        currentQuizStartTime: 0,
        currentQuizDeadlineTime: 100,
        intervalTime: 500,
    };

    beforeEach(async () => {
        quizZoneService = {
            findOne: jest.fn().mockResolvedValue(quizZone),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [PlayService, { provide: QuizZoneService, useValue: quizZoneService }],
        }).compile();

        playService = module.get<PlayService>(PlayService);
    });

    describe('사용자는 퀴즈에 대한 정답을 제출할 수 있다.', () => {
        it('현재 퀴즈 풀이 상태인 사용자는 퀴즈에 대한 정답을 제출할 수 있다.', () => {
            player.state = 'PLAY';
            expect(playService.submit('0', submittedQuiz)).resolves;
        });

        it('사용자가 퀴즈 풀이 상태가 아니라면 퀴즈에 대한 정답을 제출할 수 없다.', () => {
            player.state = 'WAIT';
            expect(playService.submit('1', submittedQuiz)).rejects.toThrow(BadRequestException);

            player.state = 'SUBMIT';
            expect(playService.submit('1', submittedQuiz)).rejects.toThrow(BadRequestException);
        });

        it('사용자가 답안을 제출하면 사용자의 제출한 답안 목록에 제출한 답안을 추가한다.', async () => {
            player.state = 'PLAY';
            player.submits = [];

            await playService.submit('0', submittedQuiz);

            expect(player.submits.length).toEqual(1);
            expect(player.submits[0]).toEqual(submittedQuiz);
        });

        it('사용자가 제출한 답안이 정답이면 점수를 1점 올린다.', async () => {
            player.score = 0;
            player.state = 'PLAY';

            quizzes.at(0).answer = '1';

            submittedQuiz.answer = '1';

            await playService.submit('0', submittedQuiz);

            expect(player.score).toEqual(1);
        });

        it('사용자가 제출한 답안이 정답이 아니라면 점수의 변화는 없다.', async () => {
            player.score = 0;
            player.state = 'PLAY';

            quizzes.at(0).answer = '1';

            submittedQuiz.answer = '0';

            await playService.submit('0', submittedQuiz);

            expect(player.score).toEqual(0);
        });

        it('사용자가 정답을 제한시간 보다 늦게 제출했다면 점수의 변화는 없다.', async () => {
            player.score = 0;
            player.state = 'PLAY';

            quizzes.at(0).answer = '1';
            quizZone.currentQuizDeadlineTime = 100;

            submittedQuiz.answer = '1';
            submittedQuiz.submittedAt = 101;

            await playService.submit('0', submittedQuiz);

            expect(player.score).toEqual(0);
        });

        it('사용자가 제출을 완료하면, 사용자의 현재 상태를 "제출" 상태로 변경한다.', async () => {
            player.state = 'PLAY';

            await playService.submit('0', submittedQuiz);

            expect(player.state).toEqual('SUBMIT');
        });
    });
});
