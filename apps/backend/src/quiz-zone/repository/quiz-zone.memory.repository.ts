import { IQuizZoneRepository } from './quiz-zone.repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { QuizZone } from '../entities/quiz-zone.entity';

@Injectable()
export class QuizZoneRepositoryMemory implements IQuizZoneRepository {
    constructor(
        @Inject('QuizZoneStorage')
        private readonly data: Map<string, QuizZone>,
    ) {}

    async get(id: string) {
        return this.data.get(id) ?? null;
    }

    async set(id: string, quizZone: QuizZone) {
        this.data.set(id, quizZone);
    }

    async has(id: string) {
        return this.data.has(id);
    }

    async delete(id: string) {
        this.data.delete(id);
    }
}
