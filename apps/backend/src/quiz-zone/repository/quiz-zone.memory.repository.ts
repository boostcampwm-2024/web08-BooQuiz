import { IQuizZoneRepository } from './quiz-zone.repository.interface';
import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { QuizZone } from '../entities/quiz-zone.entity';

@Injectable()
export class QuizZoneRepositoryMemory implements IQuizZoneRepository {
    constructor(
        @Inject('QuizZoneStorage')
        private readonly data: Map<string, QuizZone>,
    ) {}

    async set(id: string, quizZone: QuizZone) {
        //! 1인 사용자일 때는 접속 할 때마다 퀴즈존 초기화
        // if (this.data.has(id)) {
        //     throw new ConflictException('Data already exists');
        // }

        this.data.set(id, quizZone);
    }

    async get(id: string) {
        const quizZone = this.data.get(id);

        if (quizZone === undefined) {
            throw new NotFoundException('QuizZone not found');
        }

        return quizZone;
    }

    async delete(id: string) {
        this.data.delete(id);
    }
}
