import { QuizZoneRepositoryInterface } from './quiz-zone.repository.interface';
import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { QuizZone } from './entities/quiz-zone.entity';
import { QUIZ_ZONE_STORAGE } from './quiz-zone.module';

@Injectable()
export class QuizZoneRepositoryMemory implements QuizZoneRepositoryInterface {
    constructor(@Inject(QUIZ_ZONE_STORAGE) private readonly data: Map<string, QuizZone>) {}

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
