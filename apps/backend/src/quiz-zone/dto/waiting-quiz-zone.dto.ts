import { ApiProperty } from '@nestjs/swagger';

/**
* 퀴즈 존 대기실 정보를 담는 DTO 클래스
* 대기실 상태를 클라이언트에게 전달할 때 사용됩니다.
*/
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
