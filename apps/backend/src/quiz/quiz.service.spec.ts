import { Test, TestingModule } from '@nestjs/testing';
import { QuizService } from './quiz.service';
import { QuizRepository } from './repository/quiz.repository';
import { QuizSetRepository } from './repository/quiz-set.repository';
import { QuizSet } from './entity/quiz-set.entity';
import { QUIZ_TYPE } from '../common/constants';
import { CreateQuizRequestDto } from './dto/create-quiz-request.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('QuizService', () => {
    let service: QuizService;
    let quizRepository: QuizRepository;
    let quizSetRepository: QuizSetRepository;

    const mockQuizRepository = {
        save: jest.fn(),
        findBy: jest.fn(),
    };

    const mockQuizSetRepository = {
        save: jest.fn(),
        findOneBy: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                QuizService,
                {
                    provide: QuizRepository,
                    useValue: mockQuizRepository,
                },
                {
                    provide: QuizSetRepository,
                    useValue: mockQuizSetRepository,
                },
            ],
        }).compile();

        service = module.get<QuizService>(QuizService);
        quizRepository = module.get<QuizRepository>(QuizRepository);
        quizSetRepository = module.get<QuizSetRepository>(QuizSetRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createQuizSet', () => {
        it('새로운 퀴즈셋을 생성한다', async () => {
            //given
            const quizSetName = '퀴즈셋 이름';
            const quizSet = new QuizSet('퀴즈셋 이름');
            quizSet.id = 1;
            mockQuizSetRepository.save.mockResolvedValue({ id: quizSet.id });

            //when
            const result = await service.createQuizSet(quizSetName);

            //then
            expect(result.id).toEqual(1);
        });

        it('quizSetRepository.save가 에러 발생한다.', async () => {
            //given
            const quizSetName = '퀴즈셋 이름';
            mockQuizSetRepository.save.mockRejectedValue(new Error('DB 오류'));

            //when
            await expect(service.createQuizSet(quizSetName)).rejects.toThrow('DB 오류');
        });
    });

    describe('createQuiz', () => {
        it('새로운 퀴즈를 하나 생성한다', async () => {
            //given
            const quizSetId = 1;
            const dto = [
                {
                    question: '퀴즈 질문',
                    answer: '퀴즈 정답',
                    playTime: 1000,
                    quizType: QUIZ_TYPE.SHORT_ANSWER,
                },
            ] as CreateQuizRequestDto[];
            const quiz = {
                ...dto[0],
                id: 1,
                quizSet: {
                    id: quizSetId,
                    name: '퀴즈셋 이름',
                },
            };

            mockQuizSetRepository.findOneBy.mockResolvedValue(quizSetId);
            dto[0].toEntity = jest.fn().mockReturnValue(quiz);
            mockQuizRepository.save.mockResolvedValue(quiz);

            //when
            const result = await service.createQuizzes(1, dto);

            //then
            expect(dto[0].toEntity).toHaveBeenCalledTimes(1);
            expect(dto[0].toEntity).toHaveBeenCalledWith(quizSetId);

            expect(mockQuizRepository.save).toHaveBeenCalledTimes(1);
            expect(mockQuizRepository.save).toHaveBeenCalledWith([quiz]);
        });

        it('새로운 퀴즈를 여러 개를 생성한다', async () => {
            //given
            const quizSetId = 1;
            const dto = [
                {
                    question: '퀴즈 질문1',
                    answer: '퀴즈 정답1',
                    playTime: 1000,
                    quizType: QUIZ_TYPE.SHORT_ANSWER,
                },
                {
                    question: '퀴즈 질문2',
                    answer: '퀴즈 정답2',
                    playTime: 1000,
                    quizType: QUIZ_TYPE.SHORT_ANSWER,
                },
            ] as CreateQuizRequestDto[];

            const quiz1 = {
                ...dto[0],
                id: 1,
                quizSet: {
                    id: quizSetId,
                    name: '퀴즈셋 이름',
                },
            };
            const quiz2 = {
                ...dto[1],
                id: 2,
                quizSet: {
                    id: quizSetId,
                    name: '퀴즈셋 이름',
                },
            };

            mockQuizSetRepository.findOneBy.mockResolvedValue(quizSetId);
            dto[0].toEntity = jest.fn().mockReturnValue(quiz1);
            dto[1].toEntity = jest.fn().mockReturnValue(quiz2);
            mockQuizRepository.save.mockResolvedValue([quiz1, quiz2]);

            //when
            const result = await service.createQuizzes(1, dto);

            //then
            expect(dto[0].toEntity).toHaveBeenCalledTimes(1);
            expect(dto[0].toEntity).toHaveBeenCalledWith(quizSetId);

            expect(mockQuizRepository.save).toHaveBeenCalledTimes(1);
            expect(mockQuizRepository.save).toHaveBeenCalledWith([quiz1, quiz2]);
        });

        it('QuizSetId가 존재하지 않는 경우', async () => {
            //given
            const quizSetId = 2;
            const dto = [
                {
                    question: '퀴즈 질문',
                    answer: '퀴즈 정답',
                    playTime: 1000,
                    quizType: QUIZ_TYPE.SHORT_ANSWER,
                },
            ] as CreateQuizRequestDto[];

            mockQuizSetRepository.findOneBy.mockResolvedValue(null);

            //when
            //then
            await expect(service.createQuizzes(quizSetId, dto)).rejects.toThrow(
                BadRequestException,
            );
        });
    });

    describe('getQuizzes', () => {
        it('퀴즈셋의 퀴즈들을 정상적으로 반환한다. ', async () => {
            //given
            const quizList = [
                {
                    id: 1,
                    question: '네명에서 오줌을 싸면?',
                    answer: '포뇨',
                    playTime: 30000,
                    quizType: 'SHORT_ANSWER',
                },
                {
                    id: 2,
                    question: '지브리는 뭘로 돈 벌게요?',
                    answer: '토토로',
                    playTime: 30000,
                    quizType: 'SHORT_ANSWER',
                },
            ];
            const quizSetId = 1;
            const quizSet: QuizSet = { id: quizSetId, name: '퀴즈셋 이름' };

            mockQuizSetRepository.findOneBy.mockResolvedValue(quizSet);
            mockQuizRepository.findBy.mockResolvedValue(quizList);

            //when
            const result = await service.getQuizzes(quizSetId);

            // then
            expect(mockQuizSetRepository.findOneBy).toHaveBeenCalledTimes(1);
            expect(mockQuizRepository.findBy).toHaveBeenCalledTimes(1);
            expect(result).toEqual(quizList);
        });

        it('존재하지 않는 QuizSetId인 경우 예외를 던진다.', async () => {
            // given
            const quizSetId = 2;

            // QuizSetId가 존재하지 않을 때 null 반환 설정
            mockQuizSetRepository.findOneBy.mockResolvedValue(null);

            // when & then
            await expect(service.getQuizzes(quizSetId)).rejects.toThrow(BadRequestException);

            // Mock 함수 호출 검증
            expect(mockQuizSetRepository.findOneBy).toHaveBeenCalledWith({ id: quizSetId });
            expect(mockQuizRepository.findBy).not.toHaveBeenCalled();
        });
    });
});
