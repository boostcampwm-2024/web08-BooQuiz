import { PLAYER_STATE, QUIZ_ZONE_STAGE } from '../../common/constants';
import { CurrentQuizDto } from '../../play/dto/current-quiz.dto';
import { SubmittedQuiz } from '../entities/submitted-quiz.entity';
import { ChatMessage } from 'src/chat/entities/chat-message.entity';

/**
 * 퀴즈 게임에 참여하는 플레이어 엔티티
 *
 * @property id: 플레이어 세션 ID
 * @property nickname: 플레이어의 닉네임
 * @property score: 플레이어의 점수
 * @property submits: 플레이어가 제출한 퀴즈 목록
 * @property state: 플레이어의 현재 상태
 */
export interface Player {
    id: string;
    nickname: string;
    score?: number;
    submits?: SubmittedQuiz[];
    state: PLAYER_STATE;
}

/**
 * 퀴즈 존을 찾기 위한 DTO
 *
 * @property currentPlayer - 현재 플레이어
 * @property title - 퀴즈 존의 제목
 * @property description - 퀴즈 존의 설명
 * @property quizCount - 퀴즈 존의 퀴즈 개수
 * @property stage - 퀴즈 존의 진행 상태
 * @property hostId - 퀴즈 존의 호스트 ID
 * @property currentQuiz - 현재 출제 중인 퀴즈
 * @property maxPlayers - 퀴즈 존의 최대 플레이어 수
 */
export interface FindQuizZoneDto {
    readonly currentPlayer: Player;
    readonly title: string;
    readonly description: string;
    readonly quizCount: number;
    readonly stage: QUIZ_ZONE_STAGE;
    readonly hostId: string;
    readonly currentQuiz?: CurrentQuizDto;
    readonly maxPlayers?: number;
    readonly chatMessages?: ChatMessage[];
}
