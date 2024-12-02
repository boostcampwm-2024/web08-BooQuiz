import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    Param,
    Post,
    Session,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QuizZoneService } from './quiz-zone.service';
import { CreateQuizZoneDto } from './dto/create-quiz-zone.dto';

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
        if (!session || !session.id) {
            throw new BadRequestException('세션 정보가 없습니다.');
        }
        const hostId = session.id;
        await this.quizZoneService.create(createQuizZoneDto, hostId);
    }

    @Get('check/:quizZoneId')
    @HttpCode(200)
    @ApiOperation({ summary: '사용자 참여중인 퀴즈존 정보 확인' })
    @ApiParam({ name: 'id', description: '퀴즈존의 ID' })
    @ApiResponse({
        status: 200,
        description: '기존 참여 정보가 성공적으로 반환되었습니다.',
    })
    @ApiResponse({ status: 400, description: '세션 정보가 없습니다.' })
    async checkExistingQuizZoneParticipation(
        @Session() session: Record<string, any>,
        @Param('quizZoneId') quizZoneId: string,
    ) {
        const sessionQuizZoneId = session.quizZoneId;
        return sessionQuizZoneId === undefined || sessionQuizZoneId === quizZoneId;
    }

    @Get(':quizZoneId')
    @HttpCode(200)
    @ApiOperation({ summary: '사용자에 대한 퀴즈존 정보 반환' })
    @ApiParam({ name: 'id', description: '퀴즈존의 ID' })
    @ApiResponse({
        status: 200,
        description: '대기실 정보가 성공적으로 반환되었습니다.',
    })
    @ApiResponse({ status: 400, description: '세션 정보가 없습니다.' })
    async findQuizZoneInfo(
        @Session() session: Record<string, any>,
        @Param('quizZoneId') quizZoneId: string,
    ) {
        const quizZoneInfo = this.quizZoneService.getQuizZoneInfo(
            session.id,
            quizZoneId,
            session.quizZoneId,
        );
        session['quizZoneId'] = quizZoneId;
        return quizZoneInfo;
    }
}
