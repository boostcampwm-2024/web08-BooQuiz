import { Test, TestingModule } from '@nestjs/testing';
import { QuizZoneController } from './quiz-zone.controller';
import { QuizZoneService } from './quiz-zone.service';
import { BadRequestException } from '@nestjs/common';
import { CreateQuizZoneDto } from './dto/create-quiz-zone.dto';

describe('QuizZoneController', () => {
    let controller: QuizZoneController;
    let service: QuizZoneService;

    const mockQuizZoneService = {
        create: jest.fn(),
        getQuizWaitingRoom: jest.fn()
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [QuizZoneController],
            providers: [
                {
                    provide: QuizZoneService,
                    useValue: mockQuizZoneService,
                }
            ],
        }).compile();

        controller = module.get<QuizZoneController>(QuizZoneController);
        service = module.get<QuizZoneService>(QuizZoneService);
    });

    describe('create', () => {
        const createQuizZoneDto: CreateQuizZoneDto = {
            quizZoneId: 'test123'
        };

        it('세션 정보가 없으면 BadRequestException을 던진다', async () => {
            // given

            // when & then
            await expect(
                controller.create(createQuizZoneDto, {})
            ).rejects.toThrow(BadRequestException);
        });

        it('퀴즈존을 성공적으로 생성한다', async () => {
            // given
            const session = { id: 'sessionId' };
            const { quizZoneId } = createQuizZoneDto;

            // when
            await controller.create(createQuizZoneDto, session);

            // then
            expect(service.create).toHaveBeenCalledWith(quizZoneId, session.id);
        });

        it('퀴즈존의 세션 아이디가 중복되면 예외가 발생한다.', async () => {
            // given
            const session = { id: 'sessionId' };
            mockQuizZoneService.create.mockRejectedValue(new BadRequestException());

            // when & then
            await expect(
                controller.create(createQuizZoneDto, session)
            ).rejects.toThrow(BadRequestException);
        });
    });

    describe('findOne', () => {
        const quizZoneId = 'test123';
        const mockWaitingRoom = {
            title: 'Test Quiz',
            description: 'Test Description',
            quizCount: 5,
            stage: 'LOBBY',
            playerCount: 1,
            maxPlayers: 8
        };

        it('세션 정보가 없으면 BadRequestException을 던진다', async () => {
            // given
            const session = {};
            mockQuizZoneService.getQuizWaitingRoom.mockRejectedValue(new BadRequestException());

            // when & then
            await expect(
                controller.findOne(session, quizZoneId)
            ).rejects.toThrow(BadRequestException);
        });

        it('퀴즈존 대기실 정보를 성공적으로 조회한다', async () => {
            // given
            const session = { id: 'sessionId' };
            mockQuizZoneService.getQuizWaitingRoom.mockResolvedValue(mockWaitingRoom);

            // when
            const result = await controller.findOne(session, quizZoneId);

            // then
            expect(service.getQuizWaitingRoom).toHaveBeenCalledWith(quizZoneId, session.id);
            expect(result).toEqual(mockWaitingRoom);
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});