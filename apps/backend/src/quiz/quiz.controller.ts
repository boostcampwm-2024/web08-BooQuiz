import {
    Body,
    Controller,
    Delete,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QuizService } from './quiz.service';
import { UpdateQuizRequestDto } from './dto/update-quiz-request.dto';

@ApiTags('Quiz')
@Controller('quiz')
export class QuizController {
    constructor(private readonly quizService: QuizService) {}

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
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '해당 퀴즈셋의 id가 없습니다.' })
    async deleteQuiz(@Param('quizId') quizId: number): Promise<void> {
        return this.quizService.deleteQuiz(quizId);
    }
}
