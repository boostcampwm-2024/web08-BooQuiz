import { Test, TestingModule } from '@nestjs/testing';
import { QuizZoneRepositoryMemory } from './quiz-zone.repository.memory';
import { QuizZone } from './entities/quiz-zone.entity';
import { QuizZoneService } from './quiz-zone.service';
import { BadRequestException } from '@nestjs/common';

describe('QuizZoneRepositoryMemory', () => {
  let data: Record<string, QuizZone>;
  let repository: QuizZoneRepositoryMemory;

  beforeEach(async () => {
    data = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuizZoneRepositoryMemory,
        {
          provide: "DATA",
          useValue: data
        }
      ],
    }).compile();

    repository = module.get<QuizZoneRepositoryMemory>(QuizZoneRepositoryMemory);
  });

  describe('set', () => {
    it('세션 id와 퀴즈존 정보를 통해 새로운 퀴즈존 정보를 저장한다.', async () => {
      const id = 'some-id';
      const quizZone: QuizZone = {
        currentQuizDeadlineTime: 0,
        currentQuizIndex: 0,
        currentQuizStartTime: 0,
        player: undefined,
        quizzes: [],
        stage: undefined
      }

      await repository.set(id, quizZone);

      expect(data[id]).toEqual(quizZone); // 생성된 객체와 동일한지 확인
    });

    it('중복된 key 값이 입력으로 들어오면 에러가 발생한다.', async () => {
      const id = 'some-id';
      const quizZone: QuizZone = {
        currentQuizDeadlineTime: 0,
        currentQuizIndex: 0,
        currentQuizStartTime: 0,
        player: undefined,
        quizzes: [],
        stage: undefined
      }

      await repository.set(id, quizZone);

      expect(repository.set(id, quizZone)).rejects.toThrow(BadRequestException);
    });
  });
});
