import { ApiProperty } from '@nestjs/swagger';

export class CreateQuizSetDto {
    @ApiProperty({ description: '사용자가 이름으로 퀴즈셋 조회 가능' })
    readonly name: string;
}
