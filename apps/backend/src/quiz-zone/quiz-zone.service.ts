import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Quiz } from './entities/quiz.entity';
import { Player } from './entities/player.entity';
import { QuizZone } from './entities/quiz-zone.entity';
import { IQuizZoneRepository } from './repository/quiz-zone.repository.interface';
import { WaitingQuizZoneDto } from './dto/waiting-quiz-zone.dto';

const playTime = 30_000;

export const quizzes: Quiz[] = [
    { question: 'What is the capital of Korea?', answer: 'Seoul', playTime },
    { question: 'WsadfsafKorea?', answer: 'sadfsaf', playTime },
    { question: 'Wsdfaf?', answer: 'cvxvcx', playTime },
];

@Injectable()
export class QuizZoneService {
    constructor(
        @Inject('QuizZoneRepository')
        private readonly repository: IQuizZoneRepository,
    ) {}

    async create(sessionId: string) {
        const player: Player = { id: sessionId, score: 0, submits: [], state: 'WAIT' };
        const quizZone: QuizZone = {
            currentQuizDeadlineTime: 0,
            currentQuizIndex: -1,
            currentQuizStartTime: 0,
            player,
            quizzes: [...quizzes],
            stage: 'LOBBY',
            intervalTime: 5000,
        };

        await this.repository.set(sessionId, quizZone);
    }

    async findOne(quizZoneId: string) {
        return this.repository.get(quizZoneId);
    }

    async getQuizWaitingRoom(quizZoneId: string): Promise<WaitingQuizZoneDto> {
        const quizZone = await this.repository.get(quizZoneId);
        return {
            quizCount: quizZone.quizzes.length,
            stage: quizZone.stage,
        };
    }
    async progressQuizZone(quizZoneId: string) {
        const quizZone = await this.repository.get(quizZoneId);
        const { quizzes, currentQuizIndex, intervalTime } = quizZone;

        if (quizzes.length <= currentQuizIndex) {
            throw new BadRequestException('모든 퀴즈를 출제하였습니다.');
        }

        const quiz = quizzes.at(currentQuizIndex);
        const { playTime } = quiz;

        quizZone.stage = 'WAITING';
        quizZone.currentQuizStartTime = Date.now() + intervalTime;
        quizZone.currentQuizDeadlineTime = quizZone.currentQuizStartTime + playTime;

        return quizZone;
    }
}
