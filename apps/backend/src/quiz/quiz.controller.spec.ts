import { Test, TestingModule } from '@nestjs/testing';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';

describe('QuizController', () => {
    let controller: QuizController;
    let service: QuizService;

    const mockQuizService = {
        createQuizSet: jest.fn(),
        createQuiz: jest.fn(),
        getQuizzes: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [QuizController],
            providers: [
                {
                    provide: QuizService,
                    useValue: mockQuizService,
                },
            ],
        }).compile();

        controller = module.get<QuizController>(QuizController);
        service = module.get<QuizService>(QuizService);
    });

    describe('createQuizSet', () => {});

    describe('createQuiz', () => {});

    describe('getQuizzes', () => {});
});
