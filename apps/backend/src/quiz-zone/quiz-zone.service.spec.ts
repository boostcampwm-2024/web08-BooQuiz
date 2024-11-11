import { Test, TestingModule } from '@nestjs/testing';
import { quizzes, QuizZoneService } from './quiz-zone.service';
import { QuizZoneRepositoryMemory } from './quiz-zone.repository.memory';
import { QuizZone } from './entities/quiz-zone.entity';
import { ConflictException } from '@nestjs/common';
import { QUIZ_ZONE_STORAGE } from './quiz-zone.module';

describe('QuizZoneService', () => {
    let service: QuizZoneService;
    let repository: QuizZoneRepositoryMemory;
    let data: Map<string, QuizZone>;
    beforeEach(async () => {
        data = new Map();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                QuizZoneRepositoryMemory,
                QuizZoneService,
                {
                    provide: QUIZ_ZONE_STORAGE,
                    useValue: data,
                },
            ],
        }).compile();

        repository = module.get<QuizZoneRepositoryMemory>(QuizZoneRepositoryMemory);
        service = module.get<QuizZoneService>(QuizZoneService);
    });

    describe('사용자가 퀴즈존 생성 요청을 보내면 퀴즈존을 생성한다.', () => {
        it('서버는 사용자의 세션 ID를 이용하여 퀴즈존을 생성한다.', async () => {
            const sid = '1234';

            await service.create(sid);
            expect(data.has(sid)).toEqual(true);
        });

        it('퀴즈존은 입장한 사용자 정보로 초기화된다.', async () => {
            const sid = '1234';
            await service.create(sid);
            expect(data.get(sid).player.id).toEqual(sid);
        });

        it('퀴즈존이 초기화되면 현재퀴즈번호는 0이다.', async () => {
            const sid = '1234';

            await service.create(sid);
            expect(data.get(sid).currentQuizIndex).toEqual(0);
        });

        it('퀴즈존이 초기화되면 문제들이 할당된다.', async () => {
            const sid = '1234';
            await service.create(sid);
            expect(data.get(sid).quizzes).toEqual(quizzes);
        });

        it('퀴즈존이 초기화되면 로비상태가 된다.', async () => {
            const sid = '1234';
            await service.create(sid);
            expect(data.get(sid).stage).toEqual('LOBBY');
        });

        it('이미 만들어진 퀴즈존을 생성하면 에러가 발생한다.', async () => {
            const sid = '1234';
            await service.create(sid);
            expect(service.create(sid)).rejects.toThrow(ConflictException);
        });
    });
});
