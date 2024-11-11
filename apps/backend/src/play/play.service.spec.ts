import { Test, TestingModule } from '@nestjs/testing';
import { PlayService } from './play.service';
import { PLAY_STORAGE } from './play.module';
import { QuizZoneService } from '../quiz-zone/quiz-zone.service';

describe('PlayService', () => {
    let service: PlayService;
    let data: Map<string, WebSocket>;

    const mockQuizZoneService = {
        findOne: jest.fn(),
    };

    beforeEach(async () => {
        data = new Map();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PlayService,
                {
                    provide: PLAY_STORAGE,
                    useValue: data,
                },
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
