import { ApiProperty } from '@nestjs/swagger';

export class WaitingQuizZoneDto {
    @ApiProperty({ description: '풀어야 할 퀴즈의 개수' })
    readonly quizCount: number;

    @ApiProperty({ description: '현재 퀴즈존 상태' })
    readonly stage: 'LOBBY' | 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'RESULT';

    @ApiProperty({ description: '퀴즈존 제목' })
    readonly quizZoneTitle: string;

    @ApiProperty({ description: '퀴즈존 설명' })
    readonly quizZoneDescription: string;
}
