import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { QuizZoneService } from '../quiz-zone/quiz-zone.service';
import { SubmittedQuiz } from '../quiz-zone/entities/submitted-quiz.entity';
import { QuizZone } from '../quiz-zone/entities/quiz-zone.entity';
import { QuizResultSummaryDto } from './dto/quiz-result-summary.dto';

@Injectable()
export class PlayService {
    constructor(private readonly quizZoneService: QuizZoneService) {}

    async submit(quizZoneId: string, submitQuiz: SubmittedQuiz) {
        const quizZone = await this.quizZoneService.findOne(quizZoneId);
        this.submitQuiz(quizZone, submitQuiz);
    }

    async playNextQuiz(quizZoneId: string) {
        const quizZone = await this.quizZoneService.findOne(quizZoneId);
        const { intervalTime } = quizZone;

        const nextQuiz = await this.nextQuiz(quizZoneId);

        quizZone.player.state = 'PLAY';

        return {
            intervalTime,
            nextQuiz,
        };
    }

    private async nextQuiz(quizZoneId: string) {
        const quizZone = await this.quizZoneService.findOne(quizZoneId);

        quizZone.currentQuizIndex++;

        const { quizzes, currentQuizIndex, intervalTime } = quizZone;

        if (currentQuizIndex >= quizzes.length) {
            throw new NotFoundException('모든 퀴즈를 출제하였습니다.');
        }

        const nextQuiz = quizzes.at(currentQuizIndex);

        quizZone.stage = 'WAITING';
        quizZone.currentQuizStartTime = Date.now() + intervalTime;
        quizZone.currentQuizDeadlineTime = quizZone.currentQuizStartTime + nextQuiz.playTime;

        return {
            stage: quizZone.stage,
            question: nextQuiz.question,
            currentIndex: quizZone.currentQuizIndex,
            playTime: nextQuiz.playTime,
            startTime: quizZone.currentQuizStartTime,
            deadlineTime: quizZone.currentQuizDeadlineTime,
        };
    }

    async quizTimeOut(quizZoneId: string) {
        const quizZone = await this.quizZoneService.findOne(quizZoneId);
        this.submitQuiz(quizZone);
    }

    private submitQuiz(quizZone: QuizZone, submitQuiz?: SubmittedQuiz) {
        const { player, currentQuizIndex, quizzes, currentQuizDeadlineTime } = quizZone;
        const quiz = quizzes.at(currentQuizIndex);

        if (player.state !== 'PLAY') {
            throw new BadRequestException('정답을 제출할 수 없습니다.');
        }

        const now = Date.now();

        const submittedQuiz = {
            index: currentQuizIndex,
            answer: undefined,
            submittedAt: now,
            receivedAt: now,
            ...submitQuiz,
        };

        player.submits.push(submittedQuiz);

        if (
            quiz.answer === submittedQuiz.answer &&
            submittedQuiz.submittedAt <= currentQuizDeadlineTime
        ) {
            player.score++;
        }

        player.state = 'SUBMIT';
    }

    async summary(quizZoneId: string): Promise<QuizResultSummaryDto> {
        const quizZone = await this.quizZoneService.findOne(quizZoneId);
        const { player } = quizZone;
        return {
            score: player.score,
            submits: player.submits,
            quizzes: quizZone.quizzes,
        };
    }
    async clearQuizZone(quizZoneId: string) {
        const quizZone = await this.quizZoneService.findOne(quizZoneId);
        quizZone.player = {
            id: '',
            score: 0,
            submits: [],
            state: 'WAIT',
        };
        quizZone.currentQuizIndex = -1;
        quizZone.stage = 'WAITING';
    }
}
