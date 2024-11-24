import { Test, TestingModule } from '@nestjs/testing';
import { QuizZoneRepositoryMemory } from './quiz-zone.memory.repository';
import { QuizZone } from '../entities/quiz-zone.entity';
import { QUIZ_ZONE_STAGE } from '../../common/constants';

describe('QuizZoneRepositoryMemory', () => {
    let storage: Map<string, QuizZone>;
    let repository: QuizZoneRepositoryMemory;

    beforeEach(async () => {
        storage = new Map();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                QuizZoneRepositoryMemory,
                {
                    provide: 'QuizZoneStorage',
                    useValue: storage,
                },
            ],
        }).compile();

        repository = module.get<QuizZoneRepositoryMemory>(QuizZoneRepositoryMemory);
    });

    describe('set', () => {
        it('세션 id와 퀴즈존 정보를 통해 새로운 퀴즈존 정보를 저장한다.', async () => {
            const quizZoneId = 'some-id';

            const quizZone: QuizZone = {
                players: new Map(),
                hostId: 'adminId',
                maxPlayers: 4,
                quizzes: [],
                stage: QUIZ_ZONE_STAGE.LOBBY,
                title: 'title',
                description: 'description',
                currentQuizIndex: 0,
                currentQuizStartTime: 0,
                currentQuizDeadlineTime: 0,
                intervalTime: 30_000,
            };

            await repository.set(quizZoneId, quizZone);

            expect(storage.get(quizZoneId)).toEqual(quizZone); // 생성된 객체와 동일한지 확인
        });
    });
});
