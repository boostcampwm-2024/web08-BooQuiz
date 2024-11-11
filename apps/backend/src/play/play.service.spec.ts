import { Test, TestingModule } from '@nestjs/testing';
import { PlayService } from './play.service';
import { QuizZoneService } from '../quiz-zone/quiz-zone.service';

describe('PlayService', () => {
    let service: PlayService;

    const mockQuizZoneService = {
        findOne: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PlayService,
                {
                    provide: QuizZoneService,
                    useValue: mockQuizZoneService,
                },
            ],
        }).compile();

        service = module.get<PlayService>(PlayService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
