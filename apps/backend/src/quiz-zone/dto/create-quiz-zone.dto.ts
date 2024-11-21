import { IsString, Length, Matches, MaxDate, MaxLength, min, MinLength } from 'class-validator';

/**
* 퀴즈존을 생성할 때 사용하는 DTO 클래스
* 
* 퀴즈존 ID는 다음 규칙을 따릅니다:
* - 5-10글자 길이
* - 숫자와 알파벳 조합
* - 중복 불가 (중복 체크 로직 추가 예정)
*/
export class CreateQuizZoneDto {
    @IsString({ message: '핀번호가 없습니다.' })
    @Length(5, 10, { message: '핀번호는 5글자 이상 10글자 이하로 입력해주세요.' })
    @Matches(RegExp('^[a-zA-Z0-9]*$'), { message: '숫자와 알파벳 조합만 가능합니다.' })
    readonly quizZoneId: string;
}
