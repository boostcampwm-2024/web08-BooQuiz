import { Test, TestingModule } from '@nestjs/testing';
import { quizzes, QuizZoneService } from './quiz-zone.service';
import { QuizZoneRepositoryMemory } from './quiz-zone.repository.memory';
import { QuizZone } from './entities/quiz-zone.entity';
import { SubmittedQuiz } from './entities/submitted.quiz';

describe('QuizZoneService', () => {
    let service: QuizZoneService;
    let repository: QuizZoneRepositoryMemory;
    let data: Record<string, QuizZone>;
    beforeEach(async () => {
        data = {};

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                QuizZoneService,
                QuizZoneRepositoryMemory,
                {
                    provide: 'DATA',
                    useValue: data,
                },
            ],
        }).compile();

        service = module.get<QuizZoneService>(QuizZoneService);
        repository = module.get<QuizZoneRepositoryMemory>(QuizZoneRepositoryMemory);
    });

    describe('사용자가 퀴즈존 생성 요청을 보내면 퀴즈존을 생성한다.', () => {
        it('서버는 사용자의 세션 ID를 이용하여 퀴즈존을 생성한다.', () => {
            const sid = '1234';

            service.create(sid);
            expect(data.hasOwnProperty(sid)).toEqual(true);
        });

        it('퀴즈존은 입장한 사용자 정보로 초기화된다.', () => {
            const sid = '1234';

            service.create(sid);
            expect(data[sid].player.id).toEqual(sid);
        });
        it('퀴즈존이 초기화되면 현재퀴즈번호는 0이다.', () => {
            const sid = '1234';

            service.create(sid);
            expect(data[sid].currentQuizIndex).toEqual(0);
        });
        it('퀴즈존이 초기화되면 문제들이 할당된다.', () => {
            const sid = '1234';
            service.create(sid);
            expect(data[sid].quizzes).toBe(quizzes);
        });
        it('퀴즈존이 초기화되면 로비상태가 된다.', () => {
            const sid = '1234';

            service.create(sid);
            expect(data[sid].stage).toEqual('LOBBY');
        });
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
