import { IsString, Length, Matches, MaxDate, MaxLength, min, MinLength } from 'class-validator';

export class CreateQuizZoneDto {
    @IsString({ message: '핀번호가 없습니다.' })
    @Length(5, 10, { message: '핀번호는 5글자 이상 10글자 이하로 입력해주세요.' })
    @Matches(RegExp('^[a-zA-Z0-9]*$'), { message: '숫자와 알파벳 조합만 가능합니다.' })
    readonly quizZoneId: string;
}
