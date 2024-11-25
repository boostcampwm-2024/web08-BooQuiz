import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateQuizSetRequestDto {
    @ApiProperty({ description: '사용자가 이름으로 퀴즈셋 조회 가능' })
    @IsString()
    readonly name: string;
}
