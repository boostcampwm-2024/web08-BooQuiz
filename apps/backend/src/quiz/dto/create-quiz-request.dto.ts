import { ApiProperty } from '@nestjs/swagger';
import { QUIZ_TYPE } from '../../common/constants';
import { Quiz } from '../entity/quiz.entitiy';
import { QuizSet } from '../entity/quiz-set.entity';
import { IsEnum, IsNumber, IsString, Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class QuizDetailsDto {
    @ApiProperty({ description: '퀴즈 질문' })
    @IsString()
    @Length(1, 255)
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

export class CreateQuizRequestDto {

    @ApiProperty()
    readonly quizSetName: string;

    @ApiProperty({ type: [QuizDetailsDto], description: '퀴즈 세부 정보' })
    @ValidateNested({each: true})
    @Type(() => QuizDetailsDto)
    readonly quizDetails: QuizDetailsDto[];

}
