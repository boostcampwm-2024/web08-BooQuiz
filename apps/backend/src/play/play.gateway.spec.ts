import { Test, TestingModule } from '@nestjs/testing';
import { PlayGateway } from './play.gateway';
import { PlayService } from './play.service';
import { QuizZoneService } from '../quiz-zone/quiz-zone.service';
import { QuizZoneRepositoryMemory } from '../quiz-zone/quiz-zone.repository.memory';
import { QUIZ_ZONE_STORAGE } from '../quiz-zone/quiz-zone.module';

describe('PlayGateway', () => {
    let gateway: PlayGateway;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PlayGateway,
                PlayService,
                QuizZoneService,
                QuizZoneRepositoryMemory,
                {
                    provide: QUIZ_ZONE_STORAGE,
                    useValue: new Map(),
                },
            ],
        }).compile();

        gateway = module.get<PlayGateway>(PlayGateway);
    });

    it('should be defined', () => {
        expect(gateway).toBeDefined();
    });
});
