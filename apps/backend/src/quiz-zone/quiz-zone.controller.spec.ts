import { BadRequestException, NotFoundException } from '@nestjs/common';
import { QuizZoneController } from './quiz-zone.controller';
import { QuizZoneService } from './quiz-zone.service';
import { CreateQuizZoneDto } from './dto/create-quiz-zone.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from '../chat/chat.service';

describe('QuizZoneController', () => {
    let controller: QuizZoneController;
    let service: QuizZoneService;

    const mockQuizZoneService = {
        create: jest.fn(),
        getQuizZoneInfo: jest.fn(),
    };

    const mockChatService = {
        set: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [QuizZoneController],
            providers: [
                {
                    provide: QuizZoneService,
                    useValue: mockQuizZoneService,
                },
                {
                    provide: ChatService,
                    useValue: mockChatService,
                },
            ],
        }).compile();

        controller = module.get<QuizZoneController>(QuizZoneController);
        service = module.get<QuizZoneService>(QuizZoneService);
    });

    describe('create', () => {
        const createQuizZoneDto: CreateQuizZoneDto = {
            quizZoneId: 'test123',
            title: 'Test Quiz',
            description: 'Test Description',
            limitPlayerCount: 8,
            quizSetId: 1,
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

            expect(service.create).toHaveBeenCalledWith(createQuizZoneDto, session.id);
            expect(mockChatService.set).toHaveBeenCalledWith(quizZoneId);
        });

        it('퀴즈존의 세션 아이디가 중복되면 예외가 발생한다.', async () => {
            const session = { id: 'sessionId' };
            mockQuizZoneService.create.mockRejectedValue(new BadRequestException());

            await expect(controller.create(createQuizZoneDto, session)).rejects.toThrow(
                BadRequestException,
            );
        });
    });

    describe('findQuizZoneInfo', () => {
        const quizZoneId = 'test123';
        const mockQuizZoneInfo = {
            title: 'Test Quiz',
            description: 'Test Description',
            quizCount: 5,
            stage: 'LOBBY',
            playerCount: 1,
            maxPlayers: 8,
            serverTime: 0,
        };

        Date.now = jest.fn().mockReturnValue(0);

        it('퀴즈존 정보를 성공적으로 조회한다', async () => {
            const session = { id: 'sessionId' };
            mockQuizZoneService.getQuizZoneInfo.mockResolvedValue(mockQuizZoneInfo);

            const result = await controller.findQuizZoneInfo(session, quizZoneId);

            expect(service.getQuizZoneInfo).toHaveBeenCalledWith(session.id, quizZoneId, undefined);
            expect(result).toEqual(mockQuizZoneInfo);
        });

        it('퀴즈존 정보가 없으면 NotFoundException 던진다', async () => {
            const session = { id: 'sessionId' };
            mockQuizZoneService.getQuizZoneInfo.mockRejectedValue(new NotFoundException());

            await expect(controller.findQuizZoneInfo(session, quizZoneId)).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});
