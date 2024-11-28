import { ApiProperty } from '@nestjs/swagger';
import { QUIZ_TYPE } from '../../common/constants';
import { Quiz } from '../entity/quiz.entitiy';
import { IsEnum, IsNumber, IsString, Length, Max, Min } from 'class-validator';

export class UpdateQuizRequestDto {
    @ApiProperty({ description: '업데이트 하는 퀴즈 질문' })
    @IsString({message: '퀴즈 질문은 문자열이어야 합니다.'})
    @Length(1, 200)
    readonly question: string;
    @ApiProperty({ description: '업데이트 하는 퀴즈 정답' })
    @IsString({message: '퀴즈 정답은 문자열이어야 합니다.'})
    @Length(1, 30, {message: '퀴즈의 대답은 1~30자 이어야 합니다.'})
    readonly answer: string;
    @ApiProperty({ description: '업데이트 하는 퀴즈 시간' })
    @Min(3, {message: '퀴즈 시간은 3초 이상이어야 합니다.'})
    @Max(60 * 10, {message: '퀴즈 시간은 10분 이하여야 합니다.'})
    @IsNumber({}, {message: '퀴즈 시간 값이 숫자가 아닙니다.'})
    readonly playTime: number;
    @ApiProperty({ description: '업데이트 하는 퀴즈 타입' })
    @IsEnum(QUIZ_TYPE, {message: '정해진 퀴즈 타입이 아닙니다.'})
    readonly quizType: QUIZ_TYPE;
}
