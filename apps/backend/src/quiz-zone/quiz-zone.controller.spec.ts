import { Test, TestingModule } from '@nestjs/testing';
import { QuizZoneController } from './quiz-zone.controller';
import { QuizZoneService } from './quiz-zone.service';
import { ConflictException } from '@nestjs/common';

describe('QuizZoneController', () => {
  let controller: QuizZoneController;
  const mockQuizZoneService = {
    create: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizZoneController],
      providers: [QuizZoneService],
    }).overrideProvider(QuizZoneService)
      .useValue(mockQuizZoneService).compile();

    controller = module.get<QuizZoneController>(QuizZoneController);
  });
  describe('create', () => {
    const sessionId = 'session123';
    const session = {'id':sessionId}
    it('유니크한 세션id로 퀴즈존을 만든다', async () => {
      // jest.spyOn(mockQuizZoneService, 'create').mockResolvedValueOnce(undefined); // 성공하는 경우

      await expect(controller.create(session)).resolves.toBeUndefined();
      expect(mockQuizZoneService.create).toHaveBeenCalledWith(sessionId);
    });

    it('세션id가 중복되면 예외가 발생한다.', async () => {
      jest.spyOn(mockQuizZoneService, 'create').mockRejectedValueOnce(new ConflictException('Data already exists'));

      await expect(controller.create(session)).rejects.toThrow(ConflictException);
      expect(mockQuizZoneService.create).toHaveBeenCalledWith(sessionId);
    });
  });


  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
