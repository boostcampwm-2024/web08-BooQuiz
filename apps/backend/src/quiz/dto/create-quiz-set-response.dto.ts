import { ApiProperty } from '@nestjs/swagger';

export class CreateQuizSetResponseDto {
    @ApiProperty({ description: '새로 생성된 퀴즈셋 id' })
    readonly id: number;
}
