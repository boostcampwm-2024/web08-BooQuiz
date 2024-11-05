import { Test, TestingModule } from '@nestjs/testing';
import { QuizZoneService } from './quiz-zone.service';

describe('QuizZoneService', () => {
  let service: QuizZoneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuizZoneService],
    }).compile();

    service = module.get<QuizZoneService>(QuizZoneService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
