import { Test, TestingModule } from '@nestjs/testing';
import { PlayService } from './play.service';
import { QuizZoneService } from '../quiz-zone/quiz-zone.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

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

    describe('서버는 문제를 출제한다.', () => {
        it('서버가 현재 출제한 문제의 순차 번호를 저장한다.', async () => {
            quizZone.currentQuizIndex = -1;

            await playService.playNextQuiz('0');

            expect(quizZone.currentQuizIndex).toEqual(0);
        });

        it('서버는 현재 문제 번호에 해당하는 문제를 출제한다.', async () => {
            quizZone.currentQuizIndex = -1;

            const { nextQuiz } = await playService.playNextQuiz('0');

            expect(quizzes.at(quizZone.currentQuizIndex).question).toEqual(nextQuiz.question);
        });

        it('서버는 출제할 퀴즈가 없다면 예외를 발생시킨다.', () => {
            quizZone.currentQuizIndex = quizzes.length - 1;

            expect(playService.playNextQuiz('0')).rejects.toThrow(NotFoundException);
        });

        it('서버가 문제를 출제하면 퀴즈존의 상태는 "대기"로 바뀐다.', async () => {
            quizZone.currentQuizIndex = -1;

            await playService.playNextQuiz('0');

            expect(quizZone.stage).toEqual('WAITING');
        });

        it('서버는 문제를 출제할 때 제출 마감 시간을 저장한다.', async () => {
            jest.spyOn(Date, 'now').mockImplementation(() => 0);

            const quiz = quizzes.at(0);
            quiz.playTime = 100;

            quizZone.currentQuizIndex = -1;
            quizZone.intervalTime = 10;

            await playService.playNextQuiz('0');

            const limitTime = quiz.playTime + quizZone.intervalTime;

            expect(quizZone.currentQuizDeadlineTime).toEqual(limitTime);
        });

        it('서버는 사용자에게 퀴즈존의 현재 진행 상태인 "대기" 상태를 반환한다.', async () => {
            quizZone.currentQuizIndex = -1;

            const { nextQuiz } = await playService.playNextQuiz('0');

            expect(nextQuiz.stage).toEqual('WAITING');
        });

        it('서버는 사용자에게 현재 출제될 문제를 반환한다.', async () => {
            quizZone.currentQuizIndex = -1;

            const quiz = quizzes.at(0);
            const { nextQuiz } = await playService.playNextQuiz('0');

            expect(nextQuiz.question).toEqual(quiz.question);
        });

        it('서버는 사용자에게 현재 문제의 순차 번호를 반환한다.', async () => {
            quizZone.currentQuizIndex = -1;

            const { nextQuiz } = await playService.playNextQuiz('0');

            expect(nextQuiz.currentIndex).toEqual(0);
        });

        it('서버는 사용자에게 현재 문제의 풀이 제한 시간을 반환한다.', async () => {
            quizZone.currentQuizIndex = -1;

            const { nextQuiz } = await playService.playNextQuiz('0');
            const { playTime } = quizzes.at(0);

            expect(nextQuiz.playTime).toEqual(playTime);
        });

        it('서버는 사용자에게 현재 문제의 풀이 시작 시간을 반환한다.', async () => {
            jest.spyOn(Date, 'now').mockImplementation(() => 0);

            quizZone.currentQuizIndex = -1;

            const { nextQuiz } = await playService.playNextQuiz('0');

            expect(nextQuiz.startTime).toEqual(quizZone.intervalTime);
        });

        it('서버는 사용자에게 현재 문제의 풀이 종료 시간을 반환한다.', async () => {
            jest.spyOn(Date, 'now').mockImplementation(() => 0);

            quizZone.currentQuizIndex = -1;

            const { intervalTime, nextQuiz } = await playService.playNextQuiz('0');
            const { playTime } = quizzes.at(0);
            const deadline = intervalTime + playTime;

            expect(nextQuiz.deadlineTime).toEqual(deadline);
        });
    });

    describe('퀴즈 풀이 제한 시간이 지나면 현재 퀴즈 풀이를 종료한다.', () => {
        it('풀이를 진행중인 사용자가 제한된 시간에 답안을 제출하지 못하면 빈 답변으로 제출처리한다.', async () => {
            player.state = 'PLAY';
            player.submits = [];

            await playService.quizTimeOut('0');

            expect(player.submits.length).toEqual(1);
            expect(player.submits.at(0).answer).toEqual(undefined);
        });

        it('풀이가 진행중인 사용자가 아니면 예외가 발생한다.', () => {
            player.state = 'SUBMIT';
            expect(playService.quizTimeOut('0')).rejects.toThrow(BadRequestException);

            player.state = 'WAIT';
            expect(playService.quizTimeOut('0')).rejects.toThrow(BadRequestException);
        });
    });
});
