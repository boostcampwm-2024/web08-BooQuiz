import { Type } from 'class-transformer';
import { IsNumber, IsString, Length } from 'class-validator';

export class SearchQuizSetRequestDTO {
    @IsString({ message: '퀴즈셋의 이름은 문자열이어야 합니다.' })
    @Length(0, 30, { message: '퀴즈셋의 이름은 1~30자 이어야 합니다.' })
    readonly name: string;
    @Type(() => Number)
    @IsNumber({}, { message: 'page 값이 숫자가 아닙니다.' })
    readonly page?: number = 1;
    @Type(() => Number)
    @IsNumber({}, { message: '페이지 크기 값이 숫자가 아닙니다.' })
    readonly size?: number = 10;
}
