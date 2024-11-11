import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { WebSocket } from 'ws';
import { QuizZoneService } from '../quiz-zone/quiz-zone.service';
import { QuizZone } from '../quiz-zone/entities/quiz-zone.entity';
import { CurrentQuizDto } from './dto/current-quiz.dto';

@Injectable()
export class PlayService {
    private readonly plays: Map<WebSocket, { quizZoneId: string; submitHandle?: NodeJS.Timeout }> =
        new Map();

    constructor(private readonly quizZoneService: QuizZoneService) {}

    async join(quizZoneId: string, client: WebSocket) {
        const quizZone = await this.quizZoneService.findOne(quizZoneId);

        if (quizZone.player.id !== quizZoneId) {
            throw new UnauthorizedException('개설 정보가 일치하지 않습니다.');
        }

        this.plays.set(client, { quizZoneId });

        return quizZone;
    }

    async start(client: WebSocket, interval: number = 5000, playingTime: number = 30000) {
        const playInfo = this.plays.get(client);
        const quizZoneId = playInfo?.quizZoneId;
        if (quizZoneId === undefined) {
            throw new BadRequestException('퀴즈존을 찾을 수 없습니다.');
        }
        const quizZone = await this.quizZoneService.findOne(quizZoneId);
        quizZone.stage = 'WAITING';
        quizZone.currentQuizIndex = 0;
        quizZone.currentQuizStartTime = Date.now() + interval;
        quizZone.currentQuizDeadlineTime = quizZone.currentQuizStartTime + playingTime;

        playInfo.submitHandle = setTimeout(() => {
            client.send(JSON.stringify({ event: 'timeout' }));
        }, playingTime + interval);

        return this.makeQuiz(quizZone);
    }

    private makeQuiz(quizZone: QuizZone): CurrentQuizDto {
        return {
            question: quizZone.quizzes.find((quiz) => quiz.index === quizZone.currentQuizIndex)
                .question,
            stage: quizZone.stage,
            currentIndex: quizZone.currentQuizIndex,
            startTime: quizZone.currentQuizStartTime,
            deadlineTime: quizZone.currentQuizDeadlineTime,
        };
    }
}
