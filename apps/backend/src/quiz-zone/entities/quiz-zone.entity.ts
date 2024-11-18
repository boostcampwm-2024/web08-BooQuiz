import { Quiz } from './quiz.entity';
import { Player } from './player.entity';

export interface QuizZone {
    players: Map<string, Player>;
    adminId: string;
    maxPlayers: number;
    quizzes: Quiz[];
    stage: 'LOBBY' | 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'RESULT';
    currentQuizIndex: number;
    currentQuizStartTime: number;
    currentQuizDeadlineTime: number;
    intervalTime: number;
}
