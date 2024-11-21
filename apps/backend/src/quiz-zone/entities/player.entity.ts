import { SubmittedQuiz } from './submitted-quiz.entity';
import { PLAYER_STATE } from '../../common/constants';

/**
 * 퀴즈 게임에 참여하는 플레이어 엔티티
 *
 * @property id: 플레이어 세션 ID
 * @property score: 플레이어의 점수
 * @property submits: 플레이어가 제출한 퀴즈 목록
 * @property state: 플레이어의 현재 상태
 */
export interface Player {
    id: string;
    nickname: string;
    score: number;
    submits: SubmittedQuiz[];
    state: PLAYER_STATE;
}
