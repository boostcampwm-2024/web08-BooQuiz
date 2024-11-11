import { Module } from '@nestjs/common';
import { QuizZoneService } from './quiz-zone.service';
import { QuizZoneController } from './quiz-zone.controller';
import { QuizZoneRepositoryMemory } from './quiz-zone.repository.memory';

export const QUIZ_ZONE_STORAGE = Symbol('QuizZoneStorage');

@Module({
    controllers: [QuizZoneController],
    providers: [
        QuizZoneService,
        QuizZoneRepositoryMemory,
        {
            provide: QUIZ_ZONE_STORAGE,
            useValue: new Map(),
        },
    ],
})
export class QuizZoneModule {}
