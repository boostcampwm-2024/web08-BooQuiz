import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateQuizZoneDto } from './dto/create-quiz-zone.dto';
import { UpdateQuizZoneDto } from './dto/update-quiz-zone.dto';
import { QuizZoneRepositoryInterface } from './quiz-zone.repository.interface';
import { QuizZoneRepositoryMemory } from './quiz-zone.repository.memory';
import { Quiz } from './entities/quiz.entity';
import { Player } from './entities/player.entity';
import { QuizZone } from './entities/quiz-zone.entity';
import { SubmittedQuiz } from './entities/submitted.quiz';

export const quizzes: Quiz[] = [
    { index: 0, question: 'What is the capital of Korea?', answer: 'Seoul' },
    { index: 1, question: 'WsadfsafKorea?', answer: 'sadfsaf' },
    { index: 2, question: 'Wsdfaf?', answer: 'cvxvcx' },
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
        };

        await this.quizZoneRepository.set(sessionId, quizZone);
    }

    findAll() {
        return `This action returns all quizZone`;
    }

    findOne(id: number) {
        return `This action returns a #${id} quizZone`;
    }

    update(id: number, updateQuizZoneDto: UpdateQuizZoneDto) {
        return `This action updates a #${id} quizZone`;
    }

    remove(id: number) {
        return `This action removes a #${id} quizZone`;
    }
}
