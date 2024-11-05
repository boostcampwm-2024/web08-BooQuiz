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

  describe('사용자가 퀴즈존 생성 요청을 보내면 퀴즈존을 생성한다.', () => {
    it('서버는 사용자의 세션 ID를 이용하여 퀴즈존을 생성한다.', () => {
      const sid = '1234';
      service.create(sid);
    });

    it('사용자의 세션 ID로 퀴즈존 정보를 초기화한다.', () => {

    });

    it('퀴즈셋을 퀴즈존 세션에 저장한다.', () => {

    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
