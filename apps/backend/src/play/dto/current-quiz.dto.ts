import { QUIZ_ZONE_STAGE } from '../../common/constants';

/**
 * 현재 진행중인 퀴즈에 대한 DTO
 *
 * @property question - 현재 진행 중인 퀴즈의 질문
 * @property stage - 현재 퀴즈의 진행 상태
 * @property currentIndex - 현재 퀴즈의 인덱스
 * @property playTime - 퀴즈 플레이 시간
 * @property startTime - 퀴즈 시작 시간
 * @property deadlineTime - 퀴즈 마감 시간
 */
export interface CurrentQuizDto {
    readonly question: string;
    readonly stage: QUIZ_ZONE_STAGE;
    readonly currentIndex: number;
    readonly playTime: number;
    readonly startTime: number;
    readonly deadlineTime: number;
}
