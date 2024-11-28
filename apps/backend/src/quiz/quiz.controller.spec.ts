import { Test, TestingModule } from '@nestjs/testing';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { UpdateQuizRequestDto } from './dto/update-quiz-request.dto';
import { QUIZ_TYPE } from '../common/constants';

describe('QuizController', () => {
    let quizController: QuizController;
    let quizService: QuizService;

    const mockQuizService = {
        createQuizSet: jest.fn(),
        createQuizzes: jest.fn(),
        getQuizzes: jest.fn(),
        deleteQuiz: jest.fn(),
        updateQuiz: jest.fn(),
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

        quizController = module.get<QuizController>(QuizController);
        quizService = module.get<QuizService>(QuizService);
    });

    it('updateQuiz', async () => {
        //given
        const quizId = 1;
        const updateQuizRequestDto: UpdateQuizRequestDto = {
            question: '업데이트 퀴즈 질문',
            answer: '업데이트 퀴즈 정답',
            playTime: 10,
            quizType: QUIZ_TYPE.SHORT_ANSWER
        }

        mockQuizService.updateQuiz.mockResolvedValue(undefined);

        //when
        await quizController.updateQuiz(quizId, updateQuizRequestDto);

        //then
        expect(mockQuizService.updateQuiz).toHaveBeenCalled();
        expect(mockQuizService.updateQuiz).toHaveBeenCalledWith(quizId, updateQuizRequestDto);
    })

    it('deleteQuiz', async () => {
        //given
        const quizId = 1;
        mockQuizService.deleteQuiz.mockResolvedValue(undefined);

        //when
        await quizController.deleteQuiz(quizId);

        //then
        expect(mockQuizService.deleteQuiz).toHaveBeenCalled();
        expect(mockQuizService.deleteQuiz).toHaveBeenCalledWith(quizId);
    })

});
