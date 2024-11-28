import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { SearchQuizSetResponseDTO } from './dto/search-quiz-set-response.dto';
import { SearchQuizSetRequestDTO } from './dto/search-quiz-set-request.dto';
import { CreateQuizRequestDto } from './dto/create-quiz-request.dto';
import { FindQuizzesResponseDto } from './dto/find-quizzes-response.dto';

@ApiTags('Quiz')
@Controller('quiz-set')
export class QuizSetController {
    constructor(private quizService: QuizService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary: '퀴즈셋 검색'})
    @ApiResponse({
        status: HttpStatus.OK,
        description: '퀴즈셋의 검색을 성공적으로 반환했습니다',
        type: SearchQuizSetResponseDTO
    })
    async searchQuizSet(
        @Query() searchQuery: SearchQuizSetRequestDTO,
    ): Promise<SearchQuizSetResponseDTO> {
        return this.quizService.searchQuizSet(searchQuery);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: '새로운 퀴즈셋, 퀴즈 생성' })
    @ApiResponse({ status: HttpStatus.CREATED, description: '퀴즈셋이 성공적으로 생성되었습니다.' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '요청 데이터가 유효하지 않습니다' })
    async createQuizSet(
        @Body() createQuizDto: CreateQuizRequestDto
    ) {
        return this.quizService.createQuizzes(createQuizDto);
    }

    @Get(':quizSetId')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: '해당 퀴즈셋의 퀴즈들 조회' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '해당 퀴즈셋의 퀴즈들을 성공적으로 반환했습니다.',
        type: FindQuizzesResponseDto,
        isArray: true,
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '해당 퀴즈셋의 id가 없습니다.' })
    async findQuizzes(@Param('quizSetId') quizSetId: number): Promise<FindQuizzesResponseDto[]> {
        return this.quizService.getQuizzes(quizSetId);
    }

    @Delete(':quizSetId')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: '퀴즈셋 삭제' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '해당 퀴즈셋의 퀴즈들을 성공적으로 삭제했습니다.',
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '해당 퀴즈셋의 id가 없습니다.' })
    async deleteQuizSet(@Param('quizSetId') quizSetId: number): Promise<void> {
        this.quizService.deleteQuizSet(quizSetId);
    }
}