import { PLAYER_STATE, QUIZ_ZONE_STAGE } from '../../common/constants';
import { CurrentQuizDto } from '../../play/dto/current-quiz.dto';
import { SubmittedQuiz } from '../entities/submitted-quiz.entity';

export interface Player {
    id: string;
    nickname: string;
    score?: number;
    submits?: SubmittedQuiz[];
    state: PLAYER_STATE;
}

export interface FindQuizZoneDto {
    readonly currentPlayer: Player;
    readonly title: string;
    readonly description: string;
    readonly quizCount: number;
    readonly stage: QUIZ_ZONE_STAGE;
    readonly hostId: string;
    readonly currentQuiz?: CurrentQuizDto;
}
