import { ApiProperty } from '@nestjs/swagger';
import { QUIZ_TYPE } from '../../common/constants';
import { Quiz } from '../entity/quiz.entitiy';
import { QuizSet } from '../entity/quiz-set.entity';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class CreateQuizRequestDto {
    @ApiProperty({ description: '퀴즈 질문' })
    @IsString()
    readonly question: string;
    @ApiProperty({ description: '퀴즈 정답' })
    @IsString()
    readonly answer: string;
    @ApiProperty({ description: '퀴즈 시간' })
    @IsNumber()
    readonly playTime: number;
    @ApiProperty({ description: '퀴즈 타입' })
    @IsEnum(QUIZ_TYPE)
    readonly quizType: QUIZ_TYPE;

    toEntity(quizSet: QuizSet) {
        return new Quiz(this.question, this.answer, this.playTime, this.quizType, quizSet);
    }
}
