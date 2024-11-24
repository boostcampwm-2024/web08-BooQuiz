import { ApiProperty } from '@nestjs/swagger';
import { QUIZ_TYPE } from '../../common/constants';
import { Quiz } from '../quiz.entitiy';
import { QuizSet } from '../quiz-set.entity';

export class CreateQuizDto {
    @ApiProperty({ description: '퀴즈 질문' })
    readonly question: string;
    @ApiProperty({ description: '퀴즈 정답' })
    readonly answer: string;
    @ApiProperty({ description: '퀴즈 시간' })
    readonly playtime: number;
    @ApiProperty({ description: '퀴즈 타입' })
    readonly quizType: QUIZ_TYPE;

    toEntity(quizSet: QuizSet) {
        return new Quiz(this.question, this.answer, this.playtime, this.quizType, quizSet);
    }
}
