import { Module } from '@nestjs/common';
import { QuizZoneService } from './quiz-zone.service';
import { QuizZoneController } from './quiz-zone.controller';
import { QuizZoneRepositoryMemory } from './quiz-zone.repository.memory';

const data = {};

@Module({
  controllers: [QuizZoneController],
  providers: [QuizZoneService, QuizZoneRepositoryMemory,
    {
      provide: "DATA",
      useValue: data,
    }],
})
export class QuizZoneModule {}
