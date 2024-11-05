import { Test, TestingModule } from '@nestjs/testing';
import { QuizZoneController } from './quiz-zone.controller';
import { QuizZoneService } from './quiz-zone.service';

describe('QuizZoneController', () => {
  let controller: QuizZoneController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizZoneController],
      providers: [QuizZoneService],
    }).compile();

    controller = module.get<QuizZoneController>(QuizZoneController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
