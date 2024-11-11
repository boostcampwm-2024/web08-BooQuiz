import { Module } from '@nestjs/common';
import { QuizZoneService } from './quiz-zone.service';
import { QuizZoneController } from './quiz-zone.controller';
import { QuizZoneRepositoryMemory } from './quiz-zone.repository.memory';

@Module({
    controllers: [QuizZoneController],
    providers: [QuizZoneService, QuizZoneRepositoryMemory],
    exports: [QuizZoneService],
})
export class QuizZoneModule {}
