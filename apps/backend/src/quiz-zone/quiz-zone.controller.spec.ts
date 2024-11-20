import { Test, TestingModule } from '@nestjs/testing';
import { QuizZoneController } from './quiz-zone.controller';
import { QuizZoneService } from './quiz-zone.service';
import { BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateQuizZoneDto } from './dto/create-quiz-zone.dto';
import { QUIZ_ZONE_STAGE } from '../common/constants';

describe('QuizZoneController', () => {
    let controller: QuizZoneController;
    let service: QuizZoneService;

    const mockQuizZoneService = {
        create: jest.fn(),
        setPlayerInfo: jest.fn(),
        getLobbyInfo: jest.fn(),
        getProgressInfo: jest.fn(),
        getResultInfo: jest.fn(),
        getQuizZoneStage: jest.fn(),
        checkValidPlayer: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [QuizZoneController],
            providers: [
                {
                    provide: QuizZoneService,
                    useValue: mockQuizZoneService,
                },
            ],
        }).compile();

        controller = module.get<QuizZoneController>(QuizZoneController);
        service = module.get<QuizZoneService>(QuizZoneService);
    });

    describe('create', () => {
        const createQuizZoneDto: CreateQuizZoneDto = {
            quizZoneId: 'test123',
        };

        it('세션 정보가 없으면 BadRequestException을 던진다', async () => {
            await expect(controller.create(createQuizZoneDto, {})).rejects.toThrow(
                BadRequestException,
            );
        });

        it('퀴즈존을 성공적으로 생성한다', async () => {
            const session = { id: 'sessionId' };
            const { quizZoneId } = createQuizZoneDto;

            await controller.create(createQuizZoneDto, session);

            expect(service.create).toHaveBeenCalledWith(quizZoneId, session.id);
        });

        it('퀴즈존의 세션 아이디가 중복되면 예외가 발생한다.', async () => {
            const session = { id: 'sessionId' };
            mockQuizZoneService.create.mockRejectedValue(new ConflictException());

            await expect(controller.create(createQuizZoneDto, session)).rejects.toThrow(
                ConflictException,
            );
        });
    });

    describe('findQuizZoneInfo', () => {
        const quizZoneId = 'test123';
        const session = { id: 'sessionId' };

        it('퀴즈존 대기실 정보를 성공적으로 조회한다', async () => {
            const mockLobbyInfo = {
                currentPlayer: { id: 'sessionId', nickname: '닉네임', state: 'WAIT' },
                quizZoneTitle: '테스트 퀴즈',
                quizZoneDescription: '테스트 퀴즈입니다',
                quizCount: 5,
                stage: QUIZ_ZONE_STAGE.LOBBY,
                hostId: 'adminId',
            };

            mockQuizZoneService.getQuizZoneStage.mockResolvedValue(QUIZ_ZONE_STAGE.LOBBY);
            mockQuizZoneService.setPlayerInfo.mockResolvedValue(undefined);
            mockQuizZoneService.getLobbyInfo.mockResolvedValue(mockLobbyInfo);

            const result = await controller.findQuizZoneInfo(session, quizZoneId);

            expect(service.setPlayerInfo).toHaveBeenCalledWith(session.id, quizZoneId);
            expect(service.getLobbyInfo).toHaveBeenCalledWith(session.id, quizZoneId);
            expect(result).toEqual(mockLobbyInfo);
        });

        it('퀴즈 진행 중 정보를 성공적으로 조회한다', async () => {
            const mockProgressInfo = {
                currentPlayer: { id: 'sessionId', nickname: '닉네임', state: 'WAIT' },
                stage: QUIZ_ZONE_STAGE.IN_PROGRESS,
                currentQuizIndex: 1,
                currentQuizStartTime: Date.now(),
                currentQuizDeadlineTime: Date.now() + 30000,
                quizZoneTitle: '테스트 퀴즈',
                quizZoneDescription: '테스트 퀴즈입니다',
                quizCount: 5,
                intervalTime: 5000,
                hostId: 'adminId',
            };

            mockQuizZoneService.getQuizZoneStage.mockResolvedValue(QUIZ_ZONE_STAGE.IN_PROGRESS);
            mockQuizZoneService.checkValidPlayer.mockResolvedValue(undefined);
            mockQuizZoneService.getProgressInfo.mockResolvedValue(mockProgressInfo);

            const result = await controller.findQuizZoneInfo(session, quizZoneId);

            expect(service.checkValidPlayer).toHaveBeenCalledWith(session.id, quizZoneId);
            expect(service.getProgressInfo).toHaveBeenCalledWith(session.id, quizZoneId);
            expect(result).toEqual(mockProgressInfo);
        });

        it('퀴즈 결과 정보를 성공적으로 조회한다', async () => {
            const mockResultInfo = {
                currentPlayer: { id: 'sessionId', nickname: '닉네임', state: 'WAIT', score: 100, submits: [] },
                stage: QUIZ_ZONE_STAGE.RESULT,
                quizzes: [
                    { question: '신이 화나면?', answer: '신발끈', playTime: 30000 },
                ],
                quizZoneTitle: '테스트 퀴즈',
                quizZoneDescription: '테스트 퀴즈입니다',
            };

            mockQuizZoneService.getQuizZoneStage.mockResolvedValue(QUIZ_ZONE_STAGE.RESULT);
            mockQuizZoneService.checkValidPlayer.mockResolvedValue(undefined);
            mockQuizZoneService.getResultInfo.mockResolvedValue(mockResultInfo);

            const result = await controller.findQuizZoneInfo(session, quizZoneId);

            expect(service.checkValidPlayer).toHaveBeenCalledWith(session.id, quizZoneId);
            expect(service.getResultInfo).toHaveBeenCalledWith(session.id, quizZoneId);
            expect(result).toEqual(mockResultInfo);
        });

        it('퀴즈존 정보가 없으면 NotFoundException 던진다', async () => {
            mockQuizZoneService.getQuizZoneStage.mockRejectedValue(new NotFoundException());

            await expect(controller.findQuizZoneInfo(session, quizZoneId)).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});