import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QuizService } from './quiz.service';
import { CreateQuizRequestDto } from './dto/create-quiz-request.dto';
import { FindQuizzesResponseDto } from './dto/find-quizzes-response.dto';
import { UpdateQuizRequestDto } from './dto/update-quiz-request.dto';
import { SearchQuizSetResponseDTO } from './dto/search-quiz-set-response.dto';
import { SearchQuizSetRequestDTO } from './dto/search-quiz-set-request.dto';

@ApiTags('Quiz')
@Controller('quiz')
export class QuizController {
    constructor(private readonly quizService: QuizService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: '퀴즈셋 검색' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '퀴즈셋의 검색을 성공적으로 반환했습니다',
        type: SearchQuizSetResponseDTO,
    })
    async searchQuizSet(
        @Query() searchQuery: SearchQuizSetRequestDTO,
    ): Promise<SearchQuizSetResponseDTO> {
        return this.quizService.searchQuizSet(searchQuery);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: '새로운 퀴즈 생성' })
    @ApiResponse({ status: HttpStatus.CREATED, description: '퀴즈가 성공적으로 생성되었습니다.' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '요청 데이터가 유효하지 않습니다' })
    async createQuizzes(@Body() createQuizDto: CreateQuizRequestDto): Promise<number> {
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

    @Patch(':quizId')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: '퀴즈 수정' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '퀴즈의 정보를 성공적으로 수정하였습니다.',
    })
    async updateQuiz(
        @Param('quizId') quizId: number,
        @Body() updateQuizRequestDto: UpdateQuizRequestDto,
    ) {
        return this.quizService.updateQuiz(quizId, updateQuizRequestDto);
    }

    @Delete(':quizId')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: '퀴즈 삭제' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: '퀴즈의 정보를 성공적으로 삭제하였습니다.',
    })
    async deleteQuiz(@Param('quizId') quizId: number): Promise<void> {
        return this.quizService.deleteQuiz(quizId);
    }
}
