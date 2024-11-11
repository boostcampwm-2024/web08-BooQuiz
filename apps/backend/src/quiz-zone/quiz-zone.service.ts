import { BadRequestException, Injectable } from '@nestjs/common';
import { QuizZoneRepositoryMemory } from './quiz-zone.repository.memory';
import { Quiz } from './entities/quiz.entity';
import { Player } from './entities/player.entity';
import { QuizZone } from './entities/quiz-zone.entity';

const playTime = 30_000;

export const quizzes: Quiz[] = [
    { question: 'What is the capital of Korea?', answer: 'Seoul', playTime },
    { question: 'WsadfsafKorea?', answer: 'sadfsaf', playTime },
    { question: 'Wsdfaf?', answer: 'cvxvcx', playTime },
];

@Injectable()
export class QuizZoneService {
    constructor(private readonly quizZoneRepository: QuizZoneRepositoryMemory) {}

    async create(sessionId: string) {
        const player: Player = { id: sessionId, score: 0, submits: [], state: 'WAIT' };
        const quizZone: QuizZone = {
            currentQuizDeadlineTime: 0,
            currentQuizIndex: 0,
            currentQuizStartTime: 0,
            player,
            quizzes: [...quizzes],
            stage: 'LOBBY',
            intervalTime: 5000,
        };

        await this.quizZoneRepository.set(sessionId, quizZone);
    }

    async findOne(quizZoneId: string) {
        return this.quizZoneRepository.get(quizZoneId);
    }

    async progressQuizZone(quizZoneId: string) {
        const quizZone = await this.quizZoneRepository.get(quizZoneId);
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
