import { Test, TestingModule } from '@nestjs/testing';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { CreateQuizSetRequestDto } from './dto/create-quiz-set-request.dto';
import { CreateQuizRequestDto } from './dto/create-quiz-request.dto';
import { NotFoundException } from '@nestjs/common';
import { QUIZ_TYPE } from '../common/constants';

describe('QuizController', () => {
    let quizController: QuizController;
    let quizService: QuizService;

    const mockQuizService = {
        createQuizSet: jest.fn(),
        createQuizzes: jest.fn(),
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

        quizController = module.get<QuizController>(QuizController);
        quizService = module.get<QuizService>(QuizService);
    });

    describe('createQuizSet', () => {
        it('새로운 퀴즈셋을 생성한다.', async () => {
            // given
            const dto: CreateQuizSetRequestDto = { name: '퀴즈셋 이름' };
            const response = { id: 1 };
            mockQuizService.createQuizSet.mockResolvedValue(response);

            // when
            const result = await quizController.createQuizSet(dto);

            // then
            expect(quizService.createQuizSet).toHaveBeenCalledWith(dto.name);
            expect(result).toEqual(response);
        });
    });

    describe('createQuiz', () => {
        it('새로운 퀴즈를 생성한다.', async () => {
            // given
            const quizSetId = 1;
            const dto = [
                {
                    question: '퀴즈 질문',
                    answer: '퀴즈 정답',
                    playTime: 1000,
                    quizType: QUIZ_TYPE.SHORT_ANSWER,
                },
            ] as CreateQuizRequestDto[];

            // when
            await quizController.createQuizzes(quizSetId, dto);

            // then
            expect(quizService.createQuizzes).toHaveBeenCalledWith(quizSetId, dto);
        });
    });

    describe('findQuizzes', () => {
        it('퀴즈셋의 퀴즈들을 성공적으로 반환한다.', async () => {
            // given
            const quizSetId = 1;
            const quizzes = [
                {
                    id: 1,
                    question: '퀴즈 질문',
                    answer: '퀴즈 정답',
                    playTime: 1000,
                    quizType: 'SHORT_ANSWER',
                },
            ];
            mockQuizService.getQuizzes.mockResolvedValue(quizzes);

            // when
            const result = await quizController.findQuizzes(quizSetId);

            // then
            expect(quizService.getQuizzes).toHaveBeenCalledWith(quizSetId);
            expect(result).toEqual(quizzes);
        });

        it('존재하지 않는 퀴즈셋 ID인 경우 예외를 던진다.', async () => {
            // given
            const quizSetId = 2;
            mockQuizService.getQuizzes.mockRejectedValue(
                new NotFoundException(`해당 퀴즈셋을 찾을 수 없습니다.`),
            );

            // when & then
            await expect(quizController.findQuizzes(quizSetId)).rejects.toThrow(NotFoundException);
        });
    });
});
