import { Test, TestingModule } from '@nestjs/testing';
import { QuizZoneService } from './quiz-zone.service';
import { QuizZoneRepositoryMemory } from './repository/quiz-zone.memory.repository';
import { ConflictException } from '@nestjs/common';
import { QuizZone } from './entities/quiz-zone.entity';

describe('QuizZoneService', () => {
    let service: QuizZoneService;
    let storage: Map<string, QuizZone>;

    beforeEach(async () => {
        storage = new Map();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                QuizZoneService,
                {
                    provide: 'QuizZoneRepository',
                    useClass: QuizZoneRepositoryMemory,
                },
                {
                    provide: 'QuizZoneStorage',
                    useValue: storage,
                },
            ],
        }).compile();

        service = module.get<QuizZoneService>(QuizZoneService);
    });

    describe('사용자가 퀴즈존 생성 요청을 보내면 퀴즈존을 생성한다.', () => {
        it('서버는 사용자의 세션 ID를 이용하여 퀴즈존을 생성한다.', async () => {
            const sid = '1234';

            await service.create(sid);

            const { player } = storage.get(sid);

            expect(player.id).toEqual(sid);
        });

        it('퀴즈존이 초기화되면 현재퀴즈번호는 0이다.', async () => {
            const sid = '1234';

            await service.create(sid);

            const { currentQuizIndex } = storage.get(sid);

            expect(currentQuizIndex).toEqual(0);
        });

        it('퀴즈존이 초기화되면 문제들이 할당된다.', async () => {
            const sid = '1234';

            await service.create(sid);

            const { quizzes } = storage.get(sid);

            expect(quizzes).toEqual(quizzes);
        });

        it('퀴즈존이 초기화되면 로비상태가 된다.', async () => {
            const sid = '1234';

            await service.create(sid);

            const { stage } = storage.get(sid);

            expect(stage).toEqual('LOBBY');
        });

        it('이미 만들어진 퀴즈존을 생성하면 에러가 발생한다.', async () => {
            const sid = '1234';

            await service.create(sid);

            expect(service.create(sid)).rejects.toThrow(ConflictException);
        });
    });
});
