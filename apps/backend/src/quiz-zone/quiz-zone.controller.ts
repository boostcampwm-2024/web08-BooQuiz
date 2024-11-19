import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    Post, Query,
    Session,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QuizZoneService } from './quiz-zone.service';
import { WaitingQuizZoneDto } from './dto/waiting-quiz-zone.dto';
import { CreateQuizZoneDto } from './dto/create-quiz-zone.dto';
import { MessageBody } from '@nestjs/websockets';

@ApiTags('Quiz Zone')
@Controller('quiz-zone')
export class QuizZoneController {
    constructor(private readonly quizZoneService: QuizZoneService) {}

    @Post()
    @HttpCode(201)
    @ApiOperation({ summary: '새로운 퀴즈존 생성' })
    @ApiResponse({ status: 201, description: '퀴즈존이 성공적으로 생성되었습니다.' })
    @ApiResponse({ status: 400, description: '세션 정보가 없습니다.' })
    async create(
        @Body() createQuizZoneDto: CreateQuizZoneDto,
        @Session() session: Record<string, any>,
    ): Promise<void> {
        const { quizZoneId } = createQuizZoneDto;
        const adminId = session.id;
        if (adminId === undefined) {
            throw new BadRequestException('세션 정보가 없습니다.');
        }
        await this.quizZoneService.create(quizZoneId, adminId);
    }

    @Get(':quizZoneId')
    @HttpCode(200)
    @ApiOperation({ summary: '퀴즈존 대기실 정적인 정보 조회' })
    @ApiParam({ name: 'id', description: '퀴즈존의 ID' })
    @ApiResponse({
        status: 200,
        description: '대기실 정보가 성공적으로 반환되었습니다.',
        type: WaitingQuizZoneDto,
    })
    @ApiResponse({ status: 400, description: '세션 정보가 없습니다.' })
    async findOne(
        @Session() session: Record<string, any>,
        quizZoneId: string): Promise<WaitingQuizZoneDto> {

        return this.quizZoneService.getQuizWaitingRoom(quizZoneId, session.id);
    }
}
