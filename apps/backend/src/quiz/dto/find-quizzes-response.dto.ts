import { QUIZ_TYPE } from '../../common/constants';
import { ApiProperty } from '@nestjs/swagger';

export class FindQuizzesResponseDto {
    @ApiProperty({ description: '해당 퀴즈 질문' })
    readonly question: string;
    @ApiProperty({ description: '해당 퀴즈 정답' })
    readonly answer: string;
    @ApiProperty({ description: '해당 퀴즈 시간' })
    readonly playTime: number;
    @ApiProperty({ description: '해당 퀴즈 타입' })
    readonly quizType: QUIZ_TYPE;
    @ApiProperty({ description: '해당 퀴즈 id' })
    readonly id: number;
}
