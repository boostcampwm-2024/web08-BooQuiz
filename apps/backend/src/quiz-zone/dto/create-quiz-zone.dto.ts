import { IsInt, IsNotEmpty, IsString, Length, Matches, Max, Min } from 'class-validator';

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

    @IsString({ message: '제목이 없습니다.' })
    @Length(1, 100, { message: '제목은 1글자 이상 100글자 이하로 입력해주세요.' })
    readonly title: string;

    @IsString({ message: '설명이 없습니다.' })
    @Length(0, 300, { message: '설명은 300글자 이하로 입력해주세요.' })
    readonly description: string;

    @IsInt({ message: '최대 플레이어 수가 없습니다.' })
    @Min(1, { message: '최소 1명 이상이어야 합니다.' })
    @Max(300, { message: '최대 300명까지 가능합니다.' })
    readonly limitPlayerCount: number;

    @IsNotEmpty({ message: '퀴즈존을 선택해주세요.' })
    quizSetId: number;
}
