import { QuizZoneRepositoryInterface } from './quiz-zone.repository.interface';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { QuizZone } from './entities/quiz-zone.entity';

@Injectable()
export class QuizZoneRepositoryMemory implements QuizZoneRepositoryInterface {
    private readonly data: Map<string, QuizZone> = new Map();

    async set(id: string, quizZone: QuizZone) {
        if (this.data.has(id)) {
            throw new ConflictException('Data already exists');
        }

        this.data.set(id, quizZone);
    }

    async get(id: string) {
        const quizZone = this.data.get(id);

        if (quizZone === undefined) {
            throw new NotFoundException('QuizZone not found');
        }

        return quizZone;
    }
}
