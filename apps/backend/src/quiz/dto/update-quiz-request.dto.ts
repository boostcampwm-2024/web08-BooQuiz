import { ApiProperty } from '@nestjs/swagger';
import { QUIZ_TYPE } from '../../common/constants';
import { Quiz } from '../entity/quiz.entitiy';
import { IsEnum, IsNumber, IsString } from 'class-validator';

export class UpdateQuizRequestDto {
    @ApiProperty({ description: '업데이트 하는 퀴즈 질문' })
    @IsString()
    question: string;
    @IsString()
    @ApiProperty({ description: '업데이트 하는 퀴즈 정답' })
    @IsString()
    answer: string;
    @ApiProperty({ description: '업데이트 하는 퀴즈 시간' })
    @IsNumber()
    playTime: number;
    @ApiProperty({ description: '업데이트 하는 퀴즈 타입' })
    @IsEnum(QUIZ_TYPE)
    quizType: QUIZ_TYPE;
}
